const User = require('../models/user')

const errorHandler = (error, request, response, next) => {
    if (error.name === 'MongoServerError' && error.message.includes('E11000 duplicate key error')) {
        return response.status(400).json({ error: 'expected `username` to be unique'})
    } else if (error.name === 'ValidationError') {
        return response.status(400).json({error: error.message})
    } else {
        console.log("unknown error")
    }
}

const tokenExtractor = (request, response, next) => {
    const authorization = request.get('authorization')
    if (authorization && authorization.startsWith('Bearer ')) {
        const token = authorization.replace('Bearer ', '')
        const decodedToken = jwt.verify(token, process.env.SECRET)
        if (!decodedToken) {
            return response.status(401).json({error: "token invalid"})
        }
        const user = User.findById(decodedToken.id)
        if (!user) {
            response.status(404).json({error: "user not found"})
        }
        return request.user = user
    }
    response.status(400).json({error: "must provide token"})
    next()
}

module.exports = {errorHandler, tokenExtractor}