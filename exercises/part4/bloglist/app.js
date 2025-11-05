const express = require('express')
const mongoose = require('mongoose')
const {mongoUrl, PORT} = require('./utils/config')
const blogsRouter = require('./controllers/blogs')
const usersRouter = require('./controllers/users')
const middleware = require('./utils/middleware')

const app = express()
mongoose.connect(mongoUrl)

app.use(express.json())

app.use('/api/blogs', blogsRouter)
app.use('/api/users', usersRouter)
app.use(middleware.errorHandler)

module.exports = app