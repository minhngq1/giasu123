// Business logic gia sư — truy vấn và cập nhật dữ liệu qua Prisma
const { PrismaClient } = require('@prisma/client')

const prisma = new PrismaClient()

const getTutors = async ({ subject, district, city, minPrice, maxPrice, page = 1, limit = 10 }) => {
  const where = {}
  if (subject) where.subjects = { has: subject }
  if (district) where.district = { contains: district, mode: 'insensitive' }
  if (city) where.city = { contains: city, mode: 'insensitive' }
  if (minPrice || maxPrice) {
    where.pricePerHour = {}
    if (minPrice) where.pricePerHour.gte = Number(minPrice)
    if (maxPrice) where.pricePerHour.lte = Number(maxPrice)
  }

  const [tutors, total] = await Promise.all([
    prisma.tutor.findMany({
      where,
      skip: (Number(page) - 1) * Number(limit),
      take: Number(limit),
      orderBy: { rating: 'desc' },
    }),
    prisma.tutor.count({ where }),
  ])

  return { tutors, total, page: Number(page), limit: Number(limit) }
}

const getTutorById = async (id) => {
  const tutor = await prisma.tutor.findUnique({ where: { id } })
  if (!tutor) throw new Error('Không tìm thấy gia sư')
  return tutor
}

const registerTutor = async (userId, data) => {
  return prisma.tutor.create({ data: { ...data, userId } })
}

const updateTutor = async (id, data) => {
  return prisma.tutor.update({ where: { id }, data })
}

module.exports = { getTutors, getTutorById, registerTutor, updateTutor }
