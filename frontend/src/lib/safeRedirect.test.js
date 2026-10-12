import { describe, it, expect } from 'vitest'
import { safeRedirect } from './safeRedirect'

describe('safeRedirect', () => {
  it.each(['/me/classes/new', '/students/1024?x=1', '/'])('cho phép đường dẫn nội bộ: %s', (p) => expect(safeRedirect(p)).toBe(p))
  it.each(['https://evil.com', '//evil.com', '/\\evil.com', '/%5Cevil.com', '/%2F%2Fevil.com', 'javascript:alert(1)', '', null, '/%E0%A4%A'])(
    'chặn: %s', (p) => expect(safeRedirect(p)).toBe('/me'),
  )
})
