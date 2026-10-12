/*
  TUTORCARD — Card gia sư (giữ nguyên giao diện đã duyệt)
    - Header : avatar + tên (+ badge đã xác minh) + sao đánh giá
    - Body   : 4 dòng thông tin có icon (Môn dạy / Hình thức / Khu vực / Kinh nghiệm)
    - Footer : học phí (xanh) | "Xem chi tiết" (cam)
  Nhận đúng TutorPublicDto từ API (features/tutors/api.js).
*/
import { Link } from 'react-router-dom'
import Avatar, { VerifiedBadge } from '../../../components/ui/Avatar'
import InfoRow from '../../../components/ui/InfoRow'
import { ICONS } from '../../../components/ui/icons'
import { teachModeText, tutorAreaText, tutorFee } from '../format'

/** Sao đánh giá. `rating` null (R1 chưa có tính năng đánh giá) → hiện nhãn "Gia sư mới" thay vì crash. */
export function Stars({ rating }) {
  if (rating === null || rating === undefined) {
    return <span className="inline-block text-[11px] font-semibold text-primary bg-primary-soft rounded-full px-2 py-0.5">Gia sư mới</span>
  }
  return (
    <div className="flex items-center gap-1 text-xs leading-none" role="img" aria-label={`Đánh giá ${rating.toFixed(1)} trên 5`}>
      {Array.from({ length: 5 }, (_, i) => (
        <span key={i} aria-hidden="true" className={i < Math.round(rating) ? 'text-yellow-400' : 'text-gray-300'}>★</span>
      ))}
      <span className="text-gray-500 ml-1" aria-hidden="true">({rating.toFixed(1)})</span>
    </div>
  )
}

export default function TutorCard({ tutor }) {
  const { id, fullName, avatarUrl, subjects = [], experienceYears, rating, verified, expectedFee } = tutor

  return (
    <article className="bg-white rounded-2xl border border-gray-100 shadow-sm hover:shadow-md transition-shadow duration-300 p-5">

      {/* Header: avatar + tên + badge + sao */}
      <div className="flex items-center gap-3 mb-4">
        <Avatar src={avatarUrl} name={fullName} />
        <div className="min-w-0">
          <div className="flex items-center gap-1.5">
            <h3 className="font-bold text-gray-900 text-base truncate">{fullName}</h3>
            {verified && <VerifiedBadge />}
          </div>
          <Stars rating={rating} />
        </div>
      </div>

      {/* Thông tin */}
      <div className="space-y-2.5">
        <InfoRow icon={ICONS.subject} label="Môn dạy"     value={subjects.map((s) => s.name).join(', ')} />
        <InfoRow icon={ICONS.mode}    label="Hình thức"   value={teachModeText(tutor)} />
        <InfoRow icon={ICONS.area}    label="Khu vực"     value={tutorAreaText(tutor)} />
        <InfoRow icon={ICONS.exp}     label="Kinh nghiệm" value={`${experienceYears} năm`} />
      </div>

      <hr className="my-4 border-gray-100" />

      {/* Footer: học phí | xem chi tiết */}
      <div className="flex items-center justify-between">
        <span className="flex items-center gap-1.5 font-bold text-sm text-primary">
          {ICONS.coin}
          {tutorFee(expectedFee)}
        </span>

        <Link
          to={`/tutors/${id}`}
          className="flex items-center gap-1.5 text-sm font-semibold text-orange-500 hover:opacity-80 transition-opacity"
          aria-label={`Xem chi tiết gia sư ${fullName}`}
        >
          Xem chi tiết
        </Link>
      </div>
    </article>
  )
}
