import { createSlice } from '@reduxjs/toolkit'

const notiSlice = createSlice({
  name: 'notification',
  initialState: { message: null, error: false },
  reducers: {
    setNoti(state, action) {
      return action.payload
    },
    resetNoti(state, action) {
      return { message: null, error: false }
    }
  }
})

const { setNoti, resetNoti } = notiSlice.actions

export const displayNoti = (noti) => {
  return (dispatch) => {
    dispatch(setNoti(noti))
    setTimeout(() => {
      dispatch(resetNoti())
    }, 3000)
  }
}

export default notiSlice.reducer

