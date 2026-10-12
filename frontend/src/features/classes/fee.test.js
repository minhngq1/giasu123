import { describe, it, expect } from 'vitest'
import { calculateFee } from './fee'

describe('calculateFee', () => {
  it('ví dụ trong tài liệu: 200.000 × 3 × 4 × 40% = 960 xèng', () => {
    expect(calculateFee({ approvedFee: 200000, sessionsPerWeek: 3, studyMode: 'OFFLINE' })).toEqual({
      baseFeeVnd: 2400000, percent: 40, feeVnd: 960000, amountXeng: 960,
    })
  })
  it('ONLINE 30%', () => {
    expect(calculateFee({ approvedFee: 150000, sessionsPerWeek: 2, studyMode: 'ONLINE' }).amountXeng).toBe(360)
  })
  it('làm tròn LÊN đơn vị xèng', () => {
    // 155.555 × 1 × 4 × 30% = 186.666đ → 187 xèng
    expect(calculateFee({ approvedFee: 155555, sessionsPerWeek: 1, studyMode: 'ONLINE' }).amountXeng).toBe(187)
  })
  it('chưa chốt học phí → null', () => {
    expect(calculateFee({ approvedFee: null, sessionsPerWeek: 3, studyMode: 'OFFLINE' })).toBeNull()
  })
})
