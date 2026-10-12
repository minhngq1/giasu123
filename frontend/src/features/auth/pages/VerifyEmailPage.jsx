// /verify-email?token=...&next=... — trang mở từ link trong email xác thực.
import { useEffect, useRef } from 'react'
import { Link, useSearchParams } from 'react-router-dom'
import { useVerifyEmail, useResendVerification, reloadMe } from '../api'
import { messageOf } from '../../../lib/problem'
import { safeRedirect } from '../../../lib/safeRedirect'
import useAuthStore from '../../../stores/authStore'
import Button from '../../../components/ui/Button'
import Notice from '../../../components/ui/Notice'

export default function VerifyEmailPage() {
  const [params] = useSearchParams()
  const token = params.get('token')
  const next = safeRedirect(params.get('next'))
  const loggedIn = useAuthStore((s) => s.status === 'authenticated')
  const verify = useVerifyEmail()
  const resend = useResendVerification()
  const started = useRef(false)

  // Gọi xác thực đúng 1 lần (StrictMode ở dev chạy effect 2 lần; token thật chỉ dùng được 1 lần)
  useEffect(() => {
    if (token && !started.current) {
      started.current = true
      verify.mutate(token, { onSuccess: () => loggedIn && reloadMe() })
    }
  }, [token, verify, loggedIn])

  const continueTo = loggedIn ? next : `/login?from=${encodeURIComponent(next)}`

  return (
    <div className="bg-gray-50 py-16 px-4">
      <div className="max-w-[520px] mx-auto bg-white rounded-2xl border border-gray-100 shadow-sm p-8 text-center" aria-live="polite">
        {!token && (
          <>
            <p className="text-4xl mb-4" aria-hidden="true">✉️</p>
            <h1 className="text-2xl font-extrabold text-gray-900 mb-2">Thiếu liên kết xác thực</h1>
            <p className="text-sm text-gray-500 mb-6">Vui lòng mở đúng liên kết trong email chúng tôi đã gửi.</p>
          </>
        )}

        {token && (verify.isPending || verify.isIdle) && (
          <>
            <span className="inline-block w-10 h-10 border-4 border-primary border-t-transparent rounded-full animate-spin mb-4" aria-hidden="true" />
            <h1 className="text-xl font-bold text-gray-900">Đang xác thực email…</h1>
          </>
        )}

        {verify.isSuccess && (
          <>
            <p className="text-4xl mb-4" aria-hidden="true">✅</p>
            <h1 className="text-2xl font-extrabold text-gray-900 mb-2">Xác thực email thành công</h1>
            <p className="text-sm text-gray-500 mb-6">Tài khoản <strong>{verify.data.email}</strong> đã sẵn sàng.</p>
            <Button as={Link} to={continueTo} size="lg">{loggedIn ? 'Tiếp tục' : 'Đăng nhập để tiếp tục'}</Button>
          </>
        )}

        {verify.isError && (
          <>
            <p className="text-4xl mb-4" aria-hidden="true">⚠️</p>
            <h1 className="text-2xl font-extrabold text-gray-900 mb-2">Không xác thực được</h1>
            <p className="text-sm text-gray-500 mb-6">{messageOf(verify.error)}</p>
            {loggedIn ? (
              <>
                <Button onClick={() => resend.mutate()} loading={resend.isPending}>Gửi lại email xác thực</Button>
                {resend.isSuccess && <Notice tone="success" className="mt-4">{resend.data.message}</Notice>}
                {resend.isError && <Notice tone="error" className="mt-4">{messageOf(resend.error)}</Notice>}
              </>
            ) : (
              <Button as={Link} to="/login" variant="secondary">Đăng nhập để gửi lại</Button>
            )}
          </>
        )}
      </div>
    </div>
  )
}
