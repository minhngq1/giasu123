// /legal/:type và /safety — văn bản pháp lý hiển thị dạng chữ thuần (không HTML → an toàn XSS).
import { useParams } from 'react-router-dom'
import { LEGAL_DOCS } from '../content'
import { formatDate } from '../../../lib/format'
import PageHeader from '../../../components/common/PageHeader'
import NotFoundPage from '../../misc/NotFoundPage'

export default function LegalPage({ type: fixedType }) {
  const { type = fixedType } = useParams()
  const doc = LEGAL_DOCS[type]
  if (!doc) return <NotFoundPage />

  return (
    <>
      <PageHeader title={doc.title} subtitle={`Phiên bản ${doc.version} · Hiệu lực từ ${formatDate(doc.effectiveAt)}`} crumbs={[{ label: doc.title }]} />
      <section className="py-10 bg-white">
        <article className="max-w-[760px] mx-auto px-4 sm:px-6 space-y-8">
          {doc.sections.map((s) => (
            <section key={s.heading}>
              <h2 className="text-lg font-bold text-gray-900 mb-3">{s.heading}</h2>
              <div className="space-y-2">
                {s.paragraphs.map((p) => <p key={p} className="text-sm text-gray-600 leading-relaxed">{p}</p>)}
              </div>
            </section>
          ))}
          <p className="text-xs text-gray-400 border-t border-gray-100 pt-6">
            Bản demo cho project portfolio — kinh doanh thật cần luật sư soạn thảo nội dung.
          </p>
        </article>
      </section>
    </>
  )
}
