import Blog from './Blog'
import { useSelector, useDispatch } from 'react-redux'


const Blogs = ({ likesHandler, username, deleteHandler }) => {
  const blogs = useSelector(state => state.blogs)
  return (
    <div>
      {blogs.map(blog =>
        <Blog key={blog.id} blog={blog} likesHandler={likesHandler} username={username} deleteHandler={deleteHandler}/>
      )}
    </div>
  )
}

export default Blogs
