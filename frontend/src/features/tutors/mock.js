// "Backend giả" cho gia sư. Dữ liệu trả về đúng hình dạng DTO dự kiến:
//   TutorPublicDto  — danh sách/chi tiết công khai (chỉ gia sư VERIFIED, KHÔNG có SĐT/email/CCCD)
//   TutorProfileDto — hồ sơ của chính mình (/api/me/tutor-profile)
import { SUBJECTS, DISTRICTS_MAP, subjectById, subjectBySlug } from '../../constants/catalog'
import { persisted, respond, fail, paginate, normalizeText, daysAgoIso, nowIso } from '../../lib/mockKit'
import { requireUser, setTutorStatus } from '../auth/mock'
import { hasContactInfo, CONTENT_GUARD_MESSAGE } from '../../lib/contentGuard'

const NAMES = [
  'Nguyễn Thị Hương', 'Trần Văn Minh', 'Lê Thị Lan', 'Phạm Quốc Hùng', 'Đỗ Thị Mai', 'Vũ Đình Khoa',
  'Hoàng Minh Tuấn', 'Bùi Thu Trang', 'Đặng Quang Huy', 'Ngô Thị Thảo', 'Phan Đức Anh', 'Trịnh Mai Phương',
  'Lý Gia Bảo', 'Đinh Thị Ngọc', 'Mai Văn Long', 'Cao Thị Yến', 'Tô Minh Khôi', 'Hồ Thị Linh',
  'Dương Văn Nam', 'Lưu Thị Hà', 'Võ Thanh Tùng', 'Chu Thị Vân', 'Tạ Quốc Việt', 'Kiều Thị Nhung',
]
const BIOS = [
  'Tốt nghiệp sư phạm, nhiều năm luyện thi vào 10 và THPT Quốc gia. Dạy chắc gốc, có bài tập theo tuần.',
  'Sinh viên năm 3 trường top, kiên nhẫn, phù hợp học sinh mất gốc cần lấy lại căn bản.',
  'Giáo viên đang công tác tại trường THCS, có giáo án riêng cho từng học sinh.',
  'Kỹ sư phần mềm, dạy tin học và toán tư duy cho học sinh cấp 2 – cấp 3.',
]
const SCHOOLS = ['ĐH Sư phạm Hà Nội', 'ĐH Bách khoa', 'ĐH Sư phạm TP.HCM', 'ĐH Đà Nẵng', 'THCS Nguyễn Du', 'ĐH Ngoại thương']
const TYPES = ['GIAO_VIEN', 'SINH_VIEN', 'NGUOI_DI_LAM']
const PROVINCE_POOL = Object.keys(DISTRICTS_MAP)

// Bộ sinh số giả cố định (cùng seed → cùng dữ liệu mỗi lần chạy) để ảnh chụp/test ổn định.
function seeded(seed) {
  let s = seed
  return () => {
    s = (s * 9301 + 49297) % 233280
    return s / 233280
  }
}

function buildTutors() {
  const rnd = seeded(42)
  const pick = (arr) => arr[Math.floor(rnd() * arr.length)]
  return NAMES.map((fullName, i) => {
    const province = i < 2 ? 'Hà Nội' : i < 4 ? 'TP. Hồ Chí Minh' : i < 6 ? 'Đà Nẵng' : pick(PROVINCE_POOL)
    const district = pick(DISTRICTS_MAP[province])
    const subjectCount = 1 + Math.floor(rnd() * 3)
    const subjectIds = [...new Set(Array.from({ length: subjectCount }, () => pick(SUBJECTS).id))]
    const minGrade = pick([1, 6, 6, 10])
    const teachesOnline = rnd() > 0.4
    return {
      id: 1000 + i,
      userId: i === 0 ? 2 : 5000 + i, // gia sư đầu tiên là tài khoản demo giasu@demo.vn
      fullName,
      gender: /Thị/.test(fullName) ? 'FEMALE' : 'MALE',
      tutorType: pick(TYPES),
      schoolOrWorkplace: pick(SCHOOLS),
      bio: pick(BIOS),
      experienceYears: 1 + Math.floor(rnd() * 8),
      subjectIds,
      provinceName: province,
      areaNames: [district],
      teachesOnline,
      teachesOffline: !teachesOnline || rnd() > 0.3,
      minGrade,
      maxGrade: Math.min(12, minGrade + 5 + Math.floor(rnd() * 3)),
      expectedFee: 100000 + Math.floor(rnd() * 11) * 10000,
      rating: Math.round((4.3 + rnd() * 0.7) * 10) / 10, // ⚠️ đánh giá thuộc R2 — chỉ để giữ UI cũ
      verificationStatus: 'VERIFIED',
      verifiedAt: daysAgoIso(Math.floor(rnd() * 60)),
    }
  })
}

const db = persisted('tutors', () => ({ tutors: buildTutors(), profiles: {} }))

function toPublicDto(t) {
  return {
    id: t.id,
    fullName: t.fullName,
    avatarUrl: null,
    gender: t.gender,
    tutorType: t.tutorType,
    schoolOrWorkplace: t.schoolOrWorkplace,
    bio: t.bio,
    experienceYears: t.experienceYears,
    subjects: t.subjectIds.map((id) => ({ id, name: subjectById(id)?.name })),
    provinceName: t.provinceName,
    areaNames: t.areaNames,
    teachesOnline: t.teachesOnline,
    teachesOffline: t.teachesOffline,
    minGrade: t.minGrade,
    maxGrade: t.maxGrade,
    expectedFee: t.expectedFee,
    rating: t.rating,
    verified: true,
    verifiedAt: t.verifiedAt,
  }
}

/** Lọc giống câu WHERE ở backend. Mọi tham số đều tùy chọn. */
function matches(t, f) {
  if (f.city && t.provinceName !== f.city) return false
  if (f.subject) {
    const s = subjectBySlug(f.subject)
    if (!s || !t.subjectIds.includes(s.id)) return false
  }
  if (f.mode === 'ONLINE' && !t.teachesOnline) return false
  if (f.mode === 'OFFLINE' && !t.teachesOffline) return false
  if (f.grade && (Number(f.grade) < t.minGrade || Number(f.grade) > t.maxGrade)) return false
  if (f.minFee && t.expectedFee < Number(f.minFee)) return false
  if (f.maxFee && t.expectedFee > Number(f.maxFee)) return false
  if (f.q) {
    const q = normalizeText(f.q)
    const subjectNames = t.subjectIds.map((id) => subjectById(id)?.name).join(' ')
    if (!normalizeText(`${t.fullName} ${subjectNames}`).includes(q)) return false
  }
  return true
}

const SORTS = {
  featured: (a, b) => b.rating - a.rating || b.experienceYears - a.experienceYears,
  newest: (a, b) => b.verifiedAt.localeCompare(a.verifiedAt),
  feeAsc: (a, b) => a.expectedFee - b.expectedFee,
  feeDesc: (a, b) => b.expectedFee - a.expectedFee,
}

// ── Hồ sơ gia sư của chính mình ─────────────────────────────────────────────
function emptyProfile(user) {
  return {
    fullName: user.fullName, gender: '', birthYear: '', phone: user.phone ?? '', tutorType: '', schoolOrWorkplace: '',
    experienceYears: 0, subjectIds: [], provinceName: '', areaNames: [], teachesOnline: false, teachesOffline: true,
    minGrade: 1, maxGrade: 12, expectedFee: '', bio: '', acceptedTutorRules: false,
    verificationStatus: null, verifyNote: null, updatedAt: null,
  }
}

function myProfile(user) {
  if (db.data.profiles[user.id]) return db.data.profiles[user.id]
  // Tài khoản demo gia sư đã có hồ sơ VERIFIED sẵn
  const existing = db.data.tutors.find((t) => t.userId === user.id)
  if (existing) {
    return { ...emptyProfile(user), ...existing, phone: user.phone, acceptedTutorRules: true, verificationStatus: 'VERIFIED' }
  }
  return emptyProfile(user)
}

// Dùng chung bộ chặn với form (lib/contentGuard.js)

export const mockTutors = {
  list: (f = {}) =>
    respond(() => {
      const items = db.data.tutors.filter((t) => matches(t, f)).sort(SORTS[f.sort] ?? SORTS.featured)
      const page = paginate(items, f.page, f.size)
      return { ...page, items: page.items.map(toPublicDto) }
    }),

  get: (id) =>
    respond(() => {
      const t = db.data.tutors.find((x) => x.id === Number(id))
      if (!t) fail(404, 'NOT_FOUND', 'Không tìm thấy gia sư.')
      return toPublicDto(t)
    }),

  getMine: () => respond(() => myProfile(requireUser())),

  saveMine: (body) =>
    respond(() => {
      const user = requireUser()
      const current = myProfile(user)
      if (current.verificationStatus === 'PENDING') fail(409, 'INVALID_TRANSITION', 'Hồ sơ đang chờ xác minh, chưa sửa được.')
      if (hasContactInfo(body.bio ?? '')) {
        fail(400, 'CONTENT_BLOCKED', 'Dữ liệu không hợp lệ', {
          bio: CONTENT_GUARD_MESSAGE,
        })
      }
      const next = {
        ...current,
        ...body,
        // Hồ sơ VERIFIED/REJECTED sửa lại → về DRAFT, phải gửi xác minh lại
        verificationStatus: current.verificationStatus === 'VERIFIED' || current.verificationStatus === 'REJECTED' ? 'DRAFT' : current.verificationStatus ?? 'DRAFT',
        updatedAt: nowIso(),
      }
      db.data.profiles[user.id] = next
      db.save()
      if (next.verificationStatus !== current.verificationStatus) setTutorStatus(user.id, next.verificationStatus)
      return next
    }),

  submitMine: () =>
    respond(() => {
      const user = requireUser()
      const p = myProfile(user)
      if (!p.updatedAt && p.verificationStatus !== 'DRAFT') fail(409, 'PROFILE_INCOMPLETE', 'Vui lòng lưu hồ sơ trước khi gửi xác minh.')
      if (!['DRAFT', 'REJECTED'].includes(p.verificationStatus)) fail(409, 'INVALID_TRANSITION', 'Hồ sơ không ở trạng thái gửi xác minh được.')
      p.verificationStatus = 'PENDING'
      db.data.profiles[user.id] = p
      db.save()
      setTutorStatus(user.id, 'PENDING')
      return p
    }),
}
