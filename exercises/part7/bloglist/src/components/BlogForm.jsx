import Input from './Input'
import { useState } from 'react'
import { useDispatch } from 'react-redux'
import { displayNoti } from '../reducers/notiReducer'
import { addBlog } from '../reducers/blogsReducer'

const BlogForm = ({ togglableRef }) => {
  const dispatch = useDispatch()

  const [title, setTitle] = useState('')
  const [author, setAuthor] = useState('')
  const [url, setUrl] = useState('')

  const createBlog = async (event) => {
    event.preventDefault()
    const blogToAdd = {
      title: title,
      author: author,
      url: url
    }

    try {
      dispatch(addBlog(blogToAdd))
      dispatch(displayNoti({ message: `a new blog ${blogToAdd.title} by ${blogToAdd.author} added`, error: false }))
      togglableRef.current.toggleVisibility()
    } catch (error) {
      console.log(error.message)
      dispatch(displayNoti({ message: 'add blog failed', error: true }))
    }

    setTitle('')
    setAuthor('')
    setUrl('')
  }

  return (
    <div>
      <h2>create new</h2>
      <form onSubmit={(event) => createBlog(event)}>
        <Input text="title: " display={title} changeHandler={setTitle} />
        <Input text="author: " display={author} changeHandler={setAuthor} />
        <Input text="url: " display={url} changeHandler={setUrl} />
        <button type='submit'>create</button>
      </form>
    </div>
  )
}

export default BlogForm
