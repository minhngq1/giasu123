import { Link } from 'react-router-dom'

export default function NotFoundPage() {
  return (
    <section className="bg-peach">
      <div className="max-w-site mx-auto px-6 lg:px-12 py-20 text-center">
        <p className="text-sm font-semibold text-accent mb-3">Lỗi 404</p>
        <h1 className="text-3xl lg:text-4xl font-extrabold text-gray-900 mb-4">Không tìm thấy trang</h1>
        <p className="text-gray-500 mb-8 max-w-[480px] mx-auto">
          Trang bạn tìm có thể đã bị xóa, đổi địa chỉ, hoặc bạn không có quyền xem.
        </p>
        <div className="flex flex-wrap justify-center gap-3">
          <Link to="/" className="px-8 py-3 bg-primary text-white font-semibold rounded-full hover:opacity-90 text-sm">
            Về trang chủ
          </Link>
          <Link to="/tutors" className="px-8 py-3 border border-primary text-primary font-semibold rounded-full hover:bg-primary-soft text-sm">
            Tìm gia sư
          </Link>
        </div>
      </div>
    </section>
  )
}
