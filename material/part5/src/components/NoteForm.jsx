import { useState } from 'react'

const NoteForm = ({ createNote}) => {
  const [newNote, setNewNote] = useState('')

  const addNote = (event) => {
    event.preventDefault()
    createNote({
        content: newNote,
        important: true,
    })
    setNewNote('')
  }
  return (
    <div>
      <h2>Create a new note</h2>

      <form onSubmit={addNote}>  {/* React automatically creates en event object representing the whole action, and call addNote(event) */}
        <input
          value={newNote}
          onChange={event => setNewNote(event.target.value)}  // event is the whole event of what just happened, event.target is the DOM element that intrigues the change/submit, here is the input
          placeholder='write note content here'
        />
        <button type="submit">save</button>
      </form>
    </div>
  )
}

export default NoteForm