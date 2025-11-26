import { ALL_AUTHORS, ADD_BORN } from '../queries'
import { useQuery } from '@apollo/client/react'
import React, { useState } from 'react';
import Select from 'react-select';
import { useMutation } from '@apollo/client/react'


const Authors = (props) => {
  const [selectedOption, setSelectedOption] = useState(null)
  const [born, setBorn] = useState('')
  const [ editBorn ] = useMutation(ADD_BORN, { refetchQueries: [ { query: ALL_AUTHORS } ] })

  if (!props.show) {
    return null
  }

  const result = useQuery(ALL_AUTHORS)
  if (result.loading) {
    return <div>loading...</div>
  }

  const authors = result.data.allAuthors
  const options = authors.map(a => ({ value: a.name, label: a.name } ));

  const updateAuthor = async (event) => {
    event.preventDefault()
    editBorn({ variables: { name: selectedOption.value, setBornTo: Number(born) } })
    setSelectedOption(null)
    setBorn('')
  }

  return (
    <div>
      <h2>authors</h2>
      <table>
        <tbody>
          <tr>
            <th></th>
            <th>born</th>
            <th>books</th>
          </tr>
          {authors.map((a) => (
            <tr key={a.name}>
              <td>{a.name}</td>
              <td>{a.born}</td>
              <td>{a.bookCount}</td>
            </tr>
          ))}
        </tbody>
      </table>
      <h2>Set birthyear</h2>
      <form onSubmit={updateAuthor}>
        <Select
          defaultValue={selectedOption}
          onChange={setSelectedOption}
          options={options}
        />
        <div>
          born
          <input value={born} onChange ={({ target }) => setBorn(target.value)} />
        </div>
        <button type='submit'>update author</button>
      </form>
    </div>
  )
}

export default Authors
