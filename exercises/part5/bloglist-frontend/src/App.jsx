import { useState, useEffect } from 'react'
import LoginState from './components/LoginState'
import BlogsForm from './components/BlogsForm'
import LoginForm from './components/LoginForm'
import CreateNew from './components/CreateNew'
import Notification from './components/Notification'
import blogService from './services/blogs'
import loginService from './services/login'


const App = () => {
  const [blogs, setBlogs] = useState([])
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [user, setUser] = useState(null)
  const [noticeMessage, setNoticeMessage] = useState({message: null, error: false})
  const [title, setTitle] = useState('')
  const [author, setAuthor] = useState('')
  const [url, setUrl] = useState('')

  useEffect(() => {
    blogService.getAll().then(blogs =>
      setBlogs( blogs )
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
    setNoticeMessage({message: msg, error: isError})
    setTimeout(() => {
      setNoticeMessage({message: null, error: false})
    }, 5000)
  }

  const loginHandler = async (event) => {
    event.preventDefault()
    try {
      const returnedUser = await loginService.login({username, password})
      setUser(returnedUser)
      blogService.setToken(returnedUser.token)
      window.localStorage.setItem(
        'loggedUser', JSON.stringify(returnedUser)
      )

      setUsername('')
      setPassword('')
    } catch (error) {
      console.log(error)
      setNotification("wrong credentials", true)
    }
  }

  const logoutHandler = () => {
    window.localStorage.removeItem('loggedUser')
    setUser(null)
  }

  const newBlogHandler = async (event) => {
    event.preventDefault()
    const newBlog = {
      title: title,
      author: author,
      url: url
    }
    try {
      const addedBlog = await blogService.addNew(newBlog)
      setTitle('')
      setAuthor('')
      setUrl('')
      setBlogs(blogs.concat(addedBlog))
      setNotification(`a new blog ${addedBlog.title} by ${addedBlog.author} added`, false)
    } catch (error) {
      console.log(error.message)
      setNotification("add blog failed", true)
    }
  }

  const showLogin = () => (
    <div>
      <LoginState username={user.username} logoutHandler={logoutHandler} />
      <CreateNew newBlogHandler={newBlogHandler} 
                 title={title} setTitle={setTitle}
                 author={author} setAuthor={setAuthor}
                 url={url} setUrl={setUrl}
      />
      <BlogsForm blogs={blogs} />
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