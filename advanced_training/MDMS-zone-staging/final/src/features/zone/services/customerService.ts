import { eq, fetchAll, fetchPage } from "../../../services/query";
import type { SortState } from "../../../shared/types/api";
import type { User, UserStatus } from "../../../shared/types/models";

export interface CustomerListParams {
  page: number;
  pageSize: number;
  sort: SortState;
  search: string;
  status: UserStatus | "";
}

export const getZoneCustomers = (zoneId: string, p: CustomerListParams, signal?: AbortSignal) =>
  fetchPage<User>(
    "/users",
    {
      page: p.page,
      perPage: p.pageSize,
      sort: p.sort,
      where: { role: eq("customer"), zoneId: eq(zoneId), status: eq(p.status) },
      search: { term: p.search, fields: ["id", "name", "email", "phone"] },
    },
    signal,
  );

// Active customers of the zone, for the meter owner dropdown.
export const getZoneCustomerOptions = (zoneId: string, signal?: AbortSignal) =>
  fetchAll<User>(
    "/users",
    {
      where: { role: eq("customer"), zoneId: eq(zoneId), status: eq("Active") },
      sort: { field: "name", direction: "asc" },
    },
    signal,
  );
