// "Backend giả" cho xác thực. Mô phỏng đúng hành vi trong 06-security.md / 07-api.md:
//   - đăng nhập sai luôn trả cùng 1 thông báo (chống dò email)
//   - đăng ký trả cùng 1 thông báo dù email đã tồn tại
//   - cookie refresh HttpOnly được giả lập bằng sessionStorage (CHỈ ở chế độ mock)
import useAuthStore from '../../stores/authStore'
import { persisted, respond, fail, nowIso } from '../../lib/mockKit'

const SESSION_KEY = 'giasu123.mock.session'

/** Mật khẩu chung cho tài khoản demo — chỉ tồn tại ở chế độ mock. */
export const DEMO_PASSWORD = 'Demo@123'
export const DEMO_ACCOUNTS = [
  { email: 'phuhuynh@demo.vn', role: 'Phụ huynh' },
  { email: 'giasu@demo.vn', role: 'Gia sư đã xác minh' },
]

const db = persisted('users', () => ({
  nextId: 100,
  lastVerifyToken: null,
  users: [
    {
      id: 1, email: 'phuhuynh@demo.vn', password: DEMO_PASSWORD, fullName: 'Trần Thu Hà', phone: '0912000001',
      emailVerified: true, roles: ['MEMBER'], tutorStatus: null, xengAvailable: 0, createdAt: '2026-09-01T08:00:00+07:00',
    },
    {
      id: 2, email: 'giasu@demo.vn', password: DEMO_PASSWORD, fullName: 'Nguyễn Thị Hương', phone: '0912000002',
      emailVerified: true, roles: ['MEMBER'], tutorStatus: 'VERIFIED', xengAvailable: 1160, createdAt: '2026-08-20T08:00:00+07:00',
    },
  ],
}))

/** DTO trả về cho GET /api/auth/me — không bao giờ chứa mật khẩu. */
function toMeDto(u) {
  return {
    id: u.id,
    email: u.email,
    fullName: u.fullName,
    phone: u.phone,
    emailVerified: u.emailVerified,
    roles: u.roles,
    tutorStatus: u.tutorStatus,
    xengAvailable: u.tutorStatus === 'VERIFIED' ? u.xengAvailable : null,
    unreadNotifications: u.id === 2 ? 3 : 1,
  }
}

const tokenFor = (id) => `mock-access.${id}`

/** Server giả "đọc" access token để biết ai đang gọi — giống JwtAuthFilter ở backend. */
export function currentUserId() {
  const token = useAuthStore.getState().accessToken
  const id = Number(token?.split('.')[1])
  return Number.isFinite(id) && id > 0 ? id : null
}

export function requireUser() {
  const id = currentUserId()
  const user = db.data.users.find((u) => u.id === id)
  if (!user) fail(401, 'UNAUTHENTICATED', 'Vui lòng đăng nhập để tiếp tục.')
  return user
}

export function findUser(id) {
  return db.data.users.find((u) => u.id === id)
}

/** Dùng bởi mock hồ sơ gia sư khi trạng thái xác minh đổi. */
export function setTutorStatus(userId, status) {
  const u = findUser(userId)
  if (u) {
    u.tutorStatus = status
    db.save()
  }
}

export const mockAuth = {
  login: ({ email, password }) =>
    respond(() => {
      const u = db.data.users.find((x) => x.email.toLowerCase() === email.trim().toLowerCase())
      if (!u || u.password !== password) fail(401, 'BAD_CREDENTIALS', 'Email hoặc mật khẩu không đúng.')
      sessionStorage.setItem(SESSION_KEY, String(u.id))
      return { accessToken: tokenFor(u.id) }
    }),

  refresh: () =>
    respond(() => {
      const id = Number(sessionStorage.getItem(SESSION_KEY))
      if (!findUser(id)) fail(401, 'REFRESH_INVALID', 'Phiên đăng nhập đã hết hạn.')
      return { accessToken: tokenFor(id) }
    }),

  logout: () =>
    respond(() => {
      sessionStorage.removeItem(SESSION_KEY)
    }),

  me: () => respond(() => toMeDto(requireUser())),

  register: ({ fullName, email, password, phone }) =>
    respond(() => {
      const exists = db.data.users.some((u) => u.email.toLowerCase() === email.toLowerCase())
      if (!exists) {
        const id = db.data.nextId++
        db.data.users.push({
          id, email, password, fullName, phone, emailVerified: false,
          roles: ['MEMBER'], tutorStatus: null, xengAvailable: 0, createdAt: nowIso(),
        })
        db.data.lastVerifyToken = `verify-${id}`
        db.save()
      }
      // Cùng một câu trả lời cho cả email mới và email đã tồn tại → không dò được email nào đã đăng ký.
      return { message: 'Nếu email hợp lệ, chúng tôi đã gửi hướng dẫn xác thực tới hộp thư của bạn.' }
    }),

  verifyEmail: ({ token }) =>
    respond(() => {
      // 'demo' = token của tài khoản vừa đăng ký gần nhất (tiện bấm thử khi không có email thật)
      const real = token === 'demo' ? db.data.lastVerifyToken : token
      const id = Number(real?.startsWith('verify-') ? real.slice(7) : NaN)
      const u = findUser(id)
      if (!u) fail(400, 'INVALID_TOKEN', 'Liên kết xác thực không hợp lệ hoặc đã hết hạn.')
      u.emailVerified = true
      db.save()
      return { email: u.email }
    }),

  resendVerification: () =>
    respond(() => {
      const u = requireUser()
      db.data.lastVerifyToken = `verify-${u.id}`
      db.save()
      return { message: 'Nếu email hợp lệ, chúng tôi đã gửi lại hướng dẫn xác thực.' }
    }),

  /** Chỉ cho mock: link xác thực "đã gửi qua email" để bấm thử. */
  lastVerifyToken: () => db.data.lastVerifyToken,
}
