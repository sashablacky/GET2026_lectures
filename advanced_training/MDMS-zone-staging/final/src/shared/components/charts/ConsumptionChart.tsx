import {
  Bar,
  BarChart,
  CartesianGrid,
  Legend,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { axisProps, chartColors, tooltipProps } from "./chartTheme";
import { formatNumber } from "../../utils/format";

export interface ChartSeries<T> {
  key: keyof T & string;
  name: string;
  color?: string;
}

interface ConsumptionChartProps<T> {
  data: T[];
  xKey: keyof T & string;
  series: ChartSeries<T>[];
  type?: "line" | "bar";
  unit?: string;
}

const defaultColors = [chartColors.primary, chartColors.secondary];

// Line or bar chart of one or more numeric series; fills its parent's height.
export default function ConsumptionChart<T>({
  data,
  xKey,
  series,
  type = "line",
  unit = "kWh",
}: ConsumptionChartProps<T>) {
  // Plain strings: Recharts would otherwise infer a generic row type from the
  // key and reject it. The keys are already checked as keyof T in the props.
  const xDataKey: string = xKey;
  const seriesKey = (s: ChartSeries<T>): string => s.key;
  const color = (i: number) => series[i].color ?? defaultColors[i % defaultColors.length];
  const common = (
    <>
      <CartesianGrid vertical={false} stroke={chartColors.grid} strokeDasharray="3 3" />
      <XAxis dataKey={xDataKey} {...axisProps} minTickGap={12} />
      <YAxis {...axisProps} width={56} tickFormatter={(v: number) => formatNumber(v, 0)} />
      <Tooltip
        {...tooltipProps}
        formatter={(value, name) => [`${formatNumber(Number(value), 1)} ${unit}`, name]}
      />
      {series.length > 1 && <Legend wrapperStyle={{ fontSize: 13 }} />}
    </>
  );

  return (
    <ResponsiveContainer width="100%" height="100%">
      {type === "bar" ? (
        <BarChart data={data} margin={{ top: 8, right: 8, left: 0, bottom: 0 }}>
          {common}
          {series.map((s, i) => (
            <Bar key={s.key} dataKey={seriesKey(s)} name={s.name} fill={color(i)} radius={[4, 4, 0, 0]} maxBarSize={48} />
          ))}
        </BarChart>
      ) : (
        <LineChart data={data} margin={{ top: 8, right: 8, left: 0, bottom: 0 }}>
          {common}
          {series.map((s, i) => (
            <Line
              key={s.key}
              type="monotone"
              dataKey={seriesKey(s)}
              name={s.name}
              stroke={color(i)}
              strokeWidth={2}
              dot={data.length <= 31 ? { r: 3 } : false}
              activeDot={{ r: 5 }}
            />
          ))}
        </LineChart>
      )}
    </ResponsiveContainer>
  );
}
