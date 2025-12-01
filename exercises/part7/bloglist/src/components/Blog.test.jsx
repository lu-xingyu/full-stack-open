import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import Blog from './Blog'

test('render note correctly by default', async () => {
  const blog = {
    title: 'How to become a millionaire',
    author: 'Peter',
    url: 'https://link.com',
    likes: 37,
    user: {
      username: 'Chandler',
      name: 'Bing',
      id: '1',
    },
    id: '2',
  }

  const mockLikesHandler = vi.fn()
  const mockDeleteHandler = vi.fn()

  render(
    <Blog
      blog={blog}
      likesHandler={mockLikesHandler}
      username='Monica'
      deleteHandler={mockDeleteHandler}
    />,
  )

  const title = screen.getByText('How to become a millionaire', { exact: false })
  expect(title).toBeDefined()
  const author = screen.getByText('Peter', { exact: false })
  expect(author).toBeDefined()

  const url = screen.getByText('https://link.com')
  expect(url).not.toBeVisible()
  const likes = screen.getByText('likes 37', { exact: false })
  expect(likes).not.toBeVisible()
  const username = screen.getByText('Chandler')
  expect(username).not.toBeVisible()

  const user = userEvent.setup()
  const showButton = screen.getByText('view')
  await user.click(showButton)

  expect(url).toBeDefined()
  expect(likes).toBeDefined()
  expect(username).toBeDefined()

  const likeButton = screen.getByText('like')
  await user.click(likeButton)
  await user.click(likeButton)

  expect(mockLikesHandler.mock.calls).toHaveLength(2)
})
