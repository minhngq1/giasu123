import { describe, it, expect } from 'vitest'
import { classSchema, EMPTY_CLASS } from './schemas'

const valid = {
  ...EMPTY_CLASS, studentName: 'Nguyễn Văn An', studentGender: 'MALE', contactPhone: '0912345678', grade: '12',
  subjectIds: ['1', '2'], studyMode: 'OFFLINE', feeMode: 'FIXED', proposedFee: '200000', sessionsPerWeek: '3',
  minutesPerSession: '90', provinceName: 'Hà Nội', districtName: 'Cầu Giấy', addressDetail: '12 Trần Thái Tông',
}
const errorsOf = (d) => Object.fromEntries(classSchema.safeParse(d).error?.issues.map((i) => [i.path[0], i.message]) ?? [])

describe('classSchema', () => {
  it('hợp lệ → đổi chuỗi từ form sang số', () => {
    const r = classSchema.parse(valid)
    expect(r.grade).toBe(12)
    expect(r.subjectIds).toEqual([1, 2])
    expect(r.proposedFee).toBe(200000)
  })
  it('chưa chọn môn', () => expect(errorsOf({ ...valid, subjectIds: [] }).subjectIds).toBeTruthy())
  it('"Thỏa thuận" → không bắt nhập học phí và gửi null', () => {
    expect(classSchema.parse({ ...valid, feeMode: 'CONSULT', proposedFee: '' }).proposedFee).toBeNull()
  })
  it('học phí cụ thể quá thấp', () => expect(errorsOf({ ...valid, proposedFee: '1000' }).proposedFee).toBeTruthy())
  it('học tại nhà mà thiếu địa chỉ', () => expect(errorsOf({ ...valid, addressDetail: '' }).addressDetail).toBeTruthy())
  it('học online thì không cần địa chỉ', () => expect(classSchema.safeParse({ ...valid, studyMode: 'ONLINE', addressDetail: '' }).success).toBe(true))
  it('ContentGuard: chặn SĐT trong yêu cầu riêng', () => {
    expect(errorsOf({ ...valid, requirements: 'gọi em 0912 345 678' }).requirements).toMatch(/số điện thoại/)
  })
})
