// /login — Đăng nhập. Sai thông tin luôn hiện 1 câu chung (không tiết lộ email có tồn tại hay không).
import { Link, Navigate, useNavigate, useSearchParams } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { loginSchema } from '../schemas'
import { useLogin, DEMO_LOGIN } from '../api'
import { messageOf } from '../../../lib/problem'
import { safeRedirect } from '../../../lib/safeRedirect'
import useAuthStore from '../../../stores/authStore'
import FormField from '../../../components/ui/FormField'
import { Input, PasswordInput } from '../../../components/ui/inputs'
import Button from '../../../components/ui/Button'
import Notice from '../../../components/ui/Notice'

export default function LoginPage() {
  const [params] = useSearchParams()
  const from = safeRedirect(params.get('from')) // chống open redirect
  const navigate = useNavigate()
  const status = useAuthStore((s) => s.status)
  const login = useLogin()

  const { register, handleSubmit, setValue, formState: { errors } } = useForm({
    resolver: zodResolver(loginSchema),
    defaultValues: { email: '', password: '' },
  })

  if (status === 'authenticated' && !login.isPending) return <Navigate to={from} replace />

  const onSubmit = (data) => login.mutate(data, { onSuccess: () => navigate(from, { replace: true }) })

  const fillDemo = (email) => {
    setValue('email', email)
    setValue('password', DEMO_LOGIN.password)
  }

  return (
    <div className="bg-gray-50 py-12 lg:py-16 px-4">
      <div className="max-w-[440px] mx-auto bg-white rounded-2xl border border-gray-100 shadow-sm p-6 sm:p-8">
        <h1 className="text-2xl font-extrabold text-gray-900 mb-1">Đăng nhập 👋</h1>
        <p className="text-sm text-gray-500 mb-6">Chào mừng bạn quay lại Gia Sư 123.</p>

        {login.isError && <Notice tone="error" className="mb-5">{messageOf(login.error)}</Notice>}

        <form onSubmit={handleSubmit(onSubmit)} noValidate className="space-y-4">
          <FormField label="Email" required error={errors.email?.message}>
            {(a) => <Input {...a} type="email" autoComplete="email" placeholder="Nhập Email" {...register('email')} />}
          </FormField>
          <FormField label="Mật khẩu" required error={errors.password?.message}>
            {(a) => <PasswordInput {...a} autoComplete="current-password" placeholder="Nhập mật khẩu" {...register('password')} />}
          </FormField>
          <Button type="submit" size="lg" className="w-full" loading={login.isPending}>Đăng nhập</Button>
        </form>

        <p className="text-sm text-gray-500 text-center mt-6">
          Chưa có tài khoản? <Link to="/register-tutor" className="text-primary font-semibold hover:underline">Đăng ký</Link>
        </p>

        {DEMO_LOGIN && (
          <Notice tone="info" title="Tài khoản demo (chế độ mock)" className="mt-6">
            <ul className="space-y-1 mt-1">
              {DEMO_LOGIN.accounts.map((a) => (
                <li key={a.email}>
                  <button type="button" onClick={() => fillDemo(a.email)} className="underline font-semibold">{a.email}</button> — {a.role}
                </li>
              ))}
            </ul>
            <p className="mt-1">Mật khẩu: <code>{DEMO_LOGIN.password}</code></p>
          </Notice>
        )}
      </div>
    </div>
  )
}
