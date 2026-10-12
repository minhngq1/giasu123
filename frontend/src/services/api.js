// Một axios instance DUY NHẤT để gọi backend. Quy ước (08-frontend.md mục 6):
//   - Gắn `Authorization: Bearer <accessToken>` lấy từ store trong bộ nhớ.
//   - Gặp 401 → gọi refresh theo kiểu single-flight rồi gửi lại request đúng 1 lần.
//   - Mọi lỗi ném ra đều là ApiError (đã chuẩn hóa từ ProblemDetail).
import axios from 'axios'
import useAuthStore from '../stores/authStore'
import { toApiError } from '../lib/problem'

/**
 * Tạo client có thể cấu hình — tách ra hàm để test được mà không cần store/backend thật.
 * @param {object} o
 * @param {() => Promise<string>} o.refreshRequest  gọi refresh, trả access token mới
 * @param {() => string|null} o.getAccessToken
 * @param {(token: string) => void} o.onRefreshed
 * @param {() => void} o.onAuthFailure              refresh hỏng → đăng xuất
 * @param {Function} [o.adapter]                     chỉ dùng trong test
 */
export function createApiClient({ refreshRequest, getAccessToken, onRefreshed, onAuthFailure, adapter, baseURL = '/api' }) {
  const client = axios.create({
    baseURL,
    withCredentials: true, // gửi kèm cookie refresh (HttpOnly) — trình duyệt tự lo, JS không đọc được
    timeout: 15000,
    adapter,
  })

  // Single-flight: dù 10 request cùng gặp 401, chỉ có 1 lời gọi refresh; 9 request kia chờ chung promise này.
  let refreshing = null
  const refresh = () => {
    if (!refreshing) {
      refreshing = Promise.resolve()
        .then(refreshRequest)
        .then((token) => {
          onRefreshed(token)
          return token
        })
        .catch((err) => {
          onAuthFailure()
          throw toApiError(err)
        })
        .finally(() => {
          refreshing = null
        })
    }
    return refreshing
  }

  client.interceptors.request.use((config) => {
    const token = getAccessToken()
    if (token && !config.headers.Authorization) {
      config.headers.Authorization = `Bearer ${token}`
    }
    return config
  })

  client.interceptors.response.use(
    (response) => response,
    async (error) => {
      const { config, response } = error
      const canRetry = response?.status === 401 && config && !config._retried && !config.skipAuthRefresh
      if (canRetry) {
        config._retried = true // đánh dấu để không lặp vô hạn nếu token mới vẫn bị 401
        try {
          const token = await refresh()
          config.headers.Authorization = `Bearer ${token}`
          return client(config)
        } catch {
          // refresh thất bại → rơi xuống ném lỗi 401 gốc bên dưới
        }
      }
      throw toApiError(error)
    },
  )

  client.refresh = refresh
  return client
}

const api = createApiClient({
  refreshRequest: async () => {
    // skipAuthRefresh: chính lời gọi refresh bị 401 thì không được refresh tiếp (tránh vòng lặp)
    const res = await api.post('/auth/refresh', null, { skipAuthRefresh: true })
    return res.data.accessToken
  },
  getAccessToken: () => useAuthStore.getState().accessToken,
  onRefreshed: (token) => useAuthStore.getState().setAccessToken(token),
  onAuthFailure: () => useAuthStore.getState().clear(),
})

/** Gọi refresh dùng chung hàng đợi single-flight của interceptor. */
export const refreshSession = () => api.refresh()

export default api
