// Phân trang 1-based (khớp backend: ?page=1). Hiện tối đa 5 số trang quanh trang hiện tại.
export default function Pagination({ page, totalPages, onChange }) {
  if (!totalPages || totalPages <= 1) return null

  const start = Math.max(1, Math.min(page - 2, totalPages - 4))
  const pages = Array.from({ length: Math.min(5, totalPages) }, (_, i) => start + i)
  const btn = 'min-w-10 h-10 px-3 rounded-full text-sm font-semibold transition-colors'

  return (
    <nav aria-label="Phân trang" className="flex items-center justify-center gap-2 mt-10">
      <button type="button" className={`${btn} text-gray-600 hover:bg-gray-100 disabled:opacity-40`}
        onClick={() => onChange(page - 1)} disabled={page <= 1} aria-label="Trang trước">‹</button>
      {pages.map((p) => (
        <button
          key={p}
          type="button"
          onClick={() => onChange(p)}
          aria-current={p === page ? 'page' : undefined}
          className={`${btn} ${p === page ? 'bg-primary text-white' : 'text-gray-600 hover:bg-gray-100'}`}
        >
          {p}
        </button>
      ))}
      <button type="button" className={`${btn} text-gray-600 hover:bg-gray-100 disabled:opacity-40`}
        onClick={() => onChange(page + 1)} disabled={page >= totalPages} aria-label="Trang sau">›</button>
    </nav>
  )
}
