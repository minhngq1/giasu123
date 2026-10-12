// Panel menu cho màn hình < 1024px: cùng nội dung với menu desktop, xếp dọc.
// Tỉnh/Môn dùng <details> gốc của HTML → đóng/mở bằng bàn phím có sẵn, không cần state.
import { Link, NavLink } from 'react-router-dom'
import { PROVINCE_ITEMS, SUBJECT_ITEMS } from './menuItems'

const rowCls = 'flex items-center justify-between px-4 py-3 text-sm font-medium text-gray-700 rounded-lg hover:bg-primary-soft hover:text-primary'

function Group({ label, items, grid }) {
  return (
    <details className="group">
      <summary className={`${rowCls} cursor-pointer list-none`}>
        {label}
        <span className="text-xs transition-transform group-open:rotate-180" aria-hidden="true">⌄</span>
      </summary>
      <ul className={grid ? 'grid grid-cols-2 gap-1 px-2 pb-2' : 'max-h-64 overflow-y-auto px-2 pb-2'}>
        {items.map((item) => (
          <li key={item.key}>
            <Link to={item.to} className="block px-3 py-2 text-sm text-gray-600 rounded-lg hover:bg-primary-soft hover:text-primary">
              {item.label}
            </Link>
          </li>
        ))}
      </ul>
    </details>
  )
}

export default function MobileMenu({ isLoggedIn }) {
  const navCls = ({ isActive }) => `${rowCls} ${isActive ? 'text-primary font-semibold bg-primary-soft' : ''}`

  return (
    <div id="mobile-menu" className="lg:hidden border-t border-gray-100 bg-white max-h-[calc(100vh-120px)] overflow-y-auto">
      <div className="max-w-site mx-auto px-2 sm:px-4 py-3 space-y-1">
        <Group label="Tỉnh/ Thành phố" items={PROVINCE_ITEMS} />
        <Group label="Môn học" items={SUBJECT_ITEMS} grid />
        <NavLink to="/tutors" className={navCls}>Danh sách Gia sư</NavLink>
        <NavLink to="/students" className={navCls}>Học sinh cần Gia sư</NavLink>

        {!isLoggedIn && (
          <div className="flex gap-3 px-2 pt-3 border-t border-gray-100 mt-2">
            <Link to="/login" className="flex-1 text-center px-6 py-2.5 border border-primary text-primary text-sm font-semibold rounded-full">
              Đăng nhập
            </Link>
            <Link to="/register-tutor" className="flex-1 text-center px-6 py-2.5 bg-primary text-white text-sm font-semibold rounded-full">
              Đăng ký
            </Link>
          </div>
        )}
      </div>
    </div>
  )
}
