// Danh mục dùng chung: tỉnh/thành, quận/huyện, môn học, lớp.
// Đây là NGUỒN DUY NHẤT phía frontend — không khai báo lại danh sách này ở component.
// Khi có backend: danh mục sẽ đến từ GET /api/subjects và /api/areas; giữ nguyên tên export để trang không phải sửa.

// 63 tỉnh/thành (chủ dự án chọn giữ chuẩn cũ vì đầy đủ, dễ chọn).
export const PROVINCES = [
  'Hà Nội','TP. Hồ Chí Minh','Đà Nẵng','Hải Phòng','Cần Thơ',
  'An Giang','Bà Rịa - Vũng Tàu','Bắc Giang','Bắc Kạn','Bạc Liêu',
  'Bắc Ninh','Bến Tre','Bình Định','Bình Dương','Bình Phước',
  'Bình Thuận','Cà Mau','Cao Bằng','Đắk Lắk','Đắk Nông',
  'Điện Biên','Đồng Nai','Đồng Tháp','Gia Lai','Hà Giang',
  'Hà Nam','Hà Tĩnh','Hải Dương','Hậu Giang','Hòa Bình',
  'Hưng Yên','Khánh Hòa','Kiên Giang','Kon Tum','Lai Châu',
  'Lâm Đồng','Lạng Sơn','Lào Cai','Long An','Nam Định',
  'Nghệ An','Ninh Bình','Ninh Thuận','Phú Thọ','Phú Yên',
  'Quảng Bình','Quảng Nam','Quảng Ngãi','Quảng Ninh','Quảng Trị',
  'Sóc Trăng','Sơn La','Tây Ninh','Thái Bình','Thái Nguyên',
  'Thanh Hóa','Thừa Thiên Huế','Tiền Giang','Trà Vinh','Tuyên Quang',
  'Vĩnh Long','Vĩnh Phúc','Yên Bái',
]

// Quận/huyện theo tỉnh. Tỉnh chưa có trong map → form cho nhập tay.
export const DISTRICTS_MAP = {
  'Hà Nội': ['Ba Đình','Cầu Giấy','Đống Đa','Hai Bà Trưng','Hà Đông','Hoàn Kiếm','Hoàng Mai','Long Biên','Nam Từ Liêm','Tây Hồ','Thanh Xuân','Bắc Từ Liêm','Gia Lâm','Đông Anh','Sóc Sơn','Thanh Trì','Mê Linh','Hoài Đức','Đan Phượng','Thạch Thất','Chương Mỹ','Quốc Oai','Ba Vì','Sơn Tây','Phúc Thọ','Thường Tín','Phú Xuyên','Mỹ Đức','Ứng Hòa','Thanh Oai'],
  'TP. Hồ Chí Minh': ['Quận 1','Quận 3','Quận 4','Quận 5','Quận 6','Quận 7','Quận 8','Quận 10','Quận 11','Quận 12','Bình Thạnh','Gò Vấp','Phú Nhuận','Tân Bình','Tân Phú','Bình Tân','Thủ Đức','Củ Chi','Hóc Môn','Bình Chánh','Nhà Bè','Cần Giờ'],
  'Đà Nẵng': ['Hải Châu','Thanh Khê','Sơn Trà','Ngũ Hành Sơn','Liên Chiểu','Cẩm Lệ','Hòa Vang'],
  'Hải Phòng': ['Hồng Bàng','Lê Chân','Ngô Quyền','Kiến An','Hải An','Đồ Sơn','Dương Kinh','An Dương','An Lão','Kiến Thụy','Tiên Lãng','Vĩnh Bảo','Cát Hải'],
  'Cần Thơ': ['Ninh Kiều','Bình Thủy','Cái Răng','Ô Môn','Thốt Nốt','Vĩnh Thạnh','Cờ Đỏ','Phong Điền','Thới Lai'],
  'Đồng Nai': ['Biên Hòa','Long Khánh','Nhơn Trạch','Long Thành','Trảng Bom','Thống Nhất','Cẩm Mỹ','Vĩnh Cửu','Định Quán','Tân Phú','Xuân Lộc'],
  'Bình Dương': ['Thủ Dầu Một','Dĩ An','Thuận An','Bến Cát','Tân Uyên','Phú Giáo','Bắc Tân Uyên','Dầu Tiếng'],
  'Khánh Hòa': ['Nha Trang','Cam Ranh','Ninh Hòa','Vạn Ninh','Khánh Vĩnh','Diên Khánh','Khánh Sơn','Trường Sa'],
  'Nghệ An': ['Vinh','Cửa Lò','Thái Hòa','Hoàng Mai','Diễn Châu','Yên Thành','Quỳnh Lưu','Nghi Lộc','Nam Đàn','Hưng Nguyên'],
  'Thanh Hóa': ['TP. Thanh Hóa','Sầm Sơn','Bỉm Sơn','Hậu Lộc','Hoằng Hóa','Quảng Xương','Đông Sơn','Thiệu Hóa','Yên Định','Triệu Sơn'],
}

export const districtsOf = (province) => DISTRICTS_MAP[province] ?? []

// 10 môn học. `slug` khớp cột subjects.slug trong DB và dùng trên URL (?subject=toan).
export const SUBJECTS = [
  { id: 1, slug: 'toan', name: 'Toán' },
  { id: 2, slug: 'ly', name: 'Lý' },
  { id: 3, slug: 'hoa', name: 'Hóa' },
  { id: 4, slug: 'sinh', name: 'Sinh' },
  { id: 5, slug: 'van', name: 'Văn' },
  { id: 6, slug: 'tieng-anh', name: 'Tiếng Anh' },
  { id: 7, slug: 'su', name: 'Sử' },
  { id: 8, slug: 'dia', name: 'Địa' },
  { id: 9, slug: 'tin-hoc', name: 'Tin học' },
  { id: 10, slug: 'gdcd', name: 'GDCD' },
]

export const subjectBySlug = (slug) => SUBJECTS.find((s) => s.slug === slug)
export const subjectById = (id) => SUBJECTS.find((s) => s.id === Number(id))

// Lớp 1–12 (cột class_requests.grade là số).
export const GRADES = Array.from({ length: 12 }, (_, i) => ({ value: i + 1, label: `Lớp ${i + 1}` }))

// Lựa chọn cho form đăng lớp (khớp ràng buộc DB: sessions_per_week 1–7).
export const SESSIONS_PER_WEEK = [1, 2, 3, 4, 5, 6, 7]
export const MINUTES_PER_SESSION = [45, 60, 90, 120, 150]
