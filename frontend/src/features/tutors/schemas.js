// Luật validate hồ sơ gia sư — khớp cột tutor_profiles (04-database.md).
import { z } from 'zod'
import { phoneSchema } from '../auth/schemas'
import { hasContactInfo, CONTENT_GUARD_MESSAGE } from '../../lib/contentGuard'

const thisYear = new Date().getFullYear()

export const tutorProfileSchema = z
  .object({
    fullName: z.string().trim().min(2, 'Nhập họ và tên').max(100),
    gender: z.enum(['MALE', 'FEMALE'], { error: 'Chọn giới tính' }),
    birthYear: z.coerce.number().int().min(thisYear - 70, 'Năm sinh không hợp lệ').max(thisYear - 17, 'Gia sư cần từ 17 tuổi'),
    phone: phoneSchema,
    tutorType: z.enum(['SINH_VIEN', 'GIAO_VIEN', 'NGUOI_DI_LAM'], { error: 'Chọn loại gia sư' }),
    schoolOrWorkplace: z.string().trim().min(2, 'Nhập trường hoặc nơi làm việc').max(150),
    experienceYears: z.coerce.number().int().min(0).max(40),
    subjectIds: z.array(z.coerce.number()).min(1, 'Chọn ít nhất 1 môn'),
    minGrade: z.coerce.number().int().min(1).max(12),
    maxGrade: z.coerce.number().int().min(1).max(12),
    teachesOnline: z.boolean(),
    teachesOffline: z.boolean(),
    provinceName: z.string().min(1, 'Chọn tỉnh/thành phố'),
    districtName: z.string().trim(),
    expectedFee: z.coerce.number({ error: 'Nhập học phí' }).int().min(50000, 'Tối thiểu 50.000đ').max(2000000, 'Tối đa 2.000.000đ'),
    bio: z.string().trim().min(30, 'Giới thiệu tối thiểu 30 ký tự').max(1000).refine((v) => !hasContactInfo(v), CONTENT_GUARD_MESSAGE),
    acceptedTutorRules: z.literal(true, { error: 'Bạn cần đồng ý Nội quy nhận lớp' }),
  })
  .superRefine((d, ctx) => {
    if (d.minGrade > d.maxGrade) ctx.addIssue({ code: 'custom', path: ['maxGrade'], message: 'Lớp cao nhất phải ≥ lớp thấp nhất' })
    if (!d.teachesOnline && !d.teachesOffline) ctx.addIssue({ code: 'custom', path: ['teachesOffline'], message: 'Chọn ít nhất 1 hình thức dạy' })
  })
  .transform(({ districtName, ...d }) => ({ ...d, areaNames: districtName ? [districtName] : [] }))

/** TutorProfileDto → giá trị form */
export function toProfileForm(p) {
  return {
    fullName: p.fullName ?? '', gender: p.gender ?? '', birthYear: p.birthYear ?? '', phone: p.phone ?? '',
    tutorType: p.tutorType ?? '', schoolOrWorkplace: p.schoolOrWorkplace ?? '', experienceYears: p.experienceYears ?? 0,
    subjectIds: (p.subjectIds ?? []).map(String), minGrade: String(p.minGrade ?? 1), maxGrade: String(p.maxGrade ?? 12),
    teachesOnline: !!p.teachesOnline, teachesOffline: p.teachesOffline ?? true, provinceName: p.provinceName ?? '',
    districtName: p.areaNames?.[0] ?? '', expectedFee: p.expectedFee ?? '', bio: p.bio ?? '', acceptedTutorRules: !!p.acceptedTutorRules,
  }
}
