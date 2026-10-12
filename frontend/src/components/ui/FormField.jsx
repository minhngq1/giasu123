// Ô nhập có nhãn + lỗi, đúng chuẩn truy cập (a11y):
//   - <label htmlFor> trỏ đúng id của input → bấm nhãn là focus ô, trình đọc màn hình đọc được nhãn
//   - aria-invalid + aria-describedby → trình đọc màn hình đọc luôn câu báo lỗi
// Cách dùng: <FormField label="Email" required error={errors.email?.message}>
//              {(field) => <Input {...field} {...register('email')} />}
//            </FormField>
import { useId } from 'react'

export const inputCls =
  'w-full border border-gray-200 rounded-lg px-4 py-2.5 text-sm text-gray-700 bg-white placeholder:text-gray-400 ' +
  'focus:outline-none focus:border-primary transition-colors disabled:bg-gray-50 disabled:text-gray-400 ' +
  'aria-[invalid=true]:border-red-400'

export default function FormField({ label, required, error, hint, className = '', children }) {
  const id = useId()
  const errorId = `${id}-error`
  const hintId = `${id}-hint`
  const describedBy = [error && errorId, hint && hintId].filter(Boolean).join(' ') || undefined

  return (
    <div className={`flex flex-col gap-1.5 ${className}`}>
      <label htmlFor={id} className="text-sm font-medium text-gray-700">
        {label}
        {required && <span className="text-red-500 ml-0.5" aria-hidden="true">*</span>}
      </label>
      {children({ id, 'aria-invalid': error ? true : undefined, 'aria-describedby': describedBy, 'aria-required': required || undefined })}
      {hint && !error && <p id={hintId} className="text-xs text-gray-500">{hint}</p>}
      {error && <p id={errorId} className="text-xs text-red-600" role="alert">{error}</p>}
    </div>
  )
}

/**
 * Nhóm lựa chọn (radio/checkbox) — dùng <fieldset><legend> thay vì <label>
 * vì 1 nhãn chung cho nhiều ô.
 */
export function FieldGroup({ legend, required, error, className = '', children }) {
  const errorId = useId()
  return (
    <fieldset className={className} aria-describedby={error ? errorId : undefined}>
      <legend className="text-sm font-medium text-gray-700">
        {legend}
        {required && <span className="text-red-500 ml-0.5" aria-hidden="true">*</span>}
      </legend>
      <div className="mt-2.5">{children}</div>
      {error && <p id={errorId} className="text-xs text-red-600 mt-1.5" role="alert">{error}</p>}
    </fieldset>
  )
}
