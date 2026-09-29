/*
  FOOTER — Chân trang (bám sát thiết kế Figma)
  =============================================
  Layout nền sáng, gọn:
    - Hàng trên : logo trái | menu ngang giữa | social phải
    - Gạch ngang
    - Hàng dưới : bản quyền trái | điều khoản · bảo mật phải
*/
import { Link } from 'react-router-dom'

const SOCIAL_LINK = 'https://www.beonline.com.vn/'

const SOCIALS = [
  { src: '/images/insta.svg',  label: 'Instagram', href: SOCIAL_LINK },
  { src: '/images/fb.svg',     label: 'Facebook',  href: SOCIAL_LINK },
  { src: '/images/tiktok.svg', label: 'TikTok',    href: SOCIAL_LINK },
  { src: '/images/yt.svg',     label: 'YouTube',   href: SOCIAL_LINK },
]

export default function Footer() {
  return (
    <footer className="bg-white border-t border-gray-100">
      <div className="max-w-[1336px] mx-auto px-6 lg:px-12">

        {/* ── Hàng trên ── */}
        <div className="flex flex-col md:flex-row items-center justify-between gap-6 py-8">

          {/* Logo */}
          <Link to="/" className="flex-shrink-0">
            <img src="/images/logo-header.png" alt="Gia Sư 123" className="h-12 w-auto" />
          </Link>

          {/* Menu ngang */}
          <nav className="flex flex-wrap items-center justify-center gap-x-8 gap-y-2 text-sm font-medium text-gray-700">
            <button className="flex items-center gap-1 hover:text-[#24725D] transition-colors">
              Tỉnh/ Thành phố <span className="text-xs">⌄</span>
            </button>
            <button className="flex items-center gap-1 hover:text-[#24725D] transition-colors">
              Môn học <span className="text-xs">⌄</span>
            </button>
            <Link to="/tutors" className="hover:text-[#24725D] transition-colors">Danh sách Gia sư</Link>
            <Link to="/students" className="hover:text-[#24725D] transition-colors">Học sinh cần Gia sư</Link>
          </nav>

          {/* Social */}
          <div className="flex items-center gap-3">
            {SOCIALS.map((s) => (
              <a
                key={s.label}
                href={s.href}
                title={s.label}
                target="_blank"
                rel="noopener noreferrer"
                className="group w-9 h-9 rounded-full border border-gray-200 flex items-center justify-center hover:border-[#24725D] transition-colors"
              >
                <img src={s.src} alt={s.label} className="w-4 h-4 object-contain brightness-0 opacity-50 group-hover:opacity-80 transition-opacity" />
              </a>
            ))}
          </div>
        </div>

        {/* ── Hàng dưới ── */}
        <div className="border-t border-gray-100 py-5 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-gray-500">
          <p>
            Copyright © {new Date().getFullYear()} <span className="font-semibold text-gray-700">Giasu123.</span> All Rights Reserved
          </p>
          <div className="flex gap-6">
            <a href="#" className="hover:text-[#24725D] transition-colors">Điều khoản sử dụng</a>
            <a href="#" className="hover:text-[#24725D] transition-colors">Chính sách bảo mật</a>
          </div>
        </div>

      </div>
    </footer>
  )
}
