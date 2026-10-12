// Khối "Cảm nhận" — chấm phân trang giờ hoạt động thật:
//   - Desktop: 3 card cùng hiện, card đang chọn "nhô lên" (giống thiết kế cũ: card giữa nổi bật)
//   - Mobile : vuốt ngang (scroll-snap), chấm đổi theo card đang xem; bấm chấm → cuộn tới card
import { useRef, useState } from 'react'
import { TESTIMONIALS } from '../content'

export default function Testimonials() {
  const [active, setActive] = useState(1)
  const trackRef = useRef(null)

  const goTo = (i) => {
    setActive(i)
    const track = trackRef.current
    const card = track?.children[i]
    // Chỉ cuộn khi đang ở dạng slider (mobile); desktop không có thanh cuộn ngang nên bỏ qua
    if (track && card && track.scrollWidth > track.clientWidth) {
      track.scrollTo({ left: card.offsetLeft - track.offsetLeft, behavior: 'smooth' })
    }
  }

  const onScroll = () => {
    const track = trackRef.current
    if (!track || track.scrollWidth <= track.clientWidth) return
    const i = Math.round(track.scrollLeft / track.clientWidth)
    if (i !== active) setActive(Math.min(i, TESTIMONIALS.length - 1))
  }

  return (
    <section className="bg-mint py-16">
      <div className="max-w-site mx-auto px-4 sm:px-6 lg:px-12">
        <div className="text-center mb-10">
          <p className="text-sm font-semibold mb-2 text-accent">★ Đánh giá của học viên</p>
          <h2 className="text-3xl font-extrabold text-ink">Cảm nhận của Học sinh và Phụ huynh</h2>
        </div>

        <div
          ref={trackRef}
          onScroll={onScroll}
          className="flex md:grid md:grid-cols-3 gap-6 items-start overflow-x-auto md:overflow-visible snap-x snap-mandatory pb-2 md:pb-0 [scrollbar-width:none]"
        >
          {TESTIMONIALS.map((item, idx) => (
            <figure
              key={item.id}
              className={
                'bg-white rounded-2xl p-6 shadow-sm shrink-0 w-full md:w-auto snap-center transition-transform duration-300 ' +
                (idx === active ? 'md:-translate-y-4 md:shadow-lg' : '')
              }
            >
              <div className="flex gap-0.5 mb-4" role="img" aria-label="5 sao">
                {Array.from({ length: 5 }, (_, i) => (
                  <span key={i} className="text-base text-accent" aria-hidden="true">★</span>
                ))}
              </div>
              <blockquote className="text-gray-500 text-sm leading-relaxed mb-5">{item.content}</blockquote>
              <figcaption className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full flex items-center justify-center text-white text-sm font-bold flex-shrink-0 bg-primary" aria-hidden="true">
                  {item.name.trim().split(' ').pop()[0]}
                </div>
                <div>
                  <p className="font-semibold text-gray-800 text-sm">{item.name}</p>
                  <p className="text-xs text-gray-500">{item.role}</p>
                </div>
              </figcaption>
            </figure>
          ))}
        </div>

        <div className="flex justify-center items-center gap-2 mt-10">
          {TESTIMONIALS.map((t, i) => (
            <button
              key={t.id}
              type="button"
              onClick={() => goTo(i)}
              aria-label={`Xem cảm nhận ${i + 1}`}
              aria-current={i === active || undefined}
              className="p-1.5" // vùng bấm rộng hơn chấm cho dễ chạm trên điện thoại
            >
              <span className={`block rounded-full transition-all ${i === active ? 'w-2.5 h-2.5 bg-primary' : 'w-2 h-2 bg-primary-border'}`} />
            </button>
          ))}
        </div>
      </div>
    </section>
  )
}
