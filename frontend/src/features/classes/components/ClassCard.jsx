/*
  CLASSCARD — Card lớp cần gia sư (thay StudentCard cũ, theo wireframe 08-frontend.md mục 4.2)
  Giữ phong cách card trắng + dòng icon của UI cũ, nhưng TUÂN THỦ bảo vệ dữ liệu:
  chỉ hiện "Bạn {tên gọi}" + quận/tỉnh — KHÔNG có họ tên đầy đủ, số nhà, SĐT.
*/
import { Link } from 'react-router-dom'
import Avatar from '../../../components/ui/Avatar'
import StatusChip from '../../../components/ui/StatusChip'
import InfoRow from '../../../components/ui/InfoRow'
import { ICONS } from '../../../components/ui/icons'
import { CLASS_STATUS } from '../../../constants/labels'
import { classCode } from '../../../lib/format'
import { studentLine, subjectsText, studyModeText, classAreaText, scheduleText, requirementText, classFee } from '../format'

export default function ClassCard({ cls, to = `/students/${cls.id}` }) {
  return (
    <article className="bg-white rounded-2xl border border-gray-100 shadow-sm hover:shadow-md transition-shadow duration-300 p-5">

      {/* Header: avatar chữ cái + "Bạn An (nam) · Lớp 12" | mã lớp + trạng thái */}
      <div className="flex items-start justify-between gap-3 mb-4">
        <div className="flex items-center gap-3 min-w-0">
          <Avatar name={cls.studentDisplayName.replace(/^Bạn\s+/, '')} />
          <div className="min-w-0">
            <h3 className="font-bold text-gray-900 text-base truncate">{studentLine(cls)}</h3>
            <p className="text-xs text-gray-400">{classCode(cls.id)}</p>
          </div>
        </div>
        <StatusChip map={CLASS_STATUS} status={cls.status} />
      </div>

      {/* Thông tin */}
      <div className="space-y-2.5">
        <InfoRow icon={ICONS.subject}     label="Môn cần học"   value={subjectsText(cls)} />
        <InfoRow icon={ICONS.mode}        label="Hình thức học" value={studyModeText(cls)} />
        <InfoRow icon={ICONS.area}        label="Khu vực"       value={classAreaText(cls)} />
        <InfoRow icon={ICONS.calendar}    label="Lịch học"      value={scheduleText(cls)} />
        <InfoRow icon={ICONS.requirement} label="Yêu cầu riêng" value={requirementText(cls)} />
      </div>

      <hr className="my-4 border-gray-100" />

      {/* Footer: học phí/buổi | xem chi tiết */}
      <div className="flex items-center justify-between">
        <span className="flex items-center gap-1.5 font-bold text-sm text-primary">
          {ICONS.coin}
          {classFee(cls)}
        </span>
        <Link
          to={to}
          className="flex items-center gap-1.5 text-sm font-semibold text-orange-500 hover:opacity-80 transition-opacity"
          aria-label={`Xem chi tiết lớp ${classCode(cls.id)}`}
        >
          Xem chi tiết
        </Link>
      </div>
    </article>
  )
}
