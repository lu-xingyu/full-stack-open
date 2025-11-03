const mongoose = require('mongoose')

if (process.argv.length < 3) {
  console.log('give password as argument')
  process.exit(1)
}


const password = process.argv[2]

const url = `mongodb+srv://estrellalxy_db_user:${password}@cluster0.addi0ax.mongodb.net/testNoteApp?appName=Cluster0`

mongoose.connect(url)  

const noteSchema = new mongoose.Schema({
  content: String,
  important: Boolean,
})   

const Note = mongoose.model('Note', noteSchema)

if (process.argv.length === 3) {
  Note.find({}).then(result => {
    console.log('notes:')
    result.forEach(note => {
      console.log(note.content, note.important)
    })
    mongoose.connection.close()
  })
} else if (process.argv.length >= 4) {
  const newContent = process.argv[3]
  const newImport =  process.argv.length === 5 ? process.argv[4] : false
  const newNote = new Note ({
    content: newContent,
    important: newImport,
  })
  newNote.save().then(() => {
    console.log(`added ${newNote} with importance ${newImport} to notes`)
    mongoose.connection.close()
  })
} else {
  console.log('please provide password')
  mongoose.connection.close()
}