const assert = require('node:assert')
const { test, after, beforeEach, describe } = require('node:test')
const mongoose = require('mongoose')
const bcrypt = require('bcrypt')
const supertest = require('supertest')
const app = require('../app')
const Blog = require('../models/blog')
const User = require('../models/user')
const {initialBlogs, blogsInDb, usersInDb} = require('./test_helper')

const api = supertest(app)

describe('tests for blogs', () => {
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

    test('if the title or url properties are missing, responds with 400 Bad Request', async () => {
        const beforeBlogs = await blogsInDb()

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

        const afterBlogs = await blogsInDb()

        assert.strictEqual(beforeBlogs.length, afterBlogs.length)
    })

    test('deleting a single blog', async () =>{
        const blogsBefore = await blogsInDb()
        const blogToDelete = blogsBefore[0]
        await api.delete(`/api/blogs/${blogToDelete.id}`).expect(204)
        const blogsAfter = await blogsInDb()
        const IdsAfter = blogsAfter.map(blog => blog.id)
        assert.strictEqual(blogsBefore.length, blogsAfter.length + 1)
        assert(!IdsAfter.includes(blogToDelete.id))
    })

    test('updating the information of an individual blog post', async () => {
        const blogsBefore = await blogsInDb()
        const blogToUpdate = blogsBefore[0]
        const id = blogToUpdate.id
        const likesBefore = blogToUpdate.likes
        const newBlog = {...blogToUpdate, likes: likesBefore + 35}

        await api.put(`/api/blogs/${id}`).send(newBlog)
        const blogsAfter = await blogsInDb()
        const updatedBlog = blogsAfter.find(blog => blog.id === id)
        
        assert.strictEqual(updatedBlog.likes, likesBefore + 35)
    })
})

describe('tests for users', () => {
    beforeEach(async () => {
        await User.deleteMany({})
        const initialUser = {
            "username": "Barney",
            "name": "Stinsen",
        }
        initialUser.password = await bcrypt.hash("Roban", 10)
        User.save(initialUser)
    })

    test('valid user is saved', async () => {
        const newUser = {
            "username": "Ted",
            "name": "Mosby",
            "password": "architecture"
        }
        const userToAdd = new User(newUser)

        api.post('/api/users')
           .send(userToAdd)
           .expect(201)
           .expect('Content-Type', /application\/json/)

        const usersAfter = usersInDb()
        const usernames = usersAfter.map(user => user.username)
        assertStrictEqual(usersAfter.length, 2)
        assert(usernames.indludes(userToAdd.username))
        
    })

})


after(async () => {
    await mongoose.connection.close()
})
