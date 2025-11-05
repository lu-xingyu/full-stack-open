const bcrypt = require('bcrypt')
const usersRouter = require('express').Router()
const User = require('../models/user')

usersRouter.get('/', async (request, response) => {
  const users = await User.find({}).populate('notes', { content: 1, important: 1 }) // id of note if by default included
  response.json(users)
})
// first query for all users, then queries the collection of the model object specified by ref property of notes field

usersRouter.post('/', async (request, response) => {
  const { username, name, password } = request.body

  const saltRounds = 10 // cost factor: the number of rounds of hash calculation
  const passwordHash = await bcrypt.hash(password, saltRounds) // genearate a random salt, combine the password with the salt, and do saltRounds times hash calculation
  // when we compare entered password, bcrypt extracts the salt form the stored hash, 
  // rehash the entered passsword with the same salt and cost factor
  // and checks if the new hash matches the stored one

  const user = new User({
    username,
    name,
    passwordHash,
  })

  const savedUser = await user.save()

  response.status(201).json(savedUser)
})

module.exports = usersRouter