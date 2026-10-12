// Khung thông báo trong trang (thành công / lỗi / thông tin).
const TONES = {
  info: 'bg-sky-50 border-sky-100 text-sky-900',
  success: 'bg-primary-soft border-primary-border text-primary',
  warning: 'bg-amber-50 border-amber-200 text-amber-900',
  error: 'bg-red-50 border-red-100 text-red-700',
}

export default function Notice({ tone = 'info', title, children, className = '' }) {
  return (
    <div className={`rounded-xl border px-4 py-3 text-sm ${TONES[tone]} ${className}`} role={tone === 'error' ? 'alert' : 'status'}>
      {title && <p className="font-semibold mb-0.5">{title}</p>}
      {children}
    </div>
  )
}
