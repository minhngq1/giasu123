// Khối thống kê nền xanh + 4 vòng tròn cam (dùng ở Home và trang Đăng ký).
// ⚠️ Số liệu lấy từ DEMO_STATS — là số MINH HỌA, xem constants/site.js.
import { DEMO_STATS } from '../../constants/site'

const icon = (paths) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" className="w-7 h-7" aria-hidden="true">{paths}</svg>
)

const STAT_ICONS = {
  tutor: icon(<><path d="M22 10L12 5 2 10l10 5 10-5z" /><path d="M6 12v5c0 1 2.7 2 6 2s6-1 6-2v-5" /></>),
  student: icon(<><circle cx="9" cy="8" r="3" /><path d="M3 20c0-3 2.7-5 6-5s6 2 6 5" /><path d="M16 4a3 3 0 010 6M18 20c0-2-.7-3.6-2-4.5" /></>),
  connect: icon(<><path d="M9 11l3 3L22 4" /><path d="M21 12v7a2 2 0 01-2 2H5a2 2 0 01-2-2V5a2 2 0 012-2h11" /></>),
  register: icon(<><path d="M3 17l6-6 4 4 7-7" /><path d="M14 7h6v6" /></>),
}

export default function StatsSection() {
  return (
    <section className="bg-primary py-16" aria-label="Thống kê">
      <div className="max-w-site mx-auto px-4 sm:px-6 lg:px-12">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-10 text-center text-white">
          {DEMO_STATS.map((stat) => (
            <div key={stat.key} className="flex flex-col items-center">
              <span className="w-16 h-16 rounded-full flex items-center justify-center text-white mb-4 bg-accent">
                {STAT_ICONS[stat.key]}
              </span>
              <p className="text-3xl lg:text-4xl font-extrabold">{stat.value}</p>
              <p className="text-sm mt-1.5 text-green-100">{stat.label}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
