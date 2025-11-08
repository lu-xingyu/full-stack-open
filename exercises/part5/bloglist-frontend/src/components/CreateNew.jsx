import Input from './Input'
const CreateNew = ({ newBlogHandler, title, setTitle, author, setAuthor, url, setUrl }) => (
  <div>
    <h2>create new</h2>
    <form onSubmit={(event) => newBlogHandler(event)}>
      <Input text="title: " display={title} changeHandler={setTitle} />
      <Input text="author: " display={author} changeHandler={setAuthor} />
      <Input text="url: " display={url} changeHandler={setUrl} />
      <button type='submit'>create</button>
    </form>
  </div>
)

export default CreateNew