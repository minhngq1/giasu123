// Bộ lọc dùng chung cho /tutors và /students. `fields` chọn ô nào hiện.
// Mobile: thu gọn sau nút "Bộ lọc"; desktop: luôn hiện ở cột trái.
import { useState } from 'react'
import { PROVINCES, SUBJECTS, GRADES } from '../../constants/catalog'
import FormField from '../ui/FormField'
import { Input, Select } from '../ui/inputs'
import Button from '../ui/Button'

const MODE_OPTIONS = [
  { value: 'OFFLINE', label: 'Học kèm tại nhà' },
  { value: 'ONLINE', label: 'Học online 1-1' },
]

const FEE_RANGES = [
  { value: '0-150000', label: 'Dưới 150.000đ' },
  { value: '150000-200000', label: '150.000đ – 200.000đ' },
  { value: '200000-250000', label: '200.000đ – 250.000đ' },
  { value: '250000-', label: 'Trên 250.000đ' },
]

export default function ListFilters({ filters, setFilters, clear, activeCount, fields, searchPlaceholder }) {
  const [open, setOpen] = useState(false)
  const [q, setQ] = useState(filters.q)
  const feeValue = filters.minFee || filters.maxFee ? `${filters.minFee || 0}-${filters.maxFee}` : ''

  const onFee = (v) => {
    const [min, max] = v ? v.split('-') : ['', '']
    setFilters({ minFee: min === '0' ? '' : min, maxFee: max })
  }

  return (
    <aside aria-label="Bộ lọc">
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        aria-expanded={open}
        aria-controls="list-filters"
        className="lg:hidden w-full flex items-center justify-between px-4 py-3 bg-white border border-gray-200 rounded-xl text-sm font-semibold text-gray-800 mb-4"
      >
        <span>Bộ lọc {activeCount > 0 && <span className="ml-1 px-2 py-0.5 rounded-full bg-primary text-white text-xs">{activeCount}</span>}</span>
        <span aria-hidden="true">{open ? '▴' : '▾'}</span>
      </button>

      <div id="list-filters" className={`${open ? 'block' : 'hidden'} lg:block bg-white rounded-2xl border border-gray-100 shadow-sm p-5 space-y-4`}>
        <form
          role="search"
          onSubmit={(e) => {
            e.preventDefault()
            setFilters({ q: q.trim() })
          }}
        >
          <FormField label="Từ khóa">
            {(a) => <Input {...a} type="search" value={q} onChange={(e) => setQ(e.target.value)} placeholder={searchPlaceholder} />}
          </FormField>
        </form>

        <FormField label="Tỉnh/ Thành phố">
          {(a) => (
            <Select {...a} value={filters.city} onChange={(e) => setFilters({ city: e.target.value })} placeholder="Tất cả"
              options={PROVINCES.map((p) => ({ value: p, label: p }))} />
          )}
        </FormField>

        <FormField label="Môn học">
          {(a) => (
            <Select {...a} value={filters.subject} onChange={(e) => setFilters({ subject: e.target.value })} placeholder="Tất cả"
              options={SUBJECTS.map((s) => ({ value: s.slug, label: s.name }))} />
          )}
        </FormField>

        {fields.includes('grade') && (
          <FormField label="Lớp">
            {(a) => <Select {...a} value={filters.grade} onChange={(e) => setFilters({ grade: e.target.value })} placeholder="Tất cả" options={GRADES} />}
          </FormField>
        )}

        <FormField label="Hình thức">
          {(a) => <Select {...a} value={filters.mode} onChange={(e) => setFilters({ mode: e.target.value })} placeholder="Tất cả" options={MODE_OPTIONS} />}
        </FormField>

        <FormField label={fields.includes('feePerSession') ? 'Học phí/buổi' : 'Học phí mong muốn'}>
          {(a) => <Select {...a} value={feeValue} onChange={(e) => onFee(e.target.value)} placeholder="Tất cả" options={FEE_RANGES} />}
        </FormField>

        {activeCount > 0 && (
          <Button
            variant="outline"
            size="sm"
            className="w-full"
            onClick={() => {
              setQ('')
              clear()
            }}
          >
            Xóa bộ lọc ({activeCount})
          </Button>
        )}
      </div>
    </aside>
  )
}
