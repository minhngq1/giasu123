// Dòng thời gian các bước của lớp (wireframe 08-frontend.md mục 4.4).
// Gom 9 trạng thái kỹ thuật của ClassStatus thành 7 bước dễ hiểu với phụ huynh.
const STEPS = ['Đăng lớp', 'Trung tâm duyệt', 'Đang tuyển', 'Chọn gia sư', 'Giữ phí & liên hệ', 'Học thử', 'Đang học']

// Trạng thái → [bước hiện tại, có lỗi/dừng ở bước đó không]
const POSITION = {
  PENDING_REVIEW: [1, false],
  REJECTED: [1, true],
  OPEN: [2, false],
  SHORTLISTED: [3, false],
  MATCHING: [4, false],
  CANCELLED_AUDIT: [5, true],
  ACTIVE: [6, false],
  COMPLETED: [7, false],
}

export default function ClassTimeline({ status }) {
  if (status === 'CLOSED') return null
  const [current, failed] = POSITION[status] ?? [0, false]

  return (
    <ol className="flex overflow-x-auto pb-2 -mx-1" aria-label="Tiến trình lớp">
      {STEPS.map((label, i) => {
        const done = i < current
        const isCurrent = i === current
        const dot = done ? 'bg-primary text-white' : isCurrent ? (failed ? 'bg-red-600 text-white' : 'bg-accent text-white') : 'bg-gray-100 text-gray-400'
        return (
          <li key={label} className="flex-1 min-w-[88px] px-1 text-center relative" aria-current={isCurrent ? 'step' : undefined}>
            {i > 0 && <span className={`absolute top-4 right-1/2 w-full h-0.5 -z-0 ${done || isCurrent ? 'bg-primary' : 'bg-gray-200'}`} aria-hidden="true" />}
            <span className={`relative z-10 mx-auto w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold ${dot}`}>
              {done ? '✓' : failed && isCurrent ? '!' : i + 1}
            </span>
            <span className={`block mt-2 text-xs ${isCurrent ? 'font-semibold text-gray-900' : 'text-gray-500'}`}>{label}</span>
          </li>
        )
      })}
    </ol>
  )
}
