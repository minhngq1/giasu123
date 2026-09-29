// Controller học sinh — xử lý request/response, gọi studentService
const studentService = require('../services/studentService')

const getStudents = async (req, res, next) => {
  try {
    const result = await studentService.getStudents(req.query)
    res.json({ success: true, data: result })
  } catch (err) {
    next(err)
  }
}

const getStudentById = async (req, res, next) => {
  try {
    const result = await studentService.getStudentById(req.params.id)
    res.json({ success: true, data: result })
  } catch (err) {
    next(err)
  }
}

const createStudent = async (req, res, next) => {
  try {
    const result = await studentService.createStudent(req.userId, req.body)
    res.status(201).json({ success: true, data: result })
  } catch (err) {
    next(err)
  }
}

module.exports = { getStudents, getStudentById, createStudent }
