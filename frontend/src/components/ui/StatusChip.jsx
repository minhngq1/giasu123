// Chip trạng thái — mỗi tông 1 ý nghĩa (08-frontend.md mục 5).
// Truyền map nhãn (vd CLASS_STATUS) + mã trạng thái: <StatusChip map={CLASS_STATUS} status="OPEN" />
import { labelOf, toneOf } from '../../constants/labels'

const TONES = {
  gray: 'bg-gray-100 text-gray-700',
  blue: 'bg-sky-50 text-sky-800',
  orange: 'bg-accent-soft text-orange-800',
  green: 'bg-primary-soft text-primary',
  red: 'bg-red-50 text-red-700',
}

export default function StatusChip({ map, status, className = '' }) {
  return (
    <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold whitespace-nowrap ${TONES[toneOf(map, status)]} ${className}`}>
      {labelOf(map, status)}
    </span>
  )
}
