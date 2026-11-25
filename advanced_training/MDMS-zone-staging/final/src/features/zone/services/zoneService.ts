import { eq, fetchAll, fetchOne, fetchPage } from "../../../services/query";
import type { Zone } from "../../../shared/types/models";
import type { ZoneDailyConsumption, ZoneSettings } from "../types/zone";

export const getZone = (zoneId: string, signal?: AbortSignal) =>
  fetchOne<Zone>(`/zones/${encodeURIComponent(zoneId)}`, signal);

export const getZoneSettings = (zoneId: string, signal?: AbortSignal) =>
  fetchOne<ZoneSettings>(`/zoneSettings/${encodeURIComponent(zoneId)}`, signal);

// The latest `days` days of zone consumption, oldest first.
export async function getLatestZoneConsumption(
  zoneId: string,
  days: number,
  signal?: AbortSignal,
): Promise<ZoneDailyConsumption[]> {
  const page = await fetchPage<ZoneDailyConsumption>(
    "/zoneDailyConsumption",
    {
      where: { zoneId: eq(zoneId) },
      sort: { field: "date", direction: "desc" },
      perPage: days,
    },
    signal,
  );
  return [...page.data].reverse();
}

export const getZoneConsumptionInRange = (
  zoneId: string,
  from: string,
  to: string,
  signal?: AbortSignal,
) =>
  fetchAll<ZoneDailyConsumption>(
    "/zoneDailyConsumption",
    {
      where: { zoneId: eq(zoneId), date: { gte: from, lte: to } },
      sort: { field: "date", direction: "asc" },
    },
    signal,
  );
