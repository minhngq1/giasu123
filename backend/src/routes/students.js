// Routes học sinh: danh sách, chi tiết, tạo yêu cầu tìm gia sư
const express = require('express')
const router = express.Router()
const studentController = require('../controllers/studentController')
const authMiddleware = require('../middlewares/authMiddleware')

router.get('/', studentController.getStudents)
router.get('/:id', studentController.getStudentById)
router.post('/', authMiddleware, studentController.createStudent)

module.exports = router
