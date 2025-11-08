import Blog from './Blog'

const BlogsForm = ({ blogs }) => (
<div>
  {blogs.map(blog =>
    <Blog key={blog.id} blog={blog} />
  )}
</div>
)

export default BlogsForm
