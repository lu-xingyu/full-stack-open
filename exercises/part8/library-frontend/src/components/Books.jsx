import { ALL_BOOKS } from '../queries'
import { useState } from "react";
import { useQuery } from '@apollo/client/react'
import BookTable from './BookTable'

const Books = (props) => {
  const [genre, setGenre] = useState('all genres')
  if (!props.show) {
    return null
  }
  return (
    <div>
      <h2>books</h2>
      <BookTable genre={genre} />
      <button type='button' onClick={() => setGenre('refactoring')}>refactoring</button>
      <button type='button' onClick={() => setGenre('agile')}>agile</button>
      <button type='button' onClick={() => setGenre('patterns')}>patterns</button>
      <button type='button' onClick={() => setGenre('design')}>design</button>
      <button type='button' onClick={() => setGenre('crime')}>crime</button>
      <button type='button' onClick={() => setGenre('classic')}>classic</button>
      <button type='button' onClick={() => setGenre('all genres')}>all genres</button>
    </div>
  )
}

export default Books
