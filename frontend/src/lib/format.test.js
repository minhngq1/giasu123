import { describe, it, expect } from 'vitest'
import { formatVnd, formatXeng, formatDateTime, timeAgo, classCode, initialsOf } from './format'

describe('formatVnd', () => {
  it('dùng dấu chấm phân cách hàng nghìn kiểu Việt Nam', () => {
    expect(formatVnd(200000)).toBe('200.000đ')
  })
  it('giá trị rỗng hiện gạch ngang, không in "undefinedđ"', () => {
    expect(formatVnd(undefined)).toBe('—')
    expect(formatVnd(null)).toBe('—')
  })
})

describe('formatXeng', () => {
  it('1160 → "1.160 xèng"', () => {
    expect(formatXeng(1160)).toBe('1.160 xèng')
  })
})

describe('formatDateTime', () => {
  it('luôn đổi sang giờ Việt Nam (UTC+7)', () => {
    // 07:00 UTC = 14:00 giờ Việt Nam
    expect(formatDateTime('2026-09-30T07:00:00Z')).toBe('14:00 30/09/2026')
  })
})

describe('timeAgo', () => {
  const now = new Date('2026-10-12T10:00:00Z').getTime()
  it.each([
    ['2026-10-12T09:59:30Z', 'vừa xong'],
    ['2026-10-12T09:55:00Z', '5 phút trước'],
    ['2026-10-12T07:00:00Z', '3 giờ trước'],
    ['2026-10-10T10:00:00Z', '2 ngày trước'],
  ])('%s → %s', (iso, expected) => {
    expect(timeAgo(iso, now)).toBe(expected)
  })
})

describe('tiện ích nhỏ', () => {
  it('classCode', () => expect(classCode(1024)).toBe('#L1024'))
  it('initialsOf lấy 2 chữ cuối', () => expect(initialsOf('Nguyễn Thị Hương')).toBe('TH'))
})
