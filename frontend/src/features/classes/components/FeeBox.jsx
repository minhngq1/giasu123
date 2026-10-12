// Khung "Phí nhận lớp" (wireframe 08-frontend.md mục 4.3): công thức + số xèng do SERVER tính sẵn (feeEstimate).
import { Link } from 'react-router-dom'
import { formatVnd, formatXeng } from '../../../lib/format'

export default function FeeBox({ cls, children }) {
  const fee = cls.feeEstimate
  return (
    <aside className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 lg:sticky lg:top-36">
      <h2 className="font-bold text-gray-900 mb-4">Phí nhận lớp</h2>
      <dl className="text-sm space-y-2 mb-4">
        <div className="flex justify-between gap-3">
          <dt className="text-gray-500">Học phí</dt>
          <dd className="font-semibold text-gray-900">{formatVnd(cls.approvedFee)}/buổi</dd>
        </div>
        <div className="flex justify-between gap-3">
          <dt className="text-gray-500">Số buổi/tháng</dt>
          <dd className="font-semibold text-gray-900">{cls.sessionsPerWeek} × 4</dd>
        </div>
        {fee && (
          <div className="flex justify-between gap-3">
            <dt className="text-gray-500">Tỷ lệ phí ({cls.studyMode === 'ONLINE' ? 'online' : 'tại nhà'})</dt>
            <dd className="font-semibold text-gray-900">{fee.percent}%</dd>
          </div>
        )}
      </dl>
      {fee && (
        <div className="rounded-xl bg-primary-soft px-4 py-3 mb-4">
          <p className="text-xs text-gray-600">
            {formatVnd(cls.approvedFee)} × {cls.sessionsPerWeek} × 4 × {fee.percent}% =
          </p>
          <p className="text-xl font-extrabold text-primary">{formatXeng(fee.amountXeng)}</p>
          <p className="text-xs text-gray-500">≈ {formatVnd(fee.amountXeng * 1000)} (1 xèng = 1.000đ)</p>
        </div>
      )}
      <p className="text-xs text-gray-500 mb-5">
        Giữ 100% phí khi được chọn, hoàn theo{' '}
        <Link to="/legal/tutor-rules" className="text-primary underline">Nội quy nhận lớp</Link>.
      </p>
      {children}
    </aside>
  )
}
