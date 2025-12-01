import { createSlice } from '@reduxjs/toolkit'
import blogService from '../services/blogs'
import { initializeUsers } from './usersReducer'

const blogsSlice = createSlice({
  name: 'blogs',
  initialState: [],
  reducers: {
    setBlogs(state, action) {
      return action.payload.sort((a, b) => b.likes - a.likes)
    },
    newBlog(state, action) {
      const newBlogs = state.concat(action.payload)
      return newBlogs.sort((a, b) => b.likes - a.likes)
    },
    updateBlog(state, action) {
      const newBlogs = state.map((b) => (b.id === action.payload.id ? action.payload : b))
      return newBlogs.sort((a, b) => b.likes - a.likes)
    },
    removeBlog(state, action) {
      return state.filter((b) => b.id !== action.payload)
    },
  },
})

const { setBlogs, newBlog, updateBlog, removeBlog } = blogsSlice.actions

export const initializeBlogs = () => {
  return async (dispatch) => {
    blogService.getAll().then((blogs) => {
      dispatch(setBlogs(blogs))
    })
  }
}

export const addBlog = (blogToAdd) => {
  return async (dispatch) => {
    const addedBlog = await blogService.addNew(blogToAdd)
    dispatch(newBlog(addedBlog))
    dispatch(initializeUsers())
  }
}

export const likeBlog = (newBlog) => {
  return async (dispatch) => {
    const updatedBlog = await blogService.update(newBlog)
    dispatch(updateBlog(updatedBlog))
  }
}

export const deleteBlog = (id) => {
  return async (dispatch) => {
    await blogService.remove(id)
    dispatch(removeBlog(id))
    dispatch(initializeUsers())
  }
}

export const commentBlog = (id, comment) => {
  return async (dispatch) => {
    const commentedBlog = await blogService.comment(id, comment)
    dispatch(updateBlog(commentedBlog))
  }
}

export default blogsSlice.reducer
