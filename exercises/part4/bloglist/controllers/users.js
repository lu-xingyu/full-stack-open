const usersRouter = require('express').Router()
const bcrypt = require('bcrypt')
const User = require('../models/user')

usersRouter.get('/', async (request, response) => {
    const users = await User.find({})
    response.json(users)
})

usersRouter.post('/', async (request, response) => {
    const {username, name, password} = response.body

    if (password && password.length < 3) {
        response.status(400).send('error: length of password must be more than 3 characters').end()
    }

    const saltRound = 10
    const hashedPassword = await bcrypt.hash(password, saltRound)
    const newUser = new User({username, name, hashedPassword})
    const savedUser = await newUser.save()
    response.status(201).json(savedUser)
})

module.exports = usersRouter