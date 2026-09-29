// Business logic học sinh — truy vấn và tạo dữ liệu qua Prisma
const { PrismaClient } = require('@prisma/client')

const prisma = new PrismaClient()

const getStudents = async ({ subject, district, city, page = 1, limit = 10 }) => {
  const where = {}
  if (subject) where.subjects = { has: subject }
  if (district) where.district = { contains: district, mode: 'insensitive' }
  if (city) where.city = { contains: city, mode: 'insensitive' }

  const [students, total] = await Promise.all([
    prisma.student.findMany({
      where,
      skip: (Number(page) - 1) * Number(limit),
      take: Number(limit),
      orderBy: { createdAt: 'desc' },
    }),
    prisma.student.count({ where }),
  ])

  return { students, total, page: Number(page), limit: Number(limit) }
}

const getStudentById = async (id) => {
  const student = await prisma.student.findUnique({ where: { id } })
  if (!student) throw new Error('Không tìm thấy học sinh')
  return student
}

const createStudent = async (userId, data) => {
  return prisma.student.create({ data: { ...data, userId } })
}

module.exports = { getStudents, getStudentById, createStudent }
