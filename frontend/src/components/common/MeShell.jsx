// Khung chung cho các trang /me/** : tiêu đề + menu tài khoản bên trái (desktop) / thanh cuộn ngang (mobile).
import { NavLink } from 'react-router-dom'
import useAuthStore, { selectIsTutor } from '../../stores/authStore'
import { accountLinks } from './accountLinks'
import PageHeader from './PageHeader'

export default function MeShell({ title, subtitle, crumbs = [], actions, children }) {
  const user = useAuthStore((s) => s.user)
  const isTutor = useAuthStore(selectIsTutor)
  const links = accountLinks({ isTutor, tutorStatus: user?.tutorStatus }).filter((l) => !l.soon)

  return (
    <>
      <PageHeader title={title} subtitle={subtitle} crumbs={[{ label: 'Tài khoản', to: '/me' }, ...crumbs]}>{actions}</PageHeader>
      <section className="py-8 lg:py-10 bg-gray-50">
        <div className="max-w-site mx-auto px-4 sm:px-6 lg:px-12 grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8">
          <nav aria-label="Menu tài khoản" className="lg:col-span-3">
            <ul className="flex lg:flex-col gap-2 overflow-x-auto pb-1 lg:pb-0 lg:bg-white lg:rounded-2xl lg:border lg:border-gray-100 lg:p-3">
              {links.map((l) => (
                <li key={l.key} className="shrink-0">
                  <NavLink
                    to={l.to}
                    end
                    className={({ isActive }) =>
                      `block px-4 py-2.5 rounded-xl text-sm font-medium whitespace-nowrap ${
                        isActive ? 'bg-primary-soft text-primary font-semibold' : 'bg-white lg:bg-transparent text-gray-700 hover:bg-gray-50'
                      }`
                    }
                  >
                    {l.label}
                  </NavLink>
                </li>
              ))}
            </ul>
          </nav>
          <div className="lg:col-span-9 min-w-0">{children}</div>
        </div>
      </section>
    </>
  )
}
