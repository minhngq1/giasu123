// Khung chờ cả trang (dùng khi tải code trang hoặc đang khôi phục phiên).
export default function PageLoading() {
  return (
    <div className="max-w-site mx-auto px-6 lg:px-12 py-16" role="status" aria-live="polite">
      <span className="sr-only">Đang tải…</span>
      <div className="animate-pulse space-y-4">
        <div className="h-8 w-1/3 bg-gray-100 rounded-lg" />
        <div className="h-4 w-2/3 bg-gray-100 rounded" />
        <div className="h-4 w-1/2 bg-gray-100 rounded" />
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-6">
          {[0, 1, 2].map((i) => (
            <div key={i} className="h-44 bg-gray-100 rounded-2xl" />
          ))}
        </div>
      </div>
    </div>
  )
}
