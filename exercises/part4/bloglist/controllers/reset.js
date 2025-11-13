const User = require('../models/user')
const Blog = require('../models/blog')
const resetRouter = require('express').Router()

resetRouter.post('/', async (request, response) => {
    await User.deleteMany({})
    await Blog.deleteMany({})
    response.status(200).json({ message: "successfully reseted" })
})

module.exports = resetRouter