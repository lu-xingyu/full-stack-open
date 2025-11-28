import { ALL_BOOKS } from '../queries'
import { useQuery } from '@apollo/client/react'

const BookTable = ({ genre }) => {
  const result = useQuery(ALL_BOOKS)

  if (result.loading) {
    return <div>loading</div>
  }

  let books = result.data.allBooks
  if (genre !== 'all genres') {
    books = books.filter(b => b.genres.includes(genre))
  }

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
