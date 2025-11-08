import axios from 'axios'
const baseUrl = '/api/notes'
/* json-server use Access-Control-Allow-Origin: * by default, 
if change the baseUrl in notes.js to the express server in part3 and delete this server line, 
it will throw same-origin-policy error - because browser does not allow frontend request different origin" 
1. "server": "json-server -p 3001 db.json", 'http://localhost:3001/notes'
2. const cors = require('cors) app.use(cors()) in part3 index.js, 'http://localhost:3001/api/notes'
3. use relative path, and redirect it to http://localhost:3001 in vite.config.js (vite server conduct the cross-origin request, not browser)
*/

let token = null

const setToken = newToken => {
  token = `Bearer ${newToken}`
}

const getAll = () => {
  const request = axios.get(baseUrl)
  const nonExisting = {
    id: 10000,
    content: 'This note is not saved to server',
    important: true,
  }
  return request.then(response => response.data.concat(nonExisting))
}

const create = async newObject => {
  const config = {
    headers: { Authorization: token}
  }
  
  const response = await axios.post(baseUrl, newObject, config)
  return response.data
}

const update = (id, newObject) => {
  const request =  axios.put(`${baseUrl}/${id}`, newObject)
  return request.then(response => response.data)
}

/*
export default { 
  getAll: getAll, 
  create: create, 
  update: update 
} if name of keys and assigned variables is the same , it is equal to : */

export default { 
  getAll,
  create,
  update,
  setToken
}

// axios: http request package, send the request to backend according to frontend requirements in react