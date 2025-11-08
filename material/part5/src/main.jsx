import ReactDOM from 'react-dom/client'
import App from './App'
import './index.css'


ReactDOM.createRoot(document.getElementById("root")).render(<App />);



/*
// initial with AppForms

const notes = [
  {
    id: 1,
    content: 'HTML is easy',
    important: true
  },
  {
    id: 2,
    content: 'Browser can execute only JavaScript',
    important: false
  },
  {
    id: 3,
    content: 'GET and POST are the most important methods of HTTP protocol',
    important: true
  }
]

ReactDOM.createRoot(document.getElementById('root')).render(<App notes={notes} />)




// Use promise fetching with axios

const promise = axios.get('https://didactic-halibut-q7pxpr6qv64g346j7-3001.app.github.dev/notes')
console.log(promise)

promise.then(response => {
  console.log("response: ", response)
})

axios.get('https://didactic-halibut-q7pxpr6qv64g346j7-3001.app.github.dev/notes').then(response => {
  const notes = response.data
  ReactDOM.createRoot(document.getElementById('root')).render(<App notes={notes} />)
})
*/