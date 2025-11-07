const loginRouter = require('express').Router()
const jwt = require('jsonwebtoken')
const User = require('../models/user')

loginRouter.post('/', async (request, response) => {
    const {username, password} = request.body
    const user = await User.findOne({username})
    const correctPassword = 
        user === null 
        ? false 
        : jwt.compare(password, user.passwordHash)

    if (!correctPassword) {
        return response.status(404).json({ error: 'invalid username or passwprd'})
    }

    const userToToken = {
        username: user.username,
        id: user._id
    }

    const token = jwt.sign(userToToken, process.env.SECRET)

    response.status(200).json({ token: token, username: user.username, name: user.name})
})

module.exports= loginRouter