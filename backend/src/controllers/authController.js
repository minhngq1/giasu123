// Controller xác thực — xử lý request/response, gọi authService
const authService = require('../services/authService')

const register = async (req, res, next) => {
  try {
    const result = await authService.register(req.body)
    res.status(201).json({ success: true, data: result })
  } catch (err) {
    next(err)
  }
}

const login = async (req, res, next) => {
  try {
    const result = await authService.login(req.body)
    res.json({ success: true, data: result })
  } catch (err) {
    next(err)
  }
}

const getMe = async (req, res, next) => {
  try {
    const result = await authService.getMe(req.userId)
    res.json({ success: true, data: result })
  } catch (err) {
    next(err)
  }
}

module.exports = { register, login, getMe }
