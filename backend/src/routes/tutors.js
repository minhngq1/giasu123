// Routes gia sư: danh sách, chi tiết, đăng ký, cập nhật profile
const express = require('express')
const router = express.Router()
const tutorController = require('../controllers/tutorController')
const authMiddleware = require('../middlewares/authMiddleware')

router.get('/', tutorController.getTutors)
router.get('/:id', tutorController.getTutorById)
router.post('/register', authMiddleware, tutorController.registerTutor)
router.put('/:id', authMiddleware, tutorController.updateTutor)

module.exports = router
