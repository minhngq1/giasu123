// Định dạng riêng cho gia sư.
import { formatVnd } from '../../lib/format'

// ⚠️ Câu hỏi mở #9 (giá theo giờ hay theo buổi) chưa chốt → giữ "/ giờ" như UI cũ.
// Khi chốt "theo buổi": chỉ đổi hằng số này.
export const TUTOR_FEE_UNIT = 'giờ'

export const tutorFee = (fee) => `${formatVnd(fee)}/ ${TUTOR_FEE_UNIT}`

export function teachModeText({ teachesOnline, teachesOffline }) {
  if (teachesOnline && teachesOffline) return 'Tại nhà & Online'
  if (teachesOnline) return 'Dạy online'
  return 'Dạy kèm tại nhà'
}

export const tutorAreaText = (t) => [t.areaNames?.[0], t.provinceName].filter(Boolean).join(', ')
export const gradeRangeText = (t) => (t.minGrade && t.maxGrade ? `Lớp ${t.minGrade} – ${t.maxGrade}` : '—')
