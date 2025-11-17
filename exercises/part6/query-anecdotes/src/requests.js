const baseUrl = 'https://didactic-halibut-q7pxpr6qv64g346j7-3001.app.github.dev/anecdotes'

export const getAnecdotes = async () => {
    const response = await fetch(baseUrl)
    if (!response.ok) {
        throw new Error('get anecdotes failed')
    }
    return await response.json()
}

export const createAnecdote = async (newAnecdote) => {
    const config = {
        method: 'POST',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify({
            content: newAnecdote,
            votes: 0
        })
    }

    const response = await fetch(baseUrl, config)
    if (!response.ok) {
        throw new Error('create anecdote failed')
    }
    return await response.json()
}

export const voteAnecdote = async (anecdote) => {
    const config = {
        method: 'PUT',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify({...anecdote, votes : anecdote.votes + 1})
    }
    const response = await fetch(`${baseUrl}/${anecdote.id}`, config)
    if (!response.ok) {
        throw new Error('vote anecdote failed')
    }
    return await response.json()
}