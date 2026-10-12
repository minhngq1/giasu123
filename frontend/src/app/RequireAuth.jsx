// Chặn trang cần đăng nhập. Đây chỉ là chốt chặn TRẢI NGHIỆM — backend mới là chốt chặn bảo mật thật.
import { Navigate, Outlet, useLocation } from 'react-router-dom'
import useAuthStore from '../stores/authStore'
import PageLoading from '../components/common/PageLoading'

export default function RequireAuth() {
  const status = useAuthStore((s) => s.status)
  const location = useLocation()

  if (status === 'loading') return <PageLoading />
  if (status === 'anonymous') {
    // Ghi nhớ trang đang muốn vào → đăng nhập xong quay lại đúng chỗ.
    const from = location.pathname + location.search
    return <Navigate to={`/login?from=${encodeURIComponent(from)}`} replace />
  }
  return <Outlet />
}
