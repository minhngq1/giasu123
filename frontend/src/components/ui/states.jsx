// 3 trạng thái bắt buộc của mọi màn hình gọi API (CLAUDE.md mục 6): loading · lỗi · rỗng.
import { messageOf } from '../../lib/problem'
import Button from './Button'

export function Skeleton({ className = '' }) {
  return <div className={`animate-pulse bg-gray-100 rounded-lg ${className}`} aria-hidden="true" />
}

/** Khung chờ dạng lưới card — cùng bố cục với nội dung thật để trang không bị "nhảy".
 *  `itemClassName` đặt chiều cao tối thiểu = chiều cao card thật (đo bằng Playwright) → CLS gần 0
 *  khi dữ liệu về. Hằng số dùng sẵn: CARD_H trong ./cardHeights.js */
export function CardGridSkeleton({ count = 6, cols = 'sm:grid-cols-2 lg:grid-cols-3', itemClassName = '' }) {
  return (
    <div className={`grid grid-cols-1 ${cols} gap-6`} role="status" aria-label="Đang tải">
      {Array.from({ length: count }, (_, i) => (
        <div key={i} className={`bg-white rounded-2xl border border-gray-100 p-5 space-y-3 ${itemClassName}`}>
          <div className="flex items-center gap-3">
            <Skeleton className="w-10 h-10 rounded-full" />
            <Skeleton className="h-4 w-1/2" />
          </div>
          <Skeleton className="h-3 w-full" />
          <Skeleton className="h-3 w-5/6" />
          <Skeleton className="h-3 w-2/3" />
        </div>
      ))}
    </div>
  )
}

export function ErrorState({ error, onRetry, title = 'Không tải được dữ liệu' }) {
  return (
    <div className="text-center py-12 px-6 bg-white rounded-2xl border border-red-100" role="alert">
      <p className="text-3xl mb-3" aria-hidden="true">⚠️</p>
      <p className="font-bold text-gray-900 mb-1">{title}</p>
      <p className="text-sm text-gray-500 mb-6">{messageOf(error)}</p>
      {onRetry && (
        <Button variant="secondary" onClick={onRetry}>
          Thử lại
        </Button>
      )}
    </div>
  )
}

export function EmptyState({ icon = '🔍', title, description, action }) {
  return (
    <div className="text-center py-12 px-6 bg-white rounded-2xl border border-dashed border-gray-200">
      <p className="text-3xl mb-3" aria-hidden="true">{icon}</p>
      <p className="font-bold text-gray-900 mb-1">{title}</p>
      {description && <p className="text-sm text-gray-500 mb-6 max-w-[420px] mx-auto">{description}</p>}
      {action}
    </div>
  )
}

/**
 * Bọc kết quả của useQuery → tự chọn hiển thị loading / lỗi / rỗng / nội dung.
 *   <QueryState query={q} isEmpty={(d) => d.items.length === 0} empty={<EmptyState .../>} loading={<CardGridSkeleton/>}>
 *     {(data) => <List items={data.items} />}
 *   </QueryState>
 */
export function QueryState({ query, loading, empty, isEmpty, children }) {
  if (query.isPending) return loading ?? <CardGridSkeleton />
  if (query.isError) return <ErrorState error={query.error} onRetry={() => query.refetch()} />
  if (isEmpty?.(query.data)) return empty ?? <EmptyState title="Chưa có dữ liệu" />
  return children(query.data)
}
