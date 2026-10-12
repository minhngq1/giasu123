// Dải tiêu đề đầu trang (nền kem như hero) + breadcrumb.
import { Link } from 'react-router-dom'

export default function PageHeader({ title, subtitle, crumbs = [], children }) {
  return (
    <section className="bg-peach">
      <div className="max-w-site mx-auto px-4 sm:px-6 lg:px-12 py-8 lg:py-10">
        {crumbs.length > 0 && (
          <nav aria-label="Breadcrumb" className="text-sm text-gray-500 mb-3">
            <ol className="flex flex-wrap items-center gap-1.5">
              <li><Link to="/" className="hover:text-primary">Trang chủ</Link></li>
              {crumbs.map((c) => (
                <li key={c.label} className="flex items-center gap-1.5">
                  <span aria-hidden="true">›</span>
                  {c.to ? <Link to={c.to} className="hover:text-primary">{c.label}</Link> : <span aria-current="page" className="text-gray-700">{c.label}</span>}
                </li>
              ))}
            </ol>
          </nav>
        )}
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div>
            <h1 className="text-3xl lg:text-4xl font-extrabold text-gray-900">{title}</h1>
            {subtitle && <p className="text-gray-500 mt-2">{subtitle}</p>}
          </div>
          {children}
        </div>
      </div>
    </section>
  )
}
