import Blog from './Blog'

const Blogs = ({ blogs, likesHandler, username, deleteHandler }) => (
  <div>
    {blogs.map(blog =>
      <Blog key={blog.id} blog={blog} likesHandler={likesHandler} username={username} deleteHandler={deleteHandler}/>
    )}
  </div>
)

export default Blogs
