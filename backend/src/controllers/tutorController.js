// Controller gia sư — xử lý request/response, gọi tutorService
const tutorService = require('../services/tutorService')

const getTutors = async (req, res, next) => {
  try {
    const result = await tutorService.getTutors(req.query)
    res.json({ success: true, data: result })
  } catch (err) {
    next(err)
  }
}

const getTutorById = async (req, res, next) => {
  try {
    const result = await tutorService.getTutorById(req.params.id)
    res.json({ success: true, data: result })
  } catch (err) {
    next(err)
  }
}

const registerTutor = async (req, res, next) => {
  try {
    const result = await tutorService.registerTutor(req.userId, req.body)
    res.status(201).json({ success: true, data: result })
  } catch (err) {
    next(err)
  }
}

const updateTutor = async (req, res, next) => {
  try {
    const result = await tutorService.updateTutor(req.params.id, req.body)
    res.json({ success: true, data: result })
  } catch (err) {
    next(err)
  }
}

module.exports = { getTutors, getTutorById, registerTutor, updateTutor }
