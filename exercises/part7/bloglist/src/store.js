import { configureStore } from '@reduxjs/toolkit'
import notiReducer from './reducers/notiReducer'
import blogsReducer from './reducers/blogsReducer'
import loginUserReducer from './reducers/loginUserReducer'
import usersReducer from './reducers/usersReducer'

const store = configureStore({
  reducer: {
    notification: notiReducer,
    blogs: blogsReducer,
    loginUser:loginUserReducer,
    users: usersReducer
  }
})

export default store
