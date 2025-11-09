import { useState, useEffect, useRef } from 'react'
import LoginState from './components/LoginState'
import Blogs from './components/Blogs'
import LoginForm from './components/LoginForm'
import BlogForm from './components/BlogForm'
import Notification from './components/Notification'
import blogService from './services/blogs'
import loginService from './services/login'
import Togglable from './components/Togglable'


const App = () => {
  const [blogs, setBlogs] = useState([])
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [user, setUser] = useState(null)
  const [noticeMessage, setNoticeMessage] = useState({ message: null, error: false })
  const blogFormRef = useRef()


  useEffect(() => {
    blogService.getAll().then(blogs =>
      setBlogs( blogs.sort((a, b) => b.likes - a.likes) )
    )
  }, [])

  useEffect(() => {
    const loggedUserJSON = window.localStorage.getItem('loggedUser')
    if(loggedUserJSON) {
      const loggedUser = JSON.parse(loggedUserJSON)
      setUser(loggedUser)
    }
  }, [])

  const setNotification = (msg, isError) => {
    setNoticeMessage({ message: msg, error: isError })
    setTimeout(() => {
      setNoticeMessage({ message: null, error: false })
    }, 5000)
  }

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
      setNotification('wrong credentials', true)
    }
  }

  const logoutHandler = () => {
    window.localStorage.removeItem('loggedUser')
    setUser(null)
  }

  const createBlog = async (newBlog) => {
    try {
      const addedBlog = await blogService.addNew(newBlog)
      const currentBlogs = blogs.concat(addedBlog)
      setBlogs(currentBlogs.sort((a, b) => b.likes - a.likes))
      setNotification(`a new blog ${addedBlog.title} by ${addedBlog.author} added`, false)
      blogFormRef.current.toggleVisibility()
    } catch (error) {
      console.log(error.message)
      setNotification('add blog failed', true)
    }
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
        <BlogForm createBlog={createBlog} />
      </Togglable>
      <Blogs blogs={blogs} likesHandler={plusLike} username={user.username} deleteHandler={deleteHandler}/>
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
      {noticeMessage.message && <Notification message={noticeMessage.message} error={noticeMessage.error} />}
      <div>
        {!user && showLogout()}
        {user && showLogin()}
      </div>
    </div>
  )
}

export default App