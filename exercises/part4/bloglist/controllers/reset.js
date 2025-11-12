const User = require('../models/user')
const Blog = require('../models/blog')
const resetRouter = require('express').Router()

resetRouter.post('/api/reset', async (request, response) => {
    await User.deleteMany({})
    await Blog.deleteMany({})
    response.status(204).end()
})

module.exports = resetRouter