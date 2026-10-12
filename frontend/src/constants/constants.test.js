import { describe, it, expect } from 'vitest'
import { PROVINCES, DISTRICTS_MAP, SUBJECTS, GRADES } from './catalog'
import { CLASS_STATUS, APPLICATION_STATUS, VERIFICATION_STATUS, labelOf } from './labels'

describe('catalog', () => {
  it('giữ đủ 63 tỉnh, không trùng', () => {
    expect(PROVINCES).toHaveLength(63)
    expect(new Set(PROVINCES).size).toBe(63)
  })
  it('mọi tỉnh có quận/huyện đều nằm trong danh sách tỉnh', () => {
    Object.keys(DISTRICTS_MAP).forEach((p) => expect(PROVINCES).toContain(p))
  })
  it('môn học: id và slug duy nhất', () => {
    expect(new Set(SUBJECTS.map((s) => s.id)).size).toBe(SUBJECTS.length)
    expect(new Set(SUBJECTS.map((s) => s.slug)).size).toBe(SUBJECTS.length)
  })
  it('lớp 1–12', () => {
    expect(GRADES.map((g) => g.value)).toEqual([1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12])
  })
})

describe('labels', () => {
  // Danh sách enum chép từ docs/architecture/03-flows-states.md.
  // Backend thêm trạng thái mới mà quên thêm nhãn → test này đỏ.
  const expected = {
    CLASS_STATUS: ['PENDING_REVIEW', 'OPEN', 'SHORTLISTED', 'MATCHING', 'ACTIVE', 'CANCELLED_AUDIT', 'COMPLETED', 'CLOSED', 'REJECTED'],
    APPLICATION_STATUS: ['APPLIED', 'INVITED', 'SHORTLISTED', 'SELECTED', 'CONTACTING', 'TRIAL', 'ACTIVE', 'COMPLETED',
      'DECLINED', 'WITHDRAWN', 'NOT_SELECTED', 'EXPIRED', 'UNREACHABLE', 'TRIAL_FAILED', 'ENDED_BY_PARENT', 'TUTOR_QUIT'],
    VERIFICATION_STATUS: ['DRAFT', 'PENDING', 'VERIFIED', 'REJECTED', 'SUSPENDED'],
  }
  const maps = { CLASS_STATUS, APPLICATION_STATUS, VERIFICATION_STATUS }

  it.each(Object.keys(expected))('%s có nhãn cho mọi trạng thái', (name) => {
    expect(Object.keys(maps[name]).sort()).toEqual([...expected[name]].sort())
    Object.values(maps[name]).forEach((v) => expect(v.label).toBeTruthy())
  })

  it('mã lạ vẫn hiện được, không vỡ trang', () => {
    expect(labelOf(CLASS_STATUS, 'SOMETHING_NEW')).toBe('SOMETHING_NEW')
  })
})
