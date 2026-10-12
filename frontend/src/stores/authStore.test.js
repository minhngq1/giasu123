import { describe, it, expect, beforeEach } from 'vitest'
import useAuthStore from './authStore'
import { mockAuth, DEMO_PASSWORD } from '../features/auth/mock'
import { bootstrapAuth } from '../features/auth/api'

describe('authStore — token chỉ nằm trong bộ nhớ', () => {
  beforeEach(() => {
    localStorage.clear()
    useAuthStore.getState().clear()
  })

  it('đăng nhập xong không ghi gì vào localStorage', async () => {
    const { accessToken } = await mockAuth.login({ email: 'giasu@demo.vn', password: DEMO_PASSWORD })
    useAuthStore.getState().setSession({ user: { id: 2 }, accessToken })
    expect(useAuthStore.getState().status).toBe('authenticated')
    expect(localStorage.length).toBe(0)
  })

  it('mở app khi không có phiên → trạng thái khách', async () => {
    sessionStorage.clear()
    await bootstrapAuth()
    expect(useAuthStore.getState().status).toBe('anonymous')
  })

  it('mở app khi còn "cookie refresh" → khôi phục được user', async () => {
    await mockAuth.login({ email: 'giasu@demo.vn', password: DEMO_PASSWORD })
    await bootstrapAuth()
    const { status, user } = useAuthStore.getState()
    expect(status).toBe('authenticated')
    expect(user.email).toBe('giasu@demo.vn')
    expect(user).not.toHaveProperty('password')
  })

  it('sai mật khẩu → cùng 1 thông báo chung', async () => {
    const err = await mockAuth.login({ email: 'giasu@demo.vn', password: 'sai' }).catch((e) => e)
    expect(err.status).toBe(401)
    expect(err.detail).toBe('Email hoặc mật khẩu không đúng.')
  })
})
