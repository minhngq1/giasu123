# 03 — Luồng hoạt động và máy trạng thái

**Activity diagram** trả lời câu hỏi: các bước diễn ra theo thứ tự nào, ai làm bước nào.
**State diagram** trả lời câu hỏi: một đối tượng có thể ở những trạng thái nào, và chuyển sang trạng thái khác khi nào.

Mỗi state diagram bên dưới là **nguồn sự thật** cho enum tương ứng trong code: enum có hàm `canMoveTo(...)`, xem [05-backend.md](05-backend.md).

## Nguyên tắc chuyển trạng thái (áp dụng cho mọi máy trạng thái)

1. Enum kiểm tra xem bước chuyển có hợp lệ không.
2. Service ghi bằng **UPDATE có điều kiện**, ví dụ `UPDATE ... SET status = :to WHERE id = :id AND status = :from`. Nếu số dòng bị ảnh hưởng là 0, nghĩa là đã có luồng khác chuyển trạng thái trước → trả 409.
3. Ghi thêm một dòng vào `status_history` (thực thể, từ trạng thái, sang trạng thái, ai làm, ghi chú) **trong cùng transaction**.
4. Gửi thông báo và email **sau khi commit** (`@TransactionalEventListener(AFTER_COMMIT)`).

---

## 1. Activity — Đăng lớp và duyệt lớp

```mermaid
flowchart TD
    A([Thành viên mở form Đăng lớp]) --> B{Đã xác thực email?}
    B -->|Chưa| B1[Chuyển tới trang xác thực email] --> Z([Kết thúc])
    B -->|Rồi| C[Nhập thông tin lớp]
    C --> D{Validate + lọc SĐT/Zalo/link}
    D -->|Lỗi| C
    D -->|Nghi ngờ| E[Lưu kèm cờ nội dung]
    D -->|Sạch| F[Lưu lớp PENDING_REVIEW<br/>tính tên gọi]
    E --> F
    F --> G[Admin: gọi điện xác nhận phụ huynh]
    G --> H{Thông tin đúng?}
    H -->|Không| I[Từ chối kèm lý do<br/>REJECTED] --> J[Thông báo thành viên sửa] --> C
    H -->|Đúng| K[Chốt học phí, sửa tên gọi,<br/>đánh dấu đã gọi]
    K --> L[OPEN, hạn 30 ngày<br/>hiện ở danh sách công khai]
    L --> M([Thông báo thành viên])
```

## 2. Activity — Kết nối, giữ xèng, học thử (luồng tiền chính)

```mermaid
flowchart TD
    S{Chiều nào?}
    S -->|Gia sư ứng tuyển| A1[Đơn APPLIED<br/>tính match_score]
    S -->|PH mời| B1[Đơn INVITED]
    A1 --> A2{Lớp có ≥3 đơn<br/>hoặc mở ≥48h?}
    A2 -->|Chưa| A1
    A2 -->|Rồi| A3[Hiện ở Việc cần làm của admin]
    A3 --> A4[Admin chọn 2–3 đơn + lý do<br/>SHORTLISTED]
    A4 --> A5{PH quyết định}
    A5 -->|Đổi danh sách| A3
    A5 -->|Chọn một đơn| SEL
    B1 --> B2{Gia sư trả lời}
    B2 -->|Từ chối| B3[DECLINED]
    B2 -->|Đồng ý| SEL[Đơn SELECTED<br/>hạn giữ xèng 24h]
    SEL --> H1{Đủ xèng?}
    H1 -->|Thiếu N xèng| H2[Nạp đúng N qua VNPay] --> H1
    H1 -->|Quá 24h| X1[EXPIRED, +1 strike<br/>lớp tìm người khác]
    H1 -->|Đủ| H3[HOLD 100% phí<br/>CONTACTING, mở liên hệ]
    H3 --> C1{Gia sư báo trong 6h}
    C1 -->|Không liên lạc được| C2[Admin gọi phụ huynh]
    C2 -->|Sai liên hệ| C3[RELEASE 100%<br/>khóa lớp, báo cáo]
    C2 -->|Liên hệ được| T1
    C1 -->|Đã liên hệ<br/>hoặc quá 6h| T1[TRIAL<br/>dạy thử trong 7 ngày]
    T1 --> T2[Gia sư bấm Đã dạy thử]
    T2 --> T3{PH trong 48h}
    T3 -->|Tiếp tục<br/>hoặc im lặng| CAP[CAPTURE → ACTIVE<br/>bảo hành 30 ngày]
    T3 -->|Không phù hợp| R1[RELEASE theo quota<br/>lớp CANCELLED_AUDIT]
```

## 3. Activity — Sau khi lớp chạy: kết thúc, bỏ ngang, kiểm tra

```mermaid
flowchart TD
    A([Đơn ACTIVE, trong 30 ngày bảo hành]) --> B{Sự kiện}
    B -->|PH kết thúc lớp| C[Ghi lý do<br/>gia sư có 48h phản đối]
    C -->|Không phản đối| D[REFUND theo mốc ngày<br/>kể từ CAPTURE]
    C -->|Phản đối| E[Tạo báo cáo → admin phán quyết]
    B -->|Gia sư bỏ ngang| F[TUTOR_QUIT, không hoàn, +1 strike<br/>lớp mở lại OPEN có cờ ưu tiên]
    B -->|Hết 30 ngày| G[COMPLETED]
    H([Lớp CANCELLED_AUDIT]) --> I{PH chọn}
    I -->|Tuyển lại| J[OPEN]
    I -->|Đóng lớp| K[CLOSED + cờ nghi vấn<br/>admin gọi khảo sát ngẫu nhiên]
```

---

## 4. State — Lớp (`ClassStatus`)

```mermaid
stateDiagram-v2
    [*] --> PENDING_REVIEW: thành viên đăng
    PENDING_REVIEW --> OPEN: admin duyệt
    PENDING_REVIEW --> REJECTED: admin từ chối
    REJECTED --> PENDING_REVIEW: sửa và gửi lại
    OPEN --> SHORTLISTED: admin gửi shortlist
    SHORTLISTED --> OPEN: PH đổi danh sách
    OPEN --> MATCHING: gia sư nhận lời mời
    SHORTLISTED --> MATCHING: PH chọn gia sư
    MATCHING --> OPEN: đơn hết hạn giữ xèng
    MATCHING --> ACTIVE: CAPTURE
    MATCHING --> CANCELLED_AUDIT: học thử không phù hợp
    MATCHING --> CLOSED: liên hệ sai, admin khóa
    CANCELLED_AUDIT --> OPEN: PH tuyển lại
    CANCELLED_AUDIT --> CLOSED: PH đóng, gắn cờ
    ACTIVE --> OPEN: gia sư bỏ ngang, ưu tiên
    ACTIVE --> CLOSED: PH kết thúc lớp
    ACTIVE --> COMPLETED: hết 30 ngày bảo hành
    OPEN --> CLOSED: PH đóng hoặc hết 30 ngày
    SHORTLISTED --> CLOSED: PH đóng
    COMPLETED --> [*]
    CLOSED --> [*]
```

## 5. State — Đơn (`ApplicationStatus`)

```mermaid
stateDiagram-v2
    [*] --> APPLIED: gia sư ứng tuyển
    [*] --> INVITED: PH mời
    INVITED --> SELECTED: gia sư đồng ý
    INVITED --> DECLINED: gia sư từ chối hoặc quá 48h
    APPLIED --> WITHDRAWN: gia sư rút
    APPLIED --> SHORTLISTED: admin chọn vào shortlist
    APPLIED --> NOT_SELECTED: lớp đã có người hoặc đã đóng
    SHORTLISTED --> SELECTED: PH chọn
    SHORTLISTED --> NOT_SELECTED: PH chọn người khác hoặc đổi danh sách
    SELECTED --> EXPIRED: quá 24h chưa giữ xèng
    SELECTED --> CONTACTING: HOLD thành công
    CONTACTING --> TRIAL: đã liên hệ hoặc quá 6h
    CONTACTING --> UNREACHABLE: admin xác nhận sai liên hệ
    TRIAL --> ACTIVE: PH tiếp tục hoặc im lặng 48h
    TRIAL --> TRIAL_FAILED: PH không phù hợp
    ACTIVE --> ENDED_BY_PARENT: PH kết thúc, không bị phản đối
    ACTIVE --> TUTOR_QUIT: gia sư bỏ ngang
    ACTIVE --> COMPLETED: hết 30 ngày
    DECLINED --> [*]
    WITHDRAWN --> [*]
    NOT_SELECTED --> [*]
    EXPIRED --> [*]
    UNREACHABLE --> [*]
    TRIAL_FAILED --> [*]
    ENDED_BY_PARENT --> [*]
    TUTOR_QUIT --> [*]
    COMPLETED --> [*]
```

"Đơn đang chờ", dùng để tính giới hạn 5 đơn, là các đơn ở trạng thái `APPLIED`, `SHORTLISTED`, `SELECTED`.

> ⚠️ **Cần chủ dự án quyết:** nếu quá 7 ngày ở `TRIAL` mà gia sư chưa bấm "Đã dạy thử", đề xuất là hỏi phụ huynh và đưa vào hàng đợi admin. Admin chọn tiếp tục chờ, hoặc chuyển `TRIAL_FAILED` với tỉ lệ hoàn do admin định.

## 6. State — Khoản giữ phí (`FeeHoldStatus`)

```mermaid
stateDiagram-v2
    [*] --> HELD: HOLD 100% phí
    HELD --> SETTLED: CAPTURE và/hoặc RELEASE
    SETTLED --> SETTLED: REFUND sau khi đã CAPTURE
    SETTLED --> [*]
```

Hệ thống lưu số tiền của từng phần thay vì tạo thêm nhiều trạng thái. Luôn phải đúng **bất biến**:
`held = captured + released` (khi đã SETTLED) và `refunded ≤ captured`.
Ví dụ: hoàn 100% thì captured = 0, released = held. Vượt quota thì captured = 20% và released = 80%.

## 7. State — Lệnh nạp (`TopupStatus`), Báo cáo (`ReportStatus`), Rút xèng (`WithdrawalStatus`), Hồ sơ gia sư (`VerificationStatus`)

```mermaid
stateDiagram-v2
    state Topup {
        [*] --> PENDING: tạo lệnh, phiên 15 phút
        PENDING --> SUCCEEDED: IPN hợp lệ, số tiền khớp
        PENDING --> FAILED: IPN báo lỗi
        PENDING --> EXPIRED: quá phiên
        SUCCEEDED --> CHARGED_BACK: ngân hàng đòi lại
    }
```

```mermaid
stateDiagram-v2
    state Report {
        [*] --> OPEN_R: người dùng gửi
        OPEN_R --> IN_REVIEW: admin nhận xử lý
        IN_REVIEW --> RESOLVED: có kết luận, có thể kèm hoàn hoặc khóa
        IN_REVIEW --> DISMISSED: không đủ căn cứ
    }
```
`OPEN_R` trong sơ đồ tương ứng với `OPEN` trong code. Tên được đổi chỉ để không trùng với trạng thái của Lớp khi đọc sơ đồ.

```mermaid
stateDiagram-v2
    state Withdrawal {
        [*] --> REQUESTED: gia sư yêu cầu, xèng bị khóa
        REQUESTED --> APPROVED: admin duyệt
        REQUESTED --> REJECTED_W: admin từ chối, trả xèng
        APPROVED --> PAID: admin nhập mã chuyển khoản
    }
    state Verification {
        [*] --> DRAFT: tạo hồ sơ
        DRAFT --> PENDING_V: gửi xác minh
        PENDING_V --> VERIFIED: admin xác minh
        PENDING_V --> REJECTED_V: admin từ chối
        REJECTED_V --> PENDING_V: sửa và gửi lại
        VERIFIED --> SUSPENDED: vi phạm, quá nhiều strike
        SUSPENDED --> VERIFIED: admin gỡ
    }
```

---

## 8. Job định kỳ (`@Scheduled`, mỗi phút, dùng `Clock` inject)

| Job | Điều kiện | Hành động |
|-----|-----------|-----------|
| Hết hạn giữ xèng | Đơn `SELECTED` và `hold_deadline < now` | Đơn → `EXPIRED`, +1 strike; lớp `MATCHING` → `OPEN` |
| Hết hạn lời mời | Đơn `INVITED` quá 48h | Đơn → `DECLINED` |
| SLA liên hệ | Đơn `CONTACTING` quá 6h | Đơn → `TRIAL`, đánh dấu `refund_right_lost = true` |
| Tự chốt học thử | `TRIAL` đã có `trial_done_at` và quá 48h | CAPTURE → `ACTIVE` |
| Học thử quá hạn | `TRIAL` quá 7 ngày mà chưa có `trial_done_at` | Đưa vào hàng đợi admin |
| Hết cửa sổ phản đối | Có yêu cầu kết thúc lớp quá 48h mà không bị phản đối | REFUND theo mốc → `ENDED_BY_PARENT` |
| Hết bảo hành | `ACTIVE` quá 30 ngày kể từ CAPTURE | Đơn và lớp → `COMPLETED` |
| Hết hạn lớp | `OPEN`/`SHORTLISTED` và `expires_at < now` | → `CLOSED` |
| Hết phiên nạp | Topup `PENDING` quá 15 phút | → `EXPIRED` |
| Xóa CCCD | Giấy tờ của hồ sơ `VERIFIED` quá 30 ngày | Xóa file, giữ lại metadata |
| Đối soát (hằng ngày) | — | So số dư ví với sổ cái; so tổng TOPUP với các topup `SUCCEEDED`; lệch thì báo admin |

"Nhắc admin khi có ≥3 ứng viên hoặc lớp đã mở 48h" **không cần job**. Đây chỉ là một câu query trên màn "Việc cần làm".
