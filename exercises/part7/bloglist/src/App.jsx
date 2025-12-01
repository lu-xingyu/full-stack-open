import { useEffect, useRef } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { BrowserRouter as Router, Routes, Route, Link, Navigate } from 'react-router-dom'
import LoginState from './components/LoginState'
import Users from './components/Users'
import Home from './components/Home'
import SpecificUser from './components/SpecificUser'
import Blog from './components/Blog'
import { initializeBlogs } from './reducers/blogsReducer'
import { setUser } from './reducers/loginUserReducer'
import { initializeUsers } from './reducers/usersReducer'

const App = () => {
  const dispatch = useDispatch()
  const loginUser = useSelector((state) => state.loginUser)

  useEffect(() => {
    dispatch(initializeBlogs())
    dispatch(initializeUsers())
  }, [dispatch])

  useEffect(() => {
    const loggedUserJSON = window.localStorage.getItem('loggedUser')
    if (loggedUserJSON) {
      const loggedUser = JSON.parse(loggedUserJSON)
      dispatch(setUser(loggedUser))
    }
  }, [dispatch])

  const padding = {
    padding: 5,
  }

  return (
    <Router>
      <div>
        <Link style={padding} to='/'>
          home
        </Link>
        <Link style={padding} to='/users'>
          users
        </Link>
        <LoginState />
      </div>
      <Routes>
        <Route path='/' element={<Home />} />
        <Route path='/users' element={loginUser ? <Users /> : <Navigate replace to='/' />} />
        <Route path='/users/:id' element={<SpecificUser />} />
        <Route path='/blogs/:id' element={<Blog />} />
      </Routes>
    </Router>
  )
}

export default App
