import { useState } from 'react'

const C = { primary: '#24725D', orange: '#FF6B35' }

const PROVINCES = [
  'Hà Nội','TP. Hồ Chí Minh','Đà Nẵng','Hải Phòng','Cần Thơ',
  'An Giang','Bà Rịa - Vũng Tàu','Bắc Giang','Bắc Kạn','Bạc Liêu',
  'Bắc Ninh','Bến Tre','Bình Định','Bình Dương','Bình Phước',
  'Bình Thuận','Cà Mau','Cao Bằng','Đắk Lắk','Đắk Nông',
  'Điện Biên','Đồng Nai','Đồng Tháp','Gia Lai','Hà Giang',
  'Hà Nam','Hà Tĩnh','Hải Dương','Hậu Giang','Hòa Bình',
  'Hưng Yên','Khánh Hòa','Kiên Giang','Kon Tum','Lai Châu',
  'Lâm Đồng','Lạng Sơn','Lào Cai','Long An','Nam Định',
  'Nghệ An','Ninh Bình','Ninh Thuận','Phú Thọ','Phú Yên',
  'Quảng Bình','Quảng Nam','Quảng Ngãi','Quảng Ninh','Quảng Trị',
  'Sóc Trăng','Sơn La','Tây Ninh','Thái Bình','Thái Nguyên',
  'Thanh Hóa','Thừa Thiên Huế','Tiền Giang','Trà Vinh','Tuyên Quang',
  'Vĩnh Long','Vĩnh Phúc','Yên Bái',
]

const DISTRICTS_MAP = {
  'Hà Nội': ['Ba Đình','Cầu Giấy','Đống Đa','Hai Bà Trưng','Hà Đông','Hoàn Kiếm','Hoàng Mai','Long Biên','Nam Từ Liêm','Tây Hồ','Thanh Xuân','Bắc Từ Liêm','Gia Lâm','Đông Anh','Sóc Sơn','Thanh Trì','Mê Linh','Hoài Đức','Đan Phượng','Thạch Thất','Chương Mỹ','Quốc Oai','Ba Vì','Sơn Tây','Phúc Thọ','Thường Tín','Phú Xuyên','Mỹ Đức','Ứng Hòa','Thanh Oai'],
  'TP. Hồ Chí Minh': ['Quận 1','Quận 3','Quận 4','Quận 5','Quận 6','Quận 7','Quận 8','Quận 10','Quận 11','Quận 12','Bình Thạnh','Gò Vấp','Phú Nhuận','Tân Bình','Tân Phú','Bình Tân','Thủ Đức','Củ Chi','Hóc Môn','Bình Chánh','Nhà Bè','Cần Giờ'],
  'Đà Nẵng': ['Hải Châu','Thanh Khê','Sơn Trà','Ngũ Hành Sơn','Liên Chiểu','Cẩm Lệ','Hòa Vang'],
  'Hải Phòng': ['Hồng Bàng','Lê Chân','Ngô Quyền','Kiến An','Hải An','Đồ Sơn','Dương Kinh','An Dương','An Lão','Kiến Thụy','Tiên Lãng','Vĩnh Bảo','Cát Hải'],
  'Cần Thơ': ['Ninh Kiều','Bình Thủy','Cái Răng','Ô Môn','Thốt Nốt','Vĩnh Thạnh','Cờ Đỏ','Phong Điền','Thới Lai'],
  'Đồng Nai': ['Biên Hòa','Long Khánh','Nhơn Trạch','Long Thành','Trảng Bom','Thống Nhất','Cẩm Mỹ','Vĩnh Cửu','Định Quán','Tân Phú','Xuân Lộc'],
  'Bình Dương': ['Thủ Dầu Một','Dĩ An','Thuận An','Bến Cát','Tân Uyên','Phú Giáo','Bắc Tân Uyên','Dầu Tiếng'],
  'Khánh Hòa': ['Nha Trang','Cam Ranh','Ninh Hòa','Vạn Ninh','Khánh Vĩnh','Diên Khánh','Khánh Sơn','Trường Sa'],
  'Nghệ An': ['Vinh','Cửa Lò','Thái Hòa','Hoàng Mai','Diễn Châu','Yên Thành','Quỳnh Lưu','Nghi Lộc','Nam Đàn','Hưng Nguyên'],
  'Thanh Hóa': ['TP. Thanh Hóa','Sầm Sơn','Bỉm Sơn','Hậu Lộc','Hoằng Hóa','Quảng Xương','Đông Sơn','Thiệu Hóa','Yên Định','Triệu Sơn'],
}

const SUBJECTS = ['Toán','Văn','Lý','Anh','Hoá','Sử','Sinh','Địa','Mục khác']

const STAT_ICONS = {
  tutor: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" className="w-7 h-7"><path d="M22 10L12 5 2 10l10 5 10-5z" /><path d="M6 12v5c0 1 2.7 2 6 2s6-1 6-2v-5" /></svg>,
  student: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" className="w-7 h-7"><circle cx="9" cy="8" r="3" /><path d="M3 20c0-3 2.7-5 6-5s6 2 6 5" /><path d="M16 4a3 3 0 010 6M18 20c0-2-.7-3.6-2-4.5" /></svg>,
  connect: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" className="w-7 h-7"><path d="M9 11l3 3L22 4" /><path d="M21 12v7a2 2 0 01-2 2H5a2 2 0 01-2-2V5a2 2 0 012-2h11" /></svg>,
  register: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" className="w-7 h-7"><path d="M3 17l6-6 4 4 7-7" /><path d="M14 7h6v6" /></svg>,
}

const STATS = [
  { icon: STAT_ICONS.tutor,    value: '3K+',   label: 'Gia sư đã đăng ký'      },
  { icon: STAT_ICONS.student,  value: '27K+',  label: 'Học sinh cần tìm gia sư' },
  { icon: STAT_ICONS.connect,  value: '15K+',  label: 'Lớp kết nối thành công'  },
  { icon: STAT_ICONS.register, value: '102K+', label: 'Đăng ký mỗi tháng'      },
]

/* ── Shared input + label ── */
function Field({ label, required, children }) {
  return (
    <div className="flex flex-col gap-1.5">
      <label className="text-sm font-medium text-gray-700">
        {label}{required && <span className="text-red-500 ml-0.5">*</span>}
      </label>
      {children}
    </div>
  )
}

const inputCls = 'w-full border border-gray-200 rounded-lg px-4 py-2.5 text-sm text-gray-700 placeholder:text-gray-400 focus:outline-none focus:border-[#24725D] transition-colors'
const sectionTitle = 'text-xs font-bold tracking-widest text-gray-500 uppercase mb-5 mt-2'

export default function RegisterTutor() {
  const [activeTab, setActiveTab] = useState('student')
  const [showPwd,  setShowPwd ] = useState(false)
  const [showPwd2, setShowPwd2] = useState(false)

  const [form, setForm] = useState({
    email: '', password: '', confirmPassword: '',
    studentName: '', gender: 'Nam', parentName: '', phone: '',
    grade: '',
    subjects: [], customSubject: '',
    studyMode: '',
    feeType: 'negotiate', fee: '',
    sessionsPerWeek: '', timePerSession: '',
    address: '', province: '', district: '',
    requirements: '',
  })

  const set = (f) => (e) => setForm(p => ({ ...p, [f]: e.target.value }))

  const toggleSubject = (s) =>
    setForm(p => ({
      ...p,
      subjects: p.subjects.includes(s) ? p.subjects.filter(x => x !== s) : [...p.subjects, s],
    }))

  const districts = DISTRICTS_MAP[form.province] || []

  const handleSubmit = (e) => {
    e.preventDefault()
    console.log('Submit form:', form)
  }

  return (
    <>
      {/* ══════════════════════════════════════════════════════
          FORM SECTION
          ══════════════════════════════════════════════════════ */}
      <div className="min-h-screen bg-gray-50 py-10">
        <div className="max-w-[800px] mx-auto px-4">

          {/* ── Tab chuyển đổi ── */}
          <div className="flex items-center gap-3 mb-8">
            <button
              onClick={() => setActiveTab('tutor')}
              className={`px-5 py-2 rounded-lg text-sm font-semibold transition-colors ${
                activeTab === 'tutor'
                  ? 'text-white'
                  : 'bg-white border border-gray-200 text-gray-600 hover:border-gray-300'
              }`}
              style={activeTab === 'tutor' ? { backgroundColor: C.orange } : undefined}
            >
              Đăng ký làm gia sư
            </button>
            <button
              onClick={() => setActiveTab('student')}
              className={`px-5 py-2 rounded-lg text-sm font-semibold transition-colors ${
                activeTab === 'student'
                  ? 'text-white'
                  : 'bg-white border border-gray-200 text-gray-600 hover:border-gray-300'
              }`}
              style={activeTab === 'student' ? { backgroundColor: C.orange } : undefined}
            >
              Đăng ký tìm gia sư
            </button>
          </div>

          {/* ── Tiêu đề ── */}
          <h1 className="text-3xl font-extrabold text-gray-900 mb-1">
            {activeTab === 'student' ? 'Đăng ký tìm gia sư 👋' : 'Đăng ký làm gia sư 👋'}
          </h1>
          <p className="text-sm text-gray-500 mb-8">
            Các trường có dấu * là bắt buộc. Sau khi tạo xong hồ sơ, bạn có thể sửa các thông tin bất kỳ lúc nào bạn muốn
          </p>

          {/* ── Form ── */}
          <form onSubmit={handleSubmit} className="space-y-8">

            {/* ─ THÔNG TIN ĐĂNG KÝ ─ */}
            <div>
              <p className={sectionTitle}>Thông tin đăng ký</p>
              <div className="space-y-4">

                <Field label="Email" required>
                  <input type="email" value={form.email} onChange={set('email')}
                    placeholder="Nhập Email" className={inputCls} />
                </Field>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <Field label="Mật khẩu" required>
                    <div className="relative">
                      <input
                        type={showPwd ? 'text' : 'password'}
                        value={form.password} onChange={set('password')}
                        placeholder="Nhập mật khẩu"
                        className={inputCls + ' pr-10'}
                      />
                      <button type="button" onClick={() => setShowPwd(p => !p)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600">
                        {showPwd
                          ? <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-4 h-4"><path d="M17.94 17.94A10.07 10.07 0 0112 20c-7 0-11-8-11-8a18.45 18.45 0 015.06-5.94M9.9 4.24A9.12 9.12 0 0112 4c7 0 11 8 11 8a18.5 18.5 0 01-2.16 3.19m-6.72-1.07a3 3 0 11-4.24-4.24" /><line x1="1" y1="1" x2="23" y2="23" /></svg>
                          : <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-4 h-4"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" /><circle cx="12" cy="12" r="3" /></svg>
                        }
                      </button>
                    </div>
                  </Field>

                  <Field label="Nhập lại mật khẩu" required>
                    <div className="relative">
                      <input
                        type={showPwd2 ? 'text' : 'password'}
                        value={form.confirmPassword} onChange={set('confirmPassword')}
                        placeholder="Nhập lại mật khẩu"
                        className={inputCls + ' pr-10'}
                      />
                      <button type="button" onClick={() => setShowPwd2(p => !p)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600">
                        {showPwd2
                          ? <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-4 h-4"><path d="M17.94 17.94A10.07 10.07 0 0112 20c-7 0-11-8-11-8a18.45 18.45 0 015.06-5.94M9.9 4.24A9.12 9.12 0 0112 4c7 0 11 8 11 8a18.5 18.5 0 01-2.16 3.19m-6.72-1.07a3 3 0 11-4.24-4.24" /><line x1="1" y1="1" x2="23" y2="23" /></svg>
                          : <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-4 h-4"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" /><circle cx="12" cy="12" r="3" /></svg>
                        }
                      </button>
                    </div>
                  </Field>
                </div>
              </div>
            </div>

            {/* ─ THÔNG TIN CÁ NHÂN ─ */}
            <div>
              <p className={sectionTitle}>Thông tin cá nhân</p>
              <div className="space-y-4">

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <Field label="Họ và tên học sinh" required>
                    <input type="text" value={form.studentName} onChange={set('studentName')}
                      placeholder="Nhập họ tên học sinh" className={inputCls} />
                  </Field>

                  <Field label="Giới tính" required>
                    <div className="flex items-center gap-6 h-[42px]">
                      {['Nam','Nữ'].map(g => (
                        <label key={g} className="flex items-center gap-2 cursor-pointer select-none">
                          <input type="radio" name="gender" value={g}
                            checked={form.gender === g}
                            onChange={set('gender')}
                            className="w-4 h-4 accent-[#24725D]" />
                          <span className="text-sm text-gray-700">{g}</span>
                        </label>
                      ))}
                    </div>
                  </Field>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <Field label="Họ và tên phụ huynh">
                    <input type="text" value={form.parentName} onChange={set('parentName')}
                      placeholder="Nhập họ tên phụ huynh" className={inputCls} />
                  </Field>

                  <Field label="Số điện thoại liên hệ" required>
                    <input type="tel" value={form.phone} onChange={set('phone')}
                      placeholder="Nhập số điện thoại liên hệ" className={inputCls} />
                  </Field>
                </div>
              </div>
            </div>

            {/* ─ THÔNG TIN LỚP HỌC ─ */}
            <div>
              <p className={sectionTitle}>Thông tin lớp học</p>
              <div className="space-y-5">

                <Field label="Cần tìm gia sư cho học sinh lớp mấy?" required>
                  <input type="text" value={form.grade} onChange={set('grade')}
                    placeholder="Tôi muốn tìm gia sư cho học sinh lớp..." className={inputCls} />
                </Field>

                {/* Môn học */}
                <div>
                  <label className="text-sm font-medium text-gray-700">
                    Môn học cần tìm gia sư<span className="text-red-500 ml-0.5">*</span>
                  </label>
                  <div className="mt-2.5 grid grid-cols-2 gap-y-2.5 gap-x-4">
                    {SUBJECTS.map(s => (
                      <label key={s} className="flex items-center gap-2.5 cursor-pointer select-none">
                        <input type="checkbox"
                          checked={form.subjects.includes(s)}
                          onChange={() => toggleSubject(s)}
                          className="w-4 h-4 rounded accent-[#24725D] flex-shrink-0" />
                        <span className="text-sm text-gray-700">{s}</span>
                      </label>
                    ))}
                  </div>
                  {form.subjects.includes('Mục khác') && (
                    <input
                      type="text" value={form.customSubject} onChange={set('customSubject')}
                      placeholder="Nhập mục khác"
                      className={inputCls + ' mt-3'}
                    />
                  )}
                </div>

                {/* Hình thức học */}
                <div>
                  <label className="text-sm font-medium text-gray-700">
                    Hình thức học<span className="text-red-500 ml-0.5">*</span>
                  </label>
                  <div className="mt-2.5 flex flex-col gap-2.5">
                    {[
                      { val: 'online',  label: 'Học online 1-1'  },
                      { val: 'offline', label: 'Học kèm tại nhà' },
                    ].map(({ val, label }) => (
                      <label key={val} className="flex items-center gap-2.5 cursor-pointer select-none">
                        <input type="radio" name="studyMode" value={val}
                          checked={form.studyMode === val}
                          onChange={set('studyMode')}
                          className="w-4 h-4 accent-[#24725D]" />
                        <span className="text-sm text-gray-700">{label}</span>
                      </label>
                    ))}
                  </div>
                </div>

                {/* Học phí */}
                <div>
                  <label className="text-sm font-medium text-gray-700">
                    Học phí/buổi<span className="text-red-500 ml-0.5">*</span>
                  </label>
                  <div className="mt-2.5 flex flex-col gap-2.5">
                    <label className="flex items-center gap-2.5 cursor-pointer select-none">
                      <input type="radio" name="feeType" value="negotiate"
                        checked={form.feeType === 'negotiate'}
                        onChange={set('feeType')}
                        className="w-4 h-4 accent-[#24725D]" />
                      <span className="text-sm text-gray-700">Thoả Thuận</span>
                    </label>
                    <label className="flex items-center gap-2.5 cursor-pointer select-none">
                      <input type="radio" name="feeType" value="specific"
                        checked={form.feeType === 'specific'}
                        onChange={set('feeType')}
                        className="w-4 h-4 accent-[#24725D]" />
                      <span className="text-sm text-gray-700">Nhập học phí cụ thể</span>
                    </label>
                  </div>
                  {form.feeType === 'specific' && (
                    <input type="text" value={form.fee} onChange={set('fee')}
                      placeholder="Vd: 200,000"
                      className={inputCls + ' mt-3'}
                    />
                  )}
                </div>

                {/* Số buổi + Thời gian */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <Field label="Số buổi/tuần" required>
                    <input type="text" value={form.sessionsPerWeek} onChange={set('sessionsPerWeek')}
                      placeholder="Vd: 2 buổi (Tối thứ 2 và tối thứ 6)" className={inputCls} />
                  </Field>
                  <Field label="Thời gian học/buổi" required>
                    <input type="text" value={form.timePerSession} onChange={set('timePerSession')}
                      placeholder="Vd: 90 phút (19h - 20h30)" className={inputCls} />
                  </Field>
                </div>

                {/* Địa chỉ + Tỉnh + Quận */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <Field label="Địa chỉ học" required>
                    <input type="text" value={form.address} onChange={set('address')}
                      placeholder="Nhập địa chỉ" className={inputCls} />
                  </Field>

                  <Field label="Tỉnh/ Thành phố" required>
                    <select
                      value={form.province}
                      onChange={e => setForm(p => ({ ...p, province: e.target.value, district: '' }))}
                      className={inputCls}
                    >
                      <option value="">-- Tỉnh/ Thành phố --</option>
                      {PROVINCES.map(p => <option key={p} value={p}>{p}</option>)}
                    </select>
                  </Field>

                  <Field label="Quận/ Huyện" required>
                    {districts.length > 0 ? (
                      <select value={form.district} onChange={set('district')} className={inputCls}>
                        <option value="">-- Quận/ Huyện --</option>
                        {districts.map(d => <option key={d} value={d}>{d}</option>)}
                      </select>
                    ) : (
                      <input type="text" value={form.district} onChange={set('district')}
                        placeholder="-- Quận/ Huyện --"
                        className={inputCls}
                        disabled={!form.province}
                      />
                    )}
                  </Field>
                </div>

                {/* Yêu cầu riêng */}
                <Field label="Yêu cầu riêng">
                  <textarea value={form.requirements} onChange={set('requirements')}
                    placeholder="Nhập yêu cầu của bạn"
                    rows={3}
                    className={inputCls + ' resize-none'}
                  />
                </Field>

              </div>
            </div>

            {/* ── Submit ── */}
            <div className="flex justify-center pt-2 pb-4">
              <button
                type="submit"
                style={{ backgroundColor: C.primary }}
                className="px-10 py-3 text-white font-semibold rounded-full hover:opacity-90 transition-opacity text-sm"
              >
                {activeTab === 'student' ? 'Đăng ký tìm gia sư' : 'Đăng ký làm gia sư'}
              </button>
            </div>

          </form>
        </div>
      </div>

      {/* ══════════════════════════════════════════════════════
          THỐNG KÊ
          ══════════════════════════════════════════════════════ */}
      <section style={{ backgroundColor: C.primary }} className="py-16">
        <div className="max-w-[1336px] mx-auto px-6 lg:px-12">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-10 text-center text-white">
            {STATS.map((stat) => (
              <div key={stat.label} className="flex flex-col items-center">
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
          KẾT NỐI
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

          <div className="flex items-center bg-gray-50 border border-gray-200 rounded-full p-2 max-w-[520px] mx-auto">
            <input
              type="email"
              placeholder="Nhập email của bạn..."
              className="flex-1 px-4 py-2 text-sm text-gray-600 bg-transparent focus:outline-none"
            />
            <button
              style={{ backgroundColor: C.primary }}
              className="px-6 py-2.5 text-white font-semibold rounded-full hover:opacity-90 transition-opacity text-sm"
            >
              Đăng ký
            </button>
          </div>
        </div>
      </section>
    </>
  )
}
