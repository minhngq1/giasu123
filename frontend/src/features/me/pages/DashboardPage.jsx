// /me — Tổng quan "Việc cần làm của tôi": gom các việc cần chú ý lên đầu.
import { Link } from 'react-router-dom'
import useAuthStore from '../../../stores/authStore'
import { useMyClasses } from '../../classes/api'
import { useResendVerification } from '../../auth/api'
import { CLASS_STATUS, VERIFICATION_STATUS, labelOf } from '../../../constants/labels'
import { classCode, formatXeng, givenName } from '../../../lib/format'
import { messageOf } from '../../../lib/problem'
import MeShell from '../../../components/common/MeShell'
import StatusChip from '../../../components/ui/StatusChip'
import Button from '../../../components/ui/Button'
import Notice from '../../../components/ui/Notice'
import { QueryState, Skeleton } from '../../../components/ui/states'

function Card({ title, children, action }) {
  return (
    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
      <div className="flex items-center justify-between gap-3 mb-4">
        <h2 className="font-bold text-gray-900">{title}</h2>
        {action}
      </div>
      {children}
    </div>
  )
}

/** Việc cần làm suy ra từ dữ liệu — mỗi việc có 1 nút đi thẳng tới chỗ xử lý. */
function todosOf(user, classes) {
  const todos = []
  if (!user.emailVerified) todos.push({ key: 'verify', text: 'Xác thực email để đăng lớp', tone: 'warning' })
  classes.filter((c) => c.status === 'REJECTED').forEach((c) =>
    todos.push({ key: `rej-${c.id}`, text: `Lớp ${classCode(c.id)} chưa được duyệt — sửa và gửi lại`, to: `/me/classes/${c.id}`, tone: 'error' }))
  if (user.tutorStatus === 'DRAFT' || user.tutorStatus === 'REJECTED')
    todos.push({ key: 'tutor', text: 'Gửi xác minh hồ sơ gia sư', to: '/me/tutor-profile', tone: 'warning' })
  return todos
}

export default function DashboardPage() {
  const user = useAuthStore((s) => s.user)
  const classes = useMyClasses({ size: 50 })
  const resend = useResendVerification()

  return (
    <MeShell title={`Xin chào, ${givenName(user.fullName)} 👋`} subtitle="Theo dõi lớp, hồ sơ và những việc cần làm.">
      <div className="space-y-6">
        <QueryState query={classes} loading={<Skeleton className="h-24 rounded-2xl" />}>
          {(data) => {
            const todos = todosOf(user, data.items)
            return (
              <Card title="Việc cần làm">
                {todos.length === 0 ? (
                  <p className="text-sm text-gray-500">Không có việc nào cần xử lý. 🎉</p>
                ) : (
                  <ul className="space-y-3">
                    {todos.map((t) => (
                      <li key={t.key}>
                        <Notice tone={t.tone}>
                          {t.text}{' '}
                          {t.to && <Link to={t.to} className="underline font-semibold">Xử lý →</Link>}
                          {t.key === 'verify' && (
                            <button type="button" className="underline font-semibold" onClick={() => resend.mutate()}>
                              {resend.isPending ? 'Đang gửi…' : 'Gửi lại email'}
                            </button>
                          )}
                        </Notice>
                      </li>
                    ))}
                  </ul>
                )}
                {resend.isSuccess && <Notice tone="success" className="mt-3">{resend.data.message}</Notice>}
                {resend.isError && <Notice tone="error" className="mt-3">{messageOf(resend.error)}</Notice>}
              </Card>
            )
          }}
        </QueryState>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Card title="Lớp của tôi" action={<Link to="/me/classes" className="text-sm text-primary font-semibold hover:underline">Xem tất cả</Link>}>
            <QueryState query={classes} loading={<Skeleton className="h-20" />}
              isEmpty={(d) => d.items.length === 0}
              empty={<div><p className="text-sm text-gray-500 mb-4">Bạn chưa đăng lớp nào.</p><Button as={Link} to="/me/classes/new" size="sm">Đăng lớp</Button></div>}>
              {(data) => (
                <ul className="divide-y divide-gray-50">
                  {data.items.slice(0, 4).map((c) => (
                    <li key={c.id} className="py-2.5 flex items-center justify-between gap-3">
                      <Link to={`/me/classes/${c.id}`} className="text-sm font-medium text-gray-800 hover:text-primary truncate">
                        {classCode(c.id)} · {c.studentDisplayName} · Lớp {c.grade}
                      </Link>
                      <StatusChip map={CLASS_STATUS} status={c.status} />
                    </li>
                  ))}
                </ul>
              )}
            </QueryState>
          </Card>

          <Card title="Hồ sơ gia sư">
            {user.tutorStatus ? (
              <>
                <div className="flex items-center gap-3 mb-3">
                  <StatusChip map={VERIFICATION_STATUS} status={user.tutorStatus} />
                  {user.tutorStatus === 'VERIFIED' && <span className="text-sm font-semibold text-gray-800">🪙 {formatXeng(user.xengAvailable)}</span>}
                </div>
                <p className="text-sm text-gray-500 mb-4">
                  {user.tutorStatus === 'VERIFIED' ? 'Bạn đã có thể ứng tuyển các lớp đang tuyển.' : `Trạng thái: ${labelOf(VERIFICATION_STATUS, user.tutorStatus)}.`}
                </p>
                <div className="flex flex-wrap gap-3">
                  <Button as={Link} to="/me/tutor-profile" size="sm" variant="secondary">Xem hồ sơ</Button>
                  {user.tutorStatus === 'VERIFIED' && <Button as={Link} to="/students" size="sm">Tìm lớp</Button>}
                </div>
              </>
            ) : (
              <>
                <p className="text-sm text-gray-500 mb-4">Bạn có chuyên môn? Tạo hồ sơ gia sư để nhận lớp phù hợp gần bạn.</p>
                <Button as={Link} to="/me/tutor-profile" size="sm" variant="accent">Trở thành gia sư</Button>
              </>
            )}
          </Card>
        </div>
      </div>
    </MeShell>
  )
}
