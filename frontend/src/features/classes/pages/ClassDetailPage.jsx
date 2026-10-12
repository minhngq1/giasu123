// /students/:id — Chi tiết lớp CÔNG KHAI (08-frontend.md mục 4.3). Không có họ tên đầy đủ / SĐT / số nhà.
import { Link, useParams, useLocation } from 'react-router-dom'
import { useClass } from '../api'
import FeeBox from '../components/FeeBox'
import { studentLine, subjectsText, studyModeText, classAreaText, scheduleText, requirementText } from '../format'
import { CLASS_STATUS, PREFERRED_GENDER, PREFERRED_TUTOR_TYPE, labelOf } from '../../../constants/labels'
import { classCode, timeAgo } from '../../../lib/format'
import useAuthStore, { selectIsTutor } from '../../../stores/authStore'
import PageHeader from '../../../components/common/PageHeader'
import ComingSoonButton from '../../../components/common/ComingSoon'
import StatusChip from '../../../components/ui/StatusChip'
import InfoRow from '../../../components/ui/InfoRow'
import { ICONS } from '../../../components/ui/icons'
import Button from '../../../components/ui/Button'
import { QueryState, Skeleton } from '../../../components/ui/states'

function ApplyAction({ cls }) {
  const location = useLocation()
  const status = useAuthStore((s) => s.status)
  const isTutor = useAuthStore(selectIsTutor)
  const tutorStatus = useAuthStore((s) => s.user?.tutorStatus)

  if (cls.status !== 'OPEN') {
    // Lớp đang chọn gia sư (SHORTLISTED) → không cho ứng tuyển, nói rõ lý do thay vì để bấm rồi báo lỗi 409
    return <p className="text-sm text-gray-600 bg-gray-50 rounded-xl px-4 py-3">Lớp đang trong giai đoạn chọn gia sư nên tạm ngừng nhận ứng tuyển.</p>
  }
  if (status !== 'authenticated') {
    return <Button as={Link} to={`/login?from=${encodeURIComponent(location.pathname)}`} className="w-full">Đăng nhập để ứng tuyển</Button>
  }
  if (!isTutor) {
    return (
      <div className="space-y-3">
        <Button disabled className="w-full">Ứng tuyển ngay</Button>
        <p className="text-sm text-gray-600">
          {tutorStatus === 'PENDING'
            ? 'Hồ sơ gia sư của bạn đang chờ xác minh.'
            : <>Chỉ gia sư đã xác minh mới ứng tuyển được. <Link to="/me/tutor-profile" className="text-primary font-semibold underline">Trở thành gia sư →</Link></>}
        </p>
      </div>
    )
  }
  return (
    <ComingSoonButton
      label="Ứng tuyển ngay"
      className="w-full"
      description="Ứng tuyển, danh sách đề xuất (shortlist) và giữ xèng thuộc giai đoạn R1b–R1c. Giao diện và quy tắc đã được thiết kế trong tài liệu kiến trúc."
    />
  )
}

export default function ClassDetailPage() {
  const { id } = useParams()
  const query = useClass(id)
  const code = classCode(id)

  return (
    <>
      <PageHeader title={`Lớp ${code}`} crumbs={[{ label: 'Học sinh cần Gia sư', to: '/students' }, { label: code }]} />
      <section className="py-10 bg-gray-50">
        <div className="max-w-site mx-auto px-4 sm:px-6 lg:px-12">
          <QueryState query={query} loading={<div className="grid lg:grid-cols-3 gap-6"><Skeleton className="h-96 lg:col-span-2 rounded-2xl" /><Skeleton className="h-72 rounded-2xl" /></div>}>
            {(c) => (
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
                <article className="lg:col-span-2 bg-white rounded-2xl border border-gray-100 shadow-sm p-6 lg:p-8">
                  <div className="flex flex-wrap items-start justify-between gap-3 mb-2">
                    <h2 className="text-xl font-extrabold text-gray-900">{studentLine(c)}</h2>
                    <StatusChip map={CLASS_STATUS} status={c.status} />
                  </div>
                  <p className="text-sm text-gray-500 mb-6">
                    Đăng {timeAgo(c.publishedAt)} · {c.applicantCount} gia sư đã ứng tuyển
                  </p>

                  <h3 className="font-bold text-gray-900 mb-3">Thông tin lớp</h3>
                  <div className="grid sm:grid-cols-2 gap-3 mb-6">
                    <InfoRow icon={ICONS.subject} label="Môn cần học" value={subjectsText(c)} />
                    <InfoRow icon={ICONS.mode} label="Hình thức" value={studyModeText(c)} />
                    <InfoRow icon={ICONS.calendar} label="Lịch học" value={scheduleText(c)} />
                    <InfoRow icon={ICONS.area} label="Khu vực" value={classAreaText(c)} />
                  </div>
                  {c.scheduleNote && (
                    <div className="mb-6">
                      <InfoRow icon={ICONS.exp} label="Thời gian mong muốn" value={c.scheduleNote} />
                    </div>
                  )}

                  <h3 className="font-bold text-gray-900 mb-3">Yêu cầu gia sư</h3>
                  <div className="grid sm:grid-cols-2 gap-3 mb-4">
                    <InfoRow icon={ICONS.requirement} label="Giới tính" value={labelOf(PREFERRED_GENDER, c.preferredTutorGender)} />
                    <InfoRow icon={ICONS.grade} label="Đối tượng" value={labelOf(PREFERRED_TUTOR_TYPE, c.preferredTutorType)} />
                  </div>
                  <p className="text-sm text-gray-600 bg-gray-50 rounded-xl px-4 py-3">{requirementText(c)}</p>

                  <p className="text-xs text-gray-400 mt-6">
                    🔒 Họ tên đầy đủ, số điện thoại và địa chỉ chi tiết chỉ hiện với gia sư đã giữ phí nhận lớp.
                  </p>
                </article>

                <FeeBox cls={c}>
                  <ApplyAction cls={c} />
                </FeeBox>
              </div>
            )}
          </QueryState>
        </div>
      </section>
    </>
  )
}
