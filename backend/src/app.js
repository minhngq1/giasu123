// Express app setup — cấu hình middleware và routes
const express = require('express')
const cors = require('cors')
require('dotenv').config()

const authRoutes = require('./routes/auth')
const tutorRoutes = require('./routes/tutors')
const studentRoutes = require('./routes/students')
const errorHandler = require('./middlewares/errorHandler')

const app = express()

app.use(cors({ origin: 'http://localhost:5173' }))
app.use(express.json())

app.use('/api/auth', authRoutes)
app.use('/api/tutors', tutorRoutes)
app.use('/api/students', studentRoutes)

app.use(errorHandler)

module.exports = app
