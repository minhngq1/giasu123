import { describe, it, expect, vi } from 'vitest'
import { toApiError, applyServerErrors, ApiError } from './problem'

const axiosError = (status, data) => ({ response: { status, data } })

describe('toApiError', () => {
  it('đọc đúng ProblemDetail + trường mở rộng', () => {
    const e = toApiError(axiosError(409, {
      type: 'https://giasu123.vn/problems/insufficient-xeng', title: 'Không đủ xèng', status: 409,
      detail: 'Bạn cần thêm 340 xèng.', code: 'INSUFFICIENT_XENG', shortfall: 340,
    }))
    expect(e).toBeInstanceOf(ApiError)
    expect(e.code).toBe('INSUFFICIENT_XENG')
    expect(e.detail).toBe('Bạn cần thêm 340 xèng.')
    expect(e.extra.shortfall).toBe(340)
  })

  it('mất mạng → status 0 + thông báo dễ hiểu', () => {
    const e = toApiError(new Error('Network Error'))
    expect(e.status).toBe(0)
    expect(e.detail).toMatch(/kết nối/)
  })

  it('body rỗng → dùng thông báo mặc định theo status', () => {
    expect(toApiError(axiosError(429, '')).detail).toMatch(/quá nhanh/)
  })
})

describe('applyServerErrors', () => {
  it('gắn lỗi theo ô vào react-hook-form, focus ô đầu tiên', () => {
    const setError = vi.fn()
    const handled = applyServerErrors(
      axiosError(400, { status: 400, errors: { email: 'Email không hợp lệ', phone: 'Sai định dạng' } }),
      setError,
    )
    expect(handled).toBe(true)
    expect(setError).toHaveBeenNthCalledWith(1, 'email', { type: 'server', message: 'Email không hợp lệ' }, { shouldFocus: true })
    expect(setError).toHaveBeenNthCalledWith(2, 'phone', { type: 'server', message: 'Sai định dạng' }, { shouldFocus: false })
  })

  it('không có errors theo ô → trả false để trang hiện thông báo chung', () => {
    expect(applyServerErrors(axiosError(500, {}), vi.fn())).toBe(false)
  })
})
