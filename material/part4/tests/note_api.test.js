const { test, after, beforeEach } = require('node:test') 
//test for defining tests, after is executed after all the tests is finished
const mongoose = require('mongoose')
const supertest = require('supertest')
const app = require('../app')  // while requiring this, the code in app will be executed (except function), so mongoDB will start connecting now
const assert = require('node:assert')
const helper = require('./test_helper')
const Note = require('../models/note')

const api = supertest(app)  
// an object that can create a virtual http request 
// and call app funcion to simulate http request without runing the server


beforeEach(async () => {
  await Note.deleteMany({}) // delete all entries in the DB

  // add two initial entries to the DB
  /* does not work: await only waits for each save. but forEach loop will not wait for next repeat
  helper.initialNotes.forEach(async (note) => {
    let noteObject = new Note(note)
    await noteObject.save()
    console.log('saved')
  })
  console.log('done')
  */

  const noteObjects = helper.initialNotes
    .map(note => new Note(note))
  const promiseArray = noteObjects.map(note => note.save())  // this array store all the promise
  await Promise.all(promiseArray)  
  // Promise.all transform an array of promises into a single promise, 
  // that will be fulfilled once every promise in the array passed to it as an argument is resolved

  /* this will also work 
  for (let note of helper.initialNotes) {
    let noteObject = new Note(note)
    await noteObject.save()
  }
  */

  /* or this
  await Note.insertMany(helper.initialNotes)
  */
})
  


test('notes are returned as json', async () => {
  await api
    .get('/api/notes')
    .expect(200)  // expect(status_code); expect(fieldName, fieldValue); expect(callbackFn)
    .expect('Content-Type', /application\/json/) // regex / ... / only check whether it includes the target
})

test('all notes are returned', async () => {
  const response = await api.get('/api/notes')

  // execution gets here only after the HTTP request is complete
  // the result of HTTP request is saved in variable response
  assert.strictEqual(response.body.length, helper.initialNotes.length)
})

test('a specific note is within the returned notes', async () => {
  const response = await api.get('/api/notes')

  const contents = response.body.map(e => e.content)
  assert(contents.includes('HTML is easy'))
})

test('a valid note can be added ', async () => {
  const newNote = {
    content: 'async/await simplifies making async calls',
    important: true,
  }

  await api
    .post('/api/notes')
    .send(newNote)
    .expect(201)
    .expect('Content-Type', /application\/json/)

  const notesAtEnd = await helper.notesInDb()
  assert.strictEqual(notesAtEnd.length, helper.initialNotes.length + 1)

  const contents = notesAtEnd.map(r => r.content)
  assert(contents.includes('async/await simplifies making async calls'))
})

test('note without content is not added', async () => {
  const newNote = {
    important: true
  }

  await api
    .post('/api/notes')
    .send(newNote)
    .expect(400)

  const notesAtEnd = await helper.notesInDb()

  assert.strictEqual(notesAtEnd.length, helper.initialNotes.length)
})

test('a specific note can be viewed', async () => {
  const notesAtStart = await helper.notesInDb()
  const noteToView = notesAtStart[0]

  const resultNote = await api
    .get(`/api/notes/${noteToView.id}`)
    .expect(200)
    .expect('Content-Type', /application\/json/)

  assert.deepStrictEqual(resultNote.body, noteToView)
})

test('a note can be deleted', async () => {
  const notesAtStart = await helper.notesInDb()
  const noteToDelete = notesAtStart[0]

  await api
    .delete(`/api/notes/${noteToDelete.id}`)
    .expect(204)

  const notesAtEnd = await helper.notesInDb()

  const contents = notesAtEnd.map(n => n.content)
  assert(!contents.includes(noteToDelete.content))

  assert.strictEqual(notesAtEnd.length, helper.initialNotes.length - 1)
})

after(async () => {
  await mongoose.connection.close() // without after, close will be executed immediately before tests begain
})