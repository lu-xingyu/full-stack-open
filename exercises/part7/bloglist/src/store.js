import { configureStore } from '@reduxjs/toolkit'

import notiReducer from './reducers/notiReducer'
import blogsReducer from './reducers/blogsReducer'

const store = configureStore({
  reducer: {
    notification: notiReducer,
    blogs: blogsReducer
  }
})

export default store
