const blogsRouter = require('express').Router()
const Blog = require('../models/blog')

blogsRouter.get('/', async (request, response) => {
  const blogs = await Blog.find({})
  response.json(blogs)
})

blogsRouter.post('/', async (request, response) => {
  const finalLikes = request.body.likes || 0
  const blogToAdd = {...request.body, likes: finalLikes}
  if (!blogToAdd.title || !blogToAdd.url) {
    response.status(400).end()
  }

  const blog = new Blog(blogToAdd)
  const result = await blog.save()
  response.status(201).json(result)
})

module.exports = blogsRouter