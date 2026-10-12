// Chuẩn hóa lỗi từ backend (ProblemDetail — RFC 9457, xem 07-api.md) thành một dạng duy nhất cho UI.

export class ApiError extends Error {
  /**
   * @param {object} p
   * @param {number} p.status  HTTP status (0 = mất mạng / không gọi được server)
   * @param {string} p.code    mã nghiệp vụ, vd 'INSUFFICIENT_XENG', 'VALIDATION_FAILED'
   * @param {string} p.title   tiêu đề ngắn
   * @param {string} p.detail  câu giải thích cho người dùng
   * @param {Record<string,string>} p.errors  lỗi theo từng ô input (400)
   * @param {object} p.extra   các trường mở rộng khác, vd { shortfall: 340 }
   */
  constructor({ status = 0, code = 'UNKNOWN', title = 'Đã có lỗi xảy ra', detail = '', errors = {}, extra = {} } = {}) {
    super(detail || title)
    this.name = 'ApiError'
    this.status = status
    this.code = code
    this.title = title
    this.detail = detail
    this.errors = errors
    this.extra = extra
  }
}

const FALLBACK_MESSAGE = {
  0: 'Không kết nối được máy chủ. Vui lòng kiểm tra mạng và thử lại.',
  401: 'Phiên đăng nhập đã hết hạn. Vui lòng đăng nhập lại.',
  403: 'Bạn chưa đủ điều kiện để thực hiện thao tác này.',
  404: 'Không tìm thấy dữ liệu.',
  409: 'Dữ liệu vừa thay đổi. Vui lòng tải lại trang.',
  429: 'Bạn thao tác quá nhanh. Vui lòng thử lại sau ít phút.',
  500: 'Máy chủ đang gặp sự cố. Vui lòng thử lại sau.',
}

/** Đổi bất kỳ lỗi nào (axios error, ApiError, Error thường) → ApiError. */
export function toApiError(err) {
  if (err instanceof ApiError) return err
  const res = err?.response
  if (!res) {
    return new ApiError({ status: 0, code: 'NETWORK_ERROR', title: 'Mất kết nối', detail: FALLBACK_MESSAGE[0] })
  }
  const body = res.data && typeof res.data === 'object' ? res.data : {}
  // eslint-disable-next-line no-unused-vars
  const { type, title, status, detail, instance, code, errors, ...extra } = body
  return new ApiError({
    status: res.status,
    code: code ?? `HTTP_${res.status}`,
    title: title ?? 'Đã có lỗi xảy ra',
    detail: detail ?? FALLBACK_MESSAGE[res.status] ?? FALLBACK_MESSAGE[500],
    errors: errors ?? {},
    extra,
  })
}

/** Câu thông báo để hiện cho người dùng. */
export const messageOf = (err) => {
  const e = toApiError(err)
  return e.detail || e.title
}

/**
 * Gắn lỗi theo ô từ backend vào react-hook-form.
 * Trả về true nếu đã gắn được ít nhất 1 lỗi theo ô (để trang biết có cần hiện thông báo chung không).
 */
export function applyServerErrors(err, setError) {
  const { errors } = toApiError(err)
  const fields = Object.entries(errors ?? {})
  fields.forEach(([field, message], i) => {
    setError(field, { type: 'server', message }, { shouldFocus: i === 0 })
  })
  return fields.length > 0
}
