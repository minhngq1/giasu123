// Trạng thái đăng nhập — CHỈ nằm trong bộ nhớ (quyết định #5 trong CLAUDE.md).
// Không ghi localStorage: nếu web bị XSS, kẻ tấn công không đọc được token còn lưu lại.
// F5 trang → store trống → app gọi /api/auth/refresh (cookie httpOnly) để lấy lại access token.
import { create } from 'zustand'

/**
 * status:
 *   'loading'       — vừa mở app, đang thử khôi phục phiên
 *   'authenticated' — đã đăng nhập
 *   'anonymous'     — khách
 */
const useAuthStore = create((set) => ({
  user: null,
  accessToken: null,
  status: 'loading',

  setSession: ({ user, accessToken }) => set({ user, accessToken, status: 'authenticated' }),
  setAccessToken: (accessToken) => set({ accessToken }),
  setUser: (user) => set({ user }),
  clear: () => set({ user: null, accessToken: null, status: 'anonymous' }),
}))

// Selector dùng chung — gọi trong component: useAuthStore(selectIsTutor)
export const selectIsTutor = (s) => s.user?.tutorStatus === 'VERIFIED'
export const selectIsLoggedIn = (s) => s.status === 'authenticated'

export default useAuthStore
