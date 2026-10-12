// "Backend giả" cho lớp học. Hai loại DTO tách biệt — đúng nguyên tắc bảo vệ dữ liệu (06-security.md):
//   ClassPublicDto — cho khách: chỉ "Bạn {tên gọi}", quận + tỉnh. KHÔNG có họ tên đầy đủ, SĐT, số nhà.
//   ClassOwnerDto  — cho chủ lớp: đủ thông tin + lịch sử trạng thái.
import { SUBJECTS, DISTRICTS_MAP, subjectById, subjectBySlug } from '../../constants/catalog'
import { persisted, respond, fail, paginate, normalizeText, daysAgoIso, nowIso } from '../../lib/mockKit'
import { hasContactInfo, CONTENT_GUARD_MESSAGE } from '../../lib/contentGuard'
import { requireUser } from '../auth/mock'
import { calculateFee } from './fee'

const PUBLIC_STATUSES = ['OPEN', 'SHORTLISTED']

const STUDENTS = [
  ['Nguyễn Văn An', 'MALE'], ['Trần Thị Bích', 'FEMALE'], ['Lê Quang Đạt', 'MALE'], ['Phạm Thị Cúc', 'FEMALE'],
  ['Đinh Văn Long', 'MALE'], ['Hoàng Thị Mỹ', 'FEMALE'], ['Vũ Minh Khang', 'MALE'], ['Ngô Bảo Ngọc', 'FEMALE'],
  ['Phan Gia Huy', 'MALE'], ['Đỗ Khánh Linh', 'FEMALE'], ['Bùi Đức Thịnh', 'MALE'], ['Lý Thu Hằng', 'FEMALE'],
  ['Trịnh Quốc Bảo', 'MALE'], ['Mai Anh Thư', 'FEMALE'], ['Tô Hoàng Nam', 'MALE'], ['Hồ Ngọc Trâm', 'FEMALE'],
  ['Dương Tuấn Kiệt', 'MALE'], ['Lưu Phương Anh', 'FEMALE'], ['Võ Nhật Minh', 'MALE'], ['Chu Hải Yến', 'FEMALE'],
  ['Cao Đức Mạnh', 'MALE'], ['Kiều Minh Châu', 'FEMALE'], ['Tạ Thành Đạt', 'MALE'], ['Lâm Bảo Hân', 'FEMALE'],
]
const REQUIREMENTS = [
  'Ưu tiên gia sư nữ, có kinh nghiệm luyện thi',
  'Cần gia sư kiên nhẫn, học sinh hơi mất gốc',
  'Ưu tiên sinh viên sư phạm',
  'Không yêu cầu',
  'Muốn gia sư có phương pháp học qua trò chơi',
  'Ôn thi vào lớp 10 chuyên',
]
const SCHEDULES = ['Tối thứ 2, 4, 6 (19h–20h30)', 'Chiều thứ 7 và Chủ nhật', 'Tối thứ 3 và thứ 5', 'Linh hoạt, trao đổi thêm']
const PROVINCE_POOL = Object.keys(DISTRICTS_MAP)

function seeded(seed) {
  let s = seed
  return () => {
    s = (s * 9301 + 49297) % 233280
    return s / 233280
  }
}

export const displayNameOf = (studentName = '') => `Bạn ${studentName.trim().split(/\s+/).pop()}`

function buildClasses() {
  const rnd = seeded(7)
  const pick = (arr) => arr[Math.floor(rnd() * arr.length)]
  const publicClasses = STUDENTS.map(([studentName, gender], i) => {
    const province = i < 4 ? 'Hà Nội' : i < 8 ? 'TP. Hồ Chí Minh' : i < 10 ? 'Đà Nẵng' : pick(PROVINCE_POOL)
    const studyMode = rnd() > 0.35 ? 'OFFLINE' : 'ONLINE'
    const fee = 120000 + Math.floor(rnd() * 14) * 10000
    const publishedDays = Math.floor(rnd() * 20)
    return {
      id: 1100 + i,
      ownerId: 9000 + i,
      studentName,
      studentDisplayName: displayNameOf(studentName),
      studentGender: gender,
      parentName: 'Phụ huynh demo',
      contactPhone: '09xxxxxxxx',
      grade: 1 + Math.floor(rnd() * 12),
      subjectIds: [...new Set([pick(SUBJECTS).id, ...(rnd() > 0.6 ? [pick(SUBJECTS).id] : [])])],
      otherSubjectNote: '',
      studyMode,
      sessionsPerWeek: pick([2, 2, 3, 3, 4]),
      minutesPerSession: pick([60, 90, 90, 120]),
      feeMode: 'FIXED',
      proposedFee: fee,
      approvedFee: fee,
      provinceName: province,
      districtName: pick(DISTRICTS_MAP[province]),
      addressDetail: 'Số nhà demo (ẩn khi công khai)',
      scheduleNote: pick(SCHEDULES),
      preferredTutorGender: pick(['ANY', 'ANY', 'FEMALE', 'MALE']),
      preferredTutorType: pick(['ANY', 'ANY', 'SINH_VIEN', 'GIAO_VIEN']),
      requirements: pick(REQUIREMENTS),
      status: i % 7 === 3 ? 'SHORTLISTED' : 'OPEN',
      applicantCount: Math.floor(rnd() * 6),
      rejectReason: null,
      createdAt: daysAgoIso(publishedDays + 1),
      publishedAt: daysAgoIso(publishedDays),
      history: [],
    }
  })

  // 3 lớp của tài khoản demo phụ huynh (id = 1) ở 3 trạng thái khác nhau
  const base = { ...publicClasses[0], ownerId: 1, applicantCount: 0, history: [] }
  const mine = [
    {
      ...base, id: 1024, studentName: 'Nguyễn Văn An', studentDisplayName: 'Bạn An', studentGender: 'MALE', grade: 12,
      subjectIds: [1, 2], studyMode: 'OFFLINE', sessionsPerWeek: 3, minutesPerSession: 90, approvedFee: 200000, proposedFee: 180000,
      provinceName: 'Hà Nội', districtName: 'Cầu Giấy', addressDetail: '12 Trần Thái Tông', parentName: 'Trần Thu Hà', contactPhone: '0912000001',
      requirements: 'Ưu tiên gia sư nữ, có kinh nghiệm luyện thi', status: 'OPEN', applicantCount: 4,
      createdAt: daysAgoIso(4), publishedAt: daysAgoIso(2),
      history: [
        { toStatus: 'PENDING_REVIEW', at: daysAgoIso(4), note: 'Phụ huynh đăng lớp' },
        { toStatus: 'OPEN', at: daysAgoIso(2), note: 'Admin đã gọi xác nhận, chốt học phí 200.000đ/buổi' },
      ],
    },
    {
      ...base, id: 1031, studentName: 'Nguyễn Thu Hà', studentDisplayName: 'Bạn Hà', studentGender: 'FEMALE', grade: 8,
      subjectIds: [6], studyMode: 'ONLINE', sessionsPerWeek: 2, minutesPerSession: 60, feeMode: 'CONSULT', proposedFee: null, approvedFee: null,
      requirements: 'Muốn luyện giao tiếp', status: 'PENDING_REVIEW', publishedAt: null, createdAt: daysAgoIso(0.2),
      history: [{ toStatus: 'PENDING_REVIEW', at: daysAgoIso(0.2), note: 'Phụ huynh đăng lớp' }],
    },
    {
      ...base, id: 1040, studentName: 'Nguyễn Minh Khôi', studentDisplayName: 'Bạn Khôi', studentGender: 'MALE', grade: 5,
      subjectIds: [1], status: 'REJECTED', publishedAt: null, createdAt: daysAgoIso(6),
      rejectReason: 'Không liên lạc được số điện thoại đã cung cấp. Vui lòng kiểm tra lại SĐT rồi gửi lại.',
      history: [
        { toStatus: 'PENDING_REVIEW', at: daysAgoIso(6), note: 'Phụ huynh đăng lớp' },
        { toStatus: 'REJECTED', at: daysAgoIso(5), note: 'Không liên lạc được' },
      ],
    },
  ]
  return [...mine, ...publicClasses]
}

const db = persisted('classes', () => ({ nextId: 2000, classes: buildClasses() }))

const subjectsOf = (ids) => ids.map((id) => ({ id, name: subjectById(id)?.name }))

function toPublicDto(c) {
  return {
    id: c.id,
    studentDisplayName: c.studentDisplayName,
    studentGender: c.studentGender,
    grade: c.grade,
    subjects: subjectsOf(c.subjectIds),
    otherSubjectNote: c.otherSubjectNote,
    studyMode: c.studyMode,
    sessionsPerWeek: c.sessionsPerWeek,
    minutesPerSession: c.minutesPerSession,
    approvedFee: c.approvedFee,
    provinceName: c.provinceName,
    districtName: c.districtName,
    scheduleNote: c.scheduleNote,
    preferredTutorGender: c.preferredTutorGender,
    preferredTutorType: c.preferredTutorType,
    requirements: c.requirements,
    status: c.status,
    applicantCount: c.applicantCount,
    publishedAt: c.publishedAt,
    // Phí nhận lớp do server tính (frontend chỉ hiển thị)
    feeEstimate: calculateFee(c),
  }
}

function toOwnerDto(c) {
  return {
    ...toPublicDto(c),
    studentName: c.studentName,
    parentName: c.parentName,
    contactPhone: c.contactPhone,
    addressDetail: c.addressDetail,
    feeMode: c.feeMode,
    proposedFee: c.proposedFee,
    subjectIds: c.subjectIds,
    rejectReason: c.rejectReason,
    createdAt: c.createdAt,
    history: c.history,
  }
}

function matches(c, f) {
  if (!PUBLIC_STATUSES.includes(c.status)) return false
  if (f.city && c.provinceName !== f.city) return false
  if (f.subject) {
    const s = subjectBySlug(f.subject)
    if (!s || !c.subjectIds.includes(s.id)) return false
  }
  if (f.grade && c.grade !== Number(f.grade)) return false
  if (f.mode && c.studyMode !== f.mode) return false
  if (f.minFee && c.approvedFee < Number(f.minFee)) return false
  if (f.maxFee && c.approvedFee > Number(f.maxFee)) return false
  if (f.q) {
    const text = `${c.studentDisplayName} ${subjectsOf(c.subjectIds).map((s) => s.name).join(' ')} ${c.districtName} ${c.requirements}`
    if (!normalizeText(text).includes(normalizeText(f.q))) return false
  }
  return true
}

const SORTS = {
  newest: (a, b) => (b.publishedAt ?? '').localeCompare(a.publishedAt ?? ''),
  feeDesc: (a, b) => b.approvedFee - a.approvedFee,
  feeAsc: (a, b) => a.approvedFee - b.approvedFee,
}

/** Kiểm tra giống Bean Validation + ContentGuard ở backend → lỗi 400 kèm errors theo ô. */
function validate(body) {
  const errors = {}
  if (!body.subjectIds?.length) errors.subjectIds = 'Chọn ít nhất 1 môn học.'
  ;['requirements', 'scheduleNote', 'otherSubjectNote'].forEach((field) => {
    if (hasContactInfo(body[field] ?? '')) errors[field] = CONTENT_GUARD_MESSAGE
  })
  if (Object.keys(errors).length) fail(400, 'VALIDATION_FAILED', 'Dữ liệu chưa hợp lệ', errors)
}

function findMine(user, id) {
  const c = db.data.classes.find((x) => x.id === Number(id) && x.ownerId === user.id)
  // Lớp của người khác → 404 (không phải 403) để không lộ việc lớp đó tồn tại — chống IDOR
  if (!c) fail(404, 'NOT_FOUND', 'Không tìm thấy lớp.')
  return c
}

export const mockClasses = {
  list: (f = {}) =>
    respond(() => {
      const items = db.data.classes.filter((c) => matches(c, f)).sort(SORTS[f.sort] ?? SORTS.newest)
      const page = paginate(items, f.page, f.size)
      return { ...page, items: page.items.map(toPublicDto) }
    }),

  get: (id) =>
    respond(() => {
      const c = db.data.classes.find((x) => x.id === Number(id) && PUBLIC_STATUSES.includes(x.status))
      if (!c) fail(404, 'NOT_FOUND', 'Không tìm thấy lớp hoặc lớp đã đóng.')
      return toPublicDto(c)
    }),

  listMine: (f = {}) =>
    respond(() => {
      const user = requireUser()
      const items = db.data.classes.filter((c) => c.ownerId === user.id).sort((a, b) => b.createdAt.localeCompare(a.createdAt))
      const page = paginate(items, f.page, f.size)
      return { ...page, items: page.items.map(toOwnerDto) }
    }),

  getMine: (id) => respond(() => toOwnerDto(findMine(requireUser(), id))),

  create: (body) =>
    respond(() => {
      const user = requireUser()
      if (!user.emailVerified) fail(403, 'EMAIL_NOT_VERIFIED', 'Bạn cần xác thực email trước khi đăng lớp.')
      validate(body)
      const c = {
        ...body,
        id: db.data.nextId++,
        ownerId: user.id,
        studentDisplayName: displayNameOf(body.studentName),
        approvedFee: null,
        status: 'PENDING_REVIEW',
        applicantCount: 0,
        rejectReason: null,
        publishedAt: null,
        createdAt: nowIso(),
        history: [{ toStatus: 'PENDING_REVIEW', at: nowIso(), note: 'Phụ huynh đăng lớp' }],
      }
      db.data.classes.push(c)
      db.save()
      return toOwnerDto(c)
    }),

  update: (id, body) =>
    respond(() => {
      const c = findMine(requireUser(), id)
      // Chỉ sửa được khi chưa duyệt hoặc bị từ chối (07-api.md)
      if (!['PENDING_REVIEW', 'REJECTED'].includes(c.status)) fail(409, 'INVALID_TRANSITION', 'Lớp đã được duyệt, không sửa được nữa.')
      validate(body)
      const wasRejected = c.status === 'REJECTED'
      Object.assign(c, body, { studentDisplayName: displayNameOf(body.studentName), status: 'PENDING_REVIEW', rejectReason: null })
      if (wasRejected) c.history.push({ toStatus: 'PENDING_REVIEW', at: nowIso(), note: 'Phụ huynh sửa và gửi lại' })
      db.save()
      return toOwnerDto(c)
    }),

  close: (id) =>
    respond(() => {
      const c = findMine(requireUser(), id)
      if (!['PENDING_REVIEW', 'OPEN', 'SHORTLISTED', 'REJECTED'].includes(c.status)) fail(409, 'INVALID_TRANSITION', 'Không thể đóng lớp ở trạng thái hiện tại.')
      c.history.push({ toStatus: 'CLOSED', at: nowIso(), note: 'Phụ huynh đóng lớp' })
      c.status = 'CLOSED'
      db.save()
      return toOwnerDto(c)
    }),
}
