/*
  NAVBAR — ĐÃ CHỐT THIẾT KẾ (CLAUDE.md). Desktop (≥1024px) giữ nguyên 2 tầng:
    1. Top bar xanh: SĐT + Email | hộp cam 4 icon mạng xã hội
    2. Nav trắng: logo | Tỉnh/Thành phố ⌄ · Môn học ⌄ · Danh sách Gia sư · Học sinh cần Gia sư | Đăng nhập · Đăng ký
  Thay đổi được duyệt (2026-10-12):
    - Dưới 1024px: thêm nút ☰ mở menu; top bar thu gọn để không tràn ngang
    - Đã đăng nhập: thay vùng "Đăng nhập/Đăng ký" bằng UserMenu (chuông, xèng, avatar)
    - Link mạng xã hội trỏ về GitHub dự án
*/
import { useState } from 'react'
import { Link, NavLink, useLocation } from 'react-router-dom'
import useAuthStore from '../../stores/authStore'
import { CONTACT, SOCIALS } from '../../constants/site'
import NavDropdown from './NavDropdown'
import UserMenu from './UserMenu'
import MobileMenu from './MobileMenu'
import { PROVINCE_ITEMS, SUBJECT_ITEMS } from './menuItems'

const NAV_SOCIALS = [SOCIALS.facebook, SOCIALS.instagram, SOCIALS.tiktok, SOCIALS.youtube]

export default function Navbar() {
  const status = useAuthStore((s) => s.status)
  const location = useLocation()

  // Menu mobile gắn với URL lúc mở: chuyển trang → URL khác → menu tự đóng (không cần useEffect).
  const here = location.pathname + location.search
  const [mobileOpenAt, setMobileOpenAt] = useState(null)
  const mobileOpen = mobileOpenAt === here

  const navLinkClass = ({ isActive }) =>
    `text-sm font-medium transition-colors duration-200 ${
      isActive ? 'text-primary font-semibold' : 'text-gray-700 hover:text-primary'
    }`

  return (
    <header className="sticky top-0 z-50">

      {/* ══════════ 1. TOP BAR ══════════ */}
      <div className="bg-primary text-white">
        <div className="max-w-site mx-auto px-4 sm:px-6 lg:px-12 h-14 flex items-center justify-between text-sm">

          {/* Liên hệ trái — mobile chỉ giữ SĐT */}
          <div className="flex items-center gap-5 min-w-0">
            <a href={CONTACT.phoneHref} className="flex items-center gap-2 py-3 hover:opacity-90 transition-opacity whitespace-nowrap">
              <img src="/images/phone.png" alt="" className="w-4 h-4 object-contain brightness-0 invert" />
              <span>{CONTACT.phoneDisplay}</span>
            </a>
            <span className="hidden sm:block w-px h-4 bg-white/30" />
            <a href={`mailto:${CONTACT.email}`} className="hidden sm:flex items-center gap-2 hover:opacity-90 transition-opacity">
              <img src="/images/email-icon.png" alt="" className="w-4 h-4 object-contain brightness-0 invert" />
              <span>{CONTACT.email}</span>
            </a>
          </div>

          {/* Social trong hộp cam — cao kín top bar (chạm mép trên + dưới).
              --icon = cỡ icon = khoảng cách giữa 2 icon (16px mobile, 20px từ sm). Mỗi icon đặt vừa khít ô vuông --icon.
              Khoảng cách tạo bằng padding mỗi bên = --icon/2 của từng link (không dùng gap) → nhìn y hệt,
              nhưng vùng bấm mỗi icon ≥ 24px và cao kín thanh (dễ chạm trên điện thoại, chuẩn WCAG 2.2). */}
          <div className="self-stretch flex items-stretch px-2 sm:px-4.5 bg-accent flex-shrink-0 [--icon:16px] sm:[--icon:20px]">
            {NAV_SOCIALS.map((s) => (
              <a key={s.label} href={s.href} title={s.label} aria-label={s.label} target="_blank" rel="noopener noreferrer"
                 className="flex items-center justify-center px-[calc(var(--icon)/2)] hover:scale-110 transition-transform">
                <img
                  src={s.tightSrc}
                  alt=""
                  className="block brightness-0 invert"
                  style={{
                    width: `calc(var(--icon) * ${Math.min(1, s.ratio)})`,
                    height: `calc(var(--icon) * ${Math.min(1, 1 / s.ratio).toFixed(3)})`,
                  }}
                />
              </a>
            ))}
          </div>
        </div>
      </div>

      {/* ══════════ 2. NAV CHÍNH ══════════ */}
      <nav className="bg-white shadow-sm border-b border-gray-100" aria-label="Điều hướng chính">
        <div className="max-w-site mx-auto px-4 sm:px-6 lg:px-12">
          <div className="flex items-center justify-between h-16 lg:h-[72px] gap-3">

            {/* Logo */}
            <Link to="/" className="flex-shrink-0">
              <img
                src="/images/logo-header.png"
                width="268"
                height="56"
                alt="Gia Sư 123 — về trang chủ"
                className="object-contain object-left h-8 min-[380px]:h-10 sm:h-[52px] w-auto"
              />
            </Link>

            {/* Menu desktop */}
            <div className="hidden lg:flex items-center gap-8">
              <NavDropdown label="Tỉnh/ Thành phố" items={PROVINCE_ITEMS} />
              <NavDropdown label="Môn học" items={SUBJECT_ITEMS} panelClassName="w-44" />
              <NavLink to="/tutors"   className={navLinkClass}>Danh sách Gia sư</NavLink>
              <NavLink to="/students" className={navLinkClass}>Học sinh cần Gia sư</NavLink>
            </div>

            {/* Auth + nút menu mobile */}
            <div className="flex items-center gap-2 min-[380px]:gap-3 sm:gap-5">
              {status === 'authenticated' ? (
                <UserMenu />
              ) : (
                // Lúc đang khôi phục phiên: giữ chỗ nhưng ẩn → không "nháy" nút Đăng nhập rồi đổi sang avatar
                <div className={`flex items-center gap-5 ${status === 'loading' ? 'invisible' : ''}`}>
                  <Link to="/login" className="hidden sm:inline text-sm font-medium text-gray-700 hover:text-primary transition-colors">
                    Đăng nhập
                  </Link>
                  <Link
                    to="/register-tutor"
                    className="flex items-center px-4 min-[380px]:px-5 py-2 sm:px-7 sm:py-2.5 bg-primary text-white text-sm font-semibold rounded-full hover:opacity-90 transition-opacity whitespace-nowrap"
                  >
                    Đăng ký
                  </Link>
                </div>
              )}

              <button
                type="button"
                onClick={() => setMobileOpenAt(mobileOpen ? null : here)}
                aria-expanded={mobileOpen}
                aria-controls="mobile-menu"
                aria-label={mobileOpen ? 'Đóng menu' : 'Mở menu'}
                className="lg:hidden w-10 h-10 -mr-2 flex items-center justify-center rounded-lg text-gray-700 hover:bg-gray-100"
              >
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-6 h-6" aria-hidden="true">
                  {mobileOpen ? <path d="M6 6l12 12M18 6L6 18" /> : <path d="M4 7h16M4 12h16M4 17h16" />}
                </svg>
              </button>
            </div>

          </div>
        </div>

        {mobileOpen && <MobileMenu isLoggedIn={status === 'authenticated'} />}
      </nav>
    </header>
  )
}
