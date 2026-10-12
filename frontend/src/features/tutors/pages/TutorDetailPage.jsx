// /tutors/:id — Hồ sơ công khai của gia sư (chỉ gia sư VERIFIED; không có SĐT/email).
import { Link, useParams, useLocation } from 'react-router-dom'
import { useTutor } from '../api'
import { Stars } from '../components/TutorCard'
import { teachModeText, tutorAreaText, tutorFee, gradeRangeText } from '../format'
import { TUTOR_TYPE, GENDER, labelOf } from '../../../constants/labels'
import { formatDate } from '../../../lib/format'
import useAuthStore from '../../../stores/authStore'
import PageHeader from '../../../components/common/PageHeader'
import ComingSoonButton from '../../../components/common/ComingSoon'
import Avatar, { VerifiedBadge } from '../../../components/ui/Avatar'
import InfoRow from '../../../components/ui/InfoRow'
import { ICONS } from '../../../components/ui/icons'
import Button from '../../../components/ui/Button'
import { QueryState, Skeleton } from '../../../components/ui/states'

function DetailSkeleton() {
  return (
    <div className="grid lg:grid-cols-3 gap-6" role="status" aria-label="Đang tải">
      <Skeleton className="h-80 lg:col-span-2 rounded-2xl" />
      <Skeleton className="h-56 rounded-2xl" />
    </div>
  )
}

export default function TutorDetailPage() {
  const { id } = useParams()
  const location = useLocation()
  const query = useTutor(id)
  const loggedIn = useAuthStore((s) => s.status === 'authenticated')

  return (
    <>
      <PageHeader title={query.data?.fullName ?? 'Hồ sơ gia sư'} crumbs={[{ label: 'Danh sách Gia sư', to: '/tutors' }, { label: query.data?.fullName ?? '…' }]} />
      <section className="py-10 bg-gray-50">
        <div className="max-w-site mx-auto px-4 sm:px-6 lg:px-12">
          <QueryState query={query} loading={<DetailSkeleton />}>
            {(t) => (
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
                <article className="lg:col-span-2 bg-white rounded-2xl border border-gray-100 shadow-sm p-6 lg:p-8">
                  <div className="flex items-center gap-4 mb-6">
                    <Avatar src={t.avatarUrl} name={t.fullName} size="w-16 h-16 text-lg" />
                    <div>
                      <div className="flex items-center gap-2">
                        <h2 className="text-xl font-extrabold text-gray-900">{t.fullName}</h2>
                        {t.verified && <VerifiedBadge />}
                      </div>
                      <p className="text-sm text-gray-500 mb-1">
                        {labelOf(TUTOR_TYPE, t.tutorType)} · {t.schoolOrWorkplace}
                      </p>
                      <Stars rating={t.rating} />
                    </div>
                  </div>

                  <div className="grid sm:grid-cols-2 gap-3 mb-6">
                    <InfoRow icon={ICONS.subject} label="Môn dạy" value={t.subjects.map((s) => s.name).join(', ')} />
                    <InfoRow icon={ICONS.grade} label="Dạy lớp" value={gradeRangeText(t)} />
                    <InfoRow icon={ICONS.mode} label="Hình thức" value={teachModeText(t)} />
                    <InfoRow icon={ICONS.area} label="Khu vực" value={tutorAreaText(t)} />
                    <InfoRow icon={ICONS.exp} label="Kinh nghiệm" value={`${t.experienceYears} năm`} />
                    <InfoRow icon={ICONS.requirement} label="Giới tính" value={labelOf(GENDER, t.gender)} />
                  </div>

                  <h3 className="font-bold text-gray-900 mb-2">Giới thiệu</h3>
                  <p className="text-sm text-gray-600 leading-relaxed whitespace-pre-line">{t.bio}</p>

                  <p className="text-xs text-gray-400 mt-6">Đã xác minh ngày {formatDate(t.verifiedAt)}</p>
                </article>

                <aside className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 lg:sticky lg:top-36">
                  <p className="text-sm text-gray-500">Học phí mong muốn</p>
                  <p className="text-2xl font-extrabold text-primary mb-5">{tutorFee(t.expectedFee)}</p>
                  {loggedIn ? (
                    <ComingSoonButton
                      label="Mời dạy lớp của tôi"
                      className="w-full"
                      description="Tính năng mời gia sư vào lớp của bạn thuộc giai đoạn R1b (Kết nối). Trong lúc chờ, bạn có thể đăng lớp — gia sư phù hợp sẽ ứng tuyển và trung tâm gửi danh sách đề xuất cho bạn."
                    />
                  ) : (
                    <Button as={Link} to={`/login?from=${encodeURIComponent(location.pathname)}`} className="w-full">
                      Đăng nhập để mời dạy
                    </Button>
                  )}
                  <Button as={Link} to="/me/classes/new" variant="secondary" className="w-full mt-3">
                    Đăng lớp miễn phí
                  </Button>
                  <p className="text-xs text-gray-500 mt-4">
                    Thông tin liên hệ của gia sư chỉ được mở khi hai bên đã kết nối qua nền tảng.
                  </p>
                </aside>
              </div>
            )}
          </QueryState>
        </div>
      </section>
    </>
  )
}
