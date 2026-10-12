// Lớp gọi API cho xác thực. Component chỉ dùng các hook ở đây, không gọi axios/mock trực tiếp.
// Muốn chạy với backend thật: đặt VITE_USE_MOCK=false → các hàm tự chuyển sang gọi HTTP.
import { useMutation } from '@tanstack/react-query'
import api, { refreshSession } from '../../services/api'
import useAuthStore from '../../stores/authStore'
import { USE_MOCK } from '../../lib/mockKit'
import { mockAuth, DEMO_ACCOUNTS, DEMO_PASSWORD } from './mock'

// ── Hàm thuần: 1 hàm = 1 endpoint trong 07-api.md ──────────────────────────
export const authApi = {
  login: (body) => (USE_MOCK ? mockAuth.login(body) : api.post('/auth/login', body).then((r) => r.data)),
  logout: () => (USE_MOCK ? mockAuth.logout() : api.post('/auth/logout').then(() => undefined)),
  me: () => (USE_MOCK ? mockAuth.me() : api.get('/auth/me').then((r) => r.data)),
  register: (body) => (USE_MOCK ? mockAuth.register(body) : api.post('/auth/register', body).then((r) => r.data)),
  verifyEmail: (token) => (USE_MOCK ? mockAuth.verifyEmail({ token }) : api.post('/auth/verify-email', { token }).then((r) => r.data)),
  resendVerification: () =>
    USE_MOCK ? mockAuth.resendVerification() : api.post('/auth/verify-email/resend').then((r) => r.data),
  refresh: async () => {
    if (USE_MOCK) return (await mockAuth.refresh()).accessToken
    return refreshSession()
  },
}

// ── Luồng phiên đăng nhập ───────────────────────────────────────────────────

/** Gọi 1 lần khi mở app: thử lấy access token từ cookie refresh → lấy thông tin user. */
export async function bootstrapAuth() {
  const store = useAuthStore.getState()
  try {
    const accessToken = await authApi.refresh()
    store.setAccessToken(accessToken)
    const user = await authApi.me()
    store.setSession({ user, accessToken })
  } catch {
    store.clear() // không có phiên → là khách, không phải lỗi
  }
}

/** Tải lại thông tin user (vd sau khi gửi xác minh gia sư, số dư xèng đổi). */
export async function reloadMe() {
  const user = await authApi.me()
  useAuthStore.getState().setUser(user)
  return user
}

// ── Hook cho component ──────────────────────────────────────────────────────

export function useLogin() {
  return useMutation({
    mutationFn: async (credentials) => {
      const { accessToken, otpRequired } = await authApi.login(credentials)
      if (otpRequired) {
        // Tài khoản admin phải đăng nhập ở app admin (có bước OTP).
        throw new Error('Tài khoản quản trị vui lòng đăng nhập tại trang quản trị.')
      }
      useAuthStore.getState().setAccessToken(accessToken)
      const user = await authApi.me()
      useAuthStore.getState().setSession({ user, accessToken })
      return user
    },
  })
}

export function useLogout() {
  return useMutation({
    mutationFn: async () => {
      try {
        await authApi.logout()
      } finally {
        // Dù server lỗi vẫn xóa phiên phía trình duyệt.
        useAuthStore.getState().clear()
      }
    },
  })
}

export const useRegister = () => useMutation({ mutationFn: authApi.register })
export const useVerifyEmail = () => useMutation({ mutationFn: authApi.verifyEmail })
export const useResendVerification = () => useMutation({ mutationFn: authApi.resendVerification })

/** Chỉ ở chế độ mock: link xác thực giả để bấm thử thay cho email thật. */
export const mockVerifyLink = () => (USE_MOCK ? mockAuth.lastVerifyToken() : null)

/** Chỉ ở chế độ mock: danh sách tài khoản demo để hiện gợi ý trên trang đăng nhập. */
export const DEMO_LOGIN = USE_MOCK ? { accounts: DEMO_ACCOUNTS, password: DEMO_PASSWORD } : null
