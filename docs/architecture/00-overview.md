# 00 — Tổng quan

## 1. Bài toán

| Kênh hiện tại | Vấn đề |
|---------------|--------|
| Nhóm Facebook, Zalo | Không xác minh được ai; lộ SĐT và địa chỉ công khai; dễ bị lừa cọc |
| Trung tâm gia sư truyền thống | Làm thủ công qua điện thoại; tranh chấp phí là "lời nói với lời nói"; gia sư trả phí trước và chịu rủi ro |
| Nền tảng học online (Hocmai, Edupia...) | Chỉ có khóa học của nền tảng, không phải chợ gia sư 1-1 |

**Giasu123 số hóa quy trình của trung tâm gia sư.** Nền tảng làm 3 việc:
- Kiểm duyệt đầu vào: admin gọi xác nhận phụ huynh, xác minh giấy tờ gia sư.
- Chốt học phí minh bạch.
- Giữ phí môi giới trong ví. Mọi bước đều có **trạng thái, hạn chót và nhật ký**, nên tranh chấp được giải quyết bằng dữ liệu.

## 2. Mô hình kinh doanh

- **Phụ huynh / học sinh đăng lớp miễn phí.**
- **Gia sư trả phí môi giới** = `học phí/buổi × số buổi/tuần × 4 × %phí`.
  - `%phí` lấy theo hình thức học (`fee_rules`), mặc định **ONLINE 30%**, **OFFLINE 40%**.
  - Kết quả làm tròn lên đơn vị xèng. Ví dụ lớp OFFLINE: 200.000đ × 3 × 4 × 40% = 960.000đ = **960 xèng**.
- **Ví xèng:** 1 xèng = 1.000đ. Gia sư nạp qua VNPay.
  - Khi **được chọn**, gia sư phải đủ xèng để hệ thống **tạm giữ (HOLD) 100% phí**. Chỉ lúc đó thông tin liên hệ mới được mở.
  - Học thử thành công thì phí được **chốt (CAPTURE)**. Không thành thì xèng **trả về ví** theo chính sách hoàn phí.
- **Doanh thu chỉ được ghi nhận khi CAPTURE.** Xèng chưa dùng là **nợ phải trả** của nền tảng.
- Tham chiếu thị trường: nội quy nhận lớp của các trung tâm gia sư Việt Nam (phí 10–45%, gia sư phải liên hệ phụ huynh trong vài giờ, hoàn 100% nếu không gặp được phụ huynh, hoàn giảm dần theo thời gian đã dạy).

## 3. Tác nhân

| Tác nhân | Mô tả |
|----------|-------|
| Khách | Chưa đăng nhập: xem danh sách lớp và gia sư |
| Thành viên | Mọi tài khoản đã đăng ký: đăng lớp, mời gia sư, chọn gia sư |
| Gia sư | Thành viên có hồ sơ gia sư **đã xác minh**: ứng tuyển, nhận lời mời, nạp và giữ xèng. Một người có thể vừa là gia sư vừa đăng lớp |
| Admin | Duyệt lớp, xác minh gia sư, lập shortlist, xử lý báo cáo, duyệt rút xèng, cấu hình |
| VNPay | Cổng thanh toán, dùng cho việc nạp xèng |
| SMTP | Gửi email xác thực, OTP, thông báo |

## 4. Phạm vi và lộ trình (MoSCoW)

Chú thích: 📐 đã thiết kế · 🔄 đang làm · ✅ đã làm và có test

### R1 — Must (lát dọc; bảo mật được làm trong từng lát, không để dồn cuối)

| Lát | Tính năng | Trạng thái |
|-----|-----------|-----------|
| **R1a — Đăng và xem** | Đăng ký, đăng nhập, access + refresh token, rate limit | 📐 |
| | Hạ tầng email (Mailpit khi dev), xác thực email, OTP email cho admin | 📐 |
| | Clickwrap: Điều khoản + Chính sách dữ liệu (có phiên bản) | 📐 |
| | Đăng lớp → admin gọi xác nhận, duyệt, chốt học phí | 📐 |
| | Danh sách và chi tiết lớp, gia sư công khai; lọc | 📐 |
| | Hồ sơ gia sư → admin xác minh | 📐 |
| | App admin: đăng nhập + OTP, hàng đợi việc, duyệt lớp, xác minh gia sư | 📐 |
| **R1b — Kết nối** | Ứng tuyển (tối đa 5 đơn chờ), mời gia sư (tối đa 3 lời mời/lớp) | 📐 |
| | Chấm điểm theo luật, admin lập shortlist, phụ huynh chọn hoặc yêu cầu đổi danh sách | 📐 |
| | Thông báo in-app; job hết hạn; nhắc admin khi lớp có ≥3 ứng viên hoặc đã mở 48h | 📐 |
| | Chặn SĐT/Zalo/link trong ô nhập tự do + gắn cờ nội dung nghi ngờ | 📐 |
| **R1c — Thu tiền** | Ví xèng: nạp qua VNPay sandbox (nạp đúng số còn thiếu), sổ cái | 📐 |
| | HOLD → gia sư báo đã liên hệ trong 6h → học thử ≤7 ngày → phụ huynh xác nhận trong 48h → CAPTURE | 📐 |
| | Hoàn phí theo chính sách, quota hoàn, gắn cờ kiểm tra (audit flag) | 📐 |
| | Báo cáo vi phạm, kết thúc lớp + 48h để phản đối, gia sư bỏ ngang → mở lại lớp | 📐 |
| | Rút xèng về tài khoản đã xác thực (admin duyệt), email thông báo | 📐 |
| **R1d — Hoàn thiện** | Upload giấy tờ gia sư (kho file riêng tư), xóa CCCD sau 30 ngày | 📐 |
| | Đối soát hằng ngày, k6 load test, Docker Compose, CI | 📐 |

### R2 — Should
Đánh giá hai chiều · phí bậc thang theo uy tín · OTP SMS xác minh SĐT phụ huynh · hoàn tiền qua API VNPay · quên mật khẩu

### R3+ — Could
AI shortlist (Gemini qua microservice) · OCR/eKYC giấy tờ · chatbot tư vấn · số điện thoại ảo (masking) · Zalo ZNS · MoMo · RabbitMQ · tìm theo bán kính (PostGIS)

### Won't (lần này)
Thanh toán học phí hằng tháng qua nền tảng (escrow thật) · app mobile native · đa ngôn ngữ

## 5. Timeline (ước lượng thô)

Chủ dự án dành **dưới 10 giờ/tuần**. Đây là **ước lượng, chưa phải số đo**. Sau R1a sẽ đo tốc độ thật rồi lập lại kế hoạch.

| Mốc | Ước lượng |
|-----|-----------|
| Tài liệu kiến trúc + Figma | 2–3 tuần |
| R1a | 6–8 tuần |
| R1b | 5–7 tuần |
| R1c | 6–8 tuần |
| R1d | 4–5 tuần |

## 6. Yêu cầu phi chức năng (đề xuất ban đầu, sẽ đo bằng k6 và Lighthouse)

| Nhóm | Mục tiêu | Cách đo |
|------|----------|---------|
| Hiệu năng API | `GET /api/classes`: p95 < 300ms với 100 người dùng đồng thời, tỉ lệ lỗi < 1% | k6 |
| Hiệu năng frontend | Lighthouse Performance ≥ 85 (mobile) cho Home và danh sách lớp | Lighthouse CI |
| Nhất quán tiền | Tổng sổ cái = số dư ví; tổng TOPUP khớp VNPay; không có bút toán mồ côi | Job đối soát + test |
| Độ tin cậy job | Không trạng thái nào quá hạn mà chưa được xử lý quá 2 phút | Test tích hợp với `Clock` giả |
| Bảo mật | Không còn lỗi mức High từ OWASP ZAP baseline; phụ thuộc không có CVE Critical | ZAP, Dependabot |
| Truy cập | Tương phản đạt WCAG AA; dùng được form bằng bàn phím | Lighthouse Accessibility ≥ 90 |

## 7. Giả định và giới hạn

- Đây là **project portfolio**. Ví xèng ở mức demo; hướng thương mại hóa và các rủi ro còn lại ghi ở [README](README.md#hạn-chế-đã-biết-mức-demo).
- Kinh doanh thật cần đăng ký kinh doanh, hóa đơn điện tử, và Điều khoản có luật sư xem.
- VNPay dùng môi trường **sandbox**. IPN không gọi được `localhost`, nên khi dev dùng tunnel hoặc endpoint giả lập (chỉ bật ở profile `dev`).
- Chuẩn địa giới hành chính (63 tỉnh có quận/huyện, hay 34 tỉnh chỉ có xã/phường) **đang chờ kiểm chứng**. Bảng `areas` phân cấp hỗ trợ được cả hai, nên chọn chuẩn nào cũng chỉ cần đổi seed.

## 8. Thuật ngữ

| Thuật ngữ | Nghĩa | Tên trong code |
|-----------|-------|----------------|
| Lớp | Nhu cầu tìm gia sư do thành viên đăng | `ClassRequest` |
| Đơn | Quan hệ giữa một gia sư và một lớp, sinh ra do ứng tuyển hoặc được mời | `Application` |
| Shortlist | 2–3 đơn admin đề xuất cho phụ huynh | `Application.status = SHORTLISTED` |
| Xèng | Đơn vị ví: 1 xèng = 1.000đ | `wallet`, `amountXeng` |
| Giữ phí | Tạm khóa xèng của gia sư cho một đơn | `FeeHold` |
| Tên gọi | Từ cuối trong họ tên người Việt ("An" trong "Nguyễn Văn An") | `givenName` (không dùng `lastName`) |
