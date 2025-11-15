import { createSlice } from '@reduxjs/toolkit'
import { getAll, createNew, vote } from '../services/anecdotes'

const anecdoteSlice = createSlice({
  name: 'anecdotes',
  initialState: [],
  reducers: {
    voteAnecdote(state, action) {
      const anecdote = state.find(ane => ane.id === action.payload)
      const updatedAnecdote = {...anecdote, votes: anecdote.votes + 1}
      const newState = state.map(ane => ane.id === action.payload ? updatedAnecdote : ane)
      return newState.sort((a, b) => b.votes - a.votes)
    },
    addAnecdote(state, action) {
      state.push(action.payload)
      return state.sort((a, b) => b.votes - a.votes)
    },
    setAnecdotes(state, action) {
      return action.payload
    }
  }
})

const { addAnecdote, setAnecdotes } = anecdoteSlice.actions
export const initializeAnecdotes = () => {
  return async (dispatch) => {
    getAll().then(anecdotes => dispatch(setAnecdotes(anecdotes)))
  }
}

export const createAnecdote = (content) => {
  return async (dispatch) => {
    createNew(content).then(anecdote => dispatch(addAnecdote(anecdote)))
  }
}

export const updateAnecdote = (anecdote) => {
  return async (dispatch) => {
    vote(anecdote).then(anecdote => dispatch(voteAnecdote(anecdote.id)))
  }
}


export const { voteAnecdote } = anecdoteSlice.actions
export default anecdoteSlice.reducer
