// Mục trong menu tài khoản (08-frontend.md mục 4.1). `soon: true` = thuộc lát R1b–R1c, chưa làm → hiện mờ.
export function accountLinks({ isTutor, tutorStatus }) {
  return [
    { key: 'me', label: 'Tổng quan', to: '/me' },
    { key: 'classes', label: 'Lớp của tôi', to: '/me/classes' },
    { key: 'new-class', label: 'Đăng lớp mới', to: '/me/classes/new' },
    isTutor && { key: 'applications', label: 'Đơn nhận lớp', soon: true },
    { key: 'tutor', label: tutorStatus ? 'Hồ sơ gia sư' : 'Trở thành gia sư', to: '/me/tutor-profile' },
    { key: 'wallet', label: 'Ví xèng', soon: true },
    { key: 'notifications', label: 'Thông báo · Báo cáo của tôi', soon: true },
    { key: 'settings', label: 'Cài đặt tài khoản', soon: true },
  ].filter(Boolean)
}
