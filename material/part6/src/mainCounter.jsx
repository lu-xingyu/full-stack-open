import ReactDOM from 'react-dom/client'
import { createStore } from 'redux'

// define how to reaction according to different actions
const counterReducer = (state = 0, action) => {
  switch (action.type) {
    case 'INCREMENT':
      return state + 1
    case 'DECREMENT':
      return state - 1
    case 'ZERO':
      return 0
    default:
      return state
  }
}

// using the reaction create a store, it will call counterReducer(undefined, { type: '@@redux/INIT' }), and set the state to default value
const store = createStore(counterReducer)  

// dispatch send the action to the store, resulting counterReducer being called
const App = () => {
  return (
    <div>
      <div>{store.getState()}</div>
      <button onClick={() => store.dispatch({ type: 'INCREMENT' })}>  
        plus
      </button>
      <button onClick={() => store.dispatch({ type: 'DECREMENT' })}>
        minus
      </button>
      <button onClick={() => store.dispatch({ type: 'ZERO' })}>
        zero
      </button>
    </div>
  )
}

// find the docuemnt that has id = 'root', and create a React Root here for mouting react components
const root = ReactDOM.createRoot(document.getElementById('root'))


const renderApp = () => {
  root.render(<App />)
}

renderApp()  // render the initial page
store.subscribe(renderApp)  //define the call back Fn that is called by store every time after the counterReducer() is called