// SPA không tự cuộn lên đầu khi đổi trang → cuộn thủ công mỗi khi pathname đổi.
import { useEffect } from 'react'
import { useLocation } from 'react-router-dom'

export default function ScrollToTop() {
  const { pathname } = useLocation()
  useEffect(() => {
    window.scrollTo(0, 0)
  }, [pathname])
  return null
}
