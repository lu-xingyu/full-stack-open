import { useQuery, useMutation, useQueryClient  } from '@tanstack/react-query'
import { getNotes, createNote, updateNote  } from './requests'

const App = () => {
  const queryClient = useQueryClient() /* global cache management: get cache, mutate cache, refetch*/

  // returns a mutation object, which has mutationFn as mutate property
  // if mutate is called, it will update this object (status, data...)
  const newNoteMutation = useMutation({
    mutationFn: createNote,
    onSuccess: (newNote) => { // onSuccesss(returnedValueOfMutationFn, inputParaOfMutationFn, returnedValueOfOnMutate)
      const notes = queryClient.getQueryData(['notes'])
      queryClient.setQueryData(['notes'], notes.concat(newNote))
    },  // change the data field of result, and cause a rerender
  })

  const updateNoteMutation = useMutation({
    mutationFn: updateNote,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['notes'] })  // set isStale of result to true, and cause rerender
    }
  })

  const addNote = async (event) => {
    event.preventDefault()
    const content = event.target.note.value
    event.target.note.value = ''
    newNoteMutation.mutate({ content, important: true })
  }


  const toggleImportance = (note) => {
    updateNoteMutation.mutate({...note, important: !note.important })
  }

  /* useQuery: send async request, manage the status of requests and cached data of response
    it automatically call queryFn and returns an object, the object has inner status: loading, success, error; 
    every time the status changes, it will rerender the component
    if any of the field affecting UI has changed (data, isStale, error..), it will also rerender. 
    i.e. when window focus changes(change to another tab), isStale will change and cause rerender when user is back
    queryKey is used to identify this query, user can use the data in other place, if key is the same, 
    React Query will just first use the cache the render ui, and refectch the data, then update the ui

  */
  const result = useQuery({
    queryKey: ['notes'],
    queryFn: getNotes
  })
 
  console.log(JSON.parse(JSON.stringify(result)))
 
  if (result.isLoading) {
    return <div>loading data...</div>
  }
 
  const notes = result.data

  return (
    <div>
      <h2>Notes app</h2>
      <form onSubmit={addNote}>
        <input name="note" />
        <button type="submit">add</button>
      </form>
      {notes.map((note) => (
        <li key={note.id} onClick={() => toggleImportance(note)}>
          {note.content}
          <strong> {note.important ? 'important' : ''}</strong>
        </li>
      ))}
    </div>
  )
}

export default App