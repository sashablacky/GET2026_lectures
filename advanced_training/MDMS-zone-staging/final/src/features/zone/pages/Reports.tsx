import { useState } from "react";
import { useSearchParams } from "react-router-dom";
import { CircleAlert, FileText } from "lucide-react";
import PageHeader from "../../../shared/components/ui/PageHeader";
import Button from "../../../shared/components/ui/Button";
import StatCard from "../../../shared/components/ui/StatCard";
import Input from "../../../shared/components/forms/Input";
import Select from "../../../shared/components/forms/Select";
import ChartCard from "../../../shared/components/charts/ChartCard";
import ConsumptionChart from "../../../shared/components/charts/ConsumptionChart";
import DataTable from "../../../shared/components/data/DataTable";
import type { Column } from "../../../shared/components/data/DataTable";
import EmptyState from "../../../shared/components/feedback/EmptyState";
import Loader from "../../../shared/components/feedback/Loader";
import { useToast } from "../../../shared/components/feedback/toast-context";
import { useApi } from "../../../shared/hooks/useApi";
import { errorMessage, formatDate, formatKwh, formatPercent } from "../../../shared/utils/format";
import { useCurrentZone } from "../hooks/useCurrentZone";
import { getZoneActiveMeters, getMeterReadingsInRange } from "../services/meterService";
import { getLatestZoneConsumption, getZoneConsumptionInRange } from "../services/zoneService";
import { addDays, summarise, toDailyPoints, weeklyBreakdown } from "../utils/consumption";
import type { DailyValue, WeekRow } from "../utils/consumption";
import { validateDateRange } from "../utils/validation";

const DEFAULT_DAYS = 30;
const HISTORY_DAYS = 90; // readings kept in db.json

const weekColumns: Column<WeekRow>[] = [
  {
    key: "from",
    header: "Period",
    render: (w) => `${formatDate(w.from)} – ${formatDate(w.to)}`,
  },
  { key: "days", header: "Days", align: "right" },
  { key: "total", header: "Total", align: "right", render: (w) => <span className="mono">{formatKwh(w.total)}</span> },
  {
    key: "averagePerDay",
    header: "Average / day",
    align: "right",
    render: (w) => <span className="mono">{formatKwh(w.averagePerDay)}</span>,
  },
  {
    key: "changePercent",
    header: "Change vs previous",
    align: "right",
    render: (w) =>
      w.changePercent === null ? (
        <span className="muted">—</span>
      ) : (
        <span className={`mono ${w.changePercent > 0 ? "text-up" : "text-down"}`}>{formatPercent(w.changePercent)}</span>
      ),
  },
];

interface ReportViewProps {
  zoneId: string;
  zoneName: string;
  latestDate: string;
}

function ReportView({ zoneId, zoneName, latestDate }: ReportViewProps) {
  const { showToast } = useToast();
  const [searchParams] = useSearchParams();
  // Meter details links here with ?meterId=... to preselect the meter
  const [meterId, setMeterId] = useState(searchParams.get("meterId") ?? "");
  const [from, setFrom] = useState(addDays(latestDate, -(DEFAULT_DAYS - 1)));
  const [to, setTo] = useState(latestDate);

  const minDate = addDays(latestDate, -(HISTORY_DAYS - 1));
  const rangeErrors = validateDateRange(from, to, minDate, latestDate);
  const rangeValid = !rangeErrors.from && !rangeErrors.to;

  const meters = useApi((s) => getZoneActiveMeters(zoneId, s), `active-meter-list:${zoneId}`);
  const series = useApi<DailyValue[]>(
    async (s) =>
      meterId
        ? (await getMeterReadingsInRange(meterId, from, to, s)).map((r) => ({ date: r.date, kwh: r.consumptionKwh }))
        : (await getZoneConsumptionInRange(zoneId, from, to, s)).map((d) => ({ date: d.date, kwh: d.totalKwh })),
    rangeValid ? `report:${zoneId}:${meterId}:${from}:${to}` : null,
  );

  const days = rangeValid ? (series.data ?? []) : [];
  const summary = summarise(days);
  const weeks = weeklyBreakdown(days);
  const meterOptions = (meters.data ?? []).map((m) => ({ value: m.id, label: `${m.id} · ${m.ownerName}` }));
  const scopeLabel = meterId ? `meter ${meterId}` : "all meters";
  const loading = series.loading && !series.data;

  const generate = () => {
    if (!rangeValid) {
      showToast("Fix the date range before generating the report.", "error");
      return;
    }
    showToast(
      `Report for ${zoneName}, ${scopeLabel}, ${formatDate(from)} – ${formatDate(to)} is ready. PDF/CSV export comes in a later phase.`,
      "info",
    );
  };

  return (
    <div className="page">
      <PageHeader
        title="Reports & analytics"
        subtitle={`Energy usage in zone ${zoneName}`}
        actions={
          <Button variant="primary" icon={<FileText size={16} />} onClick={generate}>
            Generate report
          </Button>
        }
      />

      <section className="card filters-bar no-print" aria-label="Report filters">
        <Input
          label="From"
          type="date"
          value={from}
          min={minDate}
          max={latestDate}
          onChange={(e) => setFrom(e.target.value)}
          error={rangeErrors.from}
        />
        <Input
          label="To"
          type="date"
          value={to}
          min={minDate}
          max={latestDate}
          onChange={(e) => setTo(e.target.value)}
          error={rangeErrors.to}
        />
        <Select
          label="Meter"
          placeholder="All meters in the zone"
          options={meterOptions}
          value={meterId}
          onChange={(e) => setMeterId(e.target.value)}
        />
      </section>

      <div className="grid grid--stats">
        <StatCard label="Total consumption" loading={loading} value={rangeValid ? formatKwh(summary.total, 0) : "—"} hint={`${days.length} days, ${scopeLabel}`} />
        <StatCard label="Average per day" loading={loading} value={rangeValid ? formatKwh(summary.averagePerDay) : "—"} />
        <StatCard
          label="Peak day"
          tone="warning"
          loading={loading}
          value={summary.peak ? formatKwh(summary.peak.kwh) : "—"}
          hint={summary.peak ? formatDate(summary.peak.date) : undefined}
        />
        <StatCard
          label="Lowest day"
          tone="success"
          loading={loading}
          value={summary.lowest ? formatKwh(summary.lowest.kwh) : "—"}
          hint={summary.lowest ? formatDate(summary.lowest.date) : undefined}
        />
      </div>

      <ChartCard
        title="Energy usage trend"
        subtitle={`Daily kWh, ${scopeLabel}`}
        loading={loading}
        error={series.error ? errorMessage(series.error) : undefined}
        empty={days.length === 0}
        emptyMessage={rangeValid ? "No readings in this period." : "Choose a valid date range."}
        height={300}
      >
        <ConsumptionChart data={toDailyPoints(days)} xKey="label" series={[{ key: "kwh", name: "Consumption" }]} />
      </ChartCard>

      <section className="page">
        <h2 className="card__title" style={{ margin: 0 }}>
          Weekly summary
        </h2>
        <DataTable
          columns={weekColumns}
          rows={weeks}
          rowKey={(w) => w.id}
          loading={loading}
          emptyTitle="No data for this period"
          caption="Weekly consumption summary"
        />
      </section>
    </div>
  );
}

export default function Reports() {
  const { zoneId, zoneName } = useCurrentZone();
  // The newest day with data defines the default range and the date limits.
  const latest = useApi((s) => getLatestZoneConsumption(zoneId, 1, s), `latest-day:${zoneId}`);

  if (latest.loading) return <Loader label="Loading report…" />;
  const latestDate = latest.data?.[0]?.date;
  if (!latestDate) {
    return (
      <div className="card">
        <EmptyState
          tone={latest.error ? "error" : "default"}
          icon={latest.error ? <CircleAlert size={28} /> : undefined}
          title={latest.error ? "Could not load report data" : "No consumption data yet"}
          message={latest.error ? errorMessage(latest.error) : undefined}
        />
      </div>
    );
  }
  return <ReportView zoneId={zoneId} zoneName={zoneName} latestDate={latestDate} />;
}
