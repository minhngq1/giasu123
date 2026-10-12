// Chống "open redirect": chỉ cho phép chuyển tới đường dẫn NỘI BỘ của site.
// Ví dụ kẻ xấu gửi link /login?from=https://lua-dao.com → đăng nhập xong KHÔNG được chuyển ra ngoài.
// Chặn cả các biến thể trình duyệt hiểu là "sang domain khác": //evil.com, /\evil.com, /%5Cevil.com
export function safeRedirect(path, fallback = '/me') {
  if (typeof path !== 'string' || !path.startsWith('/')) return fallback
  let decoded
  try {
    decoded = decodeURIComponent(path)
  } catch {
    return fallback // chuỗi %.. hỏng
  }
  const hasControlChar = [...decoded].some((ch) => ch.charCodeAt(0) < 32) // tab, xuống dòng... trình duyệt có thể bỏ qua
  if (decoded.startsWith('//') || decoded.includes('\\') || hasControlChar) return fallback
  return path
}
