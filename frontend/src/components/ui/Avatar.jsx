import { initialsOf } from '../../lib/format'

/** Ảnh đại diện; không có ảnh → chữ cái đầu trên nền xanh nhạt (giống card cũ). */
export default function Avatar({ src, name, size = 'w-10 h-10 text-sm' }) {
  if (src) return <img src={src} alt={name} className={`${size} rounded-full object-cover`} />
  return (
    <div className={`${size} rounded-full bg-green-50 text-green-700 flex items-center justify-center font-bold flex-shrink-0`} aria-hidden="true">
      {initialsOf(name)}
    </div>
  )
}

export function VerifiedBadge() {
  return (
    <span className="text-green-600 text-xs flex-shrink-0" title="Đã xác minh">
      ✓<span className="sr-only">Đã xác minh</span>
    </span>
  )
}
