// Hook đóng/mở dropdown: bấm ra ngoài → đóng, phím Esc → đóng và trả focus về nút mở.
import { useEffect, useRef, useState } from 'react'

export default function useDropdown() {
  const [open, setOpen] = useState(false)
  const ref = useRef(null) // bọc cả nút + panel
  const triggerRef = useRef(null)

  useEffect(() => {
    if (!open) return
    const onPointer = (e) => {
      if (ref.current && !ref.current.contains(e.target)) setOpen(false)
    }
    const onKey = (e) => {
      if (e.key === 'Escape') {
        setOpen(false)
        triggerRef.current?.focus()
      }
    }
    document.addEventListener('mousedown', onPointer)
    document.addEventListener('keydown', onKey)
    return () => {
      document.removeEventListener('mousedown', onPointer)
      document.removeEventListener('keydown', onKey)
    }
  }, [open])

  return {
    open,
    ref,
    triggerRef,
    toggle: () => setOpen((v) => !v),
    close: () => setOpen(false),
  }
}
