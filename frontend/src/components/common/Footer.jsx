/*
  FOOTER — Chân trang (bám sát thiết kế Figma)
  =============================================
  Layout nền sáng, gọn:
    - Hàng trên : logo trái | menu ngang giữa | social phải
    - Gạch ngang
    - Hàng dưới : bản quyền trái | điều khoản · bảo mật phải
  Dropdown Tỉnh/Môn mở LÊN TRÊN (vì footer nằm cuối trang).
*/
import { Link } from 'react-router-dom'
import { SOCIALS } from '../../constants/site'
import NavDropdown from './NavDropdown'
import { PROVINCE_ITEMS, SUBJECT_ITEMS } from './menuItems'

const FOOTER_SOCIALS = [SOCIALS.instagram, SOCIALS.facebook, SOCIALS.tiktok, SOCIALS.youtube]

export default function Footer() {
  return (
    <footer className="bg-white border-t border-gray-100">
      <div className="max-w-site mx-auto px-4 sm:px-6 lg:px-12">

        {/* ── Hàng trên ── */}
        <div className="flex flex-col md:flex-row items-center justify-between gap-6 py-8">

          {/* Logo */}
          <Link to="/" className="flex-shrink-0">
            <img src="/images/logo-header.png" alt="Gia Sư 123 — về trang chủ" width="268" height="56" className="h-12 w-auto" />
          </Link>

          {/* Menu ngang */}
          <nav aria-label="Điều hướng chân trang" className="flex flex-wrap items-center justify-center gap-x-8 gap-y-2 text-sm font-medium text-gray-700">
            <NavDropdown label="Tỉnh/ Thành phố" items={PROVINCE_ITEMS} placement="up" />
            <NavDropdown label="Môn học" items={SUBJECT_ITEMS} placement="up" panelClassName="w-44" />
            <Link to="/tutors" className="hover:text-primary transition-colors">Danh sách Gia sư</Link>
            <Link to="/students" className="hover:text-primary transition-colors">Học sinh cần Gia sư</Link>
          </nav>

          {/* Social */}
          <div className="flex items-center gap-3">
            {FOOTER_SOCIALS.map((s) => (
              <a
                key={s.label}
                href={s.href}
                title={s.label}
                aria-label={s.label}
                target="_blank"
                rel="noopener noreferrer"
                className="group w-9 h-9 rounded-full border border-gray-200 flex items-center justify-center hover:border-primary transition-colors"
              >
                <img src={s.src} alt="" className="w-4 h-4 object-contain brightness-0 opacity-50 group-hover:opacity-80 transition-opacity" />
              </a>
            ))}
          </div>
        </div>

        {/* ── Hàng dưới ── */}
        <div className="border-t border-gray-100 py-5 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-gray-500">
          <p>
            Copyright © {new Date().getFullYear()} <span className="font-semibold text-gray-700">Giasu123.</span> All Rights Reserved
          </p>
          <div className="flex flex-wrap justify-center gap-x-6 gap-y-2">
            <Link to="/legal/terms" className="hover:text-primary transition-colors">Điều khoản sử dụng</Link>
            <Link to="/legal/privacy" className="hover:text-primary transition-colors">Chính sách bảo mật</Link>
            <Link to="/safety" className="hover:text-primary transition-colors">Hướng dẫn an toàn</Link>
          </div>
        </div>

      </div>
    </footer>
  )
}
