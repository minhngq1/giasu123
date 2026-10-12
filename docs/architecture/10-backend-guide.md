# 10 — Hướng dẫn viết backend (quy tắc + hợp đồng với frontend)

> **Đọc file này trước khi viết bất kỳ dòng Java/SQL nào.** Áp dụng cho người và cho AI (Claude Sonnet/Opus).
> Thứ tự nguồn sự thật khi có mâu thuẫn: **file này (mục 4 — hợp đồng frontend)** > `07-api.md` > `05-backend.md` > `04-database.md`.
> Lý do: frontend đã chạy xong với dữ liệu giả đúng các hình dạng ở mục 4; backend lệch một tên trường là trang hỏng.

---

## 1. Môi trường thật (đã kiểm tra trên máy, 2026-10-12)

| Thứ | Phiên bản | Bẫy hay gặp (AI hay viết theo bản cũ) |
|-----|-----------|----------------------------------------|
| Spring Boot | **4.1.1** (Spring Framework 7.0) | Starter web tên là `spring-boot-starter-webmvc` (không phải `-web`). Test starter tách theo module: `spring-boot-starter-webmvc-test`, `-data-jpa-test`... |
| Java | 21 | Dùng `record`, `switch` biểu thức, `var` có chừng mực |
| Jackson | **3.x** | Package là **`tools.jackson.*`** (không phải `com.fasterxml.jackson.*`); annotation vẫn ở `com.fasterxml.jackson.annotation` |
| Hibernate | 7.x | `jakarta.persistence.*` |
| Flyway | 12.x | Cần `flyway-database-postgresql` (đã có trong pom) |
| Testcontainers | **2.x** | Artifact có tiền tố: `testcontainers-postgresql`, `testcontainers-junit-jupiter`. Kết hợp `spring-boot-testcontainers` + `@ServiceConnection` |
| springdoc / jjwt / Bucket4j | **chưa thêm** | Trước khi thêm: đọc trang chính thức để chọn bản **tương thích Spring Boot 4**. springdoc 2.x là cho Boot 3 → không dùng |

Quy tắc: thêm thư viện mới thì **ghi lý do + phiên bản** vào CLAUDE.md mục 2 và chạy `./mvnw verify` xanh trước khi commit.

---

## 2. Quy trình làm 1 endpoint (Definition of Done)

Làm theo **lát dọc**, mỗi lát = 1 nhánh `feature/...`. Một endpoint chỉ "xong" khi đủ 8 bước:

1. **Migration** Flyway mới (nếu cần bảng/cột) — mục 5.
2. **Entity + enum trạng thái** (`canMoveTo`) — mục 3.2, 3.3.
3. **Repository** (query có tham số; UPDATE có điều kiện cho chuyển trạng thái).
4. **Service** `@Transactional` + **unit test** (JUnit 5 + Mockito, `Clock` cố định).
5. **DTO `record`** request/response **đúng y mục 4** + Bean Validation.
6. **Controller** mỏng (chỉ nhận/trả, không có logic).
7. **Integration test** MockMvc + Testcontainers: đường đi đúng, 400 validate, 401/403, **404 khi gọi tài nguyên của người khác (IDOR)**.
8. **Nối frontend**: `frontend/.env.local` đặt `VITE_USE_MOCK=false`, chạy luồng tương ứng trên trình duyệt. Nếu backend buộc phải khác hợp đồng → sửa `features/*/api.js` **và** cập nhật mục 4 file này trong cùng commit.

---

## 3. Quy ước code (kèm mẫu — viết đúng y mẫu)

### 3.1 Package & tên file
```
vn.giasu123.<tính năng>/
  ClassRequest.java            ← Entity (danh từ số ít)
  ClassStatus.java             ← enum trạng thái
  ClassRequestRepository.java
  ClassRequestService.java
  ClassRequestController.java  ← /api/classes...
  MyClassController.java       ← /api/me/classes... (tách theo nhóm quyền cho dễ đọc SecurityConfig)
  dto/ClassCreateRequest.java · dto/ClassPublicDto.java · dto/ClassOwnerDto.java
```
- Package này chỉ gọi **Service** của package khác. Không gọi Repository của nhau.
- Tiêm phụ thuộc bằng **constructor** (`@RequiredArgsConstructor` + field `private final`). **Cấm** `@Autowired` trên field.

### 3.2 Enum trạng thái — luật chuyển nằm trong enum
```java
public enum ClassStatus {
    PENDING_REVIEW, REJECTED, OPEN, SHORTLISTED, MATCHING, ACTIVE, CANCELLED_AUDIT, COMPLETED, CLOSED;

    private static final Map<ClassStatus, Set<ClassStatus>> NEXT = Map.of(
        PENDING_REVIEW, EnumSet.of(OPEN, REJECTED, CLOSED),
        REJECTED,       EnumSet.of(PENDING_REVIEW, CLOSED),
        OPEN,           EnumSet.of(SHORTLISTED, MATCHING, CLOSED)
        // ... chép đủ từ 03-flows-states.md mục 4
    );

    public boolean canMoveTo(ClassStatus to) {
        return NEXT.getOrDefault(this, Set.of()).contains(to);
    }
}
```

### 3.3 Chuyển trạng thái = kiểm enum → UPDATE có điều kiện → ghi lịch sử
```java
// Repository
@Modifying
@Query("update ClassRequest c set c.status = :to, c.updatedAt = :now where c.id = :id and c.status = :from")
int moveStatus(@Param("id") Long id, @Param("from") ClassStatus from, @Param("to") ClassStatus to, @Param("now") Instant now);

// Service
@Transactional
public ClassOwnerDto close(Long ownerId, Long classId) {
    ClassRequest c = repo.findByIdAndOwnerId(classId, ownerId)              // của người khác → 404
        .orElseThrow(() -> new NotFoundException("Không tìm thấy lớp."));
    if (!c.getStatus().canMoveTo(CLOSED)) throw new ConflictException("INVALID_TRANSITION", "Không thể đóng lớp ở trạng thái hiện tại.");
    if (repo.moveStatus(classId, c.getStatus(), CLOSED, Instant.now(clock)) == 0)  // luồng khác đổi trước → 409
        throw new ConflictException("INVALID_TRANSITION", "Lớp vừa thay đổi, vui lòng tải lại.");
    statusHistory.record("CLASS", classId, c.getStatus(), CLOSED, ownerId, "Phụ huynh đóng lớp");
    events.publishEvent(new ClassClosed(classId));                            // gửi thông báo SAU commit
    return ClassOwnerDto.from(repo.findById(classId).orElseThrow());
}
```

### 3.4 DTO = `record` viết tay, có `static from(...)`
```java
public record ClassPublicDto(Long id, String studentDisplayName, String studentGender, int grade,
                             List<SubjectDto> subjects, /* ... đủ trường mục 4.4 ... */ FeeEstimateDto feeEstimate) {
    public static ClassPublicDto from(ClassRequest c, FeeEstimateDto fee) { ... }
}
```
- DTO công khai **không bao giờ** có: `studentName`, `parentName`, `contactPhone`, `addressDetail`, email, mật khẩu, token.
- **Cấm** trả Entity ra controller. **Cấm** dùng MapStruct/ModelMapper (đã chốt: viết tay).

### 3.5 Lỗi = ProblemDetail + `code` (+ `errors` khi 400)
```java
public abstract class AppException extends RuntimeException {
    private final HttpStatus status; private final String code;
}
public class ConflictException extends AppException { ... 409 }
public class NotFoundException extends AppException { ... 404, code = "NOT_FOUND" }

@RestControllerAdvice
class GlobalExceptionHandler {
    @ExceptionHandler(AppException.class)
    ProblemDetail handle(AppException e) {
        ProblemDetail p = ProblemDetail.forStatusAndDetail(e.getStatus(), e.getMessage());
        p.setTitle(e.getMessage());
        p.setProperty("code", e.getCode());
        return p;
    }
    @ExceptionHandler(MethodArgumentNotValidException.class)  // → 400 VALIDATION_FAILED + errors {field: message}
    ...
}
```
- Thông điệp lỗi viết **tiếng Việt, cho người dùng đọc**. Không lộ stack trace, tên bảng, câu SQL.
- Mã `code` dùng đúng danh sách mục 4.7 (frontend so sánh theo mã).

### 3.6 Những thứ bắt buộc khác
| Chủ đề | Quy tắc |
|--------|---------|
| Thời gian | `Instant.now(clock)` với bean `Clock`. **Cấm** `LocalDateTime.now()`, `new Date()`. JSON trả ISO-8601 có múi giờ |
| Tiền | `long` / `BIGINT`. **Cấm** `double`, `float` |
| SQL | Spring Data / JPQL có `:param`. **Cấm** nối chuỗi |
| Ví | Mọi thao tác ví: `findByIdForUpdate` (`@Lock(PESSIMISTIC_WRITE)`) trong cùng transaction |
| Cấu hình nghiệp vụ | 24h, 6h, 48h, % phí... đọc từ `app_settings` / `fee_rules` qua Service. **Không hard-code** |
| Ô chữ tự do | Qua `ContentGuard` (cùng luật với `frontend/src/lib/contentGuard.js`) |
| Log | SLF4J (`@Slf4j`). Che SĐT/email. **Cấm** `System.out`, cấm log mật khẩu/token/OTP |
| Gửi email/thông báo | `@TransactionalEventListener(phase = AFTER_COMMIT)` — không gửi trong transaction |

---

## 4. Hợp đồng với frontend (phải khớp từng tên trường)

> Nguồn: `frontend/src/features/*/mock.js` (dữ liệu giả) và `features/*/api.js` (đường dẫn thật).
> Chung: JSON `camelCase` · enum `UPPER_SNAKE` · tiền là số nguyên VNĐ · thời gian ISO-8601 · giá trị chưa có → `null` (không bỏ trường) · **mảng không bao giờ `null`, rỗng thì `[]`**.

### 4.1 Phân trang (mọi danh sách)
`?page=1&size=10` (1-based, `size` ≤ 50, mặc định 10) →
```json
{ "items": [ ... ], "page": 1, "size": 10, "totalItems": 57, "totalPages": 6 }
```
`page` vượt quá → trả trang cuối (frontend đọc `page` trong response để hiển thị).

### 4.2 Xác thực
| Gọi | Body gửi lên | Trả về |
|-----|--------------|--------|
| `POST /api/auth/register` | `{ fullName, phone, email, password, consentDocumentIds: [1, 2] }` | `202 { "message": "Nếu email hợp lệ, chúng tôi đã gửi hướng dẫn xác thực..." }` — **giống hệt nhau dù email đã tồn tại** |
| `POST /api/auth/verify-email` | `{ token }` | `200 { "email": "..." }` · sai → `400 INVALID_TOKEN` |
| `POST /api/auth/verify-email/resend` | — (cần đăng nhập) | `200 { "message": "..." }` |
| `POST /api/auth/login` | `{ email, password }` | `200 { "accessToken": "..." }` + Set-Cookie refresh · admin → `{ "otpRequired": true, "challengeId": "..." }` · sai → `401 BAD_CREDENTIALS` "Email hoặc mật khẩu không đúng." |
| `POST /api/auth/refresh` | — (cookie) | `200 { "accessToken": "..." }` · hỏng → `401 REFRESH_INVALID` |
| `POST /api/auth/logout` | — | `204` |
| `GET /api/auth/me` | — | **MeDto** bên dưới |

```json
// MeDto
{ "id": 2, "email": "giasu@demo.vn", "fullName": "Nguyễn Thị Hương", "phone": "0912000002",
  "emailVerified": true, "roles": ["MEMBER"],
  "tutorStatus": "VERIFIED",          // null | DRAFT | PENDING | VERIFIED | REJECTED | SUSPENDED
  "xengAvailable": 1160,              // null nếu chưa là gia sư VERIFIED
  "unreadNotifications": 3 }          // R1a chưa có thông báo → trả 0
```
Cookie refresh: `HttpOnly; Secure; SameSite=Strict; Path=/api/auth`. Khi dev qua Vite proxy (`localhost`) cookie `Secure` vẫn hoạt động vì `localhost` được coi là ngữ cảnh an toàn.

### 4.3 Gia sư
`GET /api/tutors?provinceName=&subjectId=&studyMode=&grade=&minFee=&maxFee=&q=&sort=&page=&size=9`
- `sort`: `featured` (mặc định) | `newest` | `feeAsc` | `feeDesc`. `q` tìm **không dấu** theo tên + môn (`unaccent`).
- `grade`: gia sư có `minGrade ≤ grade ≤ maxGrade`. `studyMode=ONLINE` → `teachesOnline`, `OFFLINE` → `teachesOffline`.
- Chỉ trả gia sư `VERIFIED`.

```json
// TutorPublicDto (danh sách + GET /api/tutors/{id})
{ "id": 1000, "fullName": "Nguyễn Thị Hương", "avatarUrl": null, "gender": "FEMALE",
  "tutorType": "GIAO_VIEN", "schoolOrWorkplace": "ĐH Sư phạm Hà Nội", "bio": "...",
  "experienceYears": 5, "subjects": [{ "id": 1, "name": "Toán" }],
  "provinceName": "Hà Nội", "areaNames": ["Cầu Giấy"],
  "teachesOnline": true, "teachesOffline": true, "minGrade": 6, "maxGrade": 12,
  "expectedFee": 150000, "rating": null, "verified": true, "verifiedAt": "2026-09-30T14:00:00+07:00" }
```
`rating`: R1 chưa có đánh giá → `null`; frontend hiện nhãn "Gia sư mới" (xem nợ kỹ thuật TD-03).

`GET /api/me/tutor-profile` — **chưa có hồ sơ vẫn trả 200** với `verificationStatus: null` và các trường rỗng:
```json
// TutorProfileDto (GET, và là response của PUT / submit)
{ "fullName": "Trần Thu Hà", "gender": null, "birthYear": null, "phone": "0912000001", "tutorType": null,
  "schoolOrWorkplace": null, "experienceYears": 0, "subjectIds": [], "provinceName": null, "areaNames": [],
  "teachesOnline": false, "teachesOffline": true, "minGrade": 1, "maxGrade": 12, "expectedFee": null,
  "bio": null, "acceptedTutorRules": false, "verificationStatus": null, "verifyNote": null, "updatedAt": null }
// fullName/phone lấy sẵn từ tài khoản cho đỡ gõ lại
```
`PUT /api/me/tutor-profile` body = các trường trên (trừ `verificationStatus`, `verifyNote`, `updatedAt`), `subjectIds` là số.
Luật: đang `PENDING` → `409 INVALID_TRANSITION`; sửa hồ sơ `VERIFIED`/`REJECTED` → về `DRAFT`; `bio` có SĐT/link → `400` + `errors.bio`.
`POST /api/me/tutor-profile/submit` → profile với `PENDING` · chưa lưu → `409 PROFILE_INCOMPLETE`.

### 4.4 Lớp
`GET /api/classes?provinceName=&subjectId=&grade=&studyMode=&minFee=&maxFee=&q=&sort=&page=&size=` — chỉ lớp `OPEN`, `SHORTLISTED`; `sort`: `newest` (mặc định) | `feeDesc` | `feeAsc`.

```json
// ClassPublicDto (danh sách + GET /api/classes/{id})
{ "id": 1024, "studentDisplayName": "Bạn An", "studentGender": "MALE", "grade": 12,
  "subjects": [{ "id": 1, "name": "Toán" }], "otherSubjectNote": "",
  "studyMode": "OFFLINE", "sessionsPerWeek": 3, "minutesPerSession": 90, "approvedFee": 200000,
  "provinceName": "Hà Nội", "districtName": "Cầu Giấy",
  "scheduleNote": "Tối thứ 2, 4, 6", "preferredTutorGender": "FEMALE", "preferredTutorType": "ANY",
  "requirements": "...", "status": "OPEN", "applicantCount": 4, "publishedAt": "...",
  "feeEstimate": { "baseFeeVnd": 2400000, "percent": 40, "feeVnd": 960000, "amountXeng": 960 } }
```
`feeEstimate` do **server tính** (công thức `04-database.md` mục 5b; test đối chiếu `frontend/src/features/classes/fee.test.js`). Chưa chốt học phí → `null`.

```json
// ClassOwnerDto (GET /api/me/classes, /api/me/classes/{id}; response của POST /api/classes, PUT, close)
// = ClassPublicDto + các trường sau:
{ "studentName": "Nguyễn Văn An", "parentName": "Trần Thu Hà", "contactPhone": "0912000001",
  "addressDetail": "12 Trần Thái Tông", "feeMode": "FIXED", "proposedFee": 180000, "subjectIds": [1, 2],
  "rejectReason": null, "createdAt": "...",
  "history": [{ "toStatus": "PENDING_REVIEW", "at": "...", "note": "Phụ huynh đăng lớp" }] }
```

`POST /api/classes` (→ `201` + ClassOwnerDto) và `PUT /api/me/classes/{id}` cùng body:
```json
{ "studentName": "...", "studentGender": "MALE", "parentName": "", "contactPhone": "0912345678",
  "grade": 9, "subjectIds": [1], "otherSubjectNote": "", "studyMode": "OFFLINE",
  "feeMode": "CONSULT", "proposedFee": null, "sessionsPerWeek": 3, "minutesPerSession": 90,
  "provinceName": "Hà Nội", "districtName": "Cầu Giấy", "addressDetail": "12 Trần Thái Tông",
  "scheduleNote": "", "preferredTutorGender": "ANY", "preferredTutorType": "ANY", "requirements": "" }
```
Luật: chưa xác thực email → `403 EMAIL_NOT_VERIFIED` · lỗi validate/ContentGuard → `400 VALIDATION_FAILED` + `errors.<tên trường>` · PUT khi lớp không ở `PENDING_REVIEW`/`REJECTED` → `409 INVALID_TRANSITION`; PUT lớp `REJECTED` → về `PENDING_REVIEW` · `POST /api/me/classes/{id}/close` cho phép từ `PENDING_REVIEW`, `REJECTED`, `OPEN`, `SHORTLISTED`.
`studentDisplayName` = "Bạn " + từ cuối của `studentName` (server tính).

### 4.5 Tỉnh/quận gửi bằng **tên** (quyết định tạm cho R1a)
Frontend đang dùng danh sách tĩnh **63 tỉnh + quận/huyện của 10 tỉnh lớn** (`frontend/src/constants/catalog.js`), các tỉnh còn lại người dùng **gõ tay** quận/huyện.
Vì vậy R1a backend:
- Nhận `provinceName` (bắt buộc khớp đúng tên 1 tỉnh trong bảng `areas` → không khớp thì `400 errors.provinceName`) và `districtName` (chữ tự do ≤ 100 ký tự).
- Lưu `province_id` (FK) **+** cột chữ `district_name` (hiển thị). `area_id` để `NULL` khi chưa khớp được quận.
- Seed `areas`: chép đúng tên trong `catalog.js` (kể cả "TP. Hồ Chí Minh") để khớp chuỗi.
- Ghi nhận là nợ kỹ thuật **TD-01** (chuyển sang `provinceId/areaId` khi frontend đọc `/api/areas`).

### 4.6 Văn bản pháp lý
Frontend đang hiển thị nội dung tĩnh (`frontend/src/features/legal/content.js`) và gửi `consentDocumentIds: [1, 2]` khi đăng ký → seed `legal_documents` với **id 1 = TERMS v1, id 2 = PRIVACY v1, id 3 = TUTOR_RULES v1** (TD-02).

### 4.7 Mã lỗi frontend đang dùng
| HTTP | `code` | Khi nào |
|------|--------|---------|
| 400 | `VALIDATION_FAILED` | Bean Validation / ContentGuard — kèm `errors: { field: message }` |
| 400 | `INVALID_TOKEN` | Link xác thực email sai/hết hạn |
| 401 | `BAD_CREDENTIALS` · `REFRESH_INVALID` · `UNAUTHENTICATED` | Đăng nhập sai · refresh hỏng · chưa đăng nhập |
| 403 | `EMAIL_NOT_VERIFIED` | Đăng lớp khi chưa xác thực email |
| 404 | `NOT_FOUND` | Không tồn tại **hoặc không phải của bạn** |
| 409 | `INVALID_TRANSITION` · `PROFILE_INCOMPLETE` | Sai trạng thái · gửi xác minh khi chưa lưu hồ sơ |
| 429 | `RATE_LIMITED` | Kèm header `Retry-After` |

Thêm mã mới → thêm vào bảng này.

---

## 5. Flyway / SQL

- File: `backend/src/main/resources/db/migration/V{n}__{mo_ta_snake_case}.sql` — `V1__init.sql`, `V2__seed_catalog.sql`...
- **Không bao giờ sửa file đã chạy** (kể cả trên máy dev) → sai thì viết `V{n+1}__fix_...sql`.
- Tên: bảng số nhiều `snake_case`; ràng buộc đặt tên rõ: `pk_`, `fk_<bảng>_<cột>`, `uq_`, `ck_`, `ix_`.
- Kiểu: khóa `BIGINT GENERATED ALWAYS AS IDENTITY` · tiền `BIGINT` · thời gian `TIMESTAMPTZ` · trạng thái `VARCHAR(30) + CHECK (status IN (...))`.
- Mỗi index trong `04-database.md` mục 6 phải có; thêm index mới thì ghi lý do và kiểm bằng `EXPLAIN ANALYZE`.
- Dữ liệu demo (tài khoản `phuhuynh@demo.vn`, `giasu@demo.vn`...) để trong **script seed riêng** (profile `dev`), không nằm trong migration.
- Hai cột đề xuất (đã ghi ⬜ ở `04-database.md`): `class_requests.schedule_note`, `tutor_profiles.min_grade/max_grade` — **frontend đã dùng**, nên đưa luôn vào `V1__init.sql` nếu chủ dự án đồng ý. Thêm `class_requests.district_name` (mục 4.5).

---

## 6. Test

| Loại | Bắt buộc cho | Ghi chú |
|------|--------------|---------|
| Unit (JUnit 5 + Mockito + AssertJ) | Mọi `canMoveTo`, `FeeCalculator`, `ContentGuard`, `DisplayNameResolver`, mọi nhánh lỗi của Service | `Clock.fixed(...)`, không `Thread.sleep` |
| Integration (MockMvc + Testcontainers PostgreSQL 16) | Mọi endpoint | Flyway chạy thật; **không dùng H2** |
| IDOR | Mọi `/api/me/**` | User B gọi tài nguyên của A → 404 |
| Race | Chọn gia sư, giữ xèng, IPN | 2 luồng (`CountDownLatch`) → chỉ 1 thành công |
| Hợp đồng | Mỗi DTO ở mục 4 | Assert **tên trường** bằng `jsonPath("$.studentDisplayName")`; assert DTO công khai **không có** `$.contactPhone` |

Tên test: `hanhDong_khiDieuKien_thiKetQua` hoặc tiếng Anh `close_whenAlreadyActive_returns409` — chọn 1 kiểu và giữ nhất quán.

---

## 7. Danh sách "không được làm"

- Trả Entity ra API · `@Autowired` field · logic nghiệp vụ trong Controller · `catch (Exception e) {}` nuốt lỗi.
- Nối chuỗi SQL · `double` cho tiền · `LocalDateTime.now()` · hard-code thời hạn/phần trăm.
- Gửi email trong transaction · log dữ liệu nhạy cảm · commit file `.env`.
- `ddl-auto` khác `validate` · sửa migration cũ · tắt test cho "xanh" · đổi tên trường JSON mà không sửa frontend + mục 4.

---

## 8. Thứ tự làm R1a (gợi ý, mỗi dòng = 1 nhánh)

1. `feature/db-init` — `V1__init.sql` (bảng R1a) + `V2__seed_catalog.sql` (môn, 63 tỉnh, `fee_rules`, `app_settings`, văn bản pháp lý id 1–3) + test Flyway chạy được.
2. `feature/common` — `GlobalExceptionHandler`, `PageResponse`, `ClockConfig`, `ContentGuard`, `StatusHistory`.
3. `feature/auth` — register/verify/login/refresh/logout/me + SecurityConfig + Mailpit + Bucket4j.
4. `feature/classes` — public list/detail + me/classes CRUD + close.
5. `feature/tutors` — public list/detail + me/tutor-profile + submit.
6. `feature/admin-r1a` — duyệt lớp, xác minh gia sư (API trước, app admin sau).

Sau mỗi nhánh: chạy `frontend` với `VITE_USE_MOCK=false` cho đúng các trang liên quan.
