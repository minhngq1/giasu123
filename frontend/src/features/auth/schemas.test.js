import { describe, it, expect } from 'vitest'
import { registerSchema, loginSchema } from './schemas'

const valid = {
  fullName: 'Trần Thu Hà', phone: '0912345678', email: 'ha@example.com',
  password: 'abc12345', confirmPassword: 'abc12345', acceptTerms: true, acceptPrivacy: true,
}
const errorsOf = (data) => Object.fromEntries(registerSchema.safeParse(data).error?.issues.map((i) => [i.path[0], i.message]) ?? [])

describe('registerSchema', () => {
  it('dữ liệu hợp lệ', () => expect(registerSchema.safeParse(valid).success).toBe(true))
  it('chưa tick 2 ô đồng ý → báo lỗi riêng từng ô', () => {
    const e = errorsOf({ ...valid, acceptTerms: false, acceptPrivacy: false })
    expect(e.acceptTerms).toMatch(/Điều khoản/)
    expect(e.acceptPrivacy).toMatch(/Chính sách/)
  })
  it('mật khẩu nhập lại không khớp → lỗi gắn vào ô nhập lại', () => {
    expect(errorsOf({ ...valid, confirmPassword: 'khac1234' }).confirmPassword).toMatch(/không khớp/)
  })
  it('mật khẩu yếu', () => expect(errorsOf({ ...valid, password: 'abcdefgh', confirmPassword: 'abcdefgh' }).password).toMatch(/chữ số/))
  it.each(['0123456789', '091234567', 'abc'])('SĐT sai: %s', (phone) => expect(errorsOf({ ...valid, phone }).phone).toBeTruthy())
  it('SĐT +84 hợp lệ', () => expect(registerSchema.safeParse({ ...valid, phone: '+84912345678' }).success).toBe(true))
})

describe('loginSchema', () => {
  it('email sai định dạng', () => expect(loginSchema.safeParse({ email: 'abc', password: 'x' }).success).toBe(false))
})
