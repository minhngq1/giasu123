/*
  TUTORCARD — Card gia sư (đồng bộ phong cách card trắng với StudentCard)
  ========================================================================
  Layout: card trắng, căn trái
    - Header : avatar + tên (+ badge đã xác minh) + sao đánh giá
    - Body   : 4 dòng thông tin có icon (Môn dạy / Hình thức / Khu vực / Kinh nghiệm)
    - Footer : học phí/giờ (xanh) | "Xem chi tiết ↗" (cam)
*/
import { Link } from 'react-router-dom'

function formatPrice(price) {
  return price?.toLocaleString('vi-VN') + 'đ/ giờ'
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
  area: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" className="w-4 h-4">
      <path d="M12 21s-7-5.5-7-11a7 7 0 1114 0c0 5.5-7 11-7 11z" /><circle cx="12" cy="10" r="2.5" />
    </svg>
  ),
  exp: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" className="w-4 h-4">
      <circle cx="12" cy="12" r="9" /><path d="M12 7v5l3 2" />
    </svg>
  ),
}

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

function renderStars(rating) {
  return Array.from({ length: 5 }, (_, i) => (
    <span key={i} className={i < Math.round(rating) ? 'text-yellow-400' : 'text-gray-300'}>★</span>
  ))
}

export default function TutorCard({ tutor }) {
  const {
    id, fullName, avatar, subjects = [], pricePerHour,
    studyMode = 'Dạy kèm tại nhà',
    district, city, experience, rating = 0, isVerified,
  } = tutor

  const subjectText = subjects.join(', ')
  const areaText = [district, city].filter(Boolean).join(', ')
  const initials = fullName?.split(' ').slice(-2).map(w => w[0]).join('').toUpperCase()

  return (
    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm hover:shadow-md transition-shadow duration-300 p-5">

      {/* Header: avatar + tên + badge + sao */}
      <div className="flex items-center gap-3 mb-4">
        {avatar ? (
          <img src={avatar} alt={fullName} className="w-10 h-10 rounded-full object-cover" />
        ) : (
          <div className="w-10 h-10 rounded-full bg-green-50 text-green-700 flex items-center justify-center font-bold text-sm">
            {initials}
          </div>
        )}
        <div className="min-w-0">
          <div className="flex items-center gap-1.5">
            <h3 className="font-bold text-gray-900 text-base truncate">{fullName}</h3>
            {isVerified && (
              <span className="text-green-600 text-xs flex-shrink-0" title="Đã xác minh">✓</span>
            )}
          </div>
          <div className="flex items-center gap-1 text-xs leading-none">
            {renderStars(rating)}
            <span className="text-gray-400 ml-1">({rating.toFixed(1)})</span>
          </div>
        </div>
      </div>

      {/* Thông tin */}
      <div className="space-y-2.5">
        <InfoRow icon={ICONS.subject} label="Môn dạy"     value={subjectText} />
        <InfoRow icon={ICONS.mode}    label="Hình thức"   value={studyMode} />
        <InfoRow icon={ICONS.area}    label="Khu vực"     value={areaText} />
        <InfoRow icon={ICONS.exp}     label="Kinh nghiệm" value={`${experience} năm`} />
      </div>

      <hr className="my-4 border-gray-100" />

      {/* Footer: học phí | xem chi tiết */}
      <div className="flex items-center justify-between">
        <span className="flex items-center gap-1.5 font-bold text-sm" style={{ color: '#24725D' }}>
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" className="w-4 h-4">
            <circle cx="12" cy="12" r="9" /><path d="M12 7v10M9.5 9.5h4a1.5 1.5 0 010 3h-3a1.5 1.5 0 000 3h4" />
          </svg>
          {formatPrice(pricePerHour)}
        </span>

        <Link
          to={`/tutors/${id}`}
          className="flex items-center gap-1.5 text-sm font-semibold text-orange-500 hover:opacity-80 transition-opacity"
        >
          Xem chi tiết
        </Link>
      </div>
    </div>
  )
}
