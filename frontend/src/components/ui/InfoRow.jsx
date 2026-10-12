// Dòng thông tin "icon xám + nhãn: giá trị đậm" — dùng chung cho TutorCard, ClassCard và trang chi tiết.
// Trước đây mỗi card tự khai báo ICONS + InfoRow riêng (code lặp) → gom về đây. Icon nằm ở ./icons.jsx

export default function InfoRow({ icon: iconNode, label, value }) {
  return (
    <div className="flex items-start gap-2 text-sm">
      <span className="text-gray-400 mt-0.5 flex-shrink-0">{iconNode}</span>
      <p className="text-gray-500">
        {label}: <span className="font-semibold text-gray-800">{value}</span>
      </p>
    </div>
  )
}
