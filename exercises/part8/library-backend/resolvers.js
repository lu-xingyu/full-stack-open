const Book = require('./models/book')
const Author = require('./models/author')
const User = require('./models/user')
const { GraphQLError } = require('graphql');
const jwt = require('jsonwebtoken')
const { PubSub } = require('graphql-subscriptions')
const pubsub = new PubSub()

const resolvers = {
  Query: {
    authorCount: async () => Author.collection.countDocuments(),
    allBooks: async (root, args) => {
      let filter = {}
      if (args.author) {
        const authorFilter = await Author.findOne({name: args.author})
        if (authorFilter) {
          filter.author = authorFilter._id
        }
      }

      if (args.genre) {
        filter.genres = { $in: [args.genre] }
      }

      return Book.find(filter).populate('author')
    },
    allAuthors: async () => Author.find({}),
    me: async (root, args, context) => {
      return context.currentUser
    }
  },

  Author: {
    bookCount: async (root) => {
      return Book.countDocuments({ author: root.id})
    }
  },

  Mutation: {
    addBook: async (root, args, context) => {
      if (!context.currentUser) {
        throw new GraphQLError('muss provide token')
      }
      let authorOfBook = await Author.findOne({ name: args.author })
      if (!authorOfBook) {
        try {
          authorOfBook = new Author({ name: args.author, born: null })
          await authorOfBook.save()
        } catch(error) {
          throw new GraphQLError('saving author failed', {
            extensions: {
              code: 'BAD_USER_INPUT',
              invalidArgs: args.author,
              errorMessage: error.message
            }
          })
        }
      }

      const newBook = new Book({...args, author: authorOfBook._id})

      try {
        await newBook.save()
      } catch(error) {
        throw new GraphQLError('saving book failed', {
            extensions: {
            code: 'BAD_USER_INPUT',
            invalidArgs: args.title,
            errorMessage: error.message
          }
        })
      }

      pubsub.publish('BOOK_ADDED', { bookAdded: newBook })

      return newBook.populate('author')
    },

    editAuthor: async (root, args, context) => {
      if (!context.currentUser) {
        throw new GraphQLError('muss provide token')
      }
      const authorToEdit = await Author.findOne({ name: args.name })
      if (authorToEdit) {
        authorToEdit.born = args.setBornTo
        await authorToEdit.save()
        return authorToEdit
      }
      return null
    },

    createUser: async (root, args) => {
      const newUser = new User({...args})
      try {
        await newUser.save()
      } catch(error) {
        throw new GraphQLError('saving user failed', {
            extensions: {
            code: 'BAD_USER_INPUT',
            invalidArgs: args.username,
            errorMessage: error.message
          }
        })
      }
      return newUser
    },

    login: async (root, args) => {
      const user = await User.findOne({ username: args.username })
      if (!user || args.password !== "luck") {
        throw new GraphQLError('woring credentials', {
          extensions: {
            code: 'BAD_USER_INPUT',
            errorMessage: error.message
          }
        })
      }

      const userForToken = {
        username: user.username,
        id: user._id
      }

      return {value: jwt.sign(userForToken, process.env.JWT_SECRET)}
    }
  },

  Subscription: {
    bookAdded: {
        subscribe: () => pubsub.asyncIterableIterator('BOOK_ADDED')
    }
  }
}

module.exports = resolvers