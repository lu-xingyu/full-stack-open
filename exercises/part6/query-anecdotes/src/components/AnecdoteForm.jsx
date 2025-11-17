import { createAnecdote } from '../requests'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { useContext } from 'react'
import NotiContext from '../NotificationContext'

const AnecdoteForm = () => {
  const { notiDispatch } = useContext(NotiContext)
  const queryClient = useQueryClient()
  const mutateAnecdote = useMutation({
    mutationFn: createAnecdote,
    onSuccess: (newAnecdote) => {
      const anecdotes = queryClient.getQueryData(['anecdotes'])
      queryClient.setQueryData(['anecdotes'], anecdotes.concat(newAnecdote))
      notiDispatch({type: 'SET', payload: `anecdote '${newAnecdote.content}' added`})
      setTimeout(() => {
        notiDispatch({type: 'RESET'})
      }, 5000)
    },
    onError:(error) => {
      notiDispatch({type: 'SET', payload: error.message})
      setTimeout(() => {
        notiDispatch({type: 'RESET'})
      }, 5000)
    }
  })

  const onCreate = (event) => {
    event.preventDefault()
    const content = event.target.anecdote.value
    event.target.anecdote.value = ''
    mutateAnecdote.mutate(content) 
  }

  return (
    <div>
      <h3>create new</h3>
      <form onSubmit={onCreate}>
        <input name="anecdote" />
        <button type="submit">create</button>
      </form>
    </div>
  )
}

export default AnecdoteForm
