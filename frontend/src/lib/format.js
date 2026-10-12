// Định dạng hiển thị dùng chung. Mọi số tiền, xèng, ngày giờ trên UI đều đi qua đây
// để cả site hiển thị thống nhất (08-frontend.md mục 6).

const TIME_ZONE = 'Asia/Ho_Chi_Minh'
const numberFmt = new Intl.NumberFormat('vi-VN')

/** 200000 → "200.000đ". Giá trị rỗng → "—" (không bao giờ in "undefinedđ"). */
export function formatVnd(amount) {
  if (amount === null || amount === undefined || Number.isNaN(Number(amount))) return '—'
  return `${numberFmt.format(Number(amount))}đ`
}

/** 1160 → "1.160 xèng" */
export function formatXeng(amount) {
  if (amount === null || amount === undefined) return '—'
  return `${numberFmt.format(Number(amount))} xèng`
}

/** "2026-09-30T14:00:00+07:00" → "14:00 30/09/2026" (giờ Việt Nam, bất kể máy người dùng ở múi giờ nào). */
export function formatDateTime(iso) {
  if (!iso) return '—'
  const d = new Date(iso)
  const time = new Intl.DateTimeFormat('vi-VN', { timeZone: TIME_ZONE, hour: '2-digit', minute: '2-digit', hour12: false }).format(d)
  const date = new Intl.DateTimeFormat('vi-VN', { timeZone: TIME_ZONE, day: '2-digit', month: '2-digit', year: 'numeric' }).format(d)
  return `${time} ${date}`
}

/** "30/09/2026" */
export function formatDate(iso) {
  if (!iso) return '—'
  return new Intl.DateTimeFormat('vi-VN', { timeZone: TIME_ZONE, day: '2-digit', month: '2-digit', year: 'numeric' }).format(new Date(iso))
}

/**
 * Thời gian tương đối: "vừa xong", "5 phút trước", "2 ngày trước".
 * `now` truyền vào được để test không phụ thuộc đồng hồ thật (cùng ý tưởng với bean Clock ở backend).
 */
export function timeAgo(iso, now = Date.now()) {
  if (!iso) return ''
  const diffSec = Math.max(0, Math.floor((now - new Date(iso).getTime()) / 1000))
  if (diffSec < 60) return 'vừa xong'
  const min = Math.floor(diffSec / 60)
  if (min < 60) return `${min} phút trước`
  const hours = Math.floor(min / 60)
  if (hours < 24) return `${hours} giờ trước`
  const days = Math.floor(hours / 24)
  if (days < 30) return `${days} ngày trước`
  return formatDate(iso)
}

/** Mã lớp hiển thị: 1024 → "#L1024" */
export const classCode = (id) => `#L${id}`

/** Chữ cái đầu cho avatar: "Nguyễn Thị Hương" → "TH" */
export function initialsOf(fullName = '') {
  return fullName.trim().split(/\s+/).slice(-2).map((w) => w[0] ?? '').join('').toUpperCase()
}

/** Tên gọi = từ cuối của họ tên: "Nguyễn Thị Hương" → "Hương" */
export const givenName = (fullName = '') => fullName.trim().split(/\s+/).pop()
