import { useState, useEffect, useRef } from 'react'
import LoginState from './components/LoginState'
import Blogs from './components/Blogs'
import LoginForm from './components/LoginForm'
import BlogForm from './components/BlogForm'
import Notification from './components/Notification'
import blogService from './services/blogs'
import loginService from './services/login'
import Togglable from './components/Togglable'

import { initializeBlogs } from './reducers/blogsReducer'
import { useSelector, useDispatch } from 'react-redux'

const App = () => {
  const dispatch = useDispatch()
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [user, setUser] = useState(null)
  const blogFormRef = useRef()


  useEffect(() => {
    dispatch(initializeBlogs())
  }, [dispatch])

  useEffect(() => {
    const loggedUserJSON = window.localStorage.getItem('loggedUser')
    if(loggedUserJSON) {
      const loggedUser = JSON.parse(loggedUserJSON)
      setUser(loggedUser)
    }
  }, [])

  const loginHandler = async (event) => {
    event.preventDefault()
    try {
      const returnedUser = await loginService.login({ username, password })
      setUser(returnedUser)
      blogService.setToken(returnedUser.token)
      window.localStorage.setItem(
        'loggedUser', JSON.stringify(returnedUser)
      )

      setUsername('')
      setPassword('')
    } catch (error) {
      console.log(error)
      dispatch(displayNoti({ message: 'wrong credentials', error: true }))
    }
  }

  const logoutHandler = () => {
    window.localStorage.removeItem('loggedUser')
    setUser(null)
  }

  const plusLike = async (id, number) => {
    const blogToLike = blogs.find(b => b.id === id)

    const likedBlog = {
      user: blogToLike.user.id,
      likes: blogToLike.likes + number,
      author: blogToLike.author,
      title: blogToLike.title,
      url: blogToLike.url
    }
    try {
      await blogService.update(likedBlog, id)
      blogToLike.likes = blogToLike.likes + number
      const newBlogs = blogs.map(b => b.id !== id ?b : blogToLike)
      setBlogs(newBlogs.sort((a, b) => b.likes - a.likes))
    } catch (error) {
      console.log(error)
    }
  }

  const deleteHandler = async (id, title, author) => {
    if (window.confirm(`Remove blog ${title} by ${author}`)) {
      await blogService.remove(id)
      setBlogs(blogs.filter(b => b.id !== id))
    }
  }

  const showLogin = () => (
    <div>
      <LoginState username={user.username} logoutHandler={logoutHandler} />
      <Togglable label="create new blog" ref={blogFormRef}>
        <BlogForm togglableRef={blogFormRef} />
      </Togglable>
      <Blogs likesHandler={plusLike} username={user.username} deleteHandler={deleteHandler}/>
    </div>
  )

  const showLogout = () => (
    <LoginForm username={username} password={password} loginHandler={loginHandler}
      setUsername={setUsername} setPassword={setPassword}
    />
  )

  return (
    <div>
      <h2>blogs</h2>
      <Notification />
      <div>
        {!user && showLogout()}
        {user && showLogin()}
      </div>
    </div>
  )
}

export default App
