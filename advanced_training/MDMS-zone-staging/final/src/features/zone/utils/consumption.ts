import { formatShortDate } from "../../../shared/utils/format";
import type { ConsumptionPoint } from "../types/zone";

export interface DailyValue {
  date: string; // YYYY-MM-DD
  kwh: number;
}

const sum = (values: number[]) => values.reduce((a, b) => a + b, 0);
const round = (n: number) => Math.round(n * 100) / 100;

export const toDailyPoints = (days: DailyValue[]): ConsumptionPoint[] =>
  days.map((d) => ({ label: formatShortDate(d.date), kwh: d.kwh }));

// Days of the month of the latest date, grouped into Week 1 (1-7) ... Week 5 (29-31).
export function monthByWeek(days: DailyValue[]): ConsumptionPoint[] {
  if (days.length === 0) return [];
  const month = days[days.length - 1].date.slice(0, 7);
  const weeks = new Map<number, number>();
  for (const d of days) {
    if (!d.date.startsWith(month)) continue;
    const week = Math.ceil(Number(d.date.slice(8, 10)) / 7);
    weeks.set(week, (weeks.get(week) ?? 0) + d.kwh);
  }
  return [...weeks.entries()].map(([week, kwh]) => ({ label: `Week ${week}`, kwh: round(kwh) }));
}

export interface SeriesSummary {
  total: number;
  averagePerDay: number;
  peak: DailyValue | null;
  lowest: DailyValue | null;
}

export function summarise(days: DailyValue[]): SeriesSummary {
  if (days.length === 0) return { total: 0, averagePerDay: 0, peak: null, lowest: null };
  const total = sum(days.map((d) => d.kwh));
  let peak = days[0];
  let lowest = days[0];
  for (const d of days) {
    if (d.kwh > peak.kwh) peak = d;
    if (d.kwh < lowest.kwh) lowest = d;
  }
  return { total: round(total), averagePerDay: round(total / days.length), peak, lowest };
}

export interface WeekRow {
  id: string;
  from: string;
  to: string;
  days: number;
  total: number;
  averagePerDay: number;
  changePercent: number | null; // vs the previous 7-day block
}

// Splits the range into 7-day blocks from its first day.
export function weeklyBreakdown(days: DailyValue[]): WeekRow[] {
  const rows: WeekRow[] = [];
  for (let i = 0; i < days.length; i += 7) {
    const block = days.slice(i, i + 7);
    const total = round(sum(block.map((d) => d.kwh)));
    const averagePerDay = round(total / block.length);
    const prev = rows[rows.length - 1];
    rows.push({
      id: block[0].date,
      from: block[0].date,
      to: block[block.length - 1].date,
      days: block.length,
      total,
      averagePerDay,
      // Compare daily averages so a short last block is still comparable
      changePercent: prev ? ((averagePerDay - prev.averagePerDay) / prev.averagePerDay) * 100 : null,
    });
  }
  return rows;
}

// Adds `days` (can be negative) to a YYYY-MM-DD date.
export function addDays(date: string, days: number): string {
  const d = new Date(`${date}T00:00:00Z`);
  d.setUTCDate(d.getUTCDate() + days);
  return d.toISOString().slice(0, 10);
}
