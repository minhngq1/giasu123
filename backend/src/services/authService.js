// Business logic xác thực — đăng ký, đăng nhập, lấy user
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const { PrismaClient } = require('@prisma/client')

const prisma = new PrismaClient()

const register = async ({ email, password, role }) => {
  const exists = await prisma.user.findUnique({ where: { email } })
  if (exists) throw new Error('Email đã được sử dụng')

  const hashed = await bcrypt.hash(password, 10)
  const user = await prisma.user.create({
    data: { email, password: hashed, role: role || 'STUDENT' },
  })

  const token = jwt.sign({ userId: user.id }, process.env.JWT_SECRET, { expiresIn: '7d' })
  return { user: { id: user.id, email: user.email, role: user.role }, token }
}

const login = async ({ email, password }) => {
  const user = await prisma.user.findUnique({ where: { email } })
  if (!user) throw new Error('Email hoặc mật khẩu không đúng')

  const valid = await bcrypt.compare(password, user.password)
  if (!valid) throw new Error('Email hoặc mật khẩu không đúng')

  const token = jwt.sign({ userId: user.id }, process.env.JWT_SECRET, { expiresIn: '7d' })
  return { user: { id: user.id, email: user.email, role: user.role }, token }
}

const getMe = async (userId) => {
  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: { id: true, email: true, role: true, createdAt: true },
  })
  if (!user) throw new Error('Không tìm thấy người dùng')
  return user
}

module.exports = { register, login, getMe }
