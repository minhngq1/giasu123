// Công thức phí môi giới (04-database.md mục 5b) — hàm thuần, có test.
// Ở hệ thống thật, BACKEND tính và trả về; frontend chỉ hiển thị. Hàm này dùng cho mock và để giải thích công thức.
//   base_fee_vnd = approved_fee × sessions_per_week × 4
//   fee_vnd      = base_fee_vnd × percent / 100
//   amount_xeng  = ceil(fee_vnd / 1000)

export const DEFAULT_FEE_RULES = { ONLINE: 30, OFFLINE: 40 }
export const VND_PER_XENG = 1000

export function calculateFee({ approvedFee, sessionsPerWeek, studyMode }, rules = DEFAULT_FEE_RULES) {
  if (!approvedFee || !sessionsPerWeek) return null
  const percent = rules[studyMode]
  const baseFeeVnd = approvedFee * sessionsPerWeek * 4
  // Tính bằng số nguyên (×percent rồi mới /100) để tránh sai số dấu phẩy động
  const feeVnd = Math.round((baseFeeVnd * percent) / 100)
  return { baseFeeVnd, percent, feeVnd, amountXeng: Math.ceil(feeVnd / VND_PER_XENG) }
}
