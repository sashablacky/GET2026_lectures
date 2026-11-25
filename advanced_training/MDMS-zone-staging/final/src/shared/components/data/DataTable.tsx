import type { ReactNode } from "react";
import { ArrowDown, ArrowUp, ArrowUpDown, CircleAlert, Search } from "lucide-react";
import type { SortState } from "../../types/api";
import Pagination from "./Pagination";
import RowActionsMenu from "./RowActionsMenu";
import EmptyState from "../feedback/EmptyState";
import Skeleton from "../feedback/Skeleton";
import "./data.css";

export interface Column<T> {
  key: string; // field name; also used as the sort field
  header: string;
  render?: (row: T) => ReactNode; // default: the raw field value
  sortable?: boolean;
  align?: "left" | "right" | "center";
}

export interface RowAction<T> {
  label: string | ((row: T) => string);
  onClick: (row: T) => void;
  danger?: boolean | ((row: T) => boolean);
}

export interface DataTableProps<T> {
  columns: Column<T>[];
  rows: T[];
  rowKey: (row: T) => string;
  loading?: boolean;
  error?: string;
  emptyTitle?: string;
  emptyMessage?: string;
  // Sorting, paging and search are controlled by the page, which passes
  // them to the server (JSON Server), so the table only renders.
  sort?: SortState;
  onSortChange?: (sort: SortState) => void;
  pagination?: {
    page: number;
    pageSize: number;
    total: number;
    onPageChange: (page: number) => void;
  };
  search?: {
    value: string;
    onChange: (value: string) => void;
    placeholder?: string;
  };
  toolbar?: ReactNode; // filters shown next to the search box
  rowActions?: RowAction<T>[];
  selection?: {
    selected: Set<string>;
    onChange: (selected: Set<string>) => void;
  };
  caption?: string;
}

const SKELETON_ROWS = 5;

function defaultCell<T>(row: T, key: string): ReactNode {
  const value = (row as Record<string, unknown>)[key];
  return value === null || value === undefined || value === "" ? "—" : String(value);
}

export default function DataTable<T>({
  columns,
  rows,
  rowKey,
  loading = false,
  error,
  emptyTitle = "No records found",
  emptyMessage,
  sort,
  onSortChange,
  pagination,
  search,
  toolbar,
  rowActions,
  selection,
  caption,
}: DataTableProps<T>) {
  const colCount = columns.length + (selection ? 1 : 0) + (rowActions?.length ? 1 : 0);
  const pageKeys = rows.map(rowKey);
  const allSelected = !!selection && pageKeys.length > 0 && pageKeys.every((k) => selection.selected.has(k));

  const toggleAll = () => {
    if (!selection) return;
    const next = new Set(selection.selected);
    pageKeys.forEach((k) => (allSelected ? next.delete(k) : next.add(k)));
    selection.onChange(next);
  };
  const toggleRow = (key: string) => {
    if (!selection) return;
    const next = new Set(selection.selected);
    if (next.has(key)) next.delete(key);
    else next.add(key);
    selection.onChange(next);
  };

  const onHeaderClick = (col: Column<T>) => {
    if (!col.sortable || !onSortChange) return;
    const direction = sort?.field === col.key && sort.direction === "asc" ? "desc" : "asc";
    onSortChange({ field: col.key, direction });
  };

  const showSkeleton = loading && rows.length === 0;

  let body: ReactNode;
  if (error) {
    body = (
      <tr>
        <td colSpan={colCount}>
          <EmptyState tone="error" icon={<CircleAlert size={28} />} title="Could not load data" message={error} />
        </td>
      </tr>
    );
  } else if (showSkeleton) {
    body = Array.from({ length: SKELETON_ROWS }, (_, i) => (
      <tr key={i}>
        {Array.from({ length: colCount }, (_, j) => (
          <td key={j}>
            <Skeleton width={j === 0 ? "70%" : "50%"} />
          </td>
        ))}
      </tr>
    ));
  } else if (rows.length === 0) {
    body = (
      <tr>
        <td colSpan={colCount}>
          <EmptyState title={emptyTitle} message={emptyMessage} />
        </td>
      </tr>
    );
  } else {
    body = rows.map((row) => {
      const key = rowKey(row);
      const selected = selection?.selected.has(key);
      return (
        <tr key={key} className={selected ? "is-selected" : undefined}>
          {selection && (
            <td className="data-table__check">
              <input
                type="checkbox"
                checked={selected}
                onChange={() => toggleRow(key)}
                aria-label={`Select ${key}`}
              />
            </td>
          )}
          {columns.map((col) => (
            <td key={col.key} className={col.align ? `align-${col.align}` : undefined}>
              {col.render ? col.render(row) : defaultCell(row, col.key)}
            </td>
          ))}
          {rowActions?.length ? (
            <td className="data-table__actions">
              <RowActionsMenu row={row} actions={rowActions} />
            </td>
          ) : null}
        </tr>
      );
    });
  }

  return (
    <div className="data-table card">
      {(search || toolbar || (selection && selection.selected.size > 0)) && (
        <div className="data-table__toolbar">
          {search && (
            <label className="data-table__search">
              <Search size={16} aria-hidden="true" />
              <span className="sr-only">Search</span>
              <input
                type="search"
                value={search.value}
                placeholder={search.placeholder ?? "Search…"}
                onChange={(e) => search.onChange(e.target.value)}
              />
            </label>
          )}
          {selection && selection.selected.size > 0 && (
            <span className="data-table__selected">{selection.selected.size} selected</span>
          )}
          {toolbar && <div className="data-table__filters">{toolbar}</div>}
        </div>
      )}

      <div className={`data-table__scroll ${loading && !showSkeleton ? "is-loading" : ""}`}>
        <table>
          {caption && <caption className="sr-only">{caption}</caption>}
          <thead>
            <tr>
              {selection && (
                <th className="data-table__check">
                  <input
                    type="checkbox"
                    checked={allSelected}
                    onChange={toggleAll}
                    aria-label="Select all rows on this page"
                    disabled={rows.length === 0}
                  />
                </th>
              )}
              {columns.map((col) => {
                const active = sort?.field === col.key;
                const ariaSort = active ? (sort.direction === "asc" ? "ascending" : "descending") : undefined;
                return (
                  <th key={col.key} aria-sort={ariaSort} className={col.align ? `align-${col.align}` : undefined}>
                    {col.sortable && onSortChange ? (
                      <button type="button" className="data-table__sort" onClick={() => onHeaderClick(col)}>
                        {col.header}
                        {active ? (
                          sort.direction === "asc" ? (
                            <ArrowUp size={14} />
                          ) : (
                            <ArrowDown size={14} />
                          )
                        ) : (
                          <ArrowUpDown size={14} className="muted" />
                        )}
                      </button>
                    ) : (
                      col.header
                    )}
                  </th>
                );
              })}
              {rowActions?.length ? (
                <th className="data-table__actions">
                  <span className="sr-only">Actions</span>
                </th>
              ) : null}
            </tr>
          </thead>
          <tbody>{body}</tbody>
        </table>
      </div>

      {pagination && !error && pagination.total > 0 && (
        <Pagination
          page={pagination.page}
          pageSize={pagination.pageSize}
          total={pagination.total}
          onPageChange={pagination.onPageChange}
        />
      )}
    </div>
  );
}
