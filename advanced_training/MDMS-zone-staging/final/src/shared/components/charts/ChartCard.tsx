import type { ReactNode } from "react";
import { CircleAlert } from "lucide-react";
import TimeRangeToggle from "./TimeRangeToggle";
import type { TimeRange } from "./TimeRangeToggle";
import EmptyState from "../feedback/EmptyState";
import Skeleton from "../feedback/Skeleton";
import "./charts.css";

interface ChartCardProps {
  title: string;
  subtitle?: ReactNode;
  // Pass range + onRangeChange to show the Day/Week/Month/Year toggle.
  range?: TimeRange;
  ranges?: TimeRange[];
  onRangeChange?: (range: TimeRange) => void;
  actions?: ReactNode;
  loading?: boolean;
  error?: string;
  empty?: boolean;
  emptyMessage?: string;
  height?: number;
  children: ReactNode; // the chart, rendered inside a box of `height`
}

export default function ChartCard({
  title,
  subtitle,
  range,
  ranges,
  onRangeChange,
  actions,
  loading,
  error,
  empty,
  emptyMessage = "There is no data for this period.",
  height = 280,
  children,
}: ChartCardProps) {
  let content: ReactNode = children;
  if (error)
    content = <EmptyState tone="error" icon={<CircleAlert size={28} />} title="Could not load chart" message={error} />;
  else if (loading) content = <Skeleton height={height} radius={8} />;
  else if (empty) content = <EmptyState title="No data" message={emptyMessage} />;

  return (
    <section className="card chart-card">
      <header className="chart-card__header">
        <div>
          <h2 className="chart-card__title">{title}</h2>
          {subtitle && <p className="chart-card__subtitle">{subtitle}</p>}
        </div>
        <div className="row">
          {actions}
          {range && onRangeChange && <TimeRangeToggle value={range} onChange={onRangeChange} options={ranges} />}
        </div>
      </header>
      <div className="chart-card__body" style={{ height }}>
        {content}
      </div>
    </section>
  );
}
