import API from "./http";
import type { Paginated, SortState } from "../shared/types/api";

// Helpers that turn a typed query into JSON Server v1 params, so filtering,
// sorting and pagination happen on the server, not in the browser.

type Operator =
  | "eq"
  | "ne"
  | "lt"
  | "lte"
  | "gt"
  | "gte"
  | "in"
  | "contains"
  | "startsWith"
  | "endsWith";
type Scalar = string | number | boolean;
export type Condition = Partial<Record<Operator, Scalar | Scalar[]>>;

export interface ListQuery {
  page?: number;
  perPage?: number;
  sort?: SortState | SortState[];
  // Field -> condition. Undefined conditions are skipped (e.g. "All" filters).
  where?: Record<string, Condition | undefined>;
  // Case-insensitive "contains" search over several fields (OR).
  search?: { term: string; fields: string[] };
}

type Params = Record<string, string | number>;

// Equality condition that is skipped for empty values ("" means "All").
export const eq = (value: Scalar | undefined | null): Condition | undefined =>
  value === undefined || value === null || value === "" ? undefined : { eq: value };

export function toParams(query: ListQuery): Params {
  const params: Params = {};
  if (query.page) params._page = query.page;
  if (query.perPage) params._per_page = query.perPage;

  if (query.sort) {
    const sorts = Array.isArray(query.sort) ? query.sort : [query.sort];
    params._sort = sorts
      .map((s) => `${s.direction === "desc" ? "-" : ""}${s.field}`)
      .join(",");
  }

  // _where replaces plain filter params in JSON Server v1, so every condition
  // goes into it. Top-level keys are combined with AND.
  const where: Record<string, unknown> = {};
  for (const [field, condition] of Object.entries(query.where ?? {})) {
    if (condition && Object.keys(condition).length > 0) where[field] = condition;
  }
  const term = query.search?.term.trim();
  if (query.search && term) {
    where.or = query.search.fields.map((field) => ({
      [field]: { contains: term },
    }));
  }
  if (Object.keys(where).length > 0) params._where = JSON.stringify(where);

  return params;
}

export async function fetchPage<T>(
  url: string,
  query: ListQuery,
  signal?: AbortSignal,
): Promise<Paginated<T>> {
  const res = await API.get<Paginated<T>>(url, {
    params: toParams({ page: 1, perPage: 10, ...query }),
    signal,
  });
  return res.data;
}

export async function fetchAll<T>(
  url: string,
  query: Omit<ListQuery, "page" | "perPage">,
  signal?: AbortSignal,
): Promise<T[]> {
  const res = await API.get<T[]>(url, { params: toParams(query), signal });
  return res.data;
}

// Counts matching records without downloading them (one row per page).
export async function fetchCount(
  url: string,
  where: ListQuery["where"],
  signal?: AbortSignal,
): Promise<number> {
  const page = await fetchPage<unknown>(url, { where, perPage: 1 }, signal);
  return page.items;
}

export async function fetchOne<T>(url: string, signal?: AbortSignal): Promise<T> {
  const res = await API.get<T>(url, { signal });
  return res.data;
}
