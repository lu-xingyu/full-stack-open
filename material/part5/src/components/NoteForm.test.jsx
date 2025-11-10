import { render, screen } from '@testing-library/react'
import NoteForm from './NoteForm'
import userEvent from '@testing-library/user-event'

test('<NoteForm /> updates parent state and calls onSubmit', async () => {
  const createNote = vi.fn()
  const user = userEvent.setup()

  render(<NoteForm createNote={createNote} />)

  const input = screen.getByPlaceholderText('write note content here')
  const sendButton = screen.getByText('save')

  await user.type(input, 'testing a form...')
  await user.click(sendButton)

  console.log(createNote.mock.calls)

  expect(createNote.mock.calls).toHaveLength(1)
  expect(createNote.mock.calls[0][0].content).toBe('testing a form...')
})

/* 
screen.getByRole('textbox'): if there are multiple textbox, throw an error
alternative: 
1. use const inputs = screen.getAllByRole('textbox'); await user.type(inputs[0], '...')
2. add <label></label> outeside of input, and use screen.getByLabelText('conten'), exact match ba default
3. add placeholder property for the input, and use screen.getByPlaceholderText('...'), exact match by default
4. use container.querySelector('#noteid')
*/