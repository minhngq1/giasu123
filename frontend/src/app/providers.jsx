// Bọc toàn app: TanStack Query (cache + trạng thái gọi API) và khôi phục phiên đăng nhập.
import { useEffect, useState } from 'react'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { bootstrapAuth } from '../features/auth/api'

function createQueryClient() {
  return new QueryClient({
    defaultOptions: {
      queries: {
        staleTime: 30_000, // dữ liệu "còn tươi" 30s → quay lại trang không gọi lại API ngay
        refetchOnWindowFocus: false,
        // Lỗi 4xx (sai dữ liệu, không có quyền, không tồn tại) thì thử lại cũng vô ích → chỉ thử lại lỗi mạng/5xx.
        retry: (count, err) => count < 2 && !(err?.status >= 400 && err?.status < 500),
      },
      mutations: { retry: false },
    },
  })
}

// StrictMode ở dev gọi effect 2 lần → dùng cờ cấp module để chỉ khôi phục phiên 1 lần.
let bootstrapped = false

export default function Providers({ children }) {
  const [queryClient] = useState(createQueryClient)

  useEffect(() => {
    if (!bootstrapped) {
      bootstrapped = true
      bootstrapAuth()
    }
  }, [])

  return <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
}
