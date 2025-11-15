import { createSlice } from '@reduxjs/toolkit'

const notificationSlice = createSlice({
  name: 'noti',
  initialState: null,
  reducers: {
    setNoti(state, actions) {
      return actions.payload
    }, 
    resetNoti(state, action) {
      return null
    }
  }
})

export const { setNoti, resetNoti } = notificationSlice.actions
export default notificationSlice.reducer