// Nút dùng chung — kiểu dáng lấy từ UI cũ (pill bo tròn, chữ semibold 14px).
// Dùng `as={Link}` để có giao diện nút nhưng là thẻ <a> (điều hướng).
const VARIANTS = {
  primary: 'bg-primary text-white hover:opacity-90',
  accent: 'bg-accent text-white hover:opacity-90',
  secondary: 'border border-primary text-primary bg-white hover:bg-primary-soft',
  outline: 'border border-gray-200 text-gray-700 bg-white hover:border-gray-300',
  danger: 'bg-red-600 text-white hover:bg-red-700',
  text: 'text-primary hover:underline',
}

const SIZES = {
  sm: 'px-4 py-2 text-sm',
  md: 'px-6 py-2.5 text-sm',
  lg: 'px-8 py-3 text-sm',
}

export default function Button({
  as: Component = 'button',
  variant = 'primary',
  size = 'md',
  loading = false,
  disabled = false,
  className = '',
  children,
  ...props
}) {
  const isButton = Component === 'button'
  return (
    <Component
      {...(isButton ? { type: props.type ?? 'button', disabled: disabled || loading } : {})}
      aria-busy={loading || undefined}
      className={[
        'inline-flex items-center justify-center gap-2 font-semibold rounded-full transition whitespace-nowrap',
        'disabled:opacity-50 disabled:cursor-not-allowed',
        VARIANTS[variant],
        variant === 'text' ? 'px-0 py-0 text-sm' : SIZES[size],
        className,
      ].join(' ')}
      {...props}
    >
      {loading && (
        <span className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin" aria-hidden="true" />
      )}
      {children}
    </Component>
  )
}
