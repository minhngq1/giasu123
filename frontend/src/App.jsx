// Bảng route của web app (sitemap: docs/architecture/08-frontend.md mục 2).
// Các trang được tải lười (React.lazy) → mở trang nào chỉ tải code trang đó; riêng trang chủ nạp sẵn.
import { lazy } from 'react'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Providers from './app/providers'
import RootLayout from './app/RootLayout'
import RequireAuth from './app/RequireAuth'

// Trang chủ là trang được vào nhiều nhất → nạp cùng gói chính (không lazy) để hiện nhanh hơn 1 lượt tải.
import HomePage from './features/home/pages/HomePage'
// Xác thực
const LoginPage = lazy(() => import('./features/auth/pages/LoginPage'))
const RegisterPage = lazy(() => import('./features/auth/pages/RegisterPage'))
const VerifyEmailPage = lazy(() => import('./features/auth/pages/VerifyEmailPage'))
// Công khai
const TutorListPage = lazy(() => import('./features/tutors/pages/TutorListPage'))
const TutorDetailPage = lazy(() => import('./features/tutors/pages/TutorDetailPage'))
const ClassListPage = lazy(() => import('./features/classes/pages/ClassListPage'))
const ClassDetailPage = lazy(() => import('./features/classes/pages/ClassDetailPage'))
const LegalPage = lazy(() => import('./features/legal/pages/LegalPage'))
// Thành viên (/me/**)
const DashboardPage = lazy(() => import('./features/me/pages/DashboardPage'))
const MyClassesPage = lazy(() => import('./features/classes/pages/MyClassesPage'))
const NewClassPage = lazy(() => import('./features/classes/pages/NewClassPage'))
const MyClassDetailPage = lazy(() => import('./features/classes/pages/MyClassDetailPage'))
const EditClassPage = lazy(() => import('./features/classes/pages/EditClassPage'))
const MyTutorProfilePage = lazy(() => import('./features/tutors/pages/MyTutorProfilePage'))
const NotFoundPage = lazy(() => import('./features/misc/NotFoundPage'))

export default function App() {
  return (
    <Providers>
      <BrowserRouter>
        <Routes>
          <Route element={<RootLayout />}>
            <Route path="/" element={<HomePage />} />

            {/* Giữ nguyên các đường dẫn Navbar đang trỏ tới */}
            <Route path="/login" element={<LoginPage />} />
            <Route path="/register-tutor" element={<RegisterPage />} />
            <Route path="/verify-email" element={<VerifyEmailPage />} />
            <Route path="/tutors" element={<TutorListPage />} />
            <Route path="/tutors/:id" element={<TutorDetailPage />} />
            <Route path="/students" element={<ClassListPage />} />
            <Route path="/students/:id" element={<ClassDetailPage />} />
            <Route path="/legal/:type" element={<LegalPage />} />
            <Route path="/safety" element={<LegalPage type="safety" />} />

            {/* Cần đăng nhập — RequireAuth chỉ chặn ở giao diện, backend mới là chốt chặn thật */}
            <Route path="/me" element={<RequireAuth />}>
              <Route index element={<DashboardPage />} />
              <Route path="classes" element={<MyClassesPage />} />
              <Route path="classes/new" element={<NewClassPage />} />
              <Route path="classes/:id" element={<MyClassDetailPage />} />
              <Route path="classes/:id/edit" element={<EditClassPage />} />
              <Route path="tutor-profile" element={<MyTutorProfilePage />} />
            </Route>

            <Route path="*" element={<NotFoundPage />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </Providers>
  )
}
