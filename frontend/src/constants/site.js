// Thông tin liên hệ + mạng xã hội của site — dùng chung cho Navbar, Footer, section Kết nối.

export const CONTACT = {
  phoneDisplay: '(+84) 912 123 456',
  phoneHref: 'tel:+84912123456',
  email: 'info@gmail.com',
}

// Tạm thời mọi icon mạng xã hội đều trỏ về repo GitHub của dự án.
export const SOCIAL_LINK = 'https://github.com/minhngq1/giasu123'

// src      : icon gốc (Footer dùng, nằm trong vòng tròn)
// tightSrc : bản đã cắt hết lề trong SVG (Header dùng) → các icon to đều nhau, khoảng cách nhìn bằng nhau
// ratio    : rộng / cao của phần hình thật (đo bằng getBBox) — để đặt icon vừa khít trong ô vuông
export const SOCIALS = {
  facebook: { src: '/images/fb.svg', tightSrc: '/images/social-fb.svg', ratio: 0.537, label: 'Facebook', href: SOCIAL_LINK },
  instagram: { src: '/images/insta.svg', tightSrc: '/images/social-insta.svg', ratio: 1, label: 'Instagram', href: SOCIAL_LINK },
  tiktok: { src: '/images/tiktok.svg', tightSrc: '/images/social-tiktok.svg', ratio: 0.871, label: 'TikTok', href: SOCIAL_LINK },
  youtube: { src: '/images/yt.svg', tightSrc: '/images/social-yt.svg', ratio: 1.419, label: 'YouTube', href: SOCIAL_LINK },
}

// ⚠️ Số liệu MINH HỌA cho bản demo, không phải số đo thật.
// Khi có backend: thay bằng API thống kê (đếm thật từ DB).
export const DEMO_STATS = [
  { key: 'tutor', value: '3K+', label: 'Gia sư đã đăng ký' },
  { key: 'student', value: '27K+', label: 'Học sinh cần tìm gia sư' },
  { key: 'connect', value: '15K+', label: 'Lớp kết nối thành công' },
  { key: 'register', value: '102K+', label: 'Đăng ký mỗi tháng' },
]
