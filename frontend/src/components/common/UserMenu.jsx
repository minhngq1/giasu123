// Vùng tài khoản khi ĐÃ đăng nhập — ngoại lệ được duyệt cho Navbar (CLAUDE.md, 08-frontend.md mục 4.1):
//   🔔 chuông (số chưa đọc) · 🪙 số dư xèng (chỉ gia sư) · avatar + tên gọi ▾ (menu tài khoản)
import { Link, useNavigate } from 'react-router-dom'
import useAuthStore, { selectIsTutor } from '../../stores/authStore'
import { useLogout } from '../../features/auth/api'
import { formatXeng, givenName } from '../../lib/format'
import Avatar from '../ui/Avatar'
import useDropdown from './useDropdown'
import { accountLinks } from './accountLinks'

export function BellLink({ count }) {
  return (
    // Dưới 380px ẩn chuông cho đủ chỗ (vẫn vào được qua menu tài khoản → Tổng quan)
    <Link to="/me" className="relative p-1.5 text-gray-700 hover:text-primary transition-colors hidden min-[380px]:block" aria-label={`Thông báo, ${count} chưa đọc`}>
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" className="w-6 h-6" aria-hidden="true">
        <path d="M18 8a6 6 0 10-12 0c0 7-3 9-3 9h18s-3-2-3-9" /><path d="M13.73 21a2 2 0 01-3.46 0" />
      </svg>
      {count > 0 && (
        <span className="absolute -top-0.5 -right-0.5 min-w-[18px] h-[18px] px-1 rounded-full bg-accent text-white text-[11px] font-bold flex items-center justify-center">
          {count > 9 ? '9+' : count}
        </span>
      )}
    </Link>
  )
}

export default function UserMenu() {
  const user = useAuthStore((s) => s.user)
  const isTutor = useAuthStore(selectIsTutor)
  const logout = useLogout()
  const navigate = useNavigate()
  const { open, ref, triggerRef, toggle, close } = useDropdown()

  const onLogout = () => {
    close()
    logout.mutate(undefined, { onSettled: () => navigate('/') })
  }

  return (
    <div className="flex items-center gap-2 min-[380px]:gap-3 sm:gap-5">
      <BellLink count={user.unreadNotifications ?? 0} />

      {isTutor && (
        <span className="hidden sm:inline-flex items-center gap-1.5 px-4 py-2 rounded-full bg-accent-soft text-sm font-semibold text-gray-800" title="Số xèng khả dụng">
          <span aria-hidden="true">🪙</span> {formatXeng(user.xengAvailable)}
        </span>
      )}

      <div ref={ref} className="relative">
        <button
          ref={triggerRef}
          type="button"
          onClick={toggle}
          aria-expanded={open}
          aria-haspopup="menu"
          className="flex items-center gap-2 text-sm font-semibold text-gray-800 hover:text-primary"
        >
          <Avatar name={user.fullName} size="w-9 h-9 text-xs" />
          <span className="hidden sm:inline">{givenName(user.fullName)}</span>
          <span className="text-xs hidden min-[380px]:inline" aria-hidden="true">⌄</span>
          <span className="sr-only">Mở menu tài khoản</span>
        </button>

        {open && (
          <div className="fixed sm:absolute left-0 right-0 sm:left-auto sm:right-0 top-[120px] sm:top-full sm:mt-3 sm:w-64 bg-white sm:rounded-xl shadow-xl border border-gray-100 z-50 py-2">
            <div className="px-4 py-2 border-b border-gray-100 mb-1">
              <p className="text-sm font-semibold text-gray-900 truncate">{user.fullName}</p>
              <p className="text-xs text-gray-500 truncate">{user.email}</p>
              {isTutor && <p className="sm:hidden text-xs font-semibold text-gray-700 mt-1">🪙 {formatXeng(user.xengAvailable)}</p>}
            </div>
            <ul>
              {accountLinks({ isTutor, tutorStatus: user.tutorStatus }).map((item) => (
                <li key={item.key}>
                  {item.soon ? (
                    <span className="flex items-center justify-between px-4 py-2 text-sm text-gray-400 cursor-not-allowed" aria-disabled="true">
                      {item.label} <span className="text-[11px]">Sắp có</span>
                    </span>
                  ) : (
                    <Link to={item.to} onClick={close} className="block px-4 py-2 text-sm text-gray-700 hover:bg-primary-soft hover:text-primary">
                      {item.label}
                    </Link>
                  )}
                </li>
              ))}
              <li className="border-t border-gray-100 mt-1 pt-1">
                <button type="button" onClick={onLogout} className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:text-red-600 hover:bg-red-50">
                  Đăng xuất
                </button>
              </li>
            </ul>
          </div>
        )}
      </div>
    </div>
  )
}
