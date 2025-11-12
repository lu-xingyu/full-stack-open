const express = require('express')
const mongoose = require('mongoose')
const {mongoUrl, PORT} = require('./utils/config')
const blogsRouter = require('./controllers/blogs')
const usersRouter = require('./controllers/users')
const loginRouter = require('./controllers/login')
const middleware = require('./utils/middleware')


const app = express()
mongoose.connect(mongoUrl)

app.use(express.json())

app.use('/api/blogs', blogsRouter)
app.use('/api/users', usersRouter)
app.use('/api/login', loginRouter)
if (process.env.NODE_ENV === 'test') {
    const resetRouter = require('./controllers/reset')
    app.use('/api/reset', resetRouter)
}
app.use(middleware.errorHandler)

module.exports = app