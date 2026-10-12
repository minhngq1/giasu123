/*
  HOMEPAGE — Trang chủ Gia Sư 123 (giữ nguyên bố cục đã duyệt)
    1. HERO              — nền kem, badge + tiêu đề + ô tìm kiếm | hình minh hoạ phải
    2. DANH SÁCH GIA SƯ  — tiêu đề + toggle (Nổi bật / Mới nhất) + grid card   ← useTutors
    3. LỚP CẦN GIA SƯ    — grid 2 cột ClassCard                               ← useClasses
    4. TÌM THEO MÔN & LỚP — 2 khối pill (gia sư = xanh, học sinh = cam)
    5. THỐNG KÊ          — StatsSection (dùng chung)
    6. CẢM NHẬN          — slider: chấm bấm được, mobile vuốt ngang
    7. KẾT NỐI           — ConnectSection (dùng chung)
*/
import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { SUBJECTS, GRADES } from '../../../constants/catalog'
import { useTutors } from '../../tutors/api'
import { useClasses } from '../../classes/api'
import TutorCard from '../../tutors/components/TutorCard'
import ClassCard from '../../classes/components/ClassCard'
import { QueryState, CardGridSkeleton, EmptyState } from '../../../components/ui/states'
import { CARD_H } from '../../../components/ui/cardHeights'
import StatsSection from '../../../components/common/StatsSection'
import ConnectSection from '../../../components/common/ConnectSection'
import Testimonials from '../components/Testimonials'

/* Pill chọn môn / lớp — aria-pressed cho trình đọc màn hình biết đang chọn */
function Pill({ label, active, color, onClick }) {
  const activeCls =
    color === 'orange' ? 'bg-accent-soft border-accent text-accent' : 'bg-primary-soft border-primary text-primary'
  return (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={active}
      className={
        'px-4 py-2 rounded-lg border text-sm font-medium transition-colors ' +
        (active ? activeCls : 'bg-gray-50 border-gray-200 text-gray-500 hover:bg-gray-100')
      }
    >
      {label}
    </button>
  )
}

/* Hộp icon </> nhỏ đứng trước tiêu đề khối tìm kiếm */
function CodeBadge({ color }) {
  const cls = color === 'orange' ? 'bg-accent-soft text-accent' : 'bg-primary-soft text-primary'
  return (
    <span className={`w-9 h-9 rounded-lg flex items-center justify-center font-bold text-sm flex-shrink-0 ${cls}`} aria-hidden="true">
      &lt;/&gt;
    </span>
  )
}

const SORT_TABS = [
  { key: 'featured', label: 'Nổi bật' },
  { key: 'newest', label: 'Mới nhất' },
]

function SearchBlock({ color, title, subject, grade, onSubject, onGrade, onSearch, buttonLabel }) {
  return (
    <div>
      <div className="flex items-center gap-3 mb-6">
        <CodeBadge color={color} />
        <h3 className="text-xl sm:text-2xl font-extrabold text-gray-900">{title}</h3>
      </div>
      <div className="flex flex-wrap gap-3 mb-3" role="group" aria-label="Chọn môn học">
        {SUBJECTS.map((s) => (
          <Pill key={s.slug} label={s.name} color={color} active={subject === s.slug} onClick={() => onSubject(s.slug)} />
        ))}
      </div>
      <div className="flex flex-wrap gap-3" role="group" aria-label="Chọn lớp">
        {GRADES.map((g) => (
          <Pill key={g.value} label={g.label} color={color} active={grade === g.value} onClick={() => onGrade(g.value)} />
        ))}
      </div>
      <button
        type="button"
        onClick={onSearch}
        className={`mt-6 inline-flex items-center gap-1 px-8 py-3 text-white font-semibold rounded-full hover:opacity-90 transition-opacity text-sm ${
          color === 'orange' ? 'bg-accent' : 'bg-primary'
        }`}
      >
        {buttonLabel}
      </button>
    </div>
  )
}

export default function HomePage() {
  const navigate = useNavigate()

  const [heroQuery, setHeroQuery] = useState('')
  const [tutorSort, setTutorSort] = useState('featured')

  const [tutorSubject, setTutorSubject] = useState('toan')
  const [tutorGrade, setTutorGrade] = useState(1)
  const [studentSubject, setStudentSubject] = useState('toan')
  const [studentGrade, setStudentGrade] = useState(1)

  const tutors = useTutors({ sort: tutorSort, size: 6 })
  const classes = useClasses({ sort: 'newest', size: 6 })

  const go = (path, params) => navigate(`${path}?${new URLSearchParams(params).toString()}`)

  const onHeroSearch = (e) => {
    e.preventDefault()
    go('/tutors', heroQuery.trim() ? { q: heroQuery.trim() } : {})
  }

  return (
    <>
      {/* ══════════ 1. HERO ══════════ */}
      <section className="relative overflow-hidden bg-peach">
        <img src="/images/sun.png" alt="" aria-hidden="true"
          className="absolute top-6 left-4 w-14 h-14 opacity-50 select-none pointer-events-none" />

        <div className="max-w-site mx-auto px-4 sm:px-6 lg:px-12 py-12 lg:py-16">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-12 items-center">
            <div>
              <span className="inline-block px-4 py-1.5 rounded-full text-xs font-semibold mb-6 bg-accent-badge text-accent">
                Chào mừng đến với Gia sư 123
              </span>

              <h1 className="text-[40px] lg:text-[54px] font-extrabold text-gray-900 leading-[1.15] mb-5">
                Học Tập Hăng Say,
                <br />
                Nhập Hội Cao Thủ.
              </h1>

              <p className="text-gray-600 text-base lg:text-[17px] leading-relaxed max-w-[460px] mb-8">
                Kết nối gia sư uy tín với học sinh trên toàn quốc. Đăng ký lớp
                nhanh chóng, dạy &amp; học dễ dàng hơn bao giờ hết.
              </p>

              {/* Ô tìm kiếm dạng pill: <form> → Enter hoặc bấm nút đều tìm */}
              <form onSubmit={onHeroSearch} role="search" className="flex items-center bg-white rounded-full shadow-md p-1.5 max-w-[520px]">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-5 h-5 text-gray-400 ml-3 flex-shrink-0" aria-hidden="true">
                  <circle cx="11" cy="11" r="7" /><path d="M21 21l-4-4" />
                </svg>
                <label htmlFor="hero-search" className="sr-only">Tìm gia sư</label>
                <input
                  id="hero-search"
                  type="search"
                  value={heroQuery}
                  onChange={(e) => setHeroQuery(e.target.value)}
                  placeholder="Tìm gia sư theo tên, môn học..."
                  className="flex-1 min-w-0 px-3 py-2 text-sm text-gray-600 bg-transparent focus:outline-none"
                />
                <button type="submit" className="h-12 px-7 bg-primary text-white font-semibold rounded-full hover:opacity-90 transition-opacity text-sm whitespace-nowrap">
                  Tìm kiếm
                </button>
              </form>
            </div>

            <div className="flex justify-center lg:justify-end">
              {/* <picture> phải có bề rộng cố định: nếu không, trong flex nó rộng 0 cho tới khi ảnh tải xong
                  → width/height của <img> không giữ chỗ được → nội dung bên dưới bị đẩy xuống (CLS). */}
              <picture className="block w-full max-w-[560px]">
                <source srcSet="/images/background-bd1.webp" type="image/webp" />
                <img
                  src="/images/background-bd1.png"
                  alt="Gia sư và học sinh"
                  width="792"
                  height="602"
                  fetchPriority="high"
                  className="block w-full h-auto object-contain"
                />
              </picture>
            </div>
          </div>
        </div>
      </section>

      {/* ══════════ 2. DANH SÁCH GIA SƯ ══════════ */}
      <section className="py-14 bg-white">
        <div className="max-w-site mx-auto px-4 sm:px-6 lg:px-12">
          <div className="flex flex-wrap items-center justify-between gap-4 mb-8">
            <h2 className="text-3xl font-extrabold text-gray-900">Danh sách Gia sư</h2>
            <div className="flex items-center gap-2" role="group" aria-label="Sắp xếp gia sư">
              {SORT_TABS.map((t) => (
                <button
                  key={t.key}
                  type="button"
                  onClick={() => setTutorSort(t.key)}
                  aria-pressed={tutorSort === t.key}
                  className={
                    'px-6 py-2.5 rounded-full text-sm font-semibold transition-colors ' +
                    (tutorSort === t.key ? 'bg-accent text-white' : 'text-gray-500 hover:text-gray-700')
                  }
                >
                  {t.label}
                </button>
              ))}
            </div>
          </div>

          <QueryState
            query={tutors}
            loading={<CardGridSkeleton count={6} itemClassName={CARD_H.tutor} />}
            isEmpty={(d) => d.items.length === 0}
            empty={<EmptyState title="Chưa có gia sư nào" description="Các gia sư đã xác minh sẽ hiện ở đây." />}
          >
            {(data) => (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {data.items.map((t) => <TutorCard key={t.id} tutor={t} />)}
              </div>
            )}
          </QueryState>

          <div className="text-center mt-10">
            <Link to="/tutors" className="inline-flex items-center gap-1 px-8 py-3 bg-primary text-white font-semibold rounded-full hover:opacity-90 transition-opacity text-sm">
              Xem tất cả
            </Link>
          </div>
        </div>
      </section>

      {/* ══════════ 3. LỚP CẦN GIA SƯ ══════════ */}
      <section className="relative py-14 bg-white overflow-hidden">
        <span className="absolute top-10 right-10 text-4xl font-bold select-none pointer-events-none hidden lg:block text-primary" aria-hidden="true">
          ✳
        </span>

        <div className="max-w-site mx-auto px-4 sm:px-6 lg:px-12">
          <h2 className="text-3xl font-extrabold text-gray-900 mb-8">Danh sách Học sinh cần Gia sư</h2>

          <QueryState
            query={classes}
            loading={<CardGridSkeleton count={6} cols="md:grid-cols-2" itemClassName={CARD_H.class} />}
            isEmpty={(d) => d.items.length === 0}
            empty={<EmptyState title="Chưa có lớp đang tuyển" description="Lớp mới sẽ hiện ở đây sau khi được duyệt." />}
          >
            {(data) => (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {data.items.map((c) => <ClassCard key={c.id} cls={c} />)}
              </div>
            )}
          </QueryState>

          <div className="text-center mt-10">
            <Link to="/students" className="inline-flex items-center gap-1 px-8 py-3 bg-primary text-white font-semibold rounded-full hover:opacity-90 transition-opacity text-sm">
              Xem tất cả
            </Link>
          </div>
        </div>
      </section>

      {/* ══════════ 4. TÌM THEO MÔN & LỚP ══════════ */}
      <section className="py-14 bg-white">
        <div className="max-w-site mx-auto px-4 sm:px-6 lg:px-12 space-y-12">
          <SearchBlock
            color="green"
            title="Tìm gia sư theo Môn học & Lớp học"
            subject={tutorSubject}
            grade={tutorGrade}
            onSubject={setTutorSubject}
            onGrade={setTutorGrade}
            onSearch={() => go('/tutors', { subject: tutorSubject, grade: tutorGrade })}
            buttonLabel="Tìm gia sư"
          />
          <SearchBlock
            color="orange"
            title="Tìm học sinh theo Môn học cần dạy & Lớp học"
            subject={studentSubject}
            grade={studentGrade}
            onSubject={setStudentSubject}
            onGrade={setStudentGrade}
            onSearch={() => go('/students', { subject: studentSubject, grade: studentGrade })}
            buttonLabel="Tìm học sinh"
          />
        </div>
      </section>

      {/* ══════════ 5. THỐNG KÊ ══════════ */}
      <StatsSection />

      {/* ══════════ 6. CẢM NHẬN ══════════ */}
      <Testimonials />

      {/* ══════════ 7. KẾT NỐI ══════════ */}
      <ConnectSection />
    </>
  )
}
