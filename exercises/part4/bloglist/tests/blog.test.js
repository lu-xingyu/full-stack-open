const assert = require('node:assert')
const { test, after, beforeEach } = require('node:test')
const mongoose = require('mongoose')
const supertest = require('supertest')
const app = require('../app')
const Blog = require('../models/blog')
const {initialBlogs, blogsInDb} = require('./test_helper')

const api = supertest(app)

beforeEach(async () => {
    await Blog.deleteMany({})
    for (let blog of initialBlogs) {
        const blogToSave = new Blog(blog)
        await blogToSave.save()
    }
})

test('returns the correct amount of blog posts in the JSON format', async () => {
    const response = await api.get('/api/blogs').expect('Content-Type', /application\/json/)
    assert.strictEqual(response.body.length, 6)
})

test('the unique identifier property of the blog posts is named id', async () => {
    const response = await api.get('/api/blogs')
    const keys = Object.keys(response.body[0])
    assert(keys.includes('id'))
})

test('successfully creates a new blog post', async () => {
    const postToAdd = {
        "title": "Good Luck Teddy",
        "author": "Teddy Duncan",
        "url": "https://disney.fandom.com/wiki/Teddy_Duncan",
        "likes": 120
    }
    const originalLen = initialBlogs.length
    await api.post('/api/blogs')
             .send(postToAdd)
             .expect(201)
             .expect('Content-Type', /application\/json/)

    const currentBlogs = await blogsInDb()
    const currentTitles = currentBlogs.map((blog) => blog.title)

    assert.strictEqual(originalLen + 1, currentTitles.length)
    assert(currentTitles.includes(postToAdd.title))
})

test('if the likes property is missing, it will default to the value 0', async () => {
    const postToAdd = {
        "title": "Good Luck Teddy",
        "author": "Teddy Duncan",
        "url": "https://disney.fandom.com/wiki/Teddy_Duncan",
    }

    const response = await api.post('/api/blogs')
             .send(postToAdd)
    const id = response.body.id

    const currentBlogs = await blogsInDb()
    const addedBlog = currentBlogs.find(b => b.id === id)

    assert.strictEqual(addedBlog.likes, 0)
})

test('if the likes property is missing, it will default to the value 0', async () => {
    const postToAdd = {
        "title": "Good Luck Teddy",
        "author": "Teddy Duncan",
        "likes": 120
    }

    await api.post('/api/blogs')
             .send(postToAdd)
             .expect(400)

    const postToAdd2 = {
        "author": "Teddy Duncan",
        "url": "https://disney.fandom.com/wiki/Teddy_Duncan",
        "likes": 120
    }

    await api.post('/api/blogs')
             .send(postToAdd2)
             .expect(400)
})

after(async () => {
    await mongoose.connection.close()
})
