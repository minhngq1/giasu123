// Định dạng riêng cho lớp học.
import { GENDER, STUDY_MODE, PREFERRED_GENDER, PREFERRED_TUTOR_TYPE, labelOf } from '../../constants/labels'
import { formatVnd } from '../../lib/format'

/** "Bạn An (nam) · Lớp 12" */
export const studentLine = (c) =>
  `${c.studentDisplayName}${c.studentGender ? ` (${labelOf(GENDER, c.studentGender).toLowerCase()})` : ''} · Lớp ${c.grade}`

export const subjectsText = (c) =>
  [...(c.subjects ?? []).map((s) => s.name), c.otherSubjectNote].filter(Boolean).join(', ')

export const studyModeText = (c) => labelOf(STUDY_MODE, c.studyMode)

export const classAreaText = (c) => [c.districtName, c.provinceName].filter(Boolean).join(', ')

export const scheduleText = (c) => `${c.sessionsPerWeek} buổi/tuần · ${c.minutesPerSession} phút/buổi`

/** Gộp yêu cầu có cấu trúc + yêu cầu tự do để hiện 1 dòng. */
export function requirementText(c) {
  const parts = []
  if (c.preferredTutorGender && c.preferredTutorGender !== 'ANY') parts.push(labelOf(PREFERRED_GENDER, c.preferredTutorGender))
  if (c.preferredTutorType && c.preferredTutorType !== 'ANY') {
    const type = labelOf(PREFERRED_TUTOR_TYPE, c.preferredTutorType).toLowerCase()
    // "Gia sư nữ, là sinh viên" hoặc "Gia sư là sinh viên" khi không yêu cầu giới tính
    if (parts.length) parts[0] = `${parts[0]}, là ${type}`
    else parts.push(`Gia sư là ${type}`)
  }
  if (c.requirements && c.requirements !== 'Không yêu cầu') parts.push(c.requirements)
  return parts.join(' · ') || 'Không yêu cầu'
}

/** Học phí/buổi; chưa chốt → "Chờ chốt học phí". */
export const classFee = (c) => (c.approvedFee ? `${formatVnd(c.approvedFee)}/ buổi` : 'Chờ chốt học phí')
