import { ChevronLeft, ChevronRight } from "lucide-react";
import "./data.css";

interface PaginationProps {
  page: number;
  pageSize: number;
  total: number;
  onPageChange: (page: number) => void;
}

// Page numbers with ellipses, e.g. 1 … 4 5 6 … 12
function pageList(current: number, last: number): (number | "…")[] {
  if (last <= 7) return Array.from({ length: last }, (_, i) => i + 1);
  const pages: (number | "…")[] = [1];
  const start = Math.max(2, current - 1);
  const end = Math.min(last - 1, current + 1);
  if (start > 2) pages.push("…");
  for (let p = start; p <= end; p++) pages.push(p);
  if (end < last - 1) pages.push("…");
  pages.push(last);
  return pages;
}

export default function Pagination({ page, pageSize, total, onPageChange }: PaginationProps) {
  const last = Math.max(1, Math.ceil(total / pageSize));
  const from = total === 0 ? 0 : (page - 1) * pageSize + 1;
  const to = Math.min(total, page * pageSize);

  return (
    <nav className="pagination" aria-label="Pagination">
      <span className="pagination__info">
        Showing {from}–{to} of {total}
      </span>
      <div className="pagination__pages">
        <button
          type="button"
          className="pagination__btn"
          disabled={page <= 1}
          onClick={() => onPageChange(page - 1)}
          aria-label="Previous page"
        >
          <ChevronLeft size={16} /> <span className="pagination__label">Previous</span>
        </button>
        {pageList(page, last).map((p, i) =>
          p === "…" ? (
            <span key={`gap-${i}`} className="pagination__gap">
              …
            </span>
          ) : (
            <button
              key={p}
              type="button"
              className={`pagination__btn ${p === page ? "pagination__btn--active" : ""}`}
              aria-current={p === page ? "page" : undefined}
              onClick={() => onPageChange(p)}
            >
              {p}
            </button>
          ),
        )}
        <button
          type="button"
          className="pagination__btn"
          disabled={page >= last}
          onClick={() => onPageChange(page + 1)}
          aria-label="Next page"
        >
          <span className="pagination__label">Next</span> <ChevronRight size={16} />
        </button>
      </div>
    </nav>
  );
}
