import { useState } from 'react'

const Blog = ({ blog, likesHandler, username, deleteHandler }) => {
  const blogStyle = {
    paddingTop: 10,
    paddingLeft: 2,
    border: 'solid',
    borderWidth: 1,
    marginBottom: 5
  }

  const [view, setView] = useState(false)

  const label = view ? 'hide' : 'view'
  const trueDisplay = { display : view ? '' : 'none' }
  const showDelete = { display : username === blog.user.username ? '' : 'none' }

  return (
    <li style={blogStyle}>
      <div>
        {blog.title} {blog.author}
        <button onClick={() => setView(!view)}>{label}</button>
      </div>
      <div style={trueDisplay}>
        <div>{blog.url}</div>
        <div>likes {blog.likes} <button onClick={() => likesHandler(blog.id, 1)}>like</button></div>
        <div>{blog.user.username}</div>
        <button style={showDelete} onClick={() => deleteHandler(blog.id, blog.title, blog.author)}>remove</button>
      </div>
    </li>
  )
}

export default Blog