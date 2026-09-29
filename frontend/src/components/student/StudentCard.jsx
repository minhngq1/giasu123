/*
  STUDENTCARD — Card học sinh cần gia sư (bám sát thiết kế Figma)
  ======================================================================
  Layout: card trắng, căn trái
    - Header : avatar nhỏ + tên
    - Body   : 4 dòng thông tin có icon (Môn / Hình thức / Địa chỉ / Yêu cầu)
    - Footer : học phí/buổi (xanh) | "Xem chi tiết ↗" (cam)
*/
import { Link } from 'react-router-dom'

/* Định dạng tiền: 200000 → "200,000đ/ buổi" */
function formatBudget(budget) {
  return budget?.toLocaleString('vi-VN') + 'đ/ buổi'
}

/* ── Icon dòng thông tin (line-art xám) ── */
const ICONS = {
  subject: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" className="w-4 h-4">
      <path d="M4 19.5A2.5 2.5 0 016.5 17H20" /><path d="M6.5 2H20v20H6.5A2.5 2.5 0 014 19.5v-15A2.5 2.5 0 016.5 2z" />
    </svg>
  ),
  mode: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" className="w-4 h-4">
      <path d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V7" /><path d="M3 7l9-4 9 4-9 4-9-4z" /><path d="M7 12v4" />
    </svg>
  ),
  address: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" className="w-4 h-4">
      <path d="M12 21s-7-5.5-7-11a7 7 0 1114 0c0 5.5-7 11-7 11z" /><circle cx="12" cy="10" r="2.5" />
    </svg>
  ),
  requirement: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" className="w-4 h-4">
      <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
    </svg>
  ),
}

/* Một dòng thông tin: icon + nhãn xám + giá trị đậm */
function InfoRow({ icon, label, value }) {
  return (
    <div className="flex items-start gap-2 text-sm">
      <span className="text-gray-400 mt-0.5 flex-shrink-0">{icon}</span>
      <p className="text-gray-500">
        {label}: <span className="font-semibold text-gray-800">{value}</span>
      </p>
    </div>
  )
}

export default function StudentCard({ student }) {
  const {
    id, fullName, avatar, subjects = [],
    studyMode = 'Dạy kèm tại nhà',
    address, district, city,
    requirement = 'Không yêu cầu',
    budget,
  } = student

  const subjectText = subjects.join(', ')
  const addressText = address || [district, city].filter(Boolean).join(', ')
  const initials = fullName?.split(' ').slice(-2).map(w => w[0]).join('').toUpperCase()

  return (
    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm hover:shadow-md transition-shadow duration-300 p-5">

      {/* Header: avatar nhỏ + tên */}
      <div className="flex items-center gap-3 mb-4">
        {avatar ? (
          <img src={avatar} alt={fullName} className="w-10 h-10 rounded-full object-cover" />
        ) : (
          <div className="w-10 h-10 rounded-full bg-green-50 text-green-700 flex items-center justify-center font-bold text-sm">
            {initials}
          </div>
        )}
        <h3 className="font-bold text-gray-900 text-base">{fullName}</h3>
      </div>

      {/* Thông tin */}
      <div className="space-y-2.5">
        <InfoRow icon={ICONS.subject}     label="Môn cần học"   value={subjectText} />
        <InfoRow icon={ICONS.mode}        label="Hình thức học" value={studyMode} />
        <InfoRow icon={ICONS.address}     label="Địa chỉ học"   value={addressText} />
        <InfoRow icon={ICONS.requirement} label="Yêu cầu riêng" value={requirement} />
      </div>

      <hr className="my-4 border-gray-100" />

      {/* Footer: học phí | xem chi tiết */}
      <div className="flex items-center justify-between">
        <span className="flex items-center gap-1.5 font-bold text-sm" style={{ color: '#24725D' }}>
          {/* icon đồng xu */}
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" className="w-4 h-4">
            <circle cx="12" cy="12" r="9" /><path d="M12 7v10M9.5 9.5h4a1.5 1.5 0 010 3h-3a1.5 1.5 0 000 3h4" />
          </svg>
          {formatBudget(budget)}
        </span>

        <Link
          to={`/students/${id}`}
          className="flex items-center gap-1.5 text-sm font-semibold text-orange-500 hover:opacity-80 transition-opacity"
        >
          Xem chi tiết
        </Link>
      </div>
    </div>
  )
}
