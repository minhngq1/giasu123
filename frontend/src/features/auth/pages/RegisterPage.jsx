/*
  REGISTERPAGE — /register-tutor = "Đăng ký tài khoản" (08-frontend.md mục 4.7)
  Giữ 2 tab của thiết kế cũ. Hai tab chỉ khác trang chuyển tới SAU khi xác thực email:
    - "Đăng ký tìm gia sư"  → /me/classes/new  (đăng lớp)
    - "Đăng ký làm gia sư"  → /me/tutor-profile (hồ sơ gia sư)
  Phần "Thông tin lớp học" cũ đã chuyển sang trang Đăng lớp (ClassForm).
*/
import { useState } from 'react'
import { Link, useSearchParams } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { registerSchema } from '../schemas'
import { useRegister, mockVerifyLink } from '../api'
import { REGISTER_CONSENT_IDS } from '../../legal/content'
import { applyServerErrors, messageOf } from '../../../lib/problem'
import useAuthStore from '../../../stores/authStore'
import FormField from '../../../components/ui/FormField'
import { Input, PasswordInput } from '../../../components/ui/inputs'
import Button from '../../../components/ui/Button'
import Notice from '../../../components/ui/Notice'
import StatsSection from '../../../components/common/StatsSection'
import ConnectSection from '../../../components/common/ConnectSection'

const TABS = {
  tutor: { label: 'Đăng ký làm gia sư', next: '/me/tutor-profile', hint: 'Sau khi xác thực email, bạn điền hồ sơ gia sư để được xác minh và bắt đầu nhận lớp.' },
  student: { label: 'Đăng ký tìm gia sư', next: '/me/classes/new', hint: 'Sau khi xác thực email, bạn điền thông tin lớp học. Trung tâm sẽ gọi xác nhận và chốt học phí.' },
}

const sectionTitle = 'text-xs font-bold tracking-widest text-gray-500 uppercase mb-5 mt-2'

/** Ô đồng ý (clickwrap): nhãn có link mở văn bản trong tab mới để không mất dữ liệu form. */
function ConsentBox({ registration, error, children }) {
  return (
    <div>
      <label className="flex items-start gap-2.5 cursor-pointer select-none">
        <input type="checkbox" className="w-4 h-4 mt-0.5 accent-primary flex-shrink-0" aria-invalid={error ? true : undefined} {...registration} />
        <span className="text-sm text-gray-700">{children}</span>
      </label>
      {error && <p className="text-xs text-red-600 mt-1 ml-6" role="alert">{error}</p>}
    </div>
  )
}

function CheckEmail({ email, next, onBack }) {
  const token = mockVerifyLink()
  return (
    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-8 text-center">
      <p className="text-4xl mb-4" aria-hidden="true">📧</p>
      <h1 className="text-2xl font-extrabold text-gray-900 mb-2">Kiểm tra email để xác thực</h1>
      <p className="text-sm text-gray-500 mb-6 max-w-[460px] mx-auto">
        Nếu email <strong className="text-gray-800">{email}</strong> hợp lệ, chúng tôi đã gửi một liên kết xác thực.
        Hãy mở email và bấm vào liên kết để kích hoạt tài khoản. Nhớ kiểm tra cả thư mục Spam.
      </p>
      {token && (
        <Notice tone="info" title="Chế độ demo (chưa có máy chủ email)" className="text-left mb-6">
          <Link className="underline font-semibold" to={`/verify-email?token=${token}&next=${encodeURIComponent(next)}`}>
            Bấm vào đây để mở liên kết xác thực
          </Link>{' '}
          thay cho việc mở email.
        </Notice>
      )}
      <div className="flex flex-wrap justify-center gap-3">
        <Button as={Link} to="/login" variant="primary">Đến trang đăng nhập</Button>
        <Button variant="outline" onClick={onBack}>Đăng ký email khác</Button>
      </div>
    </div>
  )
}

export default function RegisterPage() {
  const [params, setParams] = useSearchParams()
  const tab = params.get('tab') === 'tutor' ? 'tutor' : 'student'
  const loggedIn = useAuthStore((s) => s.status === 'authenticated')
  const [submittedEmail, setSubmittedEmail] = useState(null)
  const register = useRegister()

  const { register: field, handleSubmit, setError, reset, formState: { errors } } = useForm({
    resolver: zodResolver(registerSchema),
    defaultValues: { fullName: '', phone: '', email: '', password: '', confirmPassword: '', acceptTerms: false, acceptPrivacy: false },
  })

  const onSubmit = (data) =>
    register.mutate(
      {
        fullName: data.fullName,
        phone: data.phone,
        email: data.email,
        password: data.password,
        consentDocumentIds: REGISTER_CONSENT_IDS,
      },
      {
        onSuccess: () => setSubmittedEmail(data.email),
        onError: (err) => applyServerErrors(err, setError),
      },
    )

  const switchTab = (key) => setParams(key === 'student' ? {} : { tab: key }, { replace: true })

  return (
    <>
      <div className="min-h-screen bg-gray-50 py-10">
        <div className="max-w-[800px] mx-auto px-4">

          {submittedEmail ? (
            <CheckEmail
              email={submittedEmail}
              next={TABS[tab].next}
              onBack={() => {
                reset()
                setSubmittedEmail(null)
              }}
            />
          ) : (
            <>
              {/* ── Tab chuyển đổi ── */}
              <div className="flex flex-wrap items-center gap-3 mb-8" role="group" aria-label="Loại đăng ký">
                {['tutor', 'student'].map((key) => (
                  <button
                    key={key}
                    type="button"
                    onClick={() => switchTab(key)}
                    aria-pressed={tab === key}
                    className={`px-5 py-2 rounded-lg text-sm font-semibold transition-colors ${
                      tab === key ? 'bg-accent text-white' : 'bg-white border border-gray-200 text-gray-600 hover:border-gray-300'
                    }`}
                  >
                    {TABS[key].label}
                  </button>
                ))}
              </div>

              {/* ── Tiêu đề ── */}
              <h1 className="text-3xl font-extrabold text-gray-900 mb-1">{TABS[tab].label} 👋</h1>
              <p className="text-sm text-gray-500 mb-8">
                Các trường có dấu * là bắt buộc. {TABS[tab].hint}
              </p>

              {loggedIn && (
                <Notice tone="info" className="mb-6">
                  Bạn đang đăng nhập. <Link to="/me" className="underline font-semibold">Về trang tổng quan</Link>
                </Notice>
              )}

              {register.isError && !Object.keys(register.error?.errors ?? {}).length && (
                <Notice tone="error" className="mb-6">{messageOf(register.error)}</Notice>
              )}

              {/* ── Form ── */}
              <form onSubmit={handleSubmit(onSubmit)} noValidate className="space-y-8">
                <div>
                  <p className={sectionTitle}>Thông tin tài khoản</p>
                  <div className="space-y-4">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <FormField label="Họ và tên" required error={errors.fullName?.message}>
                        {(a) => <Input {...a} autoComplete="name" placeholder="Nhập họ và tên" {...field('fullName')} />}
                      </FormField>
                      <FormField label="Số điện thoại" required error={errors.phone?.message}>
                        {(a) => <Input {...a} type="tel" inputMode="tel" autoComplete="tel" placeholder="Vd: 0912345678" {...field('phone')} />}
                      </FormField>
                    </div>

                    <FormField label="Email" required error={errors.email?.message}>
                      {(a) => <Input {...a} type="email" autoComplete="email" placeholder="Nhập Email" {...field('email')} />}
                    </FormField>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <FormField label="Mật khẩu" required error={errors.password?.message} hint="Tối thiểu 8 ký tự, có chữ và số">
                        {(a) => <PasswordInput {...a} autoComplete="new-password" placeholder="Nhập mật khẩu" {...field('password')} />}
                      </FormField>
                      <FormField label="Nhập lại mật khẩu" required error={errors.confirmPassword?.message}>
                        {(a) => <PasswordInput {...a} autoComplete="new-password" placeholder="Nhập lại mật khẩu" {...field('confirmPassword')} />}
                      </FormField>
                    </div>
                  </div>
                </div>

                <div>
                  <p className={sectionTitle}>Điều khoản</p>
                  <div className="space-y-3">
                    <ConsentBox registration={field('acceptTerms')} error={errors.acceptTerms?.message}>
                      Tôi đã đọc và đồng ý{' '}
                      <Link to="/legal/terms" target="_blank" className="text-primary font-semibold underline">Điều khoản dịch vụ (v1)</Link>
                    </ConsentBox>
                    <ConsentBox registration={field('acceptPrivacy')} error={errors.acceptPrivacy?.message}>
                      Tôi đồng ý để Giasu123 xử lý dữ liệu cá nhân theo{' '}
                      <Link to="/legal/privacy" target="_blank" className="text-primary font-semibold underline">Chính sách xử lý dữ liệu cá nhân (v1)</Link>
                    </ConsentBox>
                  </div>
                </div>

                <div className="flex flex-col items-center gap-3 pt-2 pb-4">
                  <Button type="submit" size="lg" className="px-10" loading={register.isPending}>
                    {TABS[tab].label}
                  </Button>
                  <p className="text-sm text-gray-500">
                    Đã có tài khoản? <Link to="/login" className="text-primary font-semibold hover:underline">Đăng nhập</Link>
                  </p>
                </div>
              </form>
            </>
          )}
        </div>
      </div>

      <StatsSection />
      <ConnectSection />
    </>
  )
}
