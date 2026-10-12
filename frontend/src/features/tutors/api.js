// Lớp gọi API cho gia sư (07-api.md — nhóm "Gia sư").
import { useMutation, useQuery, useQueryClient, keepPreviousData } from '@tanstack/react-query'
import api from '../../services/api'
import { USE_MOCK } from '../../lib/mockKit'
import { subjectBySlug } from '../../constants/catalog'
import { mockTutors } from './mock'
import { reloadMe } from '../auth/api'

/**
 * Bộ lọc trên URL (dễ đọc: ?city=Hà Nội&subject=toan) → tham số backend (?provinceName=...&subjectId=1).
 * TODO khi có backend: khi /api/areas sẵn sàng, đổi provinceName → provinceId.
 */
function toServerParams(f) {
  return {
    provinceName: f.city || undefined,
    subjectId: f.subject ? subjectBySlug(f.subject)?.id : undefined,
    studyMode: f.mode || undefined,
    grade: f.grade || undefined,
    minFee: f.minFee || undefined,
    maxFee: f.maxFee || undefined,
    q: f.q || undefined,
    sort: f.sort || undefined,
    page: f.page || 1,
    size: f.size || 9,
  }
}

export const tutorsApi = {
  list: (f) => (USE_MOCK ? mockTutors.list(f) : api.get('/tutors', { params: toServerParams(f) }).then((r) => r.data)),
  get: (id) => (USE_MOCK ? mockTutors.get(id) : api.get(`/tutors/${id}`).then((r) => r.data)),
  getMine: () => (USE_MOCK ? mockTutors.getMine() : api.get('/me/tutor-profile').then((r) => r.data)),
  saveMine: (body) => (USE_MOCK ? mockTutors.saveMine(body) : api.put('/me/tutor-profile', body).then((r) => r.data)),
  submitMine: () => (USE_MOCK ? mockTutors.submitMine() : api.post('/me/tutor-profile/submit').then((r) => r.data)),
}

// Query key gom về 1 chỗ → invalidate đúng, không gõ sai chuỗi.
export const tutorKeys = {
  all: ['tutors'],
  list: (f) => ['tutors', 'list', f],
  detail: (id) => ['tutors', 'detail', String(id)],
  mine: ['me', 'tutor-profile'],
}

export function useTutors(filters) {
  return useQuery({
    queryKey: tutorKeys.list(filters),
    queryFn: () => tutorsApi.list(filters),
    placeholderData: keepPreviousData, // đổi trang/bộ lọc vẫn giữ danh sách cũ trong lúc chờ → không nháy trắng
  })
}

export const useTutor = (id) => useQuery({ queryKey: tutorKeys.detail(id), queryFn: () => tutorsApi.get(id) })

export const useMyTutorProfile = () => useQuery({ queryKey: tutorKeys.mine, queryFn: tutorsApi.getMine })

export function useSaveTutorProfile() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: tutorsApi.saveMine,
    onSuccess: (profile) => {
      qc.setQueryData(tutorKeys.mine, profile)
      reloadMe() // trạng thái gia sư trên Navbar có thể đổi
    },
  })
}

export function useSubmitTutorProfile() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: tutorsApi.submitMine,
    onSuccess: (profile) => {
      qc.setQueryData(tutorKeys.mine, profile)
      reloadMe()
    },
  })
}
