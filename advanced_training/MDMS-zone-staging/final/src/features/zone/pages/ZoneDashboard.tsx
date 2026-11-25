import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Activity, Bell, FileText, Gauge, Plus } from "lucide-react";
import PageHeader from "../../../shared/components/ui/PageHeader";
import StatCard from "../../../shared/components/ui/StatCard";
import Button from "../../../shared/components/ui/Button";
import ChartCard from "../../../shared/components/charts/ChartCard";
import ConsumptionChart from "../../../shared/components/charts/ConsumptionChart";
import type { TimeRange } from "../../../shared/components/charts/TimeRangeToggle";
import { useApi } from "../../../shared/hooks/useApi";
import { errorMessage, formatNumber, formatPercent } from "../../../shared/utils/format";
import { useCurrentZone } from "../hooks/useCurrentZone";
import { countZoneMeters } from "../services/meterService";
import { countPendingAlerts } from "../services/alertService";
import { getLatestZoneConsumption } from "../services/zoneService";
import { monthByWeek, toDailyPoints } from "../utils/consumption";
import type { ZoneDailyConsumption } from "../types/zone";

const HISTORY_DAYS = 90;

// This month's average daily kWh per meter compared with the days before it.
function usageComparison(days: ZoneDailyConsumption[]) {
  if (days.length === 0) return null;
  const month = days[days.length - 1].date.slice(0, 7);
  const avg = (list: ZoneDailyConsumption[]) =>
    list.reduce((s, d) => s + d.avgKwhPerMeter, 0) / list.length;
  const current = days.filter((d) => d.date.startsWith(month));
  const before = days.filter((d) => !d.date.startsWith(month));
  if (before.length === 0) return null;
  const thisMonth = avg(current);
  const baseline = avg(before);
  return { thisMonth, baseline, changePercent: ((thisMonth - baseline) / baseline) * 100 };
}

export default function ZoneDashboard() {
  const navigate = useNavigate();
  const { zoneId, zoneName, zone } = useCurrentZone();
  const [range, setRange] = useState<TimeRange>("week");

  const activeMeters = useApi((s) => countZoneMeters(zoneId, "Active", s), `active-meters:${zoneId}`);
  const pendingAlerts = useApi((s) => countPendingAlerts(zoneId, s), `pending-alerts:${zoneId}`);
  const history = useApi((s) => getLatestZoneConsumption(zoneId, HISTORY_DAYS, s), `zone-history:${zoneId}`);

  const days = history.data ?? [];
  const usage = usageComparison(days);
  const daily = days.map((d) => ({ date: d.date, kwh: d.totalKwh }));
  const chartData = range === "week" ? toDailyPoints(daily.slice(-7)) : monthByWeek(daily);

  return (
    <div className="page">
      <PageHeader
        title="Zone dashboard"
        subtitle={`Zone: ${zoneName}`}
        actions={
          <>
            <Button variant="primary" icon={<Plus size={16} />} onClick={() => navigate("/zone/meters?add=1")}>
              Add meter
            </Button>
            <Button icon={<FileText size={16} />} onClick={() => navigate("/zone/reports")}>
              Generate report
            </Button>
          </>
        }
      />

      <div className="grid grid--stats">
        <StatCard
          label="Active meters"
          icon={<Gauge size={18} />}
          tone="success"
          loading={activeMeters.loading}
          value={activeMeters.error ? "—" : formatNumber(activeMeters.data ?? 0, 0)}
          hint={zone ? `of ${zone.totalMeters} meters in the zone` : undefined}
          link={{ to: "/zone/meters", label: "Meters" }}
        />
        <StatCard
          label="Average usage"
          icon={<Activity size={18} />}
          tone={usage && usage.changePercent > 10 ? "warning" : "default"}
          loading={history.loading}
          value={usage ? formatPercent(usage.changePercent) : "—"}
          hint={
            usage
              ? `${formatNumber(usage.thisMonth)} kWh per meter/day this month vs ${formatNumber(usage.baseline)} before`
              : undefined
          }
          link={{ to: "/zone/reports", label: "Reports" }}
        />
        <StatCard
          label="Pending alerts"
          icon={<Bell size={18} />}
          tone={(pendingAlerts.data ?? 0) > 0 ? "danger" : "success"}
          loading={pendingAlerts.loading}
          value={pendingAlerts.error ? "—" : formatNumber(pendingAlerts.data ?? 0, 0)}
          hint="Open or acknowledged"
          link={{ to: "/zone/alerts", label: "Alerts" }}
        />
      </div>

      <ChartCard
        title="Zone consumption"
        subtitle={range === "week" ? "Total kWh per day, last 7 days" : "Total kWh per week, this month"}
        range={range}
        ranges={["week", "month"]}
        onRangeChange={setRange}
        loading={history.loading}
        error={history.error ? errorMessage(history.error) : undefined}
        empty={chartData.length === 0}
      >
        <ConsumptionChart
          data={chartData}
          xKey="label"
          series={[{ key: "kwh", name: "Consumption" }]}
          type={range === "week" ? "line" : "bar"}
        />
      </ChartCard>
    </div>
  );
}
