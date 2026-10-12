/*
  CLASSFORM — form thông tin lớp (chuyển từ phần "Thông tin lớp học" của RegisterTutor cũ, giữ bố cục).
  Dùng cho cả Đăng lớp và Sửa lớp. Thay đổi so với form cũ:
    - Số buổi/tuần, thời lượng: chọn từ danh sách (trước là ô chữ tự do → dữ liệu bẩn)
    - Thêm "Thời gian học mong muốn" (lịch), giới tính + đối tượng gia sư mong muốn
    - Mọi ô có label gắn đúng input, lỗi hiện ngay dưới ô
*/
import { useForm, useWatch } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { classSchema, EMPTY_CLASS } from '../schemas'
import { PROVINCES, SUBJECTS, GRADES, SESSIONS_PER_WEEK, MINUTES_PER_SESSION, districtsOf } from '../../../constants/catalog'
import { PREFERRED_GENDER, PREFERRED_TUTOR_TYPE, optionsOf } from '../../../constants/labels'
import { applyServerErrors, messageOf } from '../../../lib/problem'
import FormField, { FieldGroup } from '../../../components/ui/FormField'
import { Input, Select, Textarea, Choice } from '../../../components/ui/inputs'
import Button from '../../../components/ui/Button'
import Notice from '../../../components/ui/Notice'

const sectionTitle = 'text-xs font-bold tracking-widest text-gray-500 uppercase mb-5 mt-2'

export default function ClassForm({ defaultValues = EMPTY_CLASS, onSubmit, submitLabel, isPending, serverError, disabled }) {
  const { register, handleSubmit, setValue, setError, control, formState: { errors } } = useForm({
    resolver: zodResolver(classSchema),
    defaultValues,
  })

  // useWatch: chỉ render lại form khi 3 ô này đổi (thay vì cả form) — để hiện/ẩn ô phụ thuộc
  const [province, feeMode, studyMode] = useWatch({ control, name: ['provinceName', 'feeMode', 'studyMode'] })
  const districts = districtsOf(province)

  const submit = handleSubmit((data) => onSubmit(data, { onError: (err) => applyServerErrors(err, setError) }))

  return (
    <form onSubmit={submit} noValidate className="space-y-8">
      {serverError && !Object.keys(serverError.errors ?? {}).length && <Notice tone="error">{messageOf(serverError)}</Notice>}

      {/* ─ THÔNG TIN HỌC SINH ─ */}
      <div>
        <p className={sectionTitle}>Thông tin học sinh</p>
        <div className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <FormField label="Họ và tên học sinh" required error={errors.studentName?.message}
              hint='Công khai chỉ hiện tên gọi, vd "Bạn An"'>
              {(a) => <Input {...a} placeholder="Nhập họ tên học sinh" {...register('studentName')} />}
            </FormField>
            <FieldGroup legend="Giới tính" required error={errors.studentGender?.message}>
              <div className="flex items-center gap-6 h-[42px]">
                <Choice type="radio" label="Nam" value="MALE" {...register('studentGender')} />
                <Choice type="radio" label="Nữ" value="FEMALE" {...register('studentGender')} />
              </div>
            </FieldGroup>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <FormField label="Họ và tên phụ huynh" error={errors.parentName?.message}>
              {(a) => <Input {...a} placeholder="Nhập họ tên phụ huynh" {...register('parentName')} />}
            </FormField>
            <FormField label="Số điện thoại liên hệ" required error={errors.contactPhone?.message}
              hint="Trung tâm gọi số này để xác nhận lớp">
              {(a) => <Input {...a} type="tel" inputMode="tel" placeholder="Vd: 0912345678" {...register('contactPhone')} />}
            </FormField>
          </div>
        </div>
      </div>

      {/* ─ THÔNG TIN LỚP HỌC ─ */}
      <div>
        <p className={sectionTitle}>Thông tin lớp học</p>
        <div className="space-y-5">
          <FormField label="Học sinh đang học lớp mấy?" required error={errors.grade?.message}>
            {(a) => <Select {...a} placeholder="-- Chọn lớp --" options={GRADES} {...register('grade')} />}
          </FormField>

          <FieldGroup legend="Môn học cần tìm gia sư" required error={errors.subjectIds?.message}>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-y-2.5 gap-x-4">
              {SUBJECTS.map((s) => (
                <Choice key={s.id} label={s.name} value={String(s.id)} {...register('subjectIds')} />
              ))}
            </div>
            <div className="mt-3">
              <FormField label="Môn khác (nếu có)" error={errors.otherSubjectNote?.message}>
                {(a) => <Input {...a} placeholder="Vd: Luyện chữ đẹp, Toán tư duy" {...register('otherSubjectNote')} />}
              </FormField>
            </div>
          </FieldGroup>

          <FieldGroup legend="Hình thức học" required error={errors.studyMode?.message}>
            <div className="flex flex-col gap-2.5">
              <Choice type="radio" label="Học online 1-1" value="ONLINE" {...register('studyMode')} />
              <Choice type="radio" label="Học kèm tại nhà" value="OFFLINE" {...register('studyMode')} />
            </div>
          </FieldGroup>

          <FieldGroup legend="Học phí/buổi" required>
            <div className="flex flex-col gap-2.5">
              <Choice type="radio" label="Thoả thuận (nhờ trung tâm tư vấn mức phù hợp)" value="CONSULT" {...register('feeMode')} />
              <Choice type="radio" label="Nhập học phí cụ thể" value="FIXED" {...register('feeMode')} />
            </div>
            {feeMode === 'FIXED' && (
              <div className="mt-3 max-w-[280px]">
                <FormField label="Học phí đề xuất (đồng/buổi)" error={errors.proposedFee?.message}>
                  {(a) => <Input {...a} type="number" inputMode="numeric" min="50000" step="10000" placeholder="Vd: 200000" {...register('proposedFee')} />}
                </FormField>
              </div>
            )}
            <p className="text-xs text-gray-500 mt-2">Trung tâm sẽ gọi xác nhận và chốt học phí cuối cùng với bạn.</p>
          </FieldGroup>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <FormField label="Số buổi/tuần" required error={errors.sessionsPerWeek?.message}>
              {(a) => <Select {...a} placeholder="-- Chọn --" options={SESSIONS_PER_WEEK.map((n) => ({ value: n, label: `${n} buổi/tuần` }))} {...register('sessionsPerWeek')} />}
            </FormField>
            <FormField label="Thời gian học/buổi" required error={errors.minutesPerSession?.message}>
              {(a) => <Select {...a} placeholder="-- Chọn --" options={MINUTES_PER_SESSION.map((n) => ({ value: n, label: `${n} phút` }))} {...register('minutesPerSession')} />}
            </FormField>
          </div>

          <FormField label="Thời gian học mong muốn" error={errors.scheduleNote?.message}>
            {(a) => <Input {...a} placeholder="Vd: Tối thứ 2, 4, 6 (19h – 20h30)" {...register('scheduleNote')} />}
          </FormField>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <FormField label="Tỉnh/ Thành phố" required error={errors.provinceName?.message}>
              {(a) => (
                <Select {...a} placeholder="-- Tỉnh/ Thành phố --" options={PROVINCES.map((p) => ({ value: p, label: p }))}
                  {...register('provinceName', { onChange: () => setValue('districtName', '') })} />
              )}
            </FormField>
            <FormField label="Quận/ Huyện" required error={errors.districtName?.message}>
              {(a) =>
                districts.length > 0 ? (
                  <Select {...a} placeholder="-- Quận/ Huyện --" options={districts.map((d) => ({ value: d, label: d }))} {...register('districtName')} />
                ) : (
                  <Input {...a} placeholder="-- Quận/ Huyện --" disabled={!province} {...register('districtName')} />
                )
              }
            </FormField>
            <FormField label="Địa chỉ học" required={studyMode === 'OFFLINE'} error={errors.addressDetail?.message}
              hint="🔒 Chỉ gia sư đã nhận lớp mới thấy">
              {(a) => <Input {...a} placeholder="Số nhà, đường, phường" {...register('addressDetail')} />}
            </FormField>
          </div>
        </div>
      </div>

      {/* ─ YÊU CẦU GIA SƯ ─ */}
      <div>
        <p className={sectionTitle}>Yêu cầu gia sư</p>
        <div className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <FormField label="Giới tính gia sư">
              {(a) => <Select {...a} options={optionsOf(PREFERRED_GENDER)} {...register('preferredTutorGender')} />}
            </FormField>
            <FormField label="Đối tượng gia sư">
              {(a) => <Select {...a} options={optionsOf(PREFERRED_TUTOR_TYPE)} {...register('preferredTutorType')} />}
            </FormField>
          </div>
          <FormField label="Yêu cầu riêng" error={errors.requirements?.message}
            hint="Không ghi số điện thoại, Zalo hay đường link — thông tin liên hệ được trao đổi qua nền tảng.">
            {(a) => <Textarea {...a} placeholder="Nhập yêu cầu của bạn" {...register('requirements')} />}
          </FormField>
        </div>
      </div>

      <div className="flex justify-center pt-2 pb-4">
        <Button type="submit" size="lg" className="px-10" loading={isPending} disabled={disabled}>{submitLabel}</Button>
      </div>
    </form>
  )
}
