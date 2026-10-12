import { describe, it, expect } from 'vitest'
import { hasContactInfo } from './contentGuard'

describe('ContentGuard (giả lập phía frontend)', () => {
  it.each(['0912 345 678', 'gọi 0912345678 nhé', '+84 912.345.678', 'zalo.me/abc', 'add Zalo mình', 'xem www.abc.vn', 'mail a.b@gmail.com'])(
    'chặn: %s', (text) => expect(hasContactInfo(text)).toBe(true),
  )
  it.each(['Ưu tiên gia sư nữ, có kinh nghiệm luyện thi', 'Học 3 buổi/tuần, 90 phút', 'Lớp 12 năm 2026'])(
    'cho qua: %s', (text) => expect(hasContactInfo(text)).toBe(false),
  )
})
