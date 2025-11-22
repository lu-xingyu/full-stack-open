import { createSlice } from '@reduxjs/toolkit'
import usersService from '../services/users'

const usersSlice = createSlice({
  name: 'users',
  initialState: [],
  reducers: {
    setAllUsers (state, action) {
      return action.payload
    }
  }
})

const { setAllUsers } = usersSlice.actions

export const initializeUsers = () => {
    return async (dispatch) => {
      const users = await usersService.getUsers()
      dispatch(setAllUsers(users))
    }
}

export default usersSlice.reducer