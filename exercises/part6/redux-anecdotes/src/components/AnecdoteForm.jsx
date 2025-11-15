import { useDispatch } from 'react-redux'
import { addAnecdote } from '../reducers/anecdoteReducer'
import { setNoti, resetNoti } from '../reducers/notificationReducer'
import { createNew } from '../services/anecdotes'

const AnecdoteForm = () => {
  const dispatch = useDispatch()
  const add = async (event) => {
    event.preventDefault()
    const addedAnecdote = await createNew(event.target.anecdote.value)
    dispatch(addAnecdote(addedAnecdote))
    dispatch(setNoti(`You've added '${event.target.anecdote.value}'`))
    event.target.anecdote.value = ''
    setTimeout(() => {
      dispatch(resetNoti(''))
    }, 5000)
  }

  return (
    <div>
      <h2>create new</h2>
      <form onSubmit={add}>
        <div>
          <input name="anecdote"/>
        </div>
        <button type="submit">create</button>
      </form>
    </div>
  )
}

export default AnecdoteForm