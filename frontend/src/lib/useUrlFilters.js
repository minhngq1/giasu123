// Bộ lọc + trang hiện tại nằm TRÊN URL (?city=Hà Nội&subject=toan&page=2):
//   - copy link gửi người khác → mở ra đúng kết quả
//   - bấm Back của trình duyệt → quay về bộ lọc trước
import { useSearchParams } from 'react-router-dom'

export default function useUrlFilters(keys) {
  const [params, setParams] = useSearchParams()

  const filters = Object.fromEntries(keys.map((k) => [k, params.get(k) ?? '']))
  const page = Number(params.get('page')) || 1

  /** Đổi 1 hoặc nhiều bộ lọc → về trang 1 (kết quả đã khác). Giá trị rỗng thì xóa khỏi URL cho gọn. */
  const setFilters = (patch) => {
    const next = new URLSearchParams(params)
    Object.entries(patch).forEach(([k, v]) => (v === '' || v === null || v === undefined ? next.delete(k) : next.set(k, String(v))))
    next.delete('page')
    setParams(next)
  }

  const setPage = (p) => {
    const next = new URLSearchParams(params)
    if (p <= 1) next.delete('page')
    else next.set('page', String(p))
    setParams(next)
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  const clear = () => setParams(new URLSearchParams())
  const activeCount = keys.filter((k) => k !== 'sort' && filters[k]).length

  return { filters, page, setFilters, setPage, clear, activeCount }
}
