const blogsRouter = require('express').Router()
const Blog = require('../models/blog')
const middleware = require('../utils/middleware')

blogsRouter.get('/', async (request, response) => {
  const blogs = await Blog.find({}).populate('user', {username: 1, name: 1})
  response.json(blogs)
})

blogsRouter.post('/',  middleware.tokenExtractor, async (request, response) => {
  const user = request.user
  const finalLikes = request.body.likes || 0
  const blogToAdd = {...request.body, likes: finalLikes, user: user._id}
  if (!blogToAdd.title || !blogToAdd.url) {
    return response.status(400).end()
  }

  const blog = new Blog(blogToAdd)
  const savedBlog = await blog.save()

  user.blogs = user.blogs.concat(savedBlog.id)
  await user.save()

  response.status(201).json(savedBlog)
})

blogsRouter.delete('/:id', middleware.tokenExtractor, async (request, response) => {
  const blog = await Blog.findById(request.params.id)
  const user = request.user

  if (blog.user.toString() !== user._id.toString()) {
    return response.status(401).json({error: "user is not permitted to delete this blog"})
  }

  await Blog.findByIdAndDelete(request.params.id)
  response.status(204).end()
})

blogsRouter.put('/:id', async (request, response) => {
  const {user, title, author, url, likes} = request.body
  const blogToUpdate = await Blog.findById(request.params.id)
  if (!blogToUpdate) {
    return response.status(404).end()
  }
  blogToUpdate.title = title
  blogToUpdate.author = author
  blogToUpdate.url = url
  blogToUpdate.likes = likes
  const updatedBlog = await blogToUpdate.save()
  response.status(200).json(updatedBlog)
})

module.exports = blogsRouter