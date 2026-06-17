/**
 * Reusable Pagination component.
 *
 * Props:
 *   page        {number}   – current page (1-based)
 *   totalPages  {number}   – total number of pages
 *   total       {number}   – total record count (optional, shown as label)
 *   onPageChange {fn}      – called with the new page number
 *   label       {string}   – noun shown in the "Total:" label e.g. "events", "users"
 *   align       {string}   – 'between' (default) | 'center' | 'end'
 *   size        {string}   – 'sm' (default) | 'md'
 */
export default function Pagination({
  page,
  totalPages,
  total,
  onPageChange,
  label     = 'records',
  align     = 'between',
  size      = 'sm',
}) {
  if (!totalPages || totalPages <= 0) return null;

  const btnSize = size === 'md' ? '' : 'btn-sm';

  // Build compact page-number list: always show first, last, current ±1, with ellipsis
  const pages = buildPageList(page, totalPages);

  const justifyClass =
    align === 'center' ? 'justify-content-center' :
    align === 'end'    ? 'justify-content-end'    :
    'justify-content-between';

  return (
    <div className={`d-flex align-items-center flex-wrap gap-2 mt-4 ${justifyClass}`}>

      {/* ── Total label (only when align=between and total is provided) ── */}
      {align === 'between' && total !== undefined && (
        <span className="text-muted small">
          Total: <strong>{total}</strong> {label}
        </span>
      )}

      {/* ── Pagination controls ── */}
      <div className="d-flex align-items-center gap-1">

        {/* Prev */}
        <button
          className={`btn ${btnSize} btn-outline-secondary`}
          disabled={page <= 1}
          onClick={() => onPageChange(page - 1)}
          aria-label="Previous page"
        >
          ‹ Prev
        </button>

        {/* Page numbers */}
        {pages.map((p, i) =>
          p === '…' ? (
            <span key={`ellipsis-${i}`} className="px-1 text-muted" style={{ lineHeight: '31px' }}>…</span>
          ) : (
            <button
              key={p}
              className={`btn ${btnSize} ${p === page ? 'btn-primary' : 'btn-outline-secondary'}`}
              onClick={() => onPageChange(p)}
              aria-label={`Page ${p}`}
              aria-current={p === page ? 'page' : undefined}
              style={{ minWidth: 36 }}
            >
              {p}
            </button>
          )
        )}

        {/* Next */}
        <button
          className={`btn ${btnSize} btn-outline-secondary`}
          disabled={page >= totalPages}
          onClick={() => onPageChange(page + 1)}
          aria-label="Next page"
        >
          Next ›
        </button>
      </div>
    </div>
  );
}

/**
 * Returns a compact list of page numbers with '…' ellipsis.
 * e.g. [1, '…', 4, 5, 6, '…', 12]
 */
function buildPageList(current, total) {
  if (total <= 7) return Array.from({ length: total }, (_, i) => i + 1);

  const pages = new Set([1, total, current]);
  if (current > 1) pages.add(current - 1);
  if (current < total) pages.add(current + 1);

  const sorted = [...pages].sort((a, b) => a - b);
  const result = [];

  for (let i = 0; i < sorted.length; i++) {
    if (i > 0 && sorted[i] - sorted[i - 1] > 1) result.push('…');
    result.push(sorted[i]);
  }

  return result;
}
