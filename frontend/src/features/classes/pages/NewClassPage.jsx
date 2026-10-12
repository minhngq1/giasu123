// /me/classes/new — Đăng lớp. Cần đã xác thực email (backend trả 403 nếu chưa; frontend báo trước).
import { Link, useNavigate } from 'react-router-dom'
import { useCreateClass } from '../api'
import ClassForm from '../components/ClassForm'
import MeShell from '../../../components/common/MeShell'
import useAuthStore from '../../../stores/authStore'
import Notice from '../../../components/ui/Notice'

export default function NewClassPage() {
  const navigate = useNavigate()
  const emailVerified = useAuthStore((s) => s.user?.emailVerified)
  const create = useCreateClass()

  const onSubmit = (data, { onError }) =>
    create.mutate(data, {
      onSuccess: (cls) => navigate(`/me/classes/${cls.id}?created=1`),
      onError,
    })

  return (
    <MeShell title="Đăng lớp tìm gia sư" subtitle="Miễn phí. Trung tâm sẽ gọi điện xác nhận và chốt học phí trước khi lớp được hiển thị." crumbs={[{ label: 'Lớp của tôi', to: '/me/classes' }, { label: 'Đăng lớp' }]}>
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 lg:p-8">
        {!emailVerified && (
          <Notice tone="warning" title="Bạn cần xác thực email trước khi đăng lớp" className="mb-6">
            Mở email chúng tôi đã gửi và bấm vào liên kết xác thực. <Link to="/me" className="underline font-semibold">Gửi lại email</Link>
          </Notice>
        )}
        <ClassForm onSubmit={onSubmit} submitLabel="Đăng lớp" isPending={create.isPending} serverError={create.error} disabled={!emailVerified} />
      </div>
    </MeShell>
  )
}
