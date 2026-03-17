import "./Pagination.css";

/**
 * Reusable pagination component.
 *
 * Props:
 *  - page          {number}   current page (1-based)
 *  - totalPages    {number}
 *  - totalCount    {number}
 *  - hasPrevious   {boolean}
 *  - hasNext       {boolean}
 *  - loading       {boolean}  disables buttons while fetching
 *  - onPageChange  {(page: number) => void}
 */
const Pagination = ({
  page,
  totalPages,
  totalCount,
  hasPrevious,
  hasNext,
  loading = false,
  onPageChange,
}) => {
  if (!totalPages || totalPages <= 1) return null;

  return (
    <div className="pagination">
      <button
        className="pagination__btn"
        onClick={() => onPageChange(page - 1)}
        disabled={!hasPrevious || loading}
        aria-label="Previous page"
      >
        ← Prev
      </button>

      <div className="pagination__pages">
        {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
          <button
            key={p}
            className={`pagination__btn pagination__btn--page${p === page ? " pagination__btn--active" : ""}`}
            onClick={() => onPageChange(p)}
            disabled={loading}
            aria-label={`Page ${p}`}
            aria-current={p === page ? "page" : undefined}
          >
            {p}
          </button>
        ))}
      </div>

      <button
        className="pagination__btn"
        onClick={() => onPageChange(page + 1)}
        disabled={!hasNext || loading}
        aria-label="Next page"
      >
        Next →
      </button>

      <span className="pagination__info">
        Page {page} / {totalPages} &nbsp;·&nbsp; {totalCount} total
      </span>
    </div>
  );
};

export default Pagination;
