import AnecdoteForm from './components/AnecdoteForm'
import Notification from './components/Notification'
import { useQuery, useQueryClient, useMutation } from '@tanstack/react-query'
import { getAnecdotes, voteAnecdote } from './requests'

const App = () => {

  const queryClient = useQueryClient()
  
  const mutateVote = useMutation({
    mutationFn: voteAnecdote,
    onSuccess: (anecdote) => {
      const anecdotes = queryClient.getQueryData(['anecdotes'])
      const newAnecdotes = anecdotes.map(ane => ane.id !== anecdote.id ? ane : anecdote)
      queryClient.setQueryData(['anecdotes'], newAnecdotes)
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

      <Notification />
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
