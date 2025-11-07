const User = require('../models/user')
const jwt = require('jsonwebtoken')

const errorHandler = (error, request, response, next) => {
    if (error.name === 'MongoServerError' && error.message.includes('E11000 duplicate key error')) {
        return response.status(400).json({ error: 'expected `username` to be unique'})
    } else if (error.name === 'ValidationError') {
        return response.status(400).json({error: error.message})
    } else {
        console.log(error.message)
    }
}

const tokenExtractor = async (request, response, next) => {
    const authorization = request.get('authorization')
    
    if (authorization && authorization.startsWith('Bear ')) {
        const token = authorization.replace('Bear ', '')
        const decodedToken = jwt.verify(token, process.env.SECRET)
        if (!decodedToken) {
            return response.status(401).json({error: "token invalid"})
        }
        const user = await User.findById(decodedToken.id)
        if (!user) {
            return response.status(404).json({error: "user not found"})
        }
        request.user = user
        return next()
    }
    response.status(400).json({error: "must provide token"})
}

module.exports = {errorHandler, tokenExtractor}