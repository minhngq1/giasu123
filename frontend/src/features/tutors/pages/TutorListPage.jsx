// /tutors — Danh sách gia sư đã xác minh: lọc (đồng bộ URL), sắp xếp, phân trang, đủ 3 trạng thái.
import { Link } from 'react-router-dom'
import useUrlFilters from '../../../lib/useUrlFilters'
import { useTutors } from '../api'
import TutorCard from '../components/TutorCard'
import ListFilters from '../../../components/common/ListFilters'
import PageHeader from '../../../components/common/PageHeader'
import Pagination from '../../../components/ui/Pagination'
import Button from '../../../components/ui/Button'
import { Select } from '../../../components/ui/inputs'
import { QueryState, CardGridSkeleton, EmptyState } from '../../../components/ui/states'
import { CARD_H } from '../../../components/ui/cardHeights'

const KEYS = ['q', 'city', 'subject', 'grade', 'mode', 'minFee', 'maxFee', 'sort']
const SORTS = [
  { value: 'featured', label: 'Nổi bật' },
  { value: 'newest', label: 'Mới xác minh' },
  { value: 'feeAsc', label: 'Học phí thấp → cao' },
  { value: 'feeDesc', label: 'Học phí cao → thấp' },
]

export default function TutorListPage() {
  const { filters, page, setFilters, setPage, clear, activeCount } = useUrlFilters(KEYS)
  const query = useTutors({ ...filters, page, size: 9 })

  return (
    <>
      <PageHeader title="Danh sách Gia sư" subtitle="Gia sư đã được trung tâm xác minh giấy tờ và hồ sơ." crumbs={[{ label: 'Danh sách Gia sư' }]} />

      <section className="py-10 bg-gray-50">
        <div className="max-w-site mx-auto px-4 sm:px-6 lg:px-12 grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8">
          <div className="lg:col-span-3">
            <ListFilters filters={filters} setFilters={setFilters} clear={clear} activeCount={activeCount}
              fields={['grade']} searchPlaceholder="Tên gia sư, môn học..." />
          </div>

          <div className="lg:col-span-9">
            <div className="flex flex-wrap items-center justify-between gap-3 mb-5">
              <p className="text-sm text-gray-600" aria-live="polite">
                {query.data ? <>Tìm thấy <strong className="text-gray-900">{query.data.totalItems}</strong> gia sư</> : 'Đang tìm…'}
              </p>
              <label className="flex items-center gap-2 text-sm text-gray-600">
                Sắp xếp
                <Select className="w-auto! py-2!" value={filters.sort || 'featured'} onChange={(e) => setFilters({ sort: e.target.value === 'featured' ? '' : e.target.value })} options={SORTS} />
              </label>
            </div>

            <QueryState
              query={query}
              loading={<CardGridSkeleton count={6} cols="sm:grid-cols-2 xl:grid-cols-3" itemClassName={CARD_H.tutor} />}
              isEmpty={(d) => d.items.length === 0}
              empty={
                <EmptyState
                  title="Không tìm thấy gia sư phù hợp"
                  description="Thử bỏ bớt bộ lọc, hoặc đăng lớp để gia sư phù hợp chủ động ứng tuyển."
                  action={
                    <div className="flex flex-wrap justify-center gap-3">
                      {activeCount > 0 && <Button variant="outline" onClick={clear}>Xóa bộ lọc</Button>}
                      <Button as={Link} to="/me/classes/new">Đăng lớp miễn phí</Button>
                    </div>
                  }
                />
              }
            >
              {(data) => (
                <>
                  <div className={`grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6 transition-opacity ${query.isPlaceholderData ? 'opacity-60' : ''}`}>
                    {data.items.map((t) => <TutorCard key={t.id} tutor={t} />)}
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
