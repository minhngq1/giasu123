// Middleware xử lý lỗi toàn cục — trả về response lỗi nhất quán
const errorHandler = (err, req, res, next) => {
  const status = err.status || 500
  res.status(status).json({
    success: false,
    message: err.message || 'Lỗi máy chủ, vui lòng thử lại sau',
  })
}

module.exports = errorHandler
