// Bộ icon line-art dùng chung (dòng thông tin trong card, trang chi tiết).
// File chỉ chứa dữ liệu icon — tách khỏi component để Fast Refresh của Vite hoạt động.

const icon = (paths, strokeWidth = 1.7) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={strokeWidth} className="w-4 h-4" aria-hidden="true">
    {paths}
  </svg>
)

export const ICONS = {
  subject: icon(<><path d="M4 19.5A2.5 2.5 0 016.5 17H20" /><path d="M6.5 2H20v20H6.5A2.5 2.5 0 014 19.5v-15A2.5 2.5 0 016.5 2z" /></>),
  mode: icon(<><path d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V7" /><path d="M3 7l9-4 9 4-9 4-9-4z" /><path d="M7 12v4" /></>),
  area: icon(<><path d="M12 21s-7-5.5-7-11a7 7 0 1114 0c0 5.5-7 11-7 11z" /><circle cx="12" cy="10" r="2.5" /></>),
  exp: icon(<><circle cx="12" cy="12" r="9" /><path d="M12 7v5l3 2" /></>),
  requirement: icon(<path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />),
  calendar: icon(<><rect x="3" y="5" width="18" height="16" rx="2" /><path d="M16 3v4M8 3v4M3 11h18" /></>),
  grade: icon(<><path d="M22 10L12 5 2 10l10 5 10-5z" /><path d="M6 12v5c0 1 2.7 2 6 2s6-1 6-2v-5" /></>),
  coin: icon(<><circle cx="12" cy="12" r="9" /><path d="M12 7v10M9.5 9.5h4a1.5 1.5 0 010 3h-3a1.5 1.5 0 000 3h4" /></>, 1.8),
}
