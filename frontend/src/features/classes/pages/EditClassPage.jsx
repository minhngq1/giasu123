// /me/classes/:id/edit — Sửa lớp (chỉ khi lớp đang Chờ duyệt hoặc Bị từ chối).
import { Navigate, useNavigate, useParams } from 'react-router-dom'
import { useMyClass, useUpdateClass } from '../api'
import { toFormValues } from '../schemas'
import ClassForm from '../components/ClassForm'
import MeShell from '../../../components/common/MeShell'
import { classCode } from '../../../lib/format'
import { QueryState, Skeleton } from '../../../components/ui/states'

export default function EditClassPage() {
  const { id } = useParams()
  const navigate = useNavigate()
  const query = useMyClass(id)
  const update = useUpdateClass()

  const onSubmit = (body, { onError }) =>
    update.mutate({ id, body }, { onSuccess: () => navigate(`/me/classes/${id}`), onError })

  return (
    <MeShell title={`Sửa lớp ${classCode(id)}`} crumbs={[{ label: 'Lớp của tôi', to: '/me/classes' }, { label: classCode(id), to: `/me/classes/${id}` }, { label: 'Sửa' }]}>
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 lg:p-8">
        <QueryState query={query} loading={<Skeleton className="h-96" />}>
          {(c) =>
            ['PENDING_REVIEW', 'REJECTED'].includes(c.status) ? (
              <ClassForm defaultValues={toFormValues(c)} onSubmit={onSubmit} isPending={update.isPending} serverError={update.error}
                submitLabel={c.status === 'REJECTED' ? 'Lưu và gửi duyệt lại' : 'Lưu thay đổi'} />
            ) : (
              <Navigate to={`/me/classes/${id}`} replace />
            )
          }
        </QueryState>
      </div>
    </MeShell>
  )
}
