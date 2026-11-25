import "./charts.css";

export type TimeRange = "day" | "week" | "month" | "year";

const LABELS: Record<TimeRange, string> = {
  day: "Day",
  week: "Week",
  month: "Month",
  year: "Year",
};

interface TimeRangeToggleProps {
  value: TimeRange;
  onChange: (range: TimeRange) => void;
  options?: TimeRange[];
}

export default function TimeRangeToggle({
  value,
  onChange,
  options = ["day", "week", "month", "year"],
}: TimeRangeToggleProps) {
  return (
    <div className="range-toggle" role="group" aria-label="Time range">
      {options.map((range) => (
        <button
          key={range}
          type="button"
          className={`range-toggle__btn ${range === value ? "range-toggle__btn--active" : ""}`}
          aria-pressed={range === value}
          onClick={() => onChange(range)}
        >
          {LABELS[range]}
        </button>
      ))}
    </div>
  );
}
