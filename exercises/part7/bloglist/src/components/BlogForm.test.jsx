import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import BlogForm from './BlogForm'

test('add new blog with correct parameters', async () => {
    const mockCreateBlog = vi.fn()

    render(<BlogForm createBlog={mockCreateBlog} />)

    const user = userEvent.setup()
    const titleInput = screen.getByLabelText("title:") // getByLabelText use textContent.trim() of DOM to match text, the latter will automatically delete sapce an the end
    await user.type(titleInput, "How to become a Millionaire")

    const authorInput = screen.getByLabelText("author:")
    await user.type(authorInput, "Peter")

    const urlInput = screen.getByLabelText("url:")
    await user.type(urlInput, "https://link.com")

    const createButton = screen.getByText("create")
    await user.click(createButton)

    expect(mockCreateBlog.mock.calls).toHaveLength(1)
    expect(mockCreateBlog.mock.calls[0][0]).toEqual({
      title: "How to become a Millionaire",
      author: "Peter",
      url: "https://link.com"
    })
})