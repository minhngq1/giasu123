import { useState, useRef, useEffect } from 'react'
import { Link, NavLink, useNavigate } from 'react-router-dom'
import useAuthStore from '../../stores/authStore'

const C = { primary: '#24725D', orange: '#FF6B35' }

const SOCIAL_LINK = 'https://www.beonline.com.vn/'

const SOCIALS = [
  { src: '/images/fb.svg',     label: 'Facebook',  href: SOCIAL_LINK },
  { src: '/images/insta.svg',  label: 'Instagram', href: SOCIAL_LINK },
  { src: '/images/tiktok.svg', label: 'TikTok',    href: SOCIAL_LINK },
  { src: '/images/yt.svg',     label: 'YouTube',   href: SOCIAL_LINK },
]

const PROVINCES = [
  'Hà Nội', 'TP. Hồ Chí Minh', 'Đà Nẵng', 'Hải Phòng', 'Cần Thơ',
  'An Giang', 'Bà Rịa - Vũng Tàu', 'Bắc Giang', 'Bắc Kạn', 'Bạc Liêu',
  'Bắc Ninh', 'Bến Tre', 'Bình Định', 'Bình Dương', 'Bình Phước',
  'Bình Thuận', 'Cà Mau', 'Cao Bằng', 'Đắk Lắk', 'Đắk Nông',
  'Điện Biên', 'Đồng Nai', 'Đồng Tháp', 'Gia Lai', 'Hà Giang',
  'Hà Nam', 'Hà Tĩnh', 'Hải Dương', 'Hậu Giang', 'Hòa Bình',
  'Hưng Yên', 'Khánh Hòa', 'Kiên Giang', 'Kon Tum', 'Lai Châu',
  'Lâm Đồng', 'Lạng Sơn', 'Lào Cai', 'Long An', 'Nam Định',
  'Nghệ An', 'Ninh Bình', 'Ninh Thuận', 'Phú Thọ', 'Phú Yên',
  'Quảng Bình', 'Quảng Nam', 'Quảng Ngãi', 'Quảng Ninh', 'Quảng Trị',
  'Sóc Trăng', 'Sơn La', 'Tây Ninh', 'Thái Bình', 'Thái Nguyên',
  'Thanh Hóa', 'Thừa Thiên Huế', 'Tiền Giang', 'Trà Vinh', 'Tuyên Quang',
  'Vĩnh Long', 'Vĩnh Phúc', 'Yên Bái',
]

const SUBJECTS = ['Toán', 'Lý', 'Hoá', 'Sinh', 'Văn', 'Tiếng Anh', 'Sử', 'Địa', 'Tin học', 'GDCD']

export default function Navbar() {
  const { isAuthenticated, logout } = useAuthStore()
  const navigate = useNavigate()

  /* null | 'province' | 'subject' */
  const [openMenu, setOpenMenu] = useState(null)
  const menuRef = useRef(null)

  /* Đóng dropdown khi click ra ngoài */
  useEffect(() => {
    function handleClickOutside(e) {
      if (menuRef.current && !menuRef.current.contains(e.target)) {
        setOpenMenu(null)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  const toggle = (name) => setOpenMenu((prev) => (prev === name ? null : name))

  const navLinkClass = ({ isActive }) =>
    `text-sm font-medium transition-colors duration-200 ${
      isActive ? 'text-[#24725D] font-semibold' : 'text-gray-700 hover:text-[#24725D]'
    }`

  return (
    <header className="sticky top-0 z-50">

      {/* ══════════ 1. TOP BAR ══════════ */}
      <div style={{ backgroundColor: C.primary }} className="text-white">
        <div className="max-w-[1336px] mx-auto px-6 lg:px-12 h-14 flex items-center justify-between text-sm">

          {/* Liên hệ trái */}
          <div className="flex items-center gap-5">
            <a href="tel:+84912123456" className="flex items-center gap-2 hover:opacity-90 transition-opacity">
              <img src="/images/phone.png" alt="" className="w-4 h-4 object-contain brightness-0 invert" />
              <span>(+84) 912 123 456</span>
            </a>
            <span className="w-px h-4 bg-white/30" />
            <a href="mailto:info@gmail.com" className="flex items-center gap-2 hover:opacity-90 transition-opacity">
              <img src="/images/email-icon.png" alt="" className="w-4 h-4 object-contain brightness-0 invert" />
              <span>info@gmail.com</span>
            </a>
          </div>

          {/* Social trong hộp cam */}
          <div
            className="flex items-center gap-5 px-6 py-2.5 rounded-lg"
            style={{ backgroundColor: C.orange }}
          >
            {SOCIALS.map((s) => (
              <a key={s.label} href={s.href} title={s.label} target="_blank" rel="noopener noreferrer"
                 className="hover:scale-110 transition-transform">
                <img src={s.src} alt={s.label} className="w-5 h-5 object-contain brightness-0 invert" />
              </a>
            ))}
          </div>
        </div>
      </div>

      {/* ══════════ 2. NAV CHÍNH ══════════ */}
      <nav className="bg-white shadow-sm border-b border-gray-100">
        <div className="max-w-[1336px] mx-auto px-6 lg:px-12">
          <div className="flex items-center justify-between h-[72px]">

            {/* Logo */}
            <Link to="/" className="flex-shrink-0">
              <img
                src="/images/logo-header.png"
                alt="Gia Sư 123"
                className="object-contain object-left"
                style={{ height: '52px', width: 'auto' }}
              />
            </Link>

            {/* Menu */}
            <div ref={menuRef} className="hidden lg:flex items-center gap-8">

              {/* ── Dropdown: Tỉnh / Thành phố ── */}
              <div className="relative">
                <button
                  onClick={() => toggle('province')}
                  className={`flex items-center gap-1 text-sm font-medium transition-colors ${
                    openMenu === 'province' ? 'text-[#24725D]' : 'text-gray-700 hover:text-[#24725D]'
                  }`}
                >
                  Tỉnh/ Thành phố
                  <span
                    className="text-xs transition-transform duration-200"
                    style={{ display: 'inline-block', transform: openMenu === 'province' ? 'rotate(180deg)' : 'rotate(0deg)' }}
                  >
                    ⌄
                  </span>
                </button>

                {openMenu === 'province' && (
                  <ul className="absolute top-full left-0 mt-3 w-56 bg-white rounded-xl shadow-xl border border-gray-100 z-50 max-h-72 overflow-y-auto py-1.5">
                    {PROVINCES.map((p) => (
                      <li key={p}>
                        <button
                          onClick={() => {
                            navigate(`/tutors?city=${encodeURIComponent(p)}`)
                            setOpenMenu(null)
                          }}
                          className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-[#E8F5F1] hover:text-[#24725D] transition-colors"
                        >
                          {p}
                        </button>
                      </li>
                    ))}
                  </ul>
                )}
              </div>

              {/* ── Dropdown: Môn học ── */}
              <div className="relative">
                <button
                  onClick={() => toggle('subject')}
                  className={`flex items-center gap-1 text-sm font-medium transition-colors ${
                    openMenu === 'subject' ? 'text-[#24725D]' : 'text-gray-700 hover:text-[#24725D]'
                  }`}
                >
                  Môn học
                  <span
                    className="text-xs transition-transform duration-200"
                    style={{ display: 'inline-block', transform: openMenu === 'subject' ? 'rotate(180deg)' : 'rotate(0deg)' }}
                  >
                    ⌄
                  </span>
                </button>

                {openMenu === 'subject' && (
                  <ul className="absolute top-full left-0 mt-3 w-44 bg-white rounded-xl shadow-xl border border-gray-100 z-50 py-1.5">
                    {SUBJECTS.map((s) => (
                      <li key={s}>
                        <button
                          onClick={() => {
                            navigate(`/tutors?subject=${encodeURIComponent(s)}`)
                            setOpenMenu(null)
                          }}
                          className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-[#E8F5F1] hover:text-[#24725D] transition-colors"
                        >
                          {s}
                        </button>
                      </li>
                    ))}
                  </ul>
                )}
              </div>

              <NavLink to="/tutors"   className={navLinkClass}>Danh sách Gia sư</NavLink>
              <NavLink to="/students" className={navLinkClass}>Học sinh cần Gia sư</NavLink>
            </div>

            {/* Auth */}
            <div className="flex items-center gap-5">
              {isAuthenticated ? (
                <button
                  onClick={logout}
                  className="text-sm font-medium text-gray-700 hover:text-red-600 transition-colors"
                >
                  Đăng xuất
                </button>
              ) : (
                <>
                  <Link to="/login" className="text-sm font-medium text-gray-700 hover:text-[#24725D] transition-colors">
                    Đăng nhập
                  </Link>
                  <Link
                    to="/register-tutor"
                    style={{ backgroundColor: C.primary }}
                    className="flex items-center px-6 py-2 text-white text-sm font-semibold rounded-full hover:opacity-90 transition-opacity"
                  >
                    Đăng ký
                  </Link>
                </>
              )}
            </div>

          </div>
        </div>
      </nav>
    </header>
  )
}
