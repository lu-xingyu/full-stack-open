import Input from './Input'
import { useState } from 'react'

const BlogForm = ({ createBlog }) => {
  const [title, setTitle] = useState('')
  const [author, setAuthor] = useState('')
  const [url, setUrl] = useState('')

  const addBlog = (event) => {
    event.preventDefault()
    const newBlog = {
      title: title,
      author: author,
      url: url
    }
    createBlog(newBlog)
    setTitle('')
    setAuthor('')
    setUrl('')
  }

  return (
    <div>
      <h2>create new</h2>
      <form onSubmit={(event) => addBlog(event)}>
        <Input text="title: " display={title} changeHandler={setTitle} />
        <Input text="author: " display={author} changeHandler={setAuthor} />
        <Input text="url: " display={url} changeHandler={setUrl} />
        <button type='submit'>create</button>
      </form>
    </div>
  )
}

export default BlogForm