// Bộ công cụ cho dữ liệu giả (mock) khi backend chưa có.
// Quy ước: CHỈ các file features/*/api.js và features/*/mock.js được import file này.
// Component không bao giờ import mock — nhờ vậy khi có backend chỉ cần tắt VITE_USE_MOCK.

import { ApiError } from './problem'

/** Bật mock trừ khi đặt VITE_USE_MOCK=false trong frontend/.env.local */
export const USE_MOCK = import.meta.env.VITE_USE_MOCK !== 'false'

const IS_TEST = import.meta.env.MODE === 'test'

/** Trễ 300–600ms để thấy được trạng thái loading như khi gọi mạng thật (test thì không trễ). */
function latency() {
  if (IS_TEST) return Promise.resolve()
  return new Promise((r) => setTimeout(r, 300 + Math.random() * 300))
}

/** Thêm ?mockError=1 vào URL trang để mọi lời gọi mock trả lỗi 500 → xem được trạng thái lỗi. */
function maybeFail() {
  if (typeof window === 'undefined') return
  if (new URLSearchParams(window.location.search).has('mockError')) {
    throw new ApiError({
      status: 500,
      code: 'MOCK_ERROR',
      title: 'Lỗi giả lập',
      detail: 'Đây là lỗi giả lập (?mockError=1) để xem trạng thái lỗi.',
    })
  }
}

/**
 * Bọc một "handler" giả: chờ trễ → có thể ném lỗi giả → trả bản sao dữ liệu
 * (sao chép để component không sửa nhầm vào "database" giả).
 */
export async function respond(handler) {
  await latency()
  maybeFail()
  const result = await handler()
  return result === undefined ? undefined : structuredClone(result)
}

/** Ném lỗi theo đúng hình dạng ProblemDetail mà backend sẽ trả. */
export function fail(status, code, detail, errors) {
  throw new ApiError({ status, code, title: detail, detail, errors: errors ?? {} })
}

/**
 * "Database" giả lưu trong sessionStorage để F5 không mất dữ liệu vừa tạo.
 * Chỉ dùng ở chế độ mock (dev). Đóng tab là mất — đúng ý: không giữ dữ liệu lâu trên trình duyệt.
 */
export function persisted(key, createInitial) {
  const storageKey = `giasu123.mock.${key}`
  let data
  try {
    const raw = !IS_TEST && sessionStorage.getItem(storageKey)
    data = raw ? JSON.parse(raw) : createInitial()
  } catch {
    data = createInitial()
  }
  return {
    get data() {
      return data
    },
    save() {
      if (IS_TEST) return
      try {
        sessionStorage.setItem(storageKey, JSON.stringify(data))
      } catch {
        /* bộ nhớ đầy hoặc bị chặn → bỏ qua, chỉ mất tính năng giữ dữ liệu khi F5 */
      }
    },
    reset() {
      data = createInitial()
    },
  }
}

/** Phân trang giống backend: page bắt đầu từ 1, size tối đa 50. */
export function paginate(items, page = 1, size = 10) {
  const safeSize = Math.min(Math.max(Number(size) || 10, 1), 50)
  const totalItems = items.length
  const totalPages = Math.max(1, Math.ceil(totalItems / safeSize))
  const safePage = Math.min(Math.max(Number(page) || 1, 1), totalPages)
  const start = (safePage - 1) * safeSize
  return { items: items.slice(start, start + safeSize), page: safePage, size: safeSize, totalItems, totalPages }
}

/** Bỏ dấu tiếng Việt để tìm kiếm không dấu (giống unaccent ở PostgreSQL). */
export function normalizeText(s = '') {
  return s.normalize('NFD').replace(/[̀-ͯ]/g, '').replace(/đ/g, 'd').replace(/Đ/g, 'D').toLowerCase().trim()
}

export const nowIso = () => new Date().toISOString()
export const daysAgoIso = (days) => new Date(Date.now() - days * 86400000).toISOString()
