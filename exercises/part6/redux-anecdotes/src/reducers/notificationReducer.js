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

const { setNoti, resetNoti } = notificationSlice.actions
export const setNotification = (msg, m) => {
  return (dispatch) => {
    dispatch(setNoti(msg))
    setTimeout(() => {
      dispatch(resetNoti())
    }, m * 1000)
  }
}
export default notificationSlice.reducer