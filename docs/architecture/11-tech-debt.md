# 11 — Sổ nợ kỹ thuật (Technical Debt Register)

> Nợ kỹ thuật = **đánh đổi có chủ đích**: chấp nhận giải pháp chưa hoàn hảo để đi nhanh, nhưng **ghi lại** để trả sau.
> Nợ không ghi lại mới là nợ xấu. Mỗi dòng có: vì sao chấp nhận, rủi ro, khi nào/cách trả.
> Mức: 🔴 trả trước khi ra mắt thật · 🟠 trả trong R1–R2 · 🟢 để được, trả khi rảnh.

| ID | Nợ | Vì sao chấp nhận | Rủi ro nếu không trả | Trả khi nào / cách trả | Mức |
|----|----|------------------|----------------------|------------------------|-----|
| TD-01 | Tỉnh/quận gửi bằng **tên** (`provinceName`, `districtName` chữ tự do) thay vì id | Frontend đang dùng danh sách tĩnh 63 tỉnh; chỉ 10 tỉnh có quận | Lọc theo quận không chính xác; sai chính tả tên quận | Khi seed đủ `areas`: frontend đọc `/api/areas`, gửi `provinceId/areaId` — chỉ sửa `toServerParams()` + form | 🟠 |
| TD-02 | Văn bản pháp lý là nội dung tĩnh trong frontend; id 1–3 viết cứng | Chưa có API `GET /api/legal/{type}/current` | Đổi phiên bản Điều khoản phải build lại frontend; id lệch DB → lưu sai đồng ý | Khi có API legal: `LegalPage` + `REGISTER_CONSENT_IDS` lấy từ API | 🟠 |
| TD-03 | Thẻ gia sư hiện giá "/ giờ"; đánh giá sao chỉ có ở mock | Câu hỏi mở #9 chưa chốt | Lệch đơn vị với lớp (theo buổi) → phụ huynh so sánh nhầm | Chốt #9 → đổi 1 hằng số `TUTOR_FEE_UNIT`; `rating: null` đã hiện "Gia sư mới" | 🟠 |
| TD-04 | Màu cam `#FF6B35` (chữ/nút) không đạt tương phản WCAG AA (2,8:1) | Màu thương hiệu đã duyệt | Người mắt kém khó đọc; trừ điểm Accessibility | Dùng cam đậm hơn cho **chữ** (vd `#C2410C`), giữ cam cho nền trang trí | 🟢 |
| TD-05 | Font Google tải từ domain ngoài, chặn render ~0,8s trên 4G chậm; chữ tiêu đề nhích nhẹ khi font về (CLS 0,036) | Đã thử tự host bằng `@fontsource` → **đo thấy chậm hơn** (file nặng hơn) | Trang đầu chậm hơn tối đa ~0,8s trên mạng yếu | Tự host bản **đã cắt bộ ký tự** (subset vietnamese+latin, woff2) + `preload` 2 file chính; đo lại bằng Lighthouse | 🟢 |
| TD-06 | Code mock vẫn nằm trong bản build production (`features/*/mock.js`) | Đơn giản, 1 công tắc `VITE_USE_MOCK` | Thêm ~15 KB; lộ dữ liệu demo | Khi backend xong: đổi `import` mock thành `import()` động hoặc xóa mock | 🟢 |
| TD-07 | Cookie refresh giả lập bằng `sessionStorage` khi chạy mock | Không có backend để đặt cookie httpOnly | Không có (chỉ chạy ở chế độ mock) | Tự hết khi tắt mock | 🟢 |
| TD-08 | `/me` đếm "việc cần làm" bằng cách tải tối đa 50 lớp | Chưa có endpoint đếm | Chậm khi 1 người có rất nhiều lớp (hiếm) | Thêm `GET /api/me/todo` trả số đếm | 🟢 |
| TD-09 | Chưa có Toast, chưa có trang lỗi tổng (Error Boundary) | Đủ cho demo; lỗi API đã có `ErrorState` | Lỗi JS bất ngờ → trang trắng | Thêm `ErrorBoundary` ở `RootLayout` | 🟠 |
| TD-10 | Hồ sơ gia sư: "khu vực dạy" chỉ chọn 1 quận | Form đơn giản | Gia sư dạy nhiều quận phải chọn 1 | Đổi sang chọn nhiều (checkbox/multiselect) khi làm TD-01 | 🟢 |
| TD-11 | Chưa có test E2E Playwright trong repo (đang chạy bằng script tạm) | Kịch bản còn đổi theo backend | Hồi quy không ai phát hiện | Chuyển 27 bước đã chạy thành `frontend/e2e/*.spec.js` khi nối backend; chạy trong CI | 🟠 |
| TD-12 | Ảnh `logo.png` 1,18 MB còn trong `public/` (không trang nào dùng) | Có thể còn dùng cho Figma/tài liệu | Không (không được tải) | Xóa hoặc chuyển ra ngoài `public/` | 🟢 |

## Đã trả (để tham khảo)
| Ngày | Nợ | Cách trả | Số đo |
|------|----|----------|-------|
| 2026-10-12 | Token trong `localStorage` | Store chỉ trong bộ nhớ + refresh single-flight | Test: `localStorage` rỗng sau đăng nhập |
| 2026-10-12 | Mobile không có menu, header tràn ngang | Menu ☰, thu gọn header dưới 380px | 8 cỡ màn × 13 trang: 0 trang tràn |
| 2026-10-12 | Ảnh hero 554 KB, favicon 1,18 MB | WebP 85 KB, favicon 2 KB | Lighthouse: tổng tải 1.942 → ~380 KB |
| 2026-10-12 | Ảnh hero làm xô lệch trang (CLS 0,135) | `<picture>` có bề rộng cố định + khung chờ cao bằng card thật | CLS 0,036 |
| 2026-10-12 | 10 lỗ hổng `npm audit` (8 high) | `npm audit fix` + `safeRedirect` | 0 lỗ hổng |
