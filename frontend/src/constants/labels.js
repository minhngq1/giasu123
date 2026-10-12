// Đổi mã enum của backend (UPPER_SNAKE) → nhãn tiếng Việt + tông màu chip.
// Nguồn sự thật của các enum: docs/architecture/03-flows-states.md.
// Tông màu theo 08-frontend.md mục 5:
//   gray = đang chờ · blue = đang xử lý · orange = cần hành động · green = thành công · red = thất bại

export const CLASS_STATUS = {
  PENDING_REVIEW: { label: 'Chờ duyệt', tone: 'gray' },
  REJECTED: { label: 'Bị từ chối', tone: 'red' },
  OPEN: { label: 'Đang tuyển', tone: 'green' },
  SHORTLISTED: { label: 'Đang chọn gia sư', tone: 'orange' },
  MATCHING: { label: 'Đang kết nối', tone: 'blue' },
  ACTIVE: { label: 'Đang học', tone: 'green' },
  CANCELLED_AUDIT: { label: 'Học thử không phù hợp', tone: 'orange' },
  COMPLETED: { label: 'Hoàn tất', tone: 'green' },
  CLOSED: { label: 'Đã đóng', tone: 'gray' },
}

export const APPLICATION_STATUS = {
  APPLIED: { label: 'Đã ứng tuyển', tone: 'gray' },
  INVITED: { label: 'Được mời', tone: 'orange' },
  SHORTLISTED: { label: 'Vào danh sách đề xuất', tone: 'blue' },
  SELECTED: { label: 'Được chọn', tone: 'orange' },
  CONTACTING: { label: 'Đang liên hệ', tone: 'orange' },
  TRIAL: { label: 'Học thử', tone: 'blue' },
  ACTIVE: { label: 'Đang dạy', tone: 'green' },
  COMPLETED: { label: 'Hoàn tất', tone: 'green' },
  DECLINED: { label: 'Đã từ chối', tone: 'gray' },
  WITHDRAWN: { label: 'Đã rút đơn', tone: 'gray' },
  NOT_SELECTED: { label: 'Không được chọn', tone: 'gray' },
  EXPIRED: { label: 'Quá hạn giữ phí', tone: 'red' },
  UNREACHABLE: { label: 'Không liên lạc được', tone: 'red' },
  TRIAL_FAILED: { label: 'Học thử không phù hợp', tone: 'red' },
  ENDED_BY_PARENT: { label: 'Phụ huynh kết thúc', tone: 'gray' },
  TUTOR_QUIT: { label: 'Gia sư bỏ lớp', tone: 'red' },
}

export const VERIFICATION_STATUS = {
  DRAFT: { label: 'Bản nháp', tone: 'gray' },
  PENDING: { label: 'Chờ xác minh', tone: 'blue' },
  VERIFIED: { label: 'Đã xác minh', tone: 'green' },
  REJECTED: { label: 'Bị từ chối', tone: 'red' },
  SUSPENDED: { label: 'Tạm khóa', tone: 'red' },
}

export const STUDY_MODE = {
  ONLINE: { label: 'Học online 1-1', short: 'Online' },
  OFFLINE: { label: 'Học kèm tại nhà', short: 'Tại nhà' },
}

export const FEE_MODE = {
  CONSULT: { label: 'Thỏa thuận (nhờ trung tâm tư vấn)' },
  FIXED: { label: 'Nhập học phí cụ thể' },
}

export const GENDER = {
  MALE: { label: 'Nam' },
  FEMALE: { label: 'Nữ' },
}

export const PREFERRED_GENDER = {
  ANY: { label: 'Không yêu cầu' },
  MALE: { label: 'Gia sư nam' },
  FEMALE: { label: 'Gia sư nữ' },
}

export const TUTOR_TYPE = {
  SINH_VIEN: { label: 'Sinh viên' },
  GIAO_VIEN: { label: 'Giáo viên' },
  NGUOI_DI_LAM: { label: 'Người đi làm' },
}

export const PREFERRED_TUTOR_TYPE = {
  ANY: { label: 'Không yêu cầu' },
  SINH_VIEN: { label: 'Sinh viên' },
  GIAO_VIEN: { label: 'Giáo viên' },
}

/** Lấy nhãn an toàn: mã lạ (backend thêm enum mới) vẫn hiện được, không làm vỡ trang. */
export const labelOf = (map, code) => map[code]?.label ?? code ?? ''
export const toneOf = (map, code) => map[code]?.tone ?? 'gray'

/** Đổi map → mảng {value, label} cho <select>/<radio>. */
export const optionsOf = (map) => Object.entries(map).map(([value, v]) => ({ value, label: v.label }))
