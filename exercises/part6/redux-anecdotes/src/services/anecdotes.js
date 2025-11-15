const baseUrl = 'https://didactic-halibut-q7pxpr6qv64g346j7-3001.app.github.dev/anecdotes'

const getAll = async () => {
    const response = await fetch(baseUrl)

    if (!response.ok) {
        throw new Error('get data failed')
    }

    return await response.json()
}

const createNew = async (content) => {
    const config = {
        method: 'POST',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify({
            content,
            votes: 0
        })
    }

    const response = await fetch(baseUrl, config)
    if (!response.ok) {
        throw new Error('Failed to create anecdote')
    }

    return await response.json()
}

const vote = async (anecdote) => {
    const config = {
        method: 'PUT',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify({
            id: anecdote.id,
            content: anecdote.content,
            votes: anecdote.votes + 1
        })
    }

    const response = await fetch(`${baseUrl}/${anecdote.id}`, config)
    if (!response.ok) {
        throw new Error('Failed to vote anecdote')
    }

    return await response.json()
}
export { getAll, createNew, vote }