// Lớp gọi API cho lớp học (07-api.md — nhóm "Lớp").
import { useMutation, useQuery, useQueryClient, keepPreviousData } from '@tanstack/react-query'
import api from '../../services/api'
import { USE_MOCK } from '../../lib/mockKit'
import { subjectBySlug } from '../../constants/catalog'
import { mockClasses } from './mock'

/** Bộ lọc URL → tham số backend. TODO khi có /api/areas: provinceName → provinceId. */
function toServerParams(f) {
  return {
    provinceName: f.city || undefined,
    subjectId: f.subject ? subjectBySlug(f.subject)?.id : undefined,
    grade: f.grade || undefined,
    studyMode: f.mode || undefined,
    minFee: f.minFee || undefined,
    maxFee: f.maxFee || undefined,
    q: f.q || undefined,
    sort: f.sort || undefined,
    page: f.page || 1,
    size: f.size || 10,
  }
}

export const classesApi = {
  list: (f) => (USE_MOCK ? mockClasses.list(f) : api.get('/classes', { params: toServerParams(f) }).then((r) => r.data)),
  get: (id) => (USE_MOCK ? mockClasses.get(id) : api.get(`/classes/${id}`).then((r) => r.data)),
  listMine: (f) => (USE_MOCK ? mockClasses.listMine(f) : api.get('/me/classes', { params: f }).then((r) => r.data)),
  getMine: (id) => (USE_MOCK ? mockClasses.getMine(id) : api.get(`/me/classes/${id}`).then((r) => r.data)),
  create: (body) => (USE_MOCK ? mockClasses.create(body) : api.post('/classes', body).then((r) => r.data)),
  update: ({ id, body }) => (USE_MOCK ? mockClasses.update(id, body) : api.put(`/me/classes/${id}`, body).then((r) => r.data)),
  close: (id) => (USE_MOCK ? mockClasses.close(id) : api.post(`/me/classes/${id}/close`).then((r) => r.data)),
}

export const classKeys = {
  all: ['classes'],
  list: (f) => ['classes', 'list', f],
  detail: (id) => ['classes', 'detail', String(id)],
  mine: ['me', 'classes'],
  mineList: (f) => ['me', 'classes', 'list', f],
  mineDetail: (id) => ['me', 'classes', 'detail', String(id)],
}

export const useClasses = (filters) =>
  useQuery({ queryKey: classKeys.list(filters), queryFn: () => classesApi.list(filters), placeholderData: keepPreviousData })

export const useClass = (id) => useQuery({ queryKey: classKeys.detail(id), queryFn: () => classesApi.get(id) })

export const useMyClasses = (filters = {}) =>
  useQuery({ queryKey: classKeys.mineList(filters), queryFn: () => classesApi.listMine(filters), placeholderData: keepPreviousData })

export const useMyClass = (id) => useQuery({ queryKey: classKeys.mineDetail(id), queryFn: () => classesApi.getMine(id) })

/** Sau khi tạo/sửa/đóng lớp: xóa cache "lớp của tôi" + danh sách công khai để lần xem sau lấy dữ liệu mới. */
function useInvalidateClasses() {
  const qc = useQueryClient()
  return () => Promise.all([qc.invalidateQueries({ queryKey: classKeys.mine }), qc.invalidateQueries({ queryKey: classKeys.all })])
}

export function useCreateClass() {
  const invalidate = useInvalidateClasses()
  return useMutation({ mutationFn: classesApi.create, onSuccess: invalidate })
}

export function useUpdateClass() {
  const invalidate = useInvalidateClasses()
  return useMutation({ mutationFn: classesApi.update, onSuccess: invalidate })
}

export function useCloseClass() {
  const invalidate = useInvalidateClasses()
  return useMutation({ mutationFn: classesApi.close, onSuccess: invalidate })
}
