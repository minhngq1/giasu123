// Nút cho tính năng thuộc lát sau (R1b–R1c): bấm → hộp thoại giải thích, thay vì nút "chết" không phản hồi.
import { useState } from 'react'
import Button from '../ui/Button'
import Modal from '../ui/Modal'

export default function ComingSoonButton({ label, description, ...buttonProps }) {
  const [open, setOpen] = useState(false)
  return (
    <>
      <Button {...buttonProps} onClick={() => setOpen(true)}>{label}</Button>
      <Modal open={open} onClose={() => setOpen(false)} title={`${label} — sắp ra mắt`}
        footer={<Button onClick={() => setOpen(false)}>Đã hiểu</Button>}>
        {description}
      </Modal>
    </>
  )
}
