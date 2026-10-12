// /students — "Học sinh cần Gia sư" = danh sách LỚP đang tuyển (chỉ thông tin công khai).
import useUrlFilters from '../../../lib/useUrlFilters'
import { useClasses } from '../api'
import ClassCard from '../components/ClassCard'
import ListFilters from '../../../components/common/ListFilters'
import PageHeader from '../../../components/common/PageHeader'
import Pagination from '../../../components/ui/Pagination'
import Button from '../../../components/ui/Button'
import { Select } from '../../../components/ui/inputs'
import { QueryState, CardGridSkeleton, EmptyState } from '../../../components/ui/states'
import { CARD_H } from '../../../components/ui/cardHeights'

const KEYS = ['q', 'city', 'subject', 'grade', 'mode', 'minFee', 'maxFee', 'sort']
const SORTS = [
  { value: 'newest', label: 'Mới nhất' },
  { value: 'feeDesc', label: 'Học phí cao → thấp' },
  { value: 'feeAsc', label: 'Học phí thấp → cao' },
]

export default function ClassListPage() {
  const { filters, page, setFilters, setPage, clear, activeCount } = useUrlFilters(KEYS)
  const query = useClasses({ ...filters, page, size: 10 })

  return (
    <>
      <PageHeader
        title="Học sinh cần Gia sư"
        subtitle="Lớp đã được trung tâm gọi xác nhận và chốt học phí. Thông tin liên hệ chỉ mở khi bạn nhận lớp."
        crumbs={[{ label: 'Học sinh cần Gia sư' }]}
      />

      <section className="py-10 bg-gray-50">
        <div className="max-w-site mx-auto px-4 sm:px-6 lg:px-12 grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8">
          <div className="lg:col-span-3">
            <ListFilters filters={filters} setFilters={setFilters} clear={clear} activeCount={activeCount}
              fields={['grade', 'feePerSession']} searchPlaceholder="Môn học, quận, yêu cầu..." />
          </div>

          <div className="lg:col-span-9">
            <div className="flex flex-wrap items-center justify-between gap-3 mb-5">
              <p className="text-sm text-gray-600" aria-live="polite">
                {query.data ? <>Có <strong className="text-gray-900">{query.data.totalItems}</strong> lớp đang tuyển</> : 'Đang tìm…'}
              </p>
              <label className="flex items-center gap-2 text-sm text-gray-600">
                Sắp xếp
                <Select className="w-auto! py-2!" value={filters.sort || 'newest'} onChange={(e) => setFilters({ sort: e.target.value === 'newest' ? '' : e.target.value })} options={SORTS} />
              </label>
            </div>

            <QueryState
              query={query}
              loading={<CardGridSkeleton count={4} cols="md:grid-cols-2" itemClassName={CARD_H.class} />}
              isEmpty={(d) => d.items.length === 0}
              empty={
                <EmptyState
                  title="Chưa có lớp phù hợp"
                  description="Thử bỏ bớt bộ lọc. Lớp mới được duyệt mỗi ngày."
                  action={activeCount > 0 && <Button variant="outline" onClick={clear}>Xóa bộ lọc</Button>}
                />
              }
            >
              {(data) => (
                <>
                  <div className={`grid grid-cols-1 md:grid-cols-2 gap-6 transition-opacity ${query.isPlaceholderData ? 'opacity-60' : ''}`}>
                    {data.items.map((c) => <ClassCard key={c.id} cls={c} />)}
                  </div>
                  <Pagination page={data.page} totalPages={data.totalPages} onChange={setPage} />
                </>
              )}
            </QueryState>
          </div>
        </div>
      </section>
    </>
  )
}
