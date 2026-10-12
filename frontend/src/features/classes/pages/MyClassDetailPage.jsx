// /me/classes/:id — Chi tiết lớp của tôi (wireframe 08-frontend.md mục 4.4).
// R1a làm khung trạng thái Chờ duyệt / Bị từ chối / Đang tuyển; các bước sau chỉ hiện trên timeline.
import { useState } from 'react'
import { Link, useParams, useSearchParams } from 'react-router-dom'
import { useMyClass, useCloseClass } from '../api'
import MeShell from '../../../components/common/MeShell'
import ClassTimeline from '../components/ClassTimeline'
import { studentLine, subjectsText, studyModeText, classAreaText, scheduleText, requirementText, classFee } from '../format'
import { CLASS_STATUS, FEE_MODE, labelOf } from '../../../constants/labels'
import { classCode, formatDateTime, formatVnd } from '../../../lib/format'
import { messageOf } from '../../../lib/problem'
import StatusChip from '../../../components/ui/StatusChip'
import Button from '../../../components/ui/Button'
import Modal from '../../../components/ui/Modal'
import Notice from '../../../components/ui/Notice'
import { QueryState, Skeleton } from '../../../components/ui/states'

function StatusPanel({ c }) {
  switch (c.status) {
    case 'PENDING_REVIEW':
      return (
        <Notice tone="info" title="Đang chờ trung tâm duyệt">
          Trung tâm sẽ gọi số {c.contactPhone} để xác nhận thông tin và chốt học phí trong giờ làm việc (thường trong 4 giờ).
          Bạn vẫn sửa được lớp trong lúc chờ.
        </Notice>
      )
    case 'REJECTED':
      return (
        <Notice tone="error" title="Lớp chưa được duyệt">
          <p className="mb-2">Lý do: {c.rejectReason}</p>
          <Link to={`/me/classes/${c.id}/edit`} className="underline font-semibold">Sửa và gửi duyệt lại →</Link>
        </Notice>
      )
    case 'OPEN':
      return (
        <Notice tone="success" title="Lớp đang tuyển gia sư">
          Đã có {c.applicantCount} gia sư ứng tuyển. Khi đủ ứng viên, trung tâm sẽ gửi bạn danh sách 2–3 gia sư phù hợp nhất để chọn.
        </Notice>
      )
    case 'CLOSED':
      return <Notice tone="info" title="Lớp đã đóng">Lớp không còn hiển thị công khai.</Notice>
    default:
      return <Notice tone="info">{labelOf(CLASS_STATUS, c.status)}</Notice>
  }
}

function Row({ label, value }) {
  return (
    <div className="flex flex-col sm:flex-row sm:gap-4 py-2.5 border-b border-gray-50 last:border-0">
      <dt className="sm:w-48 shrink-0 text-sm text-gray-500">{label}</dt>
      <dd className="text-sm font-medium text-gray-900">{value || '—'}</dd>
    </div>
  )
}

export default function MyClassDetailPage() {
  const { id } = useParams()
  const [params] = useSearchParams()
  const query = useMyClass(id)
  const close = useCloseClass()
  const [confirmClose, setConfirmClose] = useState(false)

  const canEdit = (s) => ['PENDING_REVIEW', 'REJECTED'].includes(s)
  const canClose = (s) => ['PENDING_REVIEW', 'REJECTED', 'OPEN', 'SHORTLISTED'].includes(s)

  return (
    <MeShell title={`Lớp ${classCode(id)}`} crumbs={[{ label: 'Lớp của tôi', to: '/me/classes' }, { label: classCode(id) }]}>
      <QueryState query={query} loading={<Skeleton className="h-96 rounded-2xl" />}>
        {(c) => (
          <div className="space-y-6">
            {params.get('created') && (
              <Notice tone="success" title="Đã đăng lớp!">Lớp đang chờ trung tâm gọi xác nhận. Bạn sẽ nhận thông báo khi lớp được duyệt.</Notice>
            )}

            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
              <div className="flex flex-wrap items-start justify-between gap-3 mb-6">
                <div>
                  <h2 className="text-xl font-extrabold text-gray-900">{studentLine(c)}</h2>
                  <p className="text-sm text-gray-500">Đăng lúc {formatDateTime(c.createdAt)}</p>
                </div>
                <StatusChip map={CLASS_STATUS} status={c.status} />
              </div>
              <ClassTimeline status={c.status} />
              <div className="mt-6"><StatusPanel c={c} /></div>

              {(canEdit(c.status) || canClose(c.status)) && (
                <div className="flex flex-wrap gap-3 mt-6">
                  {canEdit(c.status) && <Button as={Link} to={`/me/classes/${c.id}/edit`} variant="secondary">Sửa lớp</Button>}
                  {canClose(c.status) && <Button variant="outline" onClick={() => setConfirmClose(true)}>Đóng lớp</Button>}
                </div>
              )}
            </div>

            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
              <h3 className="font-bold text-gray-900 mb-2">Thông tin lớp</h3>
              <p className="text-xs text-gray-500 mb-4">🔒 Mục có khóa chỉ bạn và gia sư đã nhận lớp nhìn thấy.</p>
              <dl>
                <Row label="Học sinh 🔒" value={`${c.studentName} (hiển thị công khai: ${c.studentDisplayName})`} />
                <Row label="Phụ huynh 🔒" value={c.parentName} />
                <Row label="Số điện thoại 🔒" value={c.contactPhone} />
                <Row label="Môn học" value={subjectsText(c)} />
                <Row label="Hình thức" value={studyModeText(c)} />
                <Row label="Lịch học" value={scheduleText(c)} />
                <Row label="Thời gian mong muốn" value={c.scheduleNote} />
                <Row label="Khu vực" value={classAreaText(c)} />
                <Row label="Địa chỉ 🔒" value={c.addressDetail} />
                <Row label="Học phí đề xuất" value={c.feeMode === 'FIXED' ? `${formatVnd(c.proposedFee)}/buổi` : labelOf(FEE_MODE, c.feeMode)} />
                <Row label="Học phí đã chốt" value={classFee(c)} />
                <Row label="Yêu cầu gia sư" value={requirementText(c)} />
              </dl>
            </div>

            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
              <h3 className="font-bold text-gray-900 mb-4">Lịch sử</h3>
              <ol className="space-y-3">
                {[...c.history].reverse().map((h, i) => (
                  <li key={i} className="flex gap-3 text-sm">
                    <span className="w-2 h-2 mt-1.5 rounded-full bg-primary shrink-0" aria-hidden="true" />
                    <div>
                      <p className="font-medium text-gray-900">{labelOf(CLASS_STATUS, h.toStatus)} <span className="text-gray-400 font-normal">· {formatDateTime(h.at)}</span></p>
                      {h.note && <p className="text-gray-500">{h.note}</p>}
                    </div>
                  </li>
                ))}
              </ol>
            </div>

            <Modal
              open={confirmClose}
              onClose={() => setConfirmClose(false)}
              title="Đóng lớp này?"
              footer={
                <>
                  <Button variant="outline" onClick={() => setConfirmClose(false)}>Không</Button>
                  <Button variant="danger" loading={close.isPending}
                    onClick={() => close.mutate(c.id, { onSuccess: () => setConfirmClose(false) })}>
                    Đóng lớp
                  </Button>
                </>
              }
            >
              Lớp sẽ không còn hiển thị và không nhận ứng tuyển nữa. Bạn có thể đăng lớp mới bất cứ lúc nào.
              {close.isError && <Notice tone="error" className="mt-3">{messageOf(close.error)}</Notice>}
            </Modal>
          </div>
        )}
      </QueryState>
    </MeShell>
  )
}
