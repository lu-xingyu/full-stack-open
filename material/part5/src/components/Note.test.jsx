import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import Note from './Note'

test('renders content', async () => {
  const note = {
    content: 'Component testing is done with react-testing-library',
    important: true
  }

  const mockHandler = vi.fn()  // returns a fake/mock function

  render(<Note note={note} toggleImportance={mockHandler}/>) //pass the mock function to Note component


  const user = userEvent.setup()
  const button = screen.getByText('make not important')
  await user.click(button)
  expect(mockHandler.mock.calls).toHaveLength(1) 
  // mockHandler.mock store the calls, results, instances returned as constructor of each Fn calls
  // mockHandler.mock.calls store the parameters of each call
  // .toHaveLength(1) tests that mockHandler is called only once

  // screen.debug()

  const element = screen.getByText('Component testing is done with react-testing-library')
  // screen.debug(element)
  expect(element).toBeDefined()
})

/* 
screen.getByText('param'): exact match, throw an error
screen.getByText('param', { exact: false }): look for an element that contains param, if not exists, error
await screen.findByText('params'): find an element that contains param, return a promise
screen.queryByText('params'), exact match, no error if it is not found

const { container } = render(<Note note={note} />)
const div = container.querySelector('.note') find by css any selector; for id: .querySelector('#id')
expect(div).toHaveTextContent('params') look for an element that contains param


*/