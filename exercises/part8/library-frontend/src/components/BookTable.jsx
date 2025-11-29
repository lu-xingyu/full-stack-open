import { BOOK_BY_GENRE } from '../queries'
import { useQuery } from '@apollo/client/react'

const BookTable = ({ genreToQuery }) => {
  const queryVar = 
    genreToQuery === "all genres"
    ? {}
    : { genre: genreToQuery }

  const result = useQuery(BOOK_BY_GENRE, {
    variables: queryVar
  })


  if (result.loading) {
    return <div>loading</div>
  }

  let books = result.data.allBooks

  return (
    <table>
      <tbody>
        <tr>
          <th></th>
          <th>author</th>
          <th>published</th>
        </tr>
        {books.map((a) => (
          <tr key={a.title}>
            <td>{a.title}</td>
            <td>{a.author.name}</td>
            <td>{a.published}</td>
          </tr>
        ))}
      </tbody>
    </table>
  )
}

export default BookTable
