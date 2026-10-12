// /me/classes — Lớp của tôi (dữ liệu chủ lớp, có cả lớp chưa duyệt / bị từ chối).
import { Link } from 'react-router-dom'
import { useMyClasses } from '../api'
import ClassCard from '../components/ClassCard'
import MeShell from '../../../components/common/MeShell'
import useUrlFilters from '../../../lib/useUrlFilters'
import Button from '../../../components/ui/Button'
import Pagination from '../../../components/ui/Pagination'
import { QueryState, CardGridSkeleton, EmptyState } from '../../../components/ui/states'
import { CARD_H } from '../../../components/ui/cardHeights'

export default function MyClassesPage() {
  const { page, setPage } = useUrlFilters([])
  const query = useMyClasses({ page, size: 10 })

  return (
    <MeShell title="Lớp của tôi" crumbs={[{ label: 'Lớp của tôi' }]} actions={<Button as={Link} to="/me/classes/new">+ Đăng lớp mới</Button>}>
      <QueryState
        query={query}
        loading={<CardGridSkeleton count={2} cols="md:grid-cols-2" itemClassName={CARD_H.class} />}
        isEmpty={(d) => d.items.length === 0}
        empty={
          <EmptyState icon="📚" title="Bạn chưa đăng lớp nào"
            description="Đăng lớp miễn phí — trung tâm gọi xác nhận, chốt học phí và gửi bạn danh sách gia sư phù hợp."
            action={<Button as={Link} to="/me/classes/new">Đăng lớp đầu tiên</Button>} />
        }
      >
        {(data) => (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {data.items.map((c) => <ClassCard key={c.id} cls={c} to={`/me/classes/${c.id}`} />)}
            </div>
            <Pagination page={data.page} totalPages={data.totalPages} onChange={setPage} />
          </>
        )}
      </QueryState>
    </MeShell>
  )
}
