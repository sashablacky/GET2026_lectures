import { useState } from "react";
import type { SortState } from "../types/api";
import { useDebouncedValue } from "./useDebouncedValue";

interface TableStateOptions<F> {
  sort: SortState;
  filters: F;
  pageSize?: number;
}

/**
 * Page, sort, search and filter state for a server-driven DataTable.
 * Changing sort, search or a filter goes back to page 1.
 */
export function useTableState<F extends Record<string, string>>({
  sort: initialSort,
  filters: initialFilters,
  pageSize = 10,
}: TableStateOptions<F>) {
  const [page, setPage] = useState(1);
  const [sort, setSortState] = useState(initialSort);
  const [search, setSearchState] = useState("");
  const [filters, setFilters] = useState<F>(initialFilters);
  const debouncedSearch = useDebouncedValue(search);

  return {
    page,
    setPage,
    pageSize,
    sort,
    setSort: (next: SortState) => {
      setSortState(next);
      setPage(1);
    },
    search,
    debouncedSearch,
    setSearch: (value: string) => {
      setSearchState(value);
      setPage(1);
    },
    filters,
    setFilter: <K extends keyof F>(key: K, value: F[K]) => {
      setFilters((prev) => ({ ...prev, [key]: value }));
      setPage(1);
    },
  };
}
