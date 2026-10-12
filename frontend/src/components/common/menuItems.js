// Mục cho 2 dropdown "Tỉnh/Thành phố" và "Môn học" — dùng chung Navbar (desktop + mobile) và Footer.
import { PROVINCES, SUBJECTS } from '../../constants/catalog'

export const PROVINCE_ITEMS = PROVINCES.map((p) => ({ key: p, label: p, to: `/tutors?city=${encodeURIComponent(p)}` }))
export const SUBJECT_ITEMS = SUBJECTS.map((s) => ({ key: s.slug, label: s.name, to: `/tutors?subject=${s.slug}` }))
