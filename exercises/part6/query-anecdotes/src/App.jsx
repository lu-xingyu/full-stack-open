import AnecdoteForm from './components/AnecdoteForm'
import Notification from './components/Notification'
import { useQuery, useQueryClient, useMutation } from '@tanstack/react-query'
import { getAnecdotes, voteAnecdote } from './requests'
import { useContext } from 'react'

import NotiContext from './NotificationContext'

const App = () => {

  const { noti, notiDispatch } = useContext(NotiContext)
  const queryClient = useQueryClient()
  
  const mutateVote = useMutation({
    mutationFn: voteAnecdote,
    onSuccess: (anecdote) => {
      const anecdotes = queryClient.getQueryData(['anecdotes'])
      const newAnecdotes = anecdotes.map(ane => ane.id !== anecdote.id ? ane : anecdote)
      queryClient.setQueryData(['anecdotes'], newAnecdotes)
      notiDispatch({type: 'SET', payload: `anecdote '${anecdote.content}' voted`})
      setTimeout(() => {
        notiDispatch({type: 'RESET'})
      }, 5000)
    }
  })
  const handleVote = (anecdote) => {
    mutateVote.mutate(anecdote)
  }

  const result = useQuery({
    queryKey: ['anecdotes'],
    queryFn: getAnecdotes,
    retry: 1
  })

  if (result.isLoading) return ( <div>loading...</div> )
  if (result.isError) return ( <div>anecdote service not available due to problems in server</div>)

  const anecdotes = result.data

  return (
    <div>
      <h3>Anecdote app</h3>
      <Notification noti={noti}/>
      <AnecdoteForm />

      {anecdotes.map((anecdote) => (
        <div key={anecdote.id}>
          <div>{anecdote.content}</div>
          <div>
            has {anecdote.votes}
            <button onClick={() => handleVote(anecdote)}>vote</button>
          </div>
        </div>
      ))}
    </div>
  )
}

export default App
