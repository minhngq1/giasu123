// Khối "Kết nối với Gia Sư 123": liên hệ + ô đăng ký nhận tin (dùng ở Home và trang Đăng ký).
import { useState } from 'react'
import { CONTACT } from '../../constants/site'

// Kiểm tra email đơn giản bằng regex (không dùng zod) → trang chủ không phải tải thêm ~24 KB thư viện chỉ cho 1 ô
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

export default function ConnectSection() {
  const [email, setEmail] = useState('')
  const [state, setState] = useState({ status: 'idle', message: '' })

  const onSubmit = (e) => {
    e.preventDefault()
    if (!EMAIL_RE.test(email.trim())) {
      setState({ status: 'error', message: 'Email không hợp lệ' })
      return
    }
    // R1 chưa có API nhận tin qua email → chỉ báo trung thực là tính năng sắp có.
    setState({ status: 'success', message: 'Cảm ơn bạn! Tính năng nhận tin lớp mới qua email sẽ sớm ra mắt.' })
    setEmail('')
  }

  return (
    <section className="py-16 bg-white">
      <div className="max-w-[760px] mx-auto px-4 sm:px-6 text-center">
        <h2 className="text-3xl font-extrabold text-gray-900 mb-3">Kết nối với Gia Sư 123</h2>
        <p className="text-gray-500 text-sm mb-8">
          Để lại Email hoặc liên hệ trực tiếp với chúng tôi để được tư vấn và cập nhật các lớp học mới nhất
        </p>

        {/* Liên hệ: điện thoại | email */}
        <div className="flex justify-center items-center gap-6 flex-wrap mb-8">
          <a href={CONTACT.phoneHref} className="flex items-center gap-2 text-gray-700 hover:opacity-80 transition-opacity">
            <img src="/images/phone.png" alt="" className="w-5 h-5 object-contain" />
            <span className="text-sm font-medium">{CONTACT.phoneDisplay}</span>
          </a>
          <span className="w-px h-5 bg-gray-300" />
          <a href={`mailto:${CONTACT.email}`} className="flex items-center gap-2 text-gray-700 hover:opacity-80 transition-opacity">
            <img src="/images/email-icon.png" alt="" className="w-5 h-5 object-contain" />
            <span className="text-sm font-medium">{CONTACT.email}</span>
          </a>
        </div>

        {/* Ô đăng ký email dạng pill */}
        <form onSubmit={onSubmit} noValidate className="flex items-center bg-gray-50 border border-gray-200 rounded-full p-1.5 max-w-[520px] mx-auto">
          <label htmlFor="connect-email" className="sr-only">Email nhận tin</label>
          <input
            id="connect-email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Nhập email của bạn..."
            aria-invalid={state.status === 'error' || undefined}
            aria-describedby="connect-email-msg"
            className="flex-1 min-w-0 px-4 py-2 text-sm text-gray-600 bg-transparent focus:outline-none"
          />
          <button type="submit" className="h-11 px-7 bg-primary text-white font-semibold rounded-full hover:opacity-90 transition-opacity text-sm whitespace-nowrap">
            Đăng ký
          </button>
        </form>
        <p id="connect-email-msg" role="status" className={`text-sm mt-3 min-h-5 ${state.status === 'error' ? 'text-red-600' : 'text-primary'}`}>
          {state.message}
        </p>
      </div>
    </section>
  )
}
