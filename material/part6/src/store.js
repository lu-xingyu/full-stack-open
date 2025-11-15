import { configureStore } from '@reduxjs/toolkit'
import filterReducer from './reducers/filterReducer'
import noteReducer from './reducers/noteToolkit'

const store = configureStore({
  reducer: {
    notes: noteReducer,
    filter: filterReducer
  }
})

export default store


/* if use only redux
import { createStore, combineReducers } from 'redux'
const reducer = combineReducers({
  notes: noteReducer,
  filter: filterReducer
})

const store = createStore(reducer)
*/