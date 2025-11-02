require('dotenv').config()
const express = require('express')
const Note = require('./models/note')

const app = express()

/* middlewware
middleware is a type a function which can be executed between request and response, anything passed to app.use, app.get, app.post...
middleware functions have 3 or 4 parameters: request, response, next(call next middleware), error(optional)
when middleware function is used as route processor, if it return response directly(response.send(), response.json(), response.end()), then the request will be ended by the response
app.use([path], middlewareFunction)： if no path defined, every request will go into this middleware
 */


app.use(express.json())
app.use(express.static('dist'))
// whenever Express gets an HTTP GET request it will first check if the dist directory contains a
// file corresponding to the request's address. If a correct file is found, Express will return it.
// eg GET /, express will find dist/index.html by default

const requestLogger = (request, response, next) => {
  console.log('Method:', request.method)
  console.log('Path:  ', request.path)
  console.log('Body:  ', request.body)
  console.log('---')
  next()
}

app.use(requestLogger)

/*
let notes = [
  {
    id: "1",
    content: "HTML is easy",
    important: true
  },
  {
    id: "2",
    content: "Browser can execute only JavaScript",
    important: false
  },
  {
    id: "3",
    content: "GET and POST are the most important methods of HTTP protocol",
    important: true
  }
]
*/

app.get('/', (request, response) => {
  response.send('<h1>Hello World!</h1>')
})

app.get('/api/notes', (request, response) => {
  Note.find({}).then(notes => {
    response.json(notes)
  })
})
// the result of promise returned by find() is an array containing all document objects that fulfilled the confitions

app.get('/api/notes/:id', (request, response, next) => {
  Note.findById(request.params.id)
    .then(note => {
      if (note) {
        response.json(note)
      } else {
        response.status(404).end()
      }    
    })
    .catch(error => next(error))
})
// next(), execute next middleware; neax(error) execute next error handler middleware

app.post('/api/notes', (request, response, next) => {
  const body = request.body

  /*
  if (!body.content) {
    return response.status(400).json({ error: 'content missing' })
  } */

  const note = new Note({
    content: body.content,
    important: body.important || false,
  })

  note.save()
    .then(savedNote => {
      response.json(savedNote)
    })
    .catch(error => next(error))
})

app.delete('/api/notes/:id', (request, response, next) => {
  Note.findByIdAndDelete(request.params.id) // if this note if found and deleted, return the note; if can not find the note, return null
    .then(result => {
      response.status(204).end()
    })
    .catch(error => next(error))
})

app.put('/api/notes/:id', (request, response, next) => {
  const { content, important } = request.body
  Note.findById(request.params.id)
    .then(note => {
      if(!note) {
        return response.status(404).end()
      }

      note.content = content
      note.important = important

      return note.save().then(updatedNote => {
        response.json(updatedNote)
      })
    })
    .catch(error => next(error))
})


const unknownEndpoint = (request, response) => {
  response.status(404).send({ error: 'unknown endpoint' })
}

app.use(unknownEndpoint) 
// after the request go through all the midlleware, it still not response, - meaning this route is unknown
// response with 404 and an unknownEnpoint error

const errorHandler = (error, request, response, next) => {
  console.error(error.message)

  if (error.name === 'CastError') {
    return response.status(400).send({error: 'malformatted'})
  } else if (error.name === 'ValidationError') {
    return response.status(400).json({error: error.message})
  }

  next(error)
}
app.use(errorHandler)
// errorHandler can only be used by call next(error). normal non-error request will be returned by unknownEndpoint
// if put this in front of unknowEndpoint, the all unmatched route will return error instead of unknowEndpoint
const PORT = process.env.PORT
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})