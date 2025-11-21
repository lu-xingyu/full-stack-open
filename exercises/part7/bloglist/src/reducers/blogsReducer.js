import { createSlice } from '@reduxjs/toolkit'
import blogService from '../services/blogs'

import { useDispatch } from 'react-redux'

const blogsSlice = createSlice({
  name: 'blogs',
  initialState: [],
  reducers: {
    setBlogs (state, action) {
      return action.payload
    },
    updateBlog (state, action) {
      return state.map(b => b.id === action.payload.id ? action.payload : b)
    },
  }
})

const { setBlogs, updateBlog } = blogsSlice.actions

export const initializeBlogs = () => {
  return async (dispatch) => {
    blogService.getAll().then(blogs =>
      dispatch(setBlogs(blogs.sort((a, b) => b.likes - a.likes)))
    )
  }
}

export const addBlog = (newBlog) => {
  return async (dispatch, getState) => {
    const addedBlog = await blogService.addNew(newBlog)
    const oldBlogs = getState().blogs
    const currentBlogs = oldBlogs.concat(addedBlog)
    dispatch(setBlogs(currentBlogs.sort((a, b) => b.likes - a.likes)))
  }
}

export default blogsSlice.reducer
