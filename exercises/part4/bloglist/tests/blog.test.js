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

    describe('test for get blogs', () => {
        test('returns the correct amount of blog posts in the JSON format', async () => {
            const response = await api.get('/api/blogs').expect('Content-Type', /application\/json/)
            assert.strictEqual(response.body.length, 6)
        })

        test('the unique identifier property of the blog posts is named id', async () => {
            const response = await api.get('/api/blogs')
            const keys = Object.keys(response.body[0])
            assert(keys.includes('id'))
        })
    })

    describe('tests with login post and delete', () => {
        let loginToken
        let otherLoginToken
        beforeEach(async () => {
            await User.deleteMany({})
            passwordTosave = await bcrypt.hash("Roban", 10)
            const initialUser = {
                username: "Barney",
                name: "Stinsen",
                passwordHash: passwordTosave 
            }
            const sideUser = {
                username: "Malshow",
                name: "Erekson",
                passwordHash: await bcrypt.hash("Lily", 10)
            }
            const user = new User(initialUser)
            await user.save()
            const loginUser = {
                username: "Barney",
                password: "Roban"
            }
            const loginData = await api.post('/api/login').send(loginUser)
            loginToken = loginData.body.token

            const user2 = new User(sideUser)
            await user2.save()
            const loginUser2 = {
                username: "Malshow",
                password: "Lily"
            }

            const loginData2 = await api.post('/api/login').send(loginUser2)
            otherLoginToken = loginData2.body.token
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
                    .set('Authorization', `Bearer ${loginToken}`)
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
                    .set('authorization', `Bearer ${loginToken}`)
                    .expect(201)
                    .expect('Content-Type', /application\/json/)
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
                    .set('authorization', `Bearer ${loginToken}`)
                    .expect(400)

            const postToAdd2 = {
                "author": "Teddy Duncan",
                "url": "https://disney.fandom.com/wiki/Teddy_Duncan",
                "likes": 120
            }

            await api.post('/api/blogs')
                    .send(postToAdd2)
                    .set('authorization', `Bearer ${loginToken}`)
                    .expect(400)

            const afterBlogs = await blogsInDb()

            assert.strictEqual(beforeBlogs.length, afterBlogs.length)
        })

        test('deleting a single blog', async () =>{
            const postToAdd = {
                "title": "Good Luck Teddy",
                "author": "Teddy Duncan",
                "url": "https://disney.fandom.com/wiki/Teddy_Duncan",
                "likes": 120
            }

            await api.post('/api/blogs')
                    .send(postToAdd)
                    .set('Authorization', `Bearer ${loginToken}`)
                    .expect(201)
                    .expect('Content-Type', /application\/json/)

            const blogsBefore = await blogsInDb()
            const blogToDelete = await Blog.findOne({title: "Good Luck Teddy", "author": "Teddy Duncan", url: "https://disney.fandom.com/wiki/Teddy_Duncan"})
            const id = blogToDelete._id.toString()

            const blogsBefore2 = await blogsInDb()
            await api
                    .delete(`/api/blogs/${id}`)
                    .set('Authorization', `Bearer ${otherLoginToken}`)
                    .expect(401)
                    .expect(response => response.body.error.includes("user is not permitted to delete this blog"))
            const blogsAfter2 = await blogsInDb() 
            assert.strictEqual(blogsBefore2.length, blogsAfter2.length) 

            await api
                    .delete(`/api/blogs/${id}`)
                    .set('Authorization', `Bearer ${loginToken}`)
                    .expect(204)
                    
            const blogsAfter = await blogsInDb()
            const IdsAfter = blogsAfter.map(blog => blog.id)
            assert.strictEqual(blogsBefore.length, blogsAfter.length + 1)
            assert(!IdsAfter.includes(blogToDelete.id))
        })

        test('updating the information of an individual blog post', async () => {
            const postToAdd = {
                "title": "Good Luck Teddy",
                "author": "Teddy Duncan",
                "url": "https://disney.fandom.com/wiki/Teddy_Duncan",
                "likes": 120
            }

            await api.post('/api/blogs')
                    .send(postToAdd)
                    .set('Authorization', `Bearer ${loginToken}`)
                    .expect(201)
                    .expect('Content-Type', /application\/json/)

            const blogToUpdate = await Blog.findOne({title: "Good Luck Teddy", "author": "Teddy Duncan", url: "https://disney.fandom.com/wiki/Teddy_Duncan"})

            const id = blogToUpdate._id.toString()
            const likesBefore = blogToUpdate.likes
            const newBlog = {...blogToUpdate, likes: likesBefore + 35}


            await api
                    .put(`/api/blogs/${id}`)
                    .send(newBlog)
                    .expect(400)
                    .expect(response => response.body.error.includes("must provide token"))

            const blogsAfter2 = await blogsInDb()
            const updatedBlog2 = blogsAfter2.find(blog => blog.id === id)
            
            assert.strictEqual(updatedBlog2.likes, likesBefore)


            await api
                    .put(`/api/blogs/${id}`)
                    .send(newBlog)
                    .set('Authorization', `Bearer ${loginToken}`)
                    .expect(200)
            const blogsAfter = await blogsInDb()
            const updatedBlog = blogsAfter.find(blog => blog.id === id)
            
            assert.strictEqual(updatedBlog.likes, likesBefore + 35)
        })
    })
})

after(async () => {
    await mongoose.connection.close()
})
