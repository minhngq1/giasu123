// Dropdown điều hướng (nút + danh sách link). Giữ nguyên kiểu dáng dropdown đã duyệt của Navbar.
//   placement 'down' (Navbar) | 'up' (Footer — mở lên trên vì nằm cuối trang)
import { useId } from 'react'
import { Link } from 'react-router-dom'
import useDropdown from './useDropdown'

export default function NavDropdown({ label, items, panelClassName = 'w-56 max-h-72 overflow-y-auto', placement = 'down', buttonClassName = '' }) {
  const { open, ref, triggerRef, toggle, close } = useDropdown()
  const panelId = useId()

  const position = placement === 'up' ? 'bottom-full mb-3' : 'top-full mt-3'

  return (
    <div ref={ref} className="relative">
      <button
        ref={triggerRef}
        type="button"
        onClick={toggle}
        aria-expanded={open}
        aria-controls={panelId}
        className={`flex items-center gap-1 text-sm font-medium transition-colors ${
          open ? 'text-primary' : 'text-gray-700 hover:text-primary'
        } ${buttonClassName}`}
      >
        {label}
        <span
          className="text-xs transition-transform duration-200"
          style={{ display: 'inline-block', transform: open ? 'rotate(180deg)' : 'rotate(0deg)' }}
          aria-hidden="true"
        >
          ⌄
        </span>
      </button>

      {open && (
        <ul id={panelId} className={`absolute ${position} left-0 bg-white rounded-xl shadow-xl border border-gray-100 z-50 py-1.5 text-left ${panelClassName}`}>
          {items.map((item) => (
            <li key={item.key}>
              <Link
                to={item.to}
                onClick={close}
                className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-primary-soft hover:text-primary transition-colors"
              >
                {item.label}
              </Link>
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}
