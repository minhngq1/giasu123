// Luật validate form xác thực (zod). Mô phỏng luật Bean Validation ở backend để báo lỗi sớm;
// backend vẫn kiểm tra lại — lỗi từ backend được gắn vào ô qua applyServerErrors.
import { z } from 'zod'

// SĐT di động VN: 0 hoặc +84, đầu số 3/5/7/8/9, tổng 10 số.
export const PHONE_RE = /^(0|\+84)(3|5|7|8|9)\d{8}$/
export const phoneSchema = z.string().trim().regex(PHONE_RE, 'Số điện thoại không hợp lệ (vd 0912345678)')
export const emailSchema = z.string().trim().min(1, 'Vui lòng nhập email').pipe(z.email('Email không hợp lệ'))

export const loginSchema = z.object({
  email: emailSchema,
  password: z.string().min(1, 'Vui lòng nhập mật khẩu'),
})

export const registerSchema = z
  .object({
    fullName: z.string().trim().min(2, 'Vui lòng nhập họ và tên').max(100, 'Tối đa 100 ký tự'),
    phone: phoneSchema,
    email: emailSchema,
    password: z
      .string()
      .min(8, 'Mật khẩu tối thiểu 8 ký tự')
      .regex(/[A-Za-z]/, 'Mật khẩu cần ít nhất 1 chữ cái')
      .regex(/\d/, 'Mật khẩu cần ít nhất 1 chữ số'),
    confirmPassword: z.string().min(1, 'Vui lòng nhập lại mật khẩu'),
    // 2 ô đồng ý RIÊNG, không tick sẵn (Nghị định 13/2023)
    acceptTerms: z.literal(true, { error: 'Bạn cần đồng ý Điều khoản dịch vụ' }),
    acceptPrivacy: z.literal(true, { error: 'Bạn cần đồng ý Chính sách xử lý dữ liệu cá nhân' }),
  })
  .refine((d) => d.password === d.confirmPassword, { path: ['confirmPassword'], message: 'Mật khẩu nhập lại không khớp' })
