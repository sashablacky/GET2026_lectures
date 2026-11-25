import { eq, fetchAll, fetchCount, fetchOne, fetchPage } from "../../../services/query";
import type { SortState } from "../../../shared/types/api";
import type { Meter, MeterReading, MeterStatus } from "../../../shared/types/models";

export interface MeterListParams {
  page: number;
  pageSize: number;
  sort: SortState;
  search: string;
  status: MeterStatus | "";
}

export const getZoneMeters = (zoneId: string, p: MeterListParams, signal?: AbortSignal) =>
  fetchPage<Meter>(
    "/meters",
    {
      page: p.page,
      perPage: p.pageSize,
      sort: p.sort,
      where: { zoneId: eq(zoneId), status: eq(p.status) },
      search: { term: p.search, fields: ["id", "ownerName"] },
    },
    signal,
  );

export const countZoneMeters = (zoneId: string, status?: MeterStatus, signal?: AbortSignal) =>
  fetchCount("/meters", { zoneId: eq(zoneId), status: eq(status) }, signal);

export const getMeter = (meterId: string, signal?: AbortSignal) =>
  fetchOne<Meter>(`/meters/${encodeURIComponent(meterId)}`, signal);

export const getMetersByOwner = (ownerId: string, signal?: AbortSignal) =>
  fetchAll<Meter>(
    "/meters",
    { where: { ownerId: eq(ownerId) }, sort: { field: "id", direction: "asc" } },
    signal,
  );

// Meters that report readings (for the report's meter filter).
export const getZoneActiveMeters = (zoneId: string, signal?: AbortSignal) =>
  fetchAll<Meter>(
    "/meters",
    {
      where: { zoneId: eq(zoneId), status: eq("Active") },
      sort: { field: "id", direction: "asc" },
    },
    signal,
  );

export const getMeterReadingsPage = (
  meterId: string,
  page: number,
  pageSize: number,
  sort: SortState,
  signal?: AbortSignal,
) =>
  fetchPage<MeterReading>(
    "/meterReadings",
    { page, perPage: pageSize, sort, where: { meterId: eq(meterId) } },
    signal,
  );

// The latest `days` readings of a meter, oldest first.
export async function getLatestMeterReadings(
  meterId: string,
  days: number,
  signal?: AbortSignal,
): Promise<MeterReading[]> {
  const page = await fetchPage<MeterReading>(
    "/meterReadings",
    {
      where: { meterId: eq(meterId) },
      sort: { field: "date", direction: "desc" },
      perPage: days,
    },
    signal,
  );
  return [...page.data].reverse();
}

export const getMeterReadingsInRange = (
  meterId: string,
  from: string,
  to: string,
  signal?: AbortSignal,
) =>
  fetchAll<MeterReading>(
    "/meterReadings",
    {
      where: { meterId: eq(meterId), date: { gte: from, lte: to } },
      sort: { field: "date", direction: "asc" },
    },
    signal,
  );
