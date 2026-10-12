import { describe, it, expect, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import FormField from './FormField'
import { Input, PasswordInput } from './inputs'
import { QueryState, EmptyState } from './states'
import { ApiError } from '../../lib/problem'

describe('FormField', () => {
  it('label gắn đúng input → tìm được ô bằng tên nhãn', () => {
    render(<FormField label="Email" required>{(f) => <Input {...f} />}</FormField>)
    expect(screen.getByLabelText(/Email/)).toBeInstanceOf(HTMLInputElement)
  })

  it('có lỗi → aria-invalid + trình đọc màn hình đọc được câu lỗi', () => {
    render(<FormField label="Email" error="Email không hợp lệ">{(f) => <Input {...f} />}</FormField>)
    const input = screen.getByLabelText('Email')
    expect(input).toHaveAttribute('aria-invalid', 'true')
    expect(input).toHaveAccessibleDescription('Email không hợp lệ')
  })
})

describe('PasswordInput', () => {
  it('nút con mắt có tên và đổi kiểu ô', async () => {
    render(<FormField label="Mật khẩu">{(f) => <PasswordInput {...f} />}</FormField>)
    const input = screen.getByLabelText('Mật khẩu')
    expect(input).toHaveAttribute('type', 'password')
    await userEvent.click(screen.getByRole('button', { name: 'Hiện mật khẩu' }))
    expect(input).toHaveAttribute('type', 'text')
  })
})

describe('QueryState — đủ 3 trạng thái', () => {
  const renderWith = (query) =>
    render(
      <QueryState query={query} loading={<p>đang tải</p>} isEmpty={(d) => d.length === 0} empty={<EmptyState title="Trống" />}>
        {(d) => <p>có {d.length} mục</p>}
      </QueryState>,
    )

  it('loading', () => {
    renderWith({ isPending: true })
    expect(screen.getByText('đang tải')).toBeInTheDocument()
  })

  it('lỗi → có thông báo + nút Thử lại gọi refetch', async () => {
    const refetch = vi.fn()
    renderWith({ isPending: false, isError: true, error: new ApiError({ status: 500, detail: 'Máy chủ lỗi' }), refetch })
    expect(screen.getByText('Máy chủ lỗi')).toBeInTheDocument()
    await userEvent.click(screen.getByRole('button', { name: 'Thử lại' }))
    expect(refetch).toHaveBeenCalled()
  })

  it('rỗng', () => {
    renderWith({ isPending: false, isError: false, data: [] })
    expect(screen.getByText('Trống')).toBeInTheDocument()
  })

  it('có dữ liệu', () => {
    renderWith({ isPending: false, isError: false, data: [1, 2] })
    expect(screen.getByText('có 2 mục')).toBeInTheDocument()
  })
})
