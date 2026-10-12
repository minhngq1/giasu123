// Khung chung mọi trang: Navbar (đã chốt) + nội dung + Footer.
import { Suspense } from 'react'
import { Outlet } from 'react-router-dom'
import Navbar from '../components/common/Navbar'
import Footer from '../components/common/Footer'
import ScrollToTop from '../components/common/ScrollToTop'
import PageLoading from '../components/common/PageLoading'

export default function RootLayout() {
  return (
    <div className="flex flex-col min-h-screen">
      <ScrollToTop />
      <Navbar />
      <main id="main" className="flex-1">
        {/* Trang được tải lười (lazy) → hiện khung chờ trong lúc tải code của trang */}
        <Suspense fallback={<PageLoading />}>
          <Outlet />
        </Suspense>
      </main>
      <Footer />
    </div>
  )
}
