// Giả lập ContentGuard của backend (05-backend.md): chặn SĐT / Zalo / link / email trong ô chữ tự do
// để gia sư và phụ huynh không trao đổi liên hệ ngoài nền tảng (né phí).
// Frontend kiểm tra sớm cho trải nghiệm tốt; BACKEND vẫn là nơi chặn thật.

const PATTERNS = [
  /(?:\+?84|0)(?:[\s.-]?\d){8,10}/, // số điện thoại VN, kể cả viết cách "0912 345 678"
  /zalo/i,
  /https?:\/\/|www\.|\b[\w-]+\.(com|vn|net|me|org)\b/i, // đường link
  /[\w.+-]+@[\w-]+\.[\w.]+/, // email
  /facebook|fb\.com|messenger/i,
]

export const CONTENT_GUARD_MESSAGE = 'Không được ghi số điện thoại, Zalo, email hoặc đường link trong ô này.'

export function hasContactInfo(text = '') {
  return PATTERNS.some((re) => re.test(text))
}
