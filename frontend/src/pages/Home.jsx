/*
  HOME.JSX — Trang chủ Gia Sư 123
  ========================================
  Layout bám sát thiết kế Figma đã được cung cấp:
    1. HERO          — nền kem, badge + tiêu đề + ô tìm kiếm | hình minh hoạ phải
    2. DANH SÁCH GIA SƯ      — tiêu đề + toggle (Nổi bật / Mới nhất) + grid card
    3. DANH SÁCH HỌC SINH    — grid card + nút "Xem tất cả"
    4. TÌM THEO MÔN & LỚP    — 2 khối pill (gia sư = xanh, học sinh = cam)
    5. THỐNG KÊ      — nền xanh đậm, 4 ô icon tròn cam
    6. CẢM NHẬN      — nền xanh bạc hà, 3 card đánh giá + chấm phân trang
    7. KẾT NỐI       — nền trắng, liên hệ + ô đăng ký email

  Màu chủ đạo : #24725D   |  Cam CTA : #FF6B35
  Font        : Be Vietnam Pro  (index.html + index.css)
  Ảnh         : public/images/* (copy từ assets)
*/

import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import TutorCard  from '../components/tutor/TutorCard'
import StudentCard from '../components/student/StudentCard'

/* ─── Bảng màu dùng xuyên suốt file ─── */
const C = {
  primary : '#24725D', // xanh chủ đạo (gia sư)
  orange  : '#FF6B35', // cam CTA / nhấn
  peach   : '#FFF4EC', // nền kem khối hero
  mint    : '#E3F2EB', // nền bạc hà khối cảm nhận
  dark    : '#15384A', // xanh đậm tiêu đề trên nền sáng
}

/* ─────────────────────────────────────────────────────
   MOCK DATA — dữ liệu giả dùng trước khi kết nối API
   ───────────────────────────────────────────────────── */
const MOCK_TUTORS = [
  { id:'1', fullName:'Nguyễn Thị Hương', subjects:['Toán','Lý','Hóa'],     pricePerHour:150000, district:'Cầu Giấy',  city:'Hà Nội',  experience:5, rating:4.8, isVerified:true  },
  { id:'2', fullName:'Trần Văn Minh',    subjects:['Văn','Sử','Địa'],      pricePerHour:120000, district:'Đống Đa',   city:'Hà Nội',  experience:3, rating:4.6, isVerified:true  },
  { id:'3', fullName:'Lê Thị Lan',       subjects:['Tiếng Anh'],            pricePerHour:200000, district:'Tân Bình',  city:'TP.HCM',  experience:7, rating:4.9, isVerified:true  },
  { id:'4', fullName:'Phạm Quốc Hùng',  subjects:['Toán','Tin'],           pricePerHour:130000, district:'Bình Thạnh',city:'TP.HCM',  experience:4, rating:4.5, isVerified:false },
  { id:'5', fullName:'Đỗ Thị Mai',       subjects:['Sinh','Hóa'],           pricePerHour:140000, district:'Hải Châu',  city:'Đà Nẵng', experience:6, rating:4.7, isVerified:true  },
  { id:'6', fullName:'Vũ Đình Khoa',    subjects:['Lý','Toán','Hóa'],      pricePerHour:160000, district:'Thanh Khê', city:'Đà Nẵng', experience:8, rating:4.9, isVerified:true  },
]

const MOCK_STUDENTS = [
  { id:'1', fullName:'Nguyễn Văn An',  grade:'12', subjects:['Toán','Lý'],       budget:200000, studyMode:'Dạy kèm tại nhà', address:'123 Lý Tự Trọng, Quận 1, TP. Hồ Chí Minh', requirement:'Giáo viên nữ',   district:'Cầu Giấy',  city:'Hà Nội'  },
  { id:'2', fullName:'Trần Thị Bích',  grade:'10', subjects:['Tiếng Anh'],       budget:180000, studyMode:'Học online',      address:'45 Nguyễn Trãi, Đống Đa, Hà Nội',          requirement:'Không yêu cầu',  district:'Đống Đa',   city:'Hà Nội'  },
  { id:'3', fullName:'Lê Quang Đạt',   grade:'11', subjects:['Hóa','Sinh'],      budget:200000, studyMode:'Dạy kèm tại nhà', address:'12 Cộng Hòa, Tân Bình, TP. Hồ Chí Minh',   requirement:'Giáo viên nam',  district:'Tân Bình',  city:'TP.HCM'  },
  { id:'4', fullName:'Phạm Thị Cúc',   grade:'9',  subjects:['Văn','Toán'],      budget:150000, studyMode:'Dạy kèm tại nhà', address:'78 Điện Biên Phủ, Bình Thạnh, TP. HCM',    requirement:'Giáo viên nữ',   district:'Bình Thạnh',city:'TP.HCM'  },
  { id:'5', fullName:'Đinh Văn Long',  grade:'12', subjects:['Toán','Lý','Hóa'], budget:250000, studyMode:'Dạy kèm tại nhà', address:'5 Lê Duẩn, Hải Châu, Đà Nẵng',             requirement:'Giàu kinh nghiệm',district:'Hải Châu', city:'Đà Nẵng' },
  { id:'6', fullName:'Hoàng Thị Mỹ',  grade:'8',  subjects:['Anh','Toán'],       budget:160000, studyMode:'Học online',      address:'90 Hàm Nghi, Thanh Khê, Đà Nẵng',          requirement:'Không yêu cầu',  district:'Thanh Khê', city:'Đà Nẵng' },
]

const SUBJECTS = ['Toán','Lý','Hoá','Sinh','Văn','Tiếng Anh','Sử','Địa','Tin học','GDCD']
const GRADES   = ['Lớp 1','Lớp 2','Lớp 3','Lớp 4','Lớp 5','Lớp 6','Lớp 7','Lớp 8','Lớp 9','Lớp 10','Lớp 11','Lớp 12']

const TESTIMONIALS = [
  { id:1, name:'Lê Thị Phượng', role:'Phụ huynh',        stars:5, content:'Năm nay Trần bước vào lớp 11 nên mẹ Phượng tìm hiểu rất nhiều khóa học cho con. Được chị bạn chia sẻ con chị đang học tại nền tảng tìm gia sư trực tuyến, tìm được gia sư rất ưng ý.' },
  { id:2, name:'Trần Văn Trọng', role:'Học sinh lớp 12', stars:5, content:'Thấy cô kinh nghiệm dày dặn trong giảng dạy, biết nắm bắt tâm lý của học sinh. Thầy luôn cố gắng để động viên, chia sẻ, tạo cú hích để học viên vươn lên trong học tập.' },
  { id:3, name:'Lê Thị Phượng', role:'Phụ huynh',        stars:5, content:'Năm nay Trần bước vào lớp 11 nên mẹ Phượng tìm hiểu rất nhiều khóa học cho con. Được chị bạn chia sẻ con chị đang học tại nền tảng tìm gia sư trực tuyến, tìm được gia sư rất ưng ý.' },
]

/* ─────────────────────────────────────────────────────
   ICON STATS — SVG trắng đặt trong vòng tròn cam
   (dùng currentColor = trắng kế thừa từ <span>)
   ───────────────────────────────────────────────────── */
const STAT_ICONS = {
  tutor: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" className="w-7 h-7">
      <path d="M22 10L12 5 2 10l10 5 10-5z" /><path d="M6 12v5c0 1 2.7 2 6 2s6-1 6-2v-5" />
    </svg>
  ),
  student: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" className="w-7 h-7">
      <circle cx="9" cy="8" r="3" /><path d="M3 20c0-3 2.7-5 6-5s6 2 6 5" /><path d="M16 4a3 3 0 010 6M18 20c0-2-.7-3.6-2-4.5" />
    </svg>
  ),
  connect: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" className="w-7 h-7">
      <path d="M9 11l3 3L22 4" /><path d="M21 12v7a2 2 0 01-2 2H5a2 2 0 01-2-2V5a2 2 0 012-2h11" />
    </svg>
  ),
  register: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" className="w-7 h-7">
      <path d="M3 17l6-6 4 4 7-7" /><path d="M14 7h6v6" />
    </svg>
  ),
}

const STATS = [
  { icon:STAT_ICONS.tutor,    value:'3K+',   label:'Gia sư đã đăng ký'     },
  { icon:STAT_ICONS.student,  value:'27K+',  label:'Học sinh cần tìm gia sư' },
  { icon:STAT_ICONS.connect,  value:'15K+',  label:'Lớp kết nối thành công' },
  { icon:STAT_ICONS.register, value:'102K+', label:'Đăng ký mỗi tháng'     },
]

/* ─────────────────────────────────────────────────────
   COMPONENT CON: Pill (nút chọn môn / lớp)
   ─────────────────────────────────────────────────────
   props:
     - active : đang được chọn hay không
     - color  : 'green' (gia sư) | 'orange' (học sinh)
   ───────────────────────────────────────────────────── */
function Pill({ label, active, color, onClick }) {
  const activeStyle =
    color === 'orange'
      ? { backgroundColor:'#FFF1EA', borderColor:C.orange, color:C.orange }
      : { backgroundColor:'#E8F5F1', borderColor:C.primary, color:C.primary }

  return (
    <button
      onClick={onClick}
      style={active ? activeStyle : undefined}
      className={
        'px-4 py-2 rounded-lg border text-sm font-medium transition-colors ' +
        (active ? '' : 'bg-gray-50 border-gray-200 text-gray-500 hover:bg-gray-100')
      }
    >
      {label}
    </button>
  )
}

/* Hộp icon </> nhỏ đứng trước tiêu đề khối tìm kiếm */
function CodeBadge({ color }) {
  const bg = color === 'orange' ? '#FFF1EA' : '#E8F5F1'
  const fg = color === 'orange' ? C.orange  : C.primary
  return (
    <span
      className="w-9 h-9 rounded-lg flex items-center justify-center font-bold text-sm flex-shrink-0"
      style={{ backgroundColor: bg, color: fg }}
    >
      &lt;/&gt;
    </span>
  )
}

/* ─────────────────────────────────────────────────────
   COMPONENT CHÍNH: Home
   ───────────────────────────────────────────────────── */
export default function Home() {
  const navigate = useNavigate()

  /* Ô tìm kiếm ở hero */
  const [heroQuery, setHeroQuery] = useState('')

  /* Toggle danh sách gia sư: 'featured' (Nổi bật) | 'newest' (Mới nhất) */
  const [tutorSort, setTutorSort] = useState('featured')

  /* Bộ lọc pill — tách riêng cho khối gia sư & khối học sinh */
  const [tutorSubject,   setTutorSubject  ] = useState('Toán')
  const [tutorGrade,     setTutorGrade    ] = useState('Lớp 1')
  const [studentSubject, setStudentSubject] = useState('Toán')
  const [studentGrade,   setStudentGrade  ] = useState('Lớp 1')

  /* Tìm kiếm nhanh từ hero → sang trang gia sư kèm query */
  const handleHeroSearch = () => {
    const p = new URLSearchParams()
    if (heroQuery) p.set('q', heroQuery)
    navigate(`/tutors?${p.toString()}`)
  }

  const handleSearchTutor = () => {
    const p = new URLSearchParams()
    if (tutorSubject) p.set('subject', tutorSubject)
    if (tutorGrade)   p.set('grade',   tutorGrade)
    navigate(`/tutors?${p.toString()}`)
  }

  const handleSearchStudent = () => {
    const p = new URLSearchParams()
    if (studentSubject) p.set('subject', studentSubject)
    if (studentGrade)   p.set('grade',   studentGrade)
    navigate(`/students?${p.toString()}`)
  }

  return (
    <>
      {/* ══════════════════════════════════════════════════════
          1. HERO — nền kem, text + ô tìm kiếm trái | hình phải
          ══════════════════════════════════════════════════════ */}
      <section style={{ backgroundColor: C.peach }} className="relative overflow-hidden">
        {/* Mặt trời line-art trang trí góc trên trái */}
        <img
          src="/images/sun.png"
          alt=""
          aria-hidden="true"
          className="absolute top-6 left-4 w-14 h-14 opacity-50 select-none pointer-events-none"
        />

        <div className="max-w-[1336px] mx-auto px-6 lg:px-12 py-12 lg:py-16">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-12 items-center">

            {/* ── CỘT TRÁI ── */}
            <div>
              {/* Badge chào mừng */}
              <span
                className="inline-block px-4 py-1.5 rounded-full text-xs font-semibold mb-6"
                style={{ backgroundColor:'#FCE7DA', color:C.orange }}
              >
                Chào mừng đến với Gia sư 123
              </span>

              <h1 className="text-[40px] lg:text-[54px] font-extrabold text-gray-900 leading-[1.15] mb-5">
                Học Tập Hăng Say,
                <br />
                Nhập Hội Cao Thủ.
              </h1>

              <p className="text-gray-500 text-base lg:text-[17px] leading-relaxed max-w-[460px] mb-8">
                Kết nối gia sư uy tín với học sinh trên toàn quốc. Đăng ký lớp
                nhanh chóng, dạy &amp; học dễ dàng hơn bao giờ hết.
              </p>

              {/* Ô tìm kiếm dạng pill: icon + input + nút xanh */}
              <div className="flex items-center bg-white rounded-full shadow-md p-2 max-w-[520px]">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-5 h-5 text-gray-400 ml-3 flex-shrink-0">
                  <circle cx="11" cy="11" r="7" /><path d="M21 21l-4-4" />
                </svg>
                <input
                  type="text"
                  value={heroQuery}
                  onChange={(e) => setHeroQuery(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleHeroSearch()}
                  placeholder="Tìm kiếm gia sư hoặc học sinh..."
                  className="flex-1 px-3 py-2 text-sm text-gray-600 bg-transparent focus:outline-none"
                />
                <button
                  onClick={handleHeroSearch}
                  style={{ backgroundColor: C.primary }}
                  className="px-6 py-3 text-white font-semibold rounded-full hover:opacity-90 transition-opacity text-sm whitespace-nowrap flex items-center gap-1"
                >
                  Tìm kiếm
                </button>
              </div>
            </div>

            {/* ── CỘT PHẢI: hình minh hoạ (đã gồm card + chấm trang trí) ── */}
            <div className="flex justify-center lg:justify-end">
              <img
                src="/images/background-bd1.png"
                alt="Gia sư và học sinh"
                className="w-full max-w-[560px] h-auto object-contain"
              />
            </div>

          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════════════════
          2. DANH SÁCH GIA SƯ — tiêu đề + toggle Nổi bật / Mới nhất
          ══════════════════════════════════════════════════════ */}
      <section className="py-14 bg-white">
        <div className="max-w-[1336px] mx-auto px-6 lg:px-12">

          <div className="flex items-center justify-between mb-8">
            <h2 className="text-3xl font-extrabold text-gray-900">Danh sách Gia sư</h2>

            {/* Toggle: nút đang chọn nền cam, nút còn lại chữ xám */}
            <div className="flex items-center gap-2">
              <button
                onClick={() => setTutorSort('featured')}
                style={tutorSort === 'featured' ? { backgroundColor: C.orange } : undefined}
                className={
                  'px-6 py-2.5 rounded-full text-sm font-semibold transition-colors ' +
                  (tutorSort === 'featured' ? 'text-white' : 'text-gray-500 hover:text-gray-700')
                }
              >
                Nổi bật
              </button>
              <button
                onClick={() => setTutorSort('newest')}
                style={tutorSort === 'newest' ? { backgroundColor: C.orange } : undefined}
                className={
                  'px-6 py-2.5 rounded-full text-sm font-semibold transition-colors ' +
                  (tutorSort === 'newest' ? 'text-white' : 'text-gray-500 hover:text-gray-700')
                }
              >
                Mới nhất
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {MOCK_TUTORS.map((tutor) => (
              <TutorCard key={tutor.id} tutor={tutor} />
            ))}
          </div>

          <div className="text-center mt-10">
            <Link
              to="/tutors"
              style={{ backgroundColor: C.primary }}
              className="inline-flex items-center gap-1 px-8 py-3 text-white font-semibold rounded-full hover:opacity-90 transition-opacity text-sm"
            >
              Xem tất cả            </Link>
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════════════════
          3. DANH SÁCH HỌC SINH CẦN GIA SƯ — grid 2 cột
          ══════════════════════════════════════════════════════ */}
      <section className="relative py-14 bg-white overflow-hidden">
        {/* Dấu hoa thị trang trí (theo thiết kế) */}
        <span
          className="absolute top-10 right-10 text-4xl font-bold select-none pointer-events-none hidden lg:block"
          style={{ color: C.primary }}
          aria-hidden="true"
        >
          ✳
        </span>

        <div className="max-w-[1336px] mx-auto px-6 lg:px-12">
          <h2 className="text-3xl font-extrabold text-gray-900 mb-8">
            Danh sách Học sinh cần Gia sư
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {MOCK_STUDENTS.map((student) => (
              <StudentCard key={student.id} student={student} />
            ))}
          </div>

          <div className="text-center mt-10">
            <Link
              to="/students"
              style={{ backgroundColor: C.primary }}
              className="inline-flex items-center gap-1 px-8 py-3 text-white font-semibold rounded-full hover:opacity-90 transition-opacity text-sm"
            >
              Xem tất cả            </Link>
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════════════════
          4. TÌM THEO MÔN & LỚP — 2 khối pill
          ══════════════════════════════════════════════════════ */}
      <section className="py-14 bg-white">
        <div className="max-w-[1336px] mx-auto px-6 lg:px-12 space-y-12">

          {/* Khối 1 — Tìm gia sư (xanh) */}
          <div>
            <div className="flex items-center gap-3 mb-6">
              <CodeBadge color="green" />
              <h3 className="text-2xl font-extrabold text-gray-900">
                Tìm gia sư theo Môn học &amp; Lớp học
              </h3>
            </div>

            <div className="flex flex-wrap gap-3 mb-3">
              {SUBJECTS.map((s) => (
                <Pill
                  key={s}
                  label={s}
                  color="green"
                  active={tutorSubject === s}
                  onClick={() => setTutorSubject(s)}
                />
              ))}
            </div>
            <div className="flex flex-wrap gap-3">
              {GRADES.map((g) => (
                <Pill
                  key={g}
                  label={g}
                  color="green"
                  active={tutorGrade === g}
                  onClick={() => setTutorGrade(g)}
                />
              ))}
            </div>

            <button
              onClick={handleSearchTutor}
              style={{ backgroundColor: C.primary }}
              className="mt-6 inline-flex items-center gap-1 px-8 py-3 text-white font-semibold rounded-full hover:opacity-90 transition-opacity text-sm"
            >
              Tìm gia sư            </button>
          </div>

          {/* Khối 2 — Tìm học sinh (cam) */}
          <div>
            <div className="flex items-center gap-3 mb-6">
              <CodeBadge color="orange" />
              <h3 className="text-2xl font-extrabold text-gray-900">
                Tìm học sinh theo Môn học cần dạy &amp; Lớp học
              </h3>
            </div>

            <div className="flex flex-wrap gap-3 mb-3">
              {SUBJECTS.map((s) => (
                <Pill
                  key={s}
                  label={s}
                  color="orange"
                  active={studentSubject === s}
                  onClick={() => setStudentSubject(s)}
                />
              ))}
            </div>
            <div className="flex flex-wrap gap-3">
              {GRADES.map((g) => (
                <Pill
                  key={g}
                  label={g}
                  color="orange"
                  active={studentGrade === g}
                  onClick={() => setStudentGrade(g)}
                />
              ))}
            </div>

            <button
              onClick={handleSearchStudent}
              style={{ backgroundColor: C.orange }}
              className="mt-6 inline-flex items-center gap-1 px-8 py-3 text-white font-semibold rounded-full hover:opacity-90 transition-opacity text-sm"
            >
              Tìm học sinh            </button>
          </div>

        </div>
      </section>

      {/* ══════════════════════════════════════════════════════
          5. THỐNG KÊ — nền xanh đậm, 4 ô icon tròn cam
          ══════════════════════════════════════════════════════ */}
      <section style={{ backgroundColor: C.primary }} className="py-16">
        <div className="max-w-[1336px] mx-auto px-6 lg:px-12">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-10 text-center text-white">
            {STATS.map((stat) => (
              <div key={stat.label} className="flex flex-col items-center">
                {/* Vòng tròn cam chứa icon trắng */}
                <span
                  className="w-16 h-16 rounded-full flex items-center justify-center text-white mb-4"
                  style={{ backgroundColor: C.orange }}
                >
                  {stat.icon}
                </span>
                <p className="text-3xl lg:text-4xl font-extrabold">{stat.value}</p>
                <p className="text-sm mt-1.5 text-green-100">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════════════════
          6. CẢM NHẬN — nền bạc hà, 3 card + chấm phân trang
          ══════════════════════════════════════════════════════ */}
      <section style={{ backgroundColor: C.mint }} className="py-16">
        <div className="max-w-[1336px] mx-auto px-6 lg:px-12">

          <div className="text-center mb-10">
            <p className="text-sm font-semibold mb-2" style={{ color: C.orange }}>
              ★ Đánh giá của học viên
            </p>
            <h2 className="text-3xl font-extrabold" style={{ color: C.dark }}>
              Cảm nhận của Học sinh và Phụ huynh
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-start">
            {TESTIMONIALS.map((item, idx) => (
              <div
                key={item.id}
                className={
                  'bg-white rounded-2xl p-6 shadow-sm ' +
                  /* Card giữa nhô lên & nổi bật hơn (theo thiết kế) */
                  (idx === 1 ? 'md:-translate-y-4 shadow-lg' : '')
                }
              >
                {/* Sao đánh giá */}
                <div className="flex gap-0.5 mb-4">
                  {Array.from({ length: 5 }, (_, i) => (
                    <span key={i} style={{ color: C.orange }} className="text-base">★</span>
                  ))}
                </div>

                <p className="text-gray-500 text-sm leading-relaxed mb-5">{item.content}</p>

                <div className="flex items-center gap-3">
                  <div
                    className="w-10 h-10 rounded-full flex items-center justify-center text-white text-sm font-bold flex-shrink-0"
                    style={{ backgroundColor: C.primary }}
                  >
                    {item.name.trim().split(' ').pop()[0]}
                  </div>
                  <div>
                    <p className="font-semibold text-gray-800 text-sm">{item.name}</p>
                    <p className="text-xs text-gray-400">{item.role}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Chấm phân trang trang trí */}
          <div className="flex justify-center gap-2 mt-10">
            {[0, 1, 2, 3].map((i) => (
              <span
                key={i}
                className="rounded-full"
                style={{
                  width: i === 0 ? 10 : 8,
                  height: i === 0 ? 10 : 8,
                  backgroundColor: i === 0 ? C.primary : '#B9D8CD',
                }}
              />
            ))}
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════════════════
          7. KẾT NỐI — nền trắng, liên hệ + ô đăng ký email
          ══════════════════════════════════════════════════════ */}
      <section className="py-16 bg-white">
        <div className="max-w-[760px] mx-auto px-6 text-center">

          <h2 className="text-3xl font-extrabold text-gray-900 mb-3">
            Kết nối với Gia Sư 123
          </h2>
          <p className="text-gray-500 text-sm mb-8">
            Để lại Email hoặc liên hệ trực tiếp với chúng tôi để được tư vấn và
            cập nhật các lớp học mới nhất
          </p>

          {/* Liên hệ: điện thoại | email */}
          <div className="flex justify-center items-center gap-6 flex-wrap mb-8">
            <a href="tel:+84912123456" className="flex items-center gap-2 text-gray-700 hover:opacity-80 transition-opacity">
              <img src="/images/phone.png" alt="" className="w-5 h-5 object-contain" />
              <span className="text-sm font-medium">(+84) 912 123 456</span>
            </a>
            <span className="w-px h-5 bg-gray-300" />
            <a href="mailto:info@gmail.com" className="flex items-center gap-2 text-gray-700 hover:opacity-80 transition-opacity">
              <img src="/images/email-icon.png" alt="" className="w-5 h-5 object-contain" />
              <span className="text-sm font-medium">info@gmail.com</span>
            </a>
          </div>

          {/* Ô đăng ký email dạng pill */}
          <div className="flex items-center bg-gray-50 border border-gray-200 rounded-full p-2 max-w-[520px] mx-auto">
            <input
              type="email"
              placeholder="Nhập email của bạn..."
              className="flex-1 px-4 py-2 text-sm text-gray-600 bg-transparent focus:outline-none"
            />
            <button
              style={{ backgroundColor: C.primary }}
              className="px-6 py-2.5 text-white font-semibold rounded-full hover:opacity-90 transition-opacity text-sm whitespace-nowrap flex items-center gap-1"
            >
              Đăng ký            </button>
          </div>

        </div>
      </section>
    </>
  )
}
