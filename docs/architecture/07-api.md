# 07 — API

Swagger UI: `http://localhost:8080/swagger-ui.html`. Tài liệu được sinh tự động từ code (springdoc, code-first).

## 1. Quy ước chung

| Chủ đề | Quy ước | Ví dụ |
|--------|---------|-------|
| Tên trường JSON | `camelCase` | `approvedFee`, `studentDisplayName` |
| Enum | Mã `UPPER_SNAKE`; frontend tự đổi sang nhãn tiếng Việt | `"studyMode": "OFFLINE"` |
| Tiền, xèng | Số nguyên; tiền tính bằng VNĐ, ví tính bằng xèng | `"approvedFee": 200000`, `"amountXeng": 840` |
| Thời gian | ISO-8601 có múi giờ | `"2026-09-30T14:00:00+07:00"` |
| Phân trang | `?page=1&size=10` (bắt đầu từ 1, tối đa size = 50) | `{ "items": [...], "page": 1, "size": 10, "totalItems": 57, "totalPages": 6 }` |
| Sắp xếp | `?sort=publishedAt,desc` (chỉ các trường nằm trong whitelist) | |
| Thành công | Trả thẳng dữ liệu, HTTP status tự nói lên kết quả | `201` kèm `Location` khi tạo mới |
| Thao tác chuyển trạng thái | `POST /resource/{id}/{hành-động}` | `POST /api/applications/12/withdraw` |
| Idempotency | Các lệnh dính tiền nhận header `Idempotency-Key` | `POST /api/applications/{id}/hold` |

### Lỗi: ProblemDetail (RFC 9457)
```json
{
  "type": "https://giasu123.vn/problems/insufficient-xeng",
  "title": "Không đủ xèng",
  "status": 409,
  "detail": "Bạn cần thêm 340 xèng để nhận lớp này.",
  "instance": "/api/applications/12/hold",
  "code": "INSUFFICIENT_XENG",
  "shortfall": 340
}
```
Lỗi validate (400) có thêm `"errors": { "requirements": "Không được chứa số điện thoại hoặc liên kết" }`. Frontend gắn thẳng lỗi này vào đúng ô input.

| HTTP | Khi nào |
|------|---------|
| 400 | Dữ liệu không hợp lệ hoặc bị ContentGuard chặn |
| 401 | Chưa đăng nhập hoặc token hết hạn |
| 403 | Đã đăng nhập nhưng thiếu điều kiện (chưa xác thực email, chưa là gia sư VERIFIED) |
| 404 | Không tồn tại, **hoặc không phải của bạn** |
| 409 | Xung đột trạng thái (`INVALID_TRANSITION`, `CLASS_ALREADY_MATCHED`, `APPLICATION_LIMIT`, `INSUFFICIENT_XENG`) |
| 429 | Vượt rate limit |

## 2. Danh sách endpoint R1

### Xác thực và pháp lý (R1a)
| Method | Path | Quyền | Mô tả |
|--------|------|-------|-------|
| POST | `/api/auth/register` | Khách | Tạo tài khoản + danh sách `consentDocumentIds` → gửi email xác thực |
| POST | `/api/auth/verify-email` | Khách | `{token}` từ link trong email |
| POST | `/api/auth/verify-email/resend` | Thành viên | Gửi lại email xác thực |
| POST | `/api/auth/login` | Khách | Trả `{accessToken}`; nếu là admin thì trả `{otpRequired, challengeId}` |
| POST | `/api/auth/login/otp` | Khách | `{challengeId, code}` → `{accessToken}` |
| POST | `/api/auth/refresh` | Cookie | Cấp token mới (rotation) |
| POST | `/api/auth/logout` | Thành viên | Thu hồi refresh token |
| GET | `/api/auth/me` | Thành viên | Thông tin user, các vai trò, trạng thái gia sư, số dư xèng |
| GET | `/api/legal/{type}/current` | Khách | Nội dung Điều khoản, Chính sách, Nội quy nhận lớp đang hiệu lực |
| POST | `/api/me/consents` | Thành viên | Đồng ý phiên bản mới của văn bản pháp lý |

### Danh mục (R1a)
| Method | Path | Quyền | Mô tả |
|--------|------|-------|-------|
| GET | `/api/subjects` · `/api/areas?parentId=` | Khách | Môn học; địa giới theo từng cấp |

### Lớp (R1a–R1b)
| Method | Path | Quyền | Mô tả |
|--------|------|-------|-------|
| GET | `/api/classes` | Khách | Lọc theo `subjectId, provinceId, areaId, grade, studyMode, minFee, maxFee, q`. Chỉ trả `ClassPublicDto` |
| GET | `/api/classes/{id}` | Khách | Chi tiết công khai (không có trường 🔒) |
| POST | `/api/classes` | Thành viên đã xác thực email | Đăng lớp → `PENDING_REVIEW` |
| GET | `/api/me/classes` · `/api/me/classes/{id}` | Chủ lớp | `ClassOwnerDto`: đủ thông tin, trạng thái, lịch sử |
| PUT | `/api/me/classes/{id}` | Chủ lớp | Sửa khi lớp đang `PENDING_REVIEW` hoặc `REJECTED` |
| POST | `/api/me/classes/{id}/close` · `/extend` · `/reopen` | Chủ lớp | Đóng, gia hạn 30 ngày, tuyển lại (từ `CANCELLED_AUDIT`) |
| GET | `/api/me/classes/{id}/shortlist` | Chủ lớp | 2–3 ứng viên kèm lý do của admin |
| POST | `/api/me/classes/{id}/shortlist/renew` | Chủ lớp | Yêu cầu admin lập danh sách khác |
| POST | `/api/me/classes/{id}/select` | Chủ lớp | `{applicationId}` → đơn `SELECTED` |
| POST | `/api/me/classes/{id}/invites` | Chủ lớp | `{tutorId}` → đơn `INVITED` (tối đa 3 lời mời đang chờ) |

### Gia sư (R1a)
| Method | Path | Quyền | Mô tả |
|--------|------|-------|-------|
| GET | `/api/tutors` · `/api/tutors/{id}` | Khách | Chỉ gia sư VERIFIED; lọc theo môn, khu vực, hình thức, học phí, `q` (không dấu) |
| GET/PUT | `/api/me/tutor-profile` | Thành viên | Tạo hoặc sửa hồ sơ (bắt buộc đồng ý Nội quy nhận lớp) |
| POST | `/api/me/tutor-profile/submit` | Thành viên | Gửi xác minh → `PENDING` |
| POST | `/api/me/tutor-profile/documents` | Thành viên | Upload giấy tờ (multipart, R1d) |

### Đơn (R1b–R1c)
| Method | Path | Quyền | Mô tả |
|--------|------|-------|-------|
| POST | `/api/classes/{id}/applications` | Gia sư | Ứng tuyển `{message}` |
| GET | `/api/me/applications` · `/{id}` | Gia sư | Đơn của mình, kèm hạn chót |
| POST | `/api/applications/{id}/withdraw` | Gia sư của đơn | Rút đơn |
| POST | `/api/applications/{id}/accept-invite` · `/decline-invite` | Gia sư của đơn | Trả lời lời mời |
| GET | `/api/applications/{id}/fee-quote` | Gia sư của đơn | Phí, công thức, chính sách hoàn, số xèng còn thiếu |
| POST | `/api/applications/{id}/hold` | Gia sư của đơn | Giữ 100% phí (có header `Idempotency-Key`) → `CONTACTING` |
| GET | `/api/applications/{id}/contact` | Hai bên của đơn, sau HOLD | Họ tên, SĐT, địa chỉ |
| POST | `/api/applications/{id}/contact-report` | Gia sư | `{result: CONTACTED \| UNREACHABLE}` |
| POST | `/api/applications/{id}/contact-confirm` | Chủ lớp | Xác nhận đã liên hệ được |
| POST | `/api/applications/{id}/trial-done` | Gia sư | Báo đã dạy thử |
| POST | `/api/applications/{id}/trial-result` | Chủ lớp | `{result: CONTINUE \| NOT_FIT, reason}` |
| POST | `/api/applications/{id}/end` | Chủ lớp | Kết thúc lớp `{reason}` → gia sư có 48h phản đối |
| POST | `/api/applications/{id}/objection` | Gia sư | Phản đối → tạo báo cáo |
| POST | `/api/applications/{id}/quit` | Gia sư | Bỏ lớp → không hoàn, +1 strike |

### Ví xèng (R1c)
| Method | Path | Quyền | Mô tả |
|--------|------|-------|-------|
| GET | `/api/me/wallet` | Thành viên | `{available, held}` |
| GET | `/api/me/wallet/transactions` | Thành viên | Sổ cái của mình (phân trang) |
| POST | `/api/me/wallet/topups` | Gia sư | `{amountXeng}` → `{topupId, paymentUrl}` |
| GET | `/api/me/wallet/topups/{id}` | Chủ lệnh nạp | Trạng thái (trang kết quả sau Return URL) |
| GET | `/api/payments/vnpay/ipn` | VNPay (bắt buộc chữ ký) | Trả `{RspCode, Message}` |
| GET/PUT | `/api/me/payout-account` | Gia sư | Tài khoản nhận tiền |
| POST | `/api/me/wallet/withdrawals` | Gia sư | `{amountXeng}` |
| POST | `/api/dev/vnpay/simulate-ipn` | **Chỉ ở profile dev** | Giả lập IPN hợp lệ |

### Báo cáo và thông báo (R1b–R1c)
| Method | Path | Quyền | Mô tả |
|--------|------|-------|-------|
| POST | `/api/reports` | Thành viên | `{targetType, targetId, reason, description}` |
| GET | `/api/me/reports` | Thành viên | Báo cáo đã gửi |
| GET | `/api/me/notifications` · `/unread-count` | Thành viên | |
| POST | `/api/me/notifications/{id}/read` · `/read-all` | Thành viên | |

### Admin (`/api/admin/**`, bắt buộc vai trò ADMIN + phiên đã qua OTP)
| Method | Path | Mô tả |
|--------|------|-------|
| GET | `/api/admin/todo` | Số lượng và danh sách: lớp chờ duyệt, hồ sơ chờ xác minh, lớp cần shortlist (≥3 ứng viên/48h), báo cáo (SAFETY lên đầu), cờ nghi vấn, yêu cầu rút, học thử quá hạn |
| GET | `/api/admin/classes` · `/{id}` | Danh sách, chi tiết đầy đủ + lịch sử |
| POST | `/api/admin/classes/{id}/approve` | `{approvedFee, calledParent: true, studentDisplayName, note}` |
| POST | `/api/admin/classes/{id}/reject` | `{reason}` |
| GET | `/api/admin/classes/{id}/candidates` | Các đơn sắp theo `matchScore` |
| POST | `/api/admin/classes/{id}/shortlist` | `{items: [{applicationId, note}]}` (2–3 đơn) |
| GET | `/api/admin/tutors` · `/{id}` | Hàng đợi xác minh |
| GET | `/api/admin/tutors/{id}/documents/{docId}` | Xem giấy tờ (ghi `document_access_logs`) |
| POST | `/api/admin/tutors/{id}/verify` · `/reject` · `/suspend` · `/reinstate` | |
| GET | `/api/admin/reports` · POST `/{id}/resolve` | `{decisionCode, resolution, refundPercent?, lockTarget?}` |
| GET | `/api/admin/audit-flags` · POST `/{id}/check` | Ghi chú kết quả cuộc gọi khảo sát |
| GET | `/api/admin/withdrawals` · POST `/{id}/approve` · `/reject` · `/mark-paid` | `mark-paid` nhận `{transferRef}` |
| GET | `/api/admin/wallets/{userId}/transactions` · GET `/api/admin/reconciliation` | Tra cứu sổ cái, xem kết quả đối soát |
| POST | `/api/admin/wallets/{userId}/adjust` | `{amount, note}`, bắt buộc có ghi chú |
| GET/PUT | `/api/admin/settings` · `/fee-rules` · `/refund-policies` | Cấu hình |
| POST | `/api/admin/legal-documents` | Phát hành phiên bản văn bản mới |
| POST | `/api/admin/users/{id}/lock` · `/unlock` | |

### Vận hành
`GET /actuator/health` (công khai, chỉ trả trạng thái), `GET /actuator/info` (nội bộ).

## 3. Ghi chú cho react-admin
react-admin mặc định chờ header `Content-Range` và định dạng riêng của nó. Admin app sẽ dùng một **`dataProvider` tự viết**, chuyển `{items, totalItems}` sang `{data, total}`, và chuyển `page/size` từ tham số `pagination` của react-admin.
