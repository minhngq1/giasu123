// Hộp thoại dùng thẻ <dialog> gốc của trình duyệt:
//   - showModal() tự bẫy focus bên trong, tự đóng bằng phím Esc, tự làm mờ nền (::backdrop)
//   - không phải tự viết lại logic a11y phức tạp
import { useEffect, useRef } from 'react'

export default function Modal({ open, onClose, title, children, footer }) {
  const ref = useRef(null)

  useEffect(() => {
    const dlg = ref.current
    if (!dlg) return
    if (open && !dlg.open) dlg.showModal?.()
    if (!open && dlg.open) dlg.close?.()
  }, [open])

  return (
    <dialog
      ref={ref}
      onClose={onClose}
      onClick={(e) => e.target === ref.current && onClose()} // bấm ra vùng nền tối → đóng
      aria-labelledby="modal-title"
      className="m-auto w-[calc(100%-2rem)] max-w-[520px] rounded-2xl p-0 shadow-xl backdrop:bg-black/40"
    >
      {open && (
        <div className="p-6">
          <div className="flex items-start justify-between gap-4 mb-4">
            <h2 id="modal-title" className="text-lg font-bold text-gray-900">{title}</h2>
            <button type="button" onClick={onClose} aria-label="Đóng" className="text-gray-400 hover:text-gray-600 text-xl leading-none">×</button>
          </div>
          <div className="text-sm text-gray-600">{children}</div>
          {footer && <div className="mt-6 flex flex-wrap justify-end gap-3">{footer}</div>}
        </div>
      )}
    </dialog>
  )
}
