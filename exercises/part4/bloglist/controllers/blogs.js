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
    return response.status(400).end()
  }

  const blog = new Blog(blogToAdd)
  const result = await blog.save()
  response.status(201).json(result)
})

blogsRouter.delete('/:id', async (request, response) => {
  await Blog.findByIdAndDelete(request.params.id)
  response.status(204).end()
})

blogsRouter.put('/:id', async (request, response) => {
  const {title, author, url, likes} = request.body
  const blogToUpdate = await Blog.findById(request.params.id)
  if (!blogToUpdate) {
    return response.status(404)
  }
  blogToUpdate.title = title
  blogToUpdate.author = author
  blogToUpdate.url = url
  blogToUpdate.likes = likes
  const updatedBlog = await blogToUpdate.save()
  response.json(updatedBlog)
})

module.exports = blogsRouter