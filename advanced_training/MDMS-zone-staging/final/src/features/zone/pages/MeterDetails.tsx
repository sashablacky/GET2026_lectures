import { useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { ArrowLeft, ChartColumn, SearchX } from "lucide-react";
import PageHeader from "../../../shared/components/ui/PageHeader";
import Button from "../../../shared/components/ui/Button";
import StatusBadge from "../../../shared/components/data/StatusBadge";
import DataTable from "../../../shared/components/data/DataTable";
import type { Column } from "../../../shared/components/data/DataTable";
import ChartCard from "../../../shared/components/charts/ChartCard";
import ConsumptionChart from "../../../shared/components/charts/ConsumptionChart";
import type { TimeRange } from "../../../shared/components/charts/TimeRangeToggle";
import EmptyState from "../../../shared/components/feedback/EmptyState";
import Loader from "../../../shared/components/feedback/Loader";
import { useApi } from "../../../shared/hooks/useApi";
import type { SortState } from "../../../shared/types/api";
import type { Meter, MeterReading } from "../../../shared/types/models";
import { errorMessage, formatDate, formatDateTime, formatKwh, isNotFound } from "../../../shared/utils/format";
import { CURRENT_ZONE_ID } from "../constants";
import { getLatestMeterReadings, getMeter, getMeterReadingsPage } from "../services/meterService";
import { toDailyPoints } from "../utils/consumption";

const READINGS_PAGE_SIZE = 10;

const readingColumns: Column<MeterReading>[] = [
  { key: "date", header: "Date", sortable: true, render: (r) => formatDate(r.date) },
  { key: "readingKwh", header: "Reading", align: "right", render: (r) => <span className="mono">{formatKwh(r.readingKwh, 2)}</span> },
  {
    key: "consumptionKwh",
    header: "Consumption",
    sortable: true,
    align: "right",
    render: (r) => <span className="mono">{formatKwh(r.consumptionKwh, 2)}</span>,
  },
];

function MeterInfo({ meter }: { meter: Meter }) {
  return (
    <section className="card">
      <h2 className="card__title">Meter information</h2>
      <dl className="detail-grid">
        <div>
          <dt>Meter ID</dt>
          <dd>{meter.id}</dd>
        </div>
        <div>
          <dt>Owner</dt>
          <dd>
            {meter.ownerName} <span className="muted">({meter.ownerId})</span>
          </dd>
        </div>
        <div>
          <dt>Status</dt>
          <dd>
            <StatusBadge status={meter.status} />
          </dd>
        </div>
        <div>
          <dt>Tariff category</dt>
          <dd>{meter.tariffCategory}</dd>
        </div>
        <div>
          <dt>Installed on</dt>
          <dd>{formatDate(meter.installedDate)}</dd>
        </div>
        <div>
          <dt>Last reading</dt>
          <dd className="mono">
            {formatKwh(meter.lastReadingKwh, 2)}
            {meter.lastReadingAt && <div className="muted">{formatDateTime(meter.lastReadingAt)}</div>}
          </dd>
        </div>
        <div style={{ gridColumn: "1 / -1" }}>
          <dt>Address</dt>
          <dd>{meter.address}</dd>
        </div>
      </dl>
    </section>
  );
}

function MeterUsage({ meter }: { meter: Meter }) {
  const [range, setRange] = useState<TimeRange>("week");
  const [page, setPage] = useState(1);
  const [sort, setSort] = useState<SortState>({ field: "date", direction: "desc" });
  const days = range === "week" ? 7 : 30;

  const usage = useApi((s) => getLatestMeterReadings(meter.id, days, s), `usage:${meter.id}:${days}`);
  const readings = useApi(
    (s) => getMeterReadingsPage(meter.id, page, READINGS_PAGE_SIZE, sort, s),
    `readings:${meter.id}:${page}:${sort.field}:${sort.direction}`,
  );

  const chartData = toDailyPoints((usage.data ?? []).map((r) => ({ date: r.date, kwh: r.consumptionKwh })));

  return (
    <>
      <ChartCard
        title="Usage"
        subtitle={`Daily consumption, last ${days} days`}
        range={range}
        ranges={["week", "month"]}
        onRangeChange={setRange}
        loading={usage.loading && !usage.data}
        error={usage.error ? errorMessage(usage.error) : undefined}
        empty={chartData.length === 0}
        emptyMessage="This meter has no readings yet."
      >
        <ConsumptionChart data={chartData} xKey="label" series={[{ key: "kwh", name: "Consumption" }]} type="bar" />
      </ChartCard>

      <section className="page">
        <h2 className="card__title" style={{ margin: 0 }}>
          Recent readings
        </h2>
        <DataTable
          columns={readingColumns}
          rows={readings.data?.data ?? []}
          rowKey={(r) => r.id}
          loading={readings.loading}
          error={readings.error ? errorMessage(readings.error) : undefined}
          emptyTitle="No readings"
          emptyMessage="Readings appear once the meter is active and reporting."
          sort={sort}
          onSortChange={(next) => {
            setSort(next);
            setPage(1);
          }}
          pagination={{
            page,
            pageSize: READINGS_PAGE_SIZE,
            total: readings.data?.items ?? 0,
            onPageChange: setPage,
          }}
        />
      </section>
    </>
  );
}

export default function MeterDetails() {
  const { meterId = "" } = useParams();
  const navigate = useNavigate();
  const meter = useApi((s) => getMeter(meterId, s), `meter:${meterId}`);

  const back = (
    <Button icon={<ArrowLeft size={16} />} onClick={() => navigate("/zone/meters")}>
      Back to meters
    </Button>
  );

  if (meter.loading) return <Loader label="Loading meter…" />;

  // A zone admin only sees meters of their own zone.
  const notInZone = meter.data && meter.data.zoneId !== CURRENT_ZONE_ID;
  if (isNotFound(meter.error) || notInZone || !meter.data) {
    return (
      <div className="page">
        <PageHeader title={`Meter ${meterId}`} actions={back} />
        <div className="card">
          <EmptyState
            tone={meter.error && !isNotFound(meter.error) ? "error" : "default"}
            icon={<SearchX size={28} />}
            title={meter.error && !isNotFound(meter.error) ? "Could not load meter" : "Meter not found in your zone"}
            message={
              meter.error && !isNotFound(meter.error) ? (
                errorMessage(meter.error)
              ) : (
                <>
                  There is no meter <strong>{meterId}</strong> in this zone. <Link to="/zone/meters" className="link">Back to meter list</Link>
                </>
              )
            }
          />
        </div>
      </div>
    );
  }

  const m = meter.data;
  return (
    <div className="page">
      <PageHeader
        title={
          <span className="row">
            Meter {m.id} <StatusBadge status={m.status} />
          </span>
        }
        subtitle={`${m.ownerName} · ${m.zoneName}`}
        actions={
          <>
            {back}
            <Button
              icon={<ChartColumn size={16} />}
              onClick={() => navigate(`/zone/reports?meterId=${encodeURIComponent(m.id)}`)}
              disabled={m.status !== "Active"}
            >
              Usage report
            </Button>
          </>
        }
      />
      <MeterInfo meter={m} />
      <MeterUsage key={m.id} meter={m} />
    </div>
  );
}
