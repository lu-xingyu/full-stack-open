const baseUrl = 'https://didactic-halibut-q7pxpr6qv64g346j7-3001.app.github.dev/notes'

const getAll = async () => {
  const response = await fetch(baseUrl) 
  // if not explicitly defined, fetch performs its default action - GET request
  // fetch does not automatically throw an error even if the response status code is 404 or 500

  // response.ok is set to true if response status code is between 200 and 299 (meaning successful). 
  // For all other status codes, such as 404 or 500, it is set to false
  if (!response.ok) {
    throw new Error('Failed to fetch notes')
  }
  return await response.json()
}

const createNew = async (content) => {
  const response = await fetch(baseUrl, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ content, important: false }),
  })
  
  if (!response.ok) {
    throw new Error('Failed to create note')
  }
  
  return await response.json()
}

export default { getAll, createNew }