import { isAxiosError } from "axios";

const TIME_ZONE = "Asia/Kolkata";

const dateFormat = new Intl.DateTimeFormat("en-IN", {
  day: "2-digit",
  month: "short",
  year: "numeric",
  timeZone: TIME_ZONE,
});
const dateTimeFormat = new Intl.DateTimeFormat("en-IN", {
  day: "2-digit",
  month: "short",
  year: "numeric",
  hour: "2-digit",
  minute: "2-digit",
  timeZone: TIME_ZONE,
});
const shortDateFormat = new Intl.DateTimeFormat("en-IN", {
  day: "2-digit",
  month: "short",
  timeZone: TIME_ZONE,
});

const EMPTY = "—";

export const formatDate = (iso: string | null | undefined): string =>
  iso ? dateFormat.format(new Date(iso)) : EMPTY;

export const formatDateTime = (iso: string | null | undefined): string =>
  iso ? dateTimeFormat.format(new Date(iso)) : EMPTY;

export const formatShortDate = (iso: string): string =>
  shortDateFormat.format(new Date(iso));

export const formatNumber = (value: number, maxDigits = 1): string =>
  value.toLocaleString("en-IN", { maximumFractionDigits: maxDigits });

export const formatKwh = (value: number | null | undefined, maxDigits = 1): string =>
  value === null || value === undefined ? EMPTY : `${formatNumber(value, maxDigits)} kWh`;

export const formatPercent = (value: number): string =>
  `${value > 0 ? "+" : ""}${value.toFixed(1)}%`;

export function errorMessage(error: unknown): string {
  if (isAxiosError(error)) {
    if (!error.response) return "Cannot reach the data server. Is JSON Server running on port 3000?";
    if (error.response.status === 404) return "The requested record was not found.";
    return `The server returned an error (${error.response.status}).`;
  }
  return "Something went wrong while loading data.";
}

export const isNotFound = (error: unknown): boolean =>
  isAxiosError(error) && error.response?.status === 404;
