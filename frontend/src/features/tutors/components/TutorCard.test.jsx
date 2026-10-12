import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import TutorCard from './TutorCard'

const tutor = {
  id: 1, fullName: 'Nguyễn Thị Hương', avatarUrl: null, subjects: [{ id: 1, name: 'Toán' }], experienceYears: 5,
  provinceName: 'Hà Nội', areaNames: ['Cầu Giấy'], teachesOnline: true, teachesOffline: true, expectedFee: 150000, verified: true,
}
const renderCard = (t) => render(<MemoryRouter><TutorCard tutor={t} /></MemoryRouter>)

describe('TutorCard với dữ liệu backend R1', () => {
  it('rating null (chưa có đánh giá) → không crash, hiện "Gia sư mới"', () => {
    renderCard({ ...tutor, rating: null })
    expect(screen.getByText('Gia sư mới')).toBeInTheDocument()
  })
  it('có rating → hiện sao', () => {
    renderCard({ ...tutor, rating: 4.8 })
    expect(screen.getByRole('img', { name: 'Đánh giá 4.8 trên 5' })).toBeInTheDocument()
  })
  it('giá hiển thị theo định dạng Việt Nam', () => {
    renderCard({ ...tutor, rating: null })
    expect(screen.getByText('150.000đ/ giờ')).toBeInTheDocument()
  })
})
