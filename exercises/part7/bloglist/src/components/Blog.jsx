import { useState } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { likeBlog, deleteBlog, commentBlog } from '../reducers/blogsReducer'
import { useMatch, useNavigate } from 'react-router-dom'

const Blog = () => {
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const [comment, setComment] = useState('')
  const blogs = useSelector((state) => state.blogs)
  const match = useMatch('/blogs/:id')
  const blog = blogs.find((b) => b.id === match.params.id)
  const username = useSelector((state) => state.loginUser.username)

  const plusLike = async (number) => {
    const likedBlog = { ...blog, likes: blog.likes + number }
    try {
      dispatch(likeBlog(likedBlog))
    } catch (error) {
      console.log(error)
    }
  }

  const deleteHandler = async () => {
    if (window.confirm(`Remove blog ${blog.title} by ${blog.author}`)) {
      dispatch(deleteBlog(blog.id))
    }
    navigate('/')
  }

  const addComment = async (event) => {
    event.preventDefault()
    dispatch(commentBlog(blog.id, comment))
    setComment('')
  }

  const blogStyle = {
    paddingTop: 10,
    paddingLeft: 2,
    border: 'solid',
    borderWidth: 1,
    marginBottom: 5,
  }

  const showDelete = { display: username === blog.user.username ? '' : 'none' }

  return (
    <li style={blogStyle}>
      <h1>
        {blog.title} {blog.author}
      </h1>
      <div>
        <div>{blog.url}</div>
        <div>
          likes {blog.likes} <button onClick={() => plusLike(1)}>like</button>
        </div>
        <div>added by {blog.user.username}</div>
        <button style={showDelete} onClick={() => deleteHandler(blog.id, blog.title, blog.author)}>
          remove
        </button>
      </div>
      <h3>comments</h3>
      <form onSubmit={addComment}>
        <label>
          comment
          <input
            type='text'
            value={comment}
            onChange={({ target }) => setComment(target.value)}
          ></input>
        </label>
        <button type='submit'>add comment</button>
      </form>
      <ul>
        {blog.comments.map((c) => (
          <li key={blog.comments.indexOf(c)}>{c}</li>
        ))}
      </ul>
    </li>
  )
}

export default Blog
