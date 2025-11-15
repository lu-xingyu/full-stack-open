import { useDispatch } from 'react-redux'
import { createNote } from '../reducers/noteToolkit'
import noteService from '../services/notes'

const NoteForm = () => {
  const dispatch = useDispatch() // get store.dispatch fn of the store provided by Provider

  const addNote = async (event) => {
    event.preventDefault()
    const content = event.target.note.value // event.target.note: the element in event target that have name 'note' 
    event.target.note.value = '' // clear input
    const newNote = await noteService.createNew(content)
    dispatch(createNote(newNote))
  }

  return (
    <form onSubmit={addNote}>
      <input name="note" />
      <button type="submit">add</button>
    </form>
  )
}

export default NoteForm