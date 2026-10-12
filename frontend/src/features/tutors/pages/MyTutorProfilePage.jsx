// /me/tutor-profile — Tạo/sửa hồ sơ gia sư → Gửi xác minh (DRAFT → PENDING → VERIFIED/REJECTED).
import { Link } from 'react-router-dom'
import { useForm, useWatch } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { useMyTutorProfile, useSaveTutorProfile, useSubmitTutorProfile } from '../api'
import { tutorProfileSchema, toProfileForm } from '../schemas'
import { PROVINCES, SUBJECTS, GRADES, districtsOf } from '../../../constants/catalog'
import { TUTOR_TYPE, VERIFICATION_STATUS, optionsOf } from '../../../constants/labels'
import { applyServerErrors, messageOf } from '../../../lib/problem'
import MeShell from '../../../components/common/MeShell'
import FormField, { FieldGroup } from '../../../components/ui/FormField'
import { Input, Select, Textarea, Choice } from '../../../components/ui/inputs'
import Button from '../../../components/ui/Button'
import Notice from '../../../components/ui/Notice'
import StatusChip from '../../../components/ui/StatusChip'
import { QueryState, Skeleton } from '../../../components/ui/states'

const sectionTitle = 'text-xs font-bold tracking-widest text-gray-500 uppercase mb-5 mt-2'

const STATUS_HELP = {
  null: 'Điền hồ sơ rồi bấm "Lưu hồ sơ", sau đó "Gửi xác minh". Trung tâm sẽ liên hệ để kiểm tra giấy tờ.',
  DRAFT: 'Hồ sơ đã lưu nhưng chưa gửi xác minh.',
  PENDING: 'Trung tâm đang xác minh hồ sơ của bạn (thường trong 1–2 ngày làm việc). Trong lúc này chưa sửa được hồ sơ.',
  VERIFIED: 'Hồ sơ đã được xác minh — bạn có thể ứng tuyển lớp. Sửa hồ sơ sẽ cần xác minh lại.',
  REJECTED: 'Hồ sơ chưa đạt. Vui lòng sửa theo ghi chú rồi gửi lại.',
}

function ProfileForm({ profile }) {
  const save = useSaveTutorProfile()
  const submit = useSubmitTutorProfile()
  const locked = profile.verificationStatus === 'PENDING'

  const { register, handleSubmit, setValue, setError, reset, control, formState: { errors, isDirty } } = useForm({
    resolver: zodResolver(tutorProfileSchema),
    defaultValues: toProfileForm(profile),
  })
  const province = useWatch({ control, name: 'provinceName' })
  const districts = districtsOf(province)

  const onSave = (data) =>
    save.mutate(data, {
      // Lưu xong: lấy dữ liệu server trả về làm "mốc gốc" mới của form → isDirty về false
      onSuccess: (saved) => reset(toProfileForm(saved)),
      onError: (err) => applyServerErrors(err, setError),
    })
  const canSubmit = ['DRAFT', 'REJECTED'].includes(profile.verificationStatus) && !isDirty

  return (
    <>
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 mb-6">
        <div className="flex flex-wrap items-center gap-3 mb-2">
          <h2 className="font-bold text-gray-900">Trạng thái hồ sơ</h2>
          {profile.verificationStatus
            ? <StatusChip map={VERIFICATION_STATUS} status={profile.verificationStatus} />
            : <span className="text-sm text-gray-500">Chưa tạo</span>}
        </div>
        <p className="text-sm text-gray-600">{STATUS_HELP[profile.verificationStatus]}</p>
        {profile.verifyNote && <Notice tone="error" className="mt-3">Ghi chú của trung tâm: {profile.verifyNote}</Notice>}
        {canSubmit && (
          <div className="mt-4">
            <Button variant="accent" loading={submit.isPending} onClick={() => submit.mutate()}>Gửi xác minh</Button>
            {submit.isError && <Notice tone="error" className="mt-3">{messageOf(submit.error)}</Notice>}
          </div>
        )}
        {isDirty && ['DRAFT', 'REJECTED'].includes(profile.verificationStatus) && (
          <p className="text-xs text-gray-500 mt-3">Bạn có thay đổi chưa lưu — lưu hồ sơ trước khi gửi xác minh.</p>
        )}
      </div>

      <form onSubmit={handleSubmit(onSave)} noValidate className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 lg:p-8 space-y-8">
        <fieldset disabled={locked} className="space-y-8 disabled:opacity-60">
          {save.isSuccess && !isDirty && <Notice tone="success">Đã lưu hồ sơ.</Notice>}
          {save.isError && !Object.keys(save.error?.errors ?? {}).length && <Notice tone="error">{messageOf(save.error)}</Notice>}

          <div>
            <p className={sectionTitle}>Thông tin cá nhân</p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <FormField label="Họ và tên" required error={errors.fullName?.message}>
                {(a) => <Input {...a} {...register('fullName')} />}
              </FormField>
              <FormField label="Số điện thoại" required error={errors.phone?.message} hint="🔒 Không hiển thị công khai">
                {(a) => <Input {...a} type="tel" {...register('phone')} />}
              </FormField>
              <FieldGroup legend="Giới tính" required error={errors.gender?.message}>
                <div className="flex items-center gap-6 h-[42px]">
                  <Choice type="radio" label="Nam" value="MALE" {...register('gender')} />
                  <Choice type="radio" label="Nữ" value="FEMALE" {...register('gender')} />
                </div>
              </FieldGroup>
              <FormField label="Năm sinh" required error={errors.birthYear?.message}>
                {(a) => <Input {...a} type="number" inputMode="numeric" placeholder="Vd: 2003" {...register('birthYear')} />}
              </FormField>
            </div>
          </div>

          <div>
            <p className={sectionTitle}>Chuyên môn</p>
            <div className="space-y-5">
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <FormField label="Bạn là" required error={errors.tutorType?.message}>
                  {(a) => <Select {...a} placeholder="-- Chọn --" options={optionsOf(TUTOR_TYPE)} {...register('tutorType')} />}
                </FormField>
                <FormField label="Trường / nơi làm việc" required error={errors.schoolOrWorkplace?.message} className="sm:col-span-2">
                  {(a) => <Input {...a} placeholder="Vd: ĐH Sư phạm Hà Nội" {...register('schoolOrWorkplace')} />}
                </FormField>
              </div>

              <FieldGroup legend="Môn dạy" required error={errors.subjectIds?.message}>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-y-2.5 gap-x-4">
                  {SUBJECTS.map((s) => <Choice key={s.id} label={s.name} value={String(s.id)} {...register('subjectIds')} />)}
                </div>
              </FieldGroup>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <FormField label="Dạy từ lớp" required error={errors.minGrade?.message}>
                  {(a) => <Select {...a} options={GRADES} {...register('minGrade')} />}
                </FormField>
                <FormField label="Đến lớp" required error={errors.maxGrade?.message}>
                  {(a) => <Select {...a} options={GRADES} {...register('maxGrade')} />}
                </FormField>
                <FormField label="Số năm kinh nghiệm" required error={errors.experienceYears?.message}>
                  {(a) => <Input {...a} type="number" min="0" max="40" {...register('experienceYears')} />}
                </FormField>
              </div>

              <FieldGroup legend="Hình thức dạy" required error={errors.teachesOffline?.message}>
                <div className="flex flex-wrap gap-6">
                  <Choice label="Dạy kèm tại nhà" {...register('teachesOffline')} />
                  <Choice label="Dạy online" {...register('teachesOnline')} />
                </div>
              </FieldGroup>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <FormField label="Tỉnh/ Thành phố" required error={errors.provinceName?.message}>
                  {(a) => <Select {...a} placeholder="-- Chọn --" options={PROVINCES.map((p) => ({ value: p, label: p }))}
                    {...register('provinceName', { onChange: () => setValue('districtName', '') })} />}
                </FormField>
                <FormField label="Khu vực dạy (quận/huyện)" error={errors.districtName?.message}>
                  {(a) => districts.length
                    ? <Select {...a} placeholder="-- Chọn --" options={districts.map((d) => ({ value: d, label: d }))} {...register('districtName')} />
                    : <Input {...a} disabled={!province} {...register('districtName')} />}
                </FormField>
                <FormField label="Học phí mong muốn (đ/giờ)" required error={errors.expectedFee?.message}>
                  {(a) => <Input {...a} type="number" inputMode="numeric" step="10000" placeholder="Vd: 150000" {...register('expectedFee')} />}
                </FormField>
              </div>

              <FormField label="Giới thiệu bản thân" required error={errors.bio?.message}
                hint="Phương pháp dạy, thành tích… Không ghi SĐT, Zalo, email hay link.">
                {(a) => <Textarea {...a} rows={5} {...register('bio')} />}
              </FormField>
            </div>
          </div>

          <div>
            <label className="flex items-start gap-2.5 cursor-pointer select-none">
              <input type="checkbox" className="w-4 h-4 mt-0.5 accent-primary" aria-invalid={errors.acceptedTutorRules ? true : undefined} {...register('acceptedTutorRules')} />
              <span className="text-sm text-gray-700">
                Tôi đã đọc và đồng ý <Link to="/legal/tutor-rules" target="_blank" className="text-primary font-semibold underline">Nội quy nhận lớp (v1)</Link>, gồm quy định giữ phí và hoàn phí.
              </span>
            </label>
            {errors.acceptedTutorRules && <p className="text-xs text-red-600 mt-1 ml-6" role="alert">{errors.acceptedTutorRules.message}</p>}
          </div>

          <div className="flex justify-center">
            <Button type="submit" size="lg" className="px-10" loading={save.isPending}>Lưu hồ sơ</Button>
          </div>
        </fieldset>
      </form>
    </>
  )
}

export default function MyTutorProfilePage() {
  const query = useMyTutorProfile()
  return (
    <MeShell title="Hồ sơ gia sư" subtitle="Hồ sơ được trung tâm xác minh trước khi hiển thị và ứng tuyển lớp." crumbs={[{ label: 'Hồ sơ gia sư' }]}>
      <QueryState query={query} loading={<Skeleton className="h-[600px] rounded-2xl" />}>
        {(profile) => <ProfileForm profile={profile} />}
      </QueryState>
    </MeShell>
  )
}
