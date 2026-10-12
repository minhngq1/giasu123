// Các ô nhập cơ bản. Dùng forwardRef-free (React 19 cho phép truyền `ref` như prop thường)
// nên dùng trực tiếp được với react-hook-form: <Input {...register('email')} />
import { useState } from 'react'
import { inputCls } from './FormField'

export function Input({ className = '', ...props }) {
  return <input className={`${inputCls} ${className}`} {...props} />
}

export function Textarea({ className = '', rows = 3, ...props }) {
  return <textarea rows={rows} className={`${inputCls} resize-none ${className}`} {...props} />
}

export function Select({ className = '', placeholder, options = [], ...props }) {
  return (
    <select className={`${inputCls} ${className}`} {...props}>
      {placeholder !== undefined && <option value="">{placeholder}</option>}
      {options.map((o) => (
        <option key={o.value} value={o.value}>{o.label}</option>
      ))}
    </select>
  )
}

/** Ô mật khẩu có nút hiện/ẩn (nút có aria-label + aria-pressed cho trình đọc màn hình). */
export function PasswordInput({ className = '', ...props }) {
  const [show, setShow] = useState(false)
  return (
    <div className="relative">
      <input type={show ? 'text' : 'password'} className={`${inputCls} pr-10 ${className}`} {...props} />
      <button
        type="button"
        onClick={() => setShow((v) => !v)}
        aria-label={show ? 'Ẩn mật khẩu' : 'Hiện mật khẩu'}
        aria-pressed={show}
        className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
      >
        {show ? (
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-4 h-4" aria-hidden="true"><path d="M17.94 17.94A10.07 10.07 0 0112 20c-7 0-11-8-11-8a18.45 18.45 0 015.06-5.94M9.9 4.24A9.12 9.12 0 0112 4c7 0 11 8 11 8a18.5 18.5 0 01-2.16 3.19m-6.72-1.07a3 3 0 11-4.24-4.24" /><line x1="1" y1="1" x2="23" y2="23" /></svg>
        ) : (
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-4 h-4" aria-hidden="true"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" /><circle cx="12" cy="12" r="3" /></svg>
        )}
      </button>
    </div>
  )
}

/** Checkbox / radio kèm nhãn bấm được (nhãn bọc input → không cần id). */
export function Choice({ type = 'checkbox', label, className = '', ...props }) {
  return (
    <label className={`flex items-center gap-2.5 cursor-pointer select-none ${className}`}>
      <input type={type} className="w-4 h-4 accent-primary flex-shrink-0" {...props} />
      <span className="text-sm text-gray-700">{label}</span>
    </label>
  )
}
