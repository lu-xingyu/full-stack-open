const express = require('express')
const mongoose = require('mongoose')
const {mongoUrl, PORT} = require('./utils/config')
const blogsRouter = require('./controllers/blogs')

const app = express()
mongoose.connect(mongoUrl)

app.use(express.json())

app.use('/api/blogs', blogsRouter)

module.exports = app