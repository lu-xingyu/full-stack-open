const assert = require('node:assert')
const { test, after, beforeEach, describe } = require('node:test')
const mongoose = require('mongoose')
const bcrypt = require('bcrypt')
const supertest = require('supertest')
const app = require('../app')
const User = require('../models/user')
const {usersInDb} = require('./test_helper')

const api = supertest(app)

describe('tests for users', () => {
    beforeEach(async () => {
        await User.deleteMany({})
        passwordTosave = await bcrypt.hash("Roban", 10)
        const initialUser = {
            username: "Barney",
            name: "Stinsen",
            passwordHash: passwordTosave 
        }
        
        const user = new User(initialUser)
        await user.save()
    })

    test('valid user is saved', async () => {
        const usersBefore = await usersInDb()
        const newUser = {
            "username": "Ted",
            "name": "Mosby",
            "password": "architecture"
        }

        await api.post('/api/users')
           .send(newUser)
           .expect(201)
           .expect('Content-Type', /application\/json/)

        const usersAfter = await usersInDb()

        const usernames = usersAfter.map(user => user.username)
        assert.strictEqual(usersAfter.length, usersBefore.length + 1)
        assert(usernames.includes(newUser.username))
    })

    test('invalid username is not saved', async () => {
        const usersBefore = await usersInDb()
        const newUser = {
            "username": "Ga",
            "name": "Mosby",
            "password": "architecture"
        }
        response = await api.post('/api/users')
           .send(newUser)
           .expect(400)
           .expect('Content-Type', /application\/json/)
           .expect(response => {
                response.body.error.includes('is shorter than the minimum allowed length')
           })


        const usersAfter = await usersInDb()

        const usernames = usersAfter.map(user => user.username)
        assert.strictEqual(usersAfter.length, usersBefore.length)
        assert(!usernames.includes(newUser.username))
    })

    test('invalid password is not saved', async () => {
        const usersBefore = await usersInDb()
        const newUser = {
            "username": "Gabel",
            "name": "Mosby",
            "password": "a"
        }
        response = await api.post('/api/users')
           .send(newUser)
           .expect(400)
           .expect('Content-Type', /application\/json/)
           .expect(response => {
                response.body.error.includes('length of password must be more than 3 characters')
           })

        const usersAfter = await usersInDb()

        const usernames = usersAfter.map(user => user.username)
        assert.strictEqual(usersAfter.length, usersBefore.length)
        assert(!usernames.includes(newUser.username))
    })
})


after(async () => {
    await mongoose.connection.close()
})