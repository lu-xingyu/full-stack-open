import { useRef } from 'react'
import { useSelector } from 'react-redux'
import Blogs from './Blogs'
import LoginForm from './LoginForm'
import BlogForm from './BlogForm'
import Notification from './Notification'
import Togglable from './Togglable'

const Home = () => {
  const blogFormRef = useRef()
  const user = useSelector((state) => state.loginUser)

  const showLogin = () => (
    <div>
      <Togglable label='create new blog' ref={blogFormRef}>
        <BlogForm togglableRef={blogFormRef} />
      </Togglable>
      <Blogs />
    </div>
  )

  const showLogout = () => <LoginForm />

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

export default Home
