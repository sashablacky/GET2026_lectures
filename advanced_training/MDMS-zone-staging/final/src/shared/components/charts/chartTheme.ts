// Shared Recharts styling. CSS variables make charts follow the light/dark theme.
export const chartColors = {
  primary: "var(--chart-1)",
  secondary: "var(--chart-2)",
  grid: "var(--chart-grid)",
  axis: "var(--text-muted)",
};

export const axisProps = {
  stroke: chartColors.grid,
  tick: { fill: chartColors.axis, fontSize: 12 },
  tickLine: false,
};

export const tooltipProps = {
  contentStyle: {
    background: "var(--surface)",
    border: "1px solid var(--border)",
    borderRadius: 8,
    color: "var(--text)",
    fontSize: 13,
  },
  labelStyle: { color: "var(--text)", fontWeight: 600 },
  itemStyle: { color: "var(--text)" },
  cursor: { fill: "var(--surface-hover)", stroke: "var(--border)" },
};
