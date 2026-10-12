// Văn bản pháp lý phiên bản 1 (bản tóm tắt cho demo — kinh doanh thật cần luật sư soạn).
// Hiển thị dạng CHỮ THUẦN (không HTML) → không cần dangerouslySetInnerHTML, không có nguy cơ XSS.
// `id` khớp bảng legal_documents → gửi kèm khi đăng ký (consentDocumentIds).

export const LEGAL_DOCS = {
  terms: {
    id: 1, type: 'TERMS', version: 1, effectiveAt: '2026-10-01', title: 'Điều khoản dịch vụ',
    sections: [
      { heading: '1. Phạm vi dịch vụ', paragraphs: [
        'Giasu123 là nền tảng kết nối phụ huynh/học sinh với gia sư. Phụ huynh đăng lớp miễn phí; gia sư trả phí môi giới khi nhận lớp thành công.',
        'Nền tảng xác minh thông tin lớp (gọi điện cho phụ huynh) và giấy tờ gia sư trước khi hiển thị công khai.',
      ] },
      { heading: '2. Tài khoản', paragraphs: [
        'Bạn chịu trách nhiệm bảo mật mật khẩu và mọi hoạt động trên tài khoản của mình.',
        'Mỗi người dùng một tài khoản. Một tài khoản có thể vừa đăng lớp vừa làm gia sư.',
      ] },
      { heading: '3. Hành vi bị cấm', paragraphs: [
        'Ghi số điện thoại, Zalo, email hoặc đường link trong các ô mô tả để trao đổi riêng, né phí.',
        'Đăng thông tin sai sự thật, giả mạo giấy tờ, quấy rối hoặc gây nguy hiểm cho học sinh.',
      ] },
      { heading: '4. Phí và hoàn phí', paragraphs: [
        'Phí môi giới = học phí/buổi × số buổi/tuần × 4 × tỷ lệ phí (ONLINE 30%, OFFLINE 40%), tính bằng xèng (1 xèng = 1.000đ).',
        'Cách hoàn phí được quy định chi tiết trong Nội quy nhận lớp.',
      ] },
    ],
  },
  privacy: {
    id: 2, type: 'PRIVACY', version: 1, effectiveAt: '2026-10-01', title: 'Chính sách xử lý dữ liệu cá nhân',
    sections: [
      { heading: '1. Dữ liệu chúng tôi thu thập', paragraphs: [
        'Họ tên, email, số điện thoại, thông tin lớp học; với gia sư: hồ sơ giảng dạy và ảnh giấy tờ để xác minh.',
      ] },
      { heading: '2. Hiển thị công khai', paragraphs: [
        'Danh sách lớp chỉ hiện tên gọi của học sinh (ví dụ "Bạn An") và quận/huyện. Họ tên đầy đủ, số nhà, số điện thoại chỉ được mở cho gia sư đã giữ phí nhận lớp.',
      ] },
      { heading: '3. Lưu trữ và xóa', paragraphs: [
        'Ảnh CCCD được tự động xóa sau 30 ngày kể từ khi hồ sơ được xác minh. Khi bạn xóa tài khoản, thông tin cá nhân được ẩn danh hóa; lịch sử giao dịch được giữ để đối soát.',
      ] },
      { heading: '4. Quyền của bạn', paragraphs: [
        'Bạn có quyền xem, sửa, rút lại sự đồng ý và yêu cầu xóa dữ liệu theo Nghị định 13/2023/NĐ-CP.',
      ] },
    ],
  },
  'tutor-rules': {
    id: 3, type: 'TUTOR_RULES', version: 1, effectiveAt: '2026-10-01', title: 'Nội quy nhận lớp',
    sections: [
      { heading: '1. Giữ phí khi được chọn', paragraphs: [
        'Khi được phụ huynh chọn, bạn có 24 giờ để giữ 100% phí nhận lớp bằng xèng. Sau khi giữ phí, thông tin liên hệ được mở.',
      ] },
      { heading: '2. Liên hệ và học thử', paragraphs: [
        'Bạn cần báo "Đã liên hệ" hoặc "Không liên lạc được" trong 6 giờ. Buổi học thử diễn ra trong 7 ngày.',
      ] },
      { heading: '3. Hoàn phí', paragraphs: [
        'Không liên lạc được phụ huynh (đã được xác nhận): hoàn 100%.',
        'Học thử không phù hợp: hoàn 100%; từ lần thứ 3 trong tháng hoàn 80%.',
        'Phụ huynh kết thúc lớp sau khi đã chốt phí: ngày 1–14 hoàn 50%, ngày 15–21 hoàn 20%, từ ngày 22 không hoàn.',
        'Gia sư tự bỏ lớp hoặc vi phạm nội quy: không hoàn.',
      ] },
    ],
  },
  safety: {
    id: null, type: 'SAFETY', version: 1, effectiveAt: '2026-10-01', title: 'Hướng dẫn an toàn',
    sections: [
      { heading: 'Cho phụ huynh', paragraphs: [
        'Buổi đầu tiên nên có người lớn ở nhà. Không chuyển tiền cọc trực tiếp cho gia sư — mọi khoản phí đi qua nền tảng.',
      ] },
      { heading: 'Cho gia sư', paragraphs: [
        'Chỉ nhận lớp trên nền tảng. Báo cáo ngay nếu thông tin lớp sai sự thật hoặc bạn cảm thấy không an toàn.',
      ] },
      { heading: 'Báo cáo vi phạm', paragraphs: [
        'Liên hệ hotline hoặc dùng nút "Báo cáo" trong trang lớp/đơn. Báo cáo liên quan an toàn được ưu tiên xử lý đầu tiên.',
      ] },
    ],
  },
}

export const REGISTER_CONSENT_IDS = [LEGAL_DOCS.terms.id, LEGAL_DOCS.privacy.id]
