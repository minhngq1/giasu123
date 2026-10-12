// Luật validate form Đăng lớp — khớp cột class_requests (04-database.md) và ContentGuard.
import { z } from 'zod'
import { phoneSchema } from '../auth/schemas'
import { hasContactInfo, CONTENT_GUARD_MESSAGE } from '../../lib/contentGuard'

/** Ô chữ tự do: giới hạn độ dài + không chứa SĐT/Zalo/link. */
const freeText = (max) =>
  z.string().trim().max(max, `Tối đa ${max} ký tự`).refine((v) => !hasContactInfo(v), CONTENT_GUARD_MESSAGE)

export const classSchema = z
  .object({
    studentName: z.string().trim().min(2, 'Vui lòng nhập họ tên học sinh').max(100),
    studentGender: z.enum(['MALE', 'FEMALE'], { error: 'Chọn giới tính' }),
    parentName: z.string().trim().max(100),
    contactPhone: phoneSchema,
    grade: z.coerce.number({ error: 'Chọn lớp' }).int().min(1, 'Chọn lớp').max(12),
    subjectIds: z.array(z.coerce.number()).min(1, 'Chọn ít nhất 1 môn học'),
    otherSubjectNote: freeText(100),
    studyMode: z.enum(['ONLINE', 'OFFLINE'], { error: 'Chọn hình thức học' }),
    feeMode: z.enum(['CONSULT', 'FIXED']),
    proposedFee: z.union([z.literal(''), z.coerce.number()]),
    sessionsPerWeek: z.coerce.number().int().min(1, 'Chọn số buổi').max(7),
    minutesPerSession: z.coerce.number().int().min(30, 'Chọn thời lượng'),
    provinceName: z.string().min(1, 'Chọn tỉnh/thành phố'),
    districtName: z.string().trim().min(1, 'Chọn hoặc nhập quận/huyện'),
    addressDetail: z.string().trim().max(200),
    scheduleNote: freeText(200),
    preferredTutorGender: z.enum(['ANY', 'MALE', 'FEMALE']),
    preferredTutorType: z.enum(['ANY', 'SINH_VIEN', 'GIAO_VIEN']),
    requirements: freeText(500),
  })
  // Luật phụ thuộc giữa các ô (không viết được bằng từng ô riêng lẻ):
  .superRefine((d, ctx) => {
    if (d.feeMode === 'FIXED' && (d.proposedFee === '' || d.proposedFee < 50000 || d.proposedFee > 2000000)) {
      ctx.addIssue({ code: 'custom', path: ['proposedFee'], message: 'Học phí từ 50.000đ đến 2.000.000đ/buổi' })
    }
    if (d.studyMode === 'OFFLINE' && d.addressDetail.length < 5) {
      ctx.addIssue({ code: 'custom', path: ['addressDetail'], message: 'Học tại nhà cần địa chỉ (chỉ gia sư đã nhận lớp mới thấy)' })
    }
  })
  // Chuẩn hóa trước khi gửi lên server
  .transform((d) => ({ ...d, proposedFee: d.feeMode === 'FIXED' ? d.proposedFee : null }))

export const EMPTY_CLASS = {
  studentName: '', studentGender: '', parentName: '', contactPhone: '', grade: '', subjectIds: [], otherSubjectNote: '',
  studyMode: '', feeMode: 'CONSULT', proposedFee: '', sessionsPerWeek: '', minutesPerSession: '',
  provinceName: '', districtName: '', addressDetail: '', scheduleNote: '',
  preferredTutorGender: 'ANY', preferredTutorType: 'ANY', requirements: '',
}

/** ClassOwnerDto (server) → giá trị mặc định của form (để Sửa lớp). */
export function toFormValues(c) {
  return {
    ...EMPTY_CLASS,
    ...Object.fromEntries(Object.keys(EMPTY_CLASS).map((k) => [k, c[k] ?? EMPTY_CLASS[k]])),
    subjectIds: (c.subjectIds ?? []).map(String),
    grade: String(c.grade ?? ''),
    sessionsPerWeek: String(c.sessionsPerWeek ?? ''),
    minutesPerSession: String(c.minutesPerSession ?? ''),
    proposedFee: c.proposedFee ?? '',
  }
}
