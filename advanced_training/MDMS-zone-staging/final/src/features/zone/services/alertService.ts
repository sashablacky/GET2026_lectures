import { eq, fetchCount, fetchPage } from "../../../services/query";
import type { SortState } from "../../../shared/types/api";
import type { Alert, AlertSeverity, AlertStatus } from "../../../shared/types/models";

export interface AlertListParams {
  page: number;
  pageSize: number;
  sort: SortState;
  search: string;
  severity: AlertSeverity | "";
  status: AlertStatus | "";
}

export const getZoneAlerts = (zoneId: string, p: AlertListParams, signal?: AbortSignal) =>
  fetchPage<Alert>(
    "/alerts",
    {
      page: p.page,
      perPage: p.pageSize,
      sort: p.sort,
      where: { zoneId: eq(zoneId), severity: eq(p.severity), status: eq(p.status) },
      search: { term: p.search, fields: ["id", "meterId", "type"] },
    },
    signal,
  );

// Pending = not resolved yet (Open or Acknowledged).
export const countPendingAlerts = (zoneId: string, signal?: AbortSignal) =>
  fetchCount("/alerts", { zoneId: eq(zoneId), status: { ne: "Resolved" } }, signal);
