import { useEffect } from 'react'
import { useDispatch } from 'react-redux'
import NoteForm from './components/NoteForm'
import Notes from './components/Notes'
import VisibilityFilter from './components/VisibilityFilter'
import { initializeNotes } from './reducers/noteToolkit'


const App = () => {
  const dispatch = useDispatch()

  useEffect(() => {
     dispatch(initializeNotes())
  }, [dispatch])  
  // good programming practice: add all variables and functions used inside the useEffect hook 
  // that are defined within the component to the dependency array

  return (
    <div>
      <NoteForm />
      <VisibilityFilter />
      <Notes />
    </div>
  )
}

export default App