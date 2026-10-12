import { describe, it, expect } from 'vitest'
import { requirementText, studentLine, classFee } from './format'

describe('requirementText', () => {
  it('giới tính + đối tượng + yêu cầu tự do', () => {
    expect(requirementText({ preferredTutorGender: 'FEMALE', preferredTutorType: 'SINH_VIEN', requirements: 'Kiên nhẫn' }))
      .toBe('Gia sư nữ, là sinh viên · Kiên nhẫn')
  })
  it('chỉ có đối tượng → câu vẫn có chủ ngữ', () => {
    expect(requirementText({ preferredTutorGender: 'ANY', preferredTutorType: 'GIAO_VIEN', requirements: '' })).toBe('Gia sư là giáo viên')
  })
  it('không yêu cầu gì', () => {
    expect(requirementText({ preferredTutorGender: 'ANY', preferredTutorType: 'ANY', requirements: '' })).toBe('Không yêu cầu')
  })
})

describe('studentLine / classFee', () => {
  it('"Bạn An (nam) · Lớp 12"', () => expect(studentLine({ studentDisplayName: 'Bạn An', studentGender: 'MALE', grade: 12 })).toBe('Bạn An (nam) · Lớp 12'))
  it('chưa chốt học phí', () => expect(classFee({ approvedFee: null })).toBe('Chờ chốt học phí'))
})
