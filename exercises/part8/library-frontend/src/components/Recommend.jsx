import { useQuery } from '@apollo/client/react'
import BookTable from './BookTable'
import { ME } from '../queries'

const Recommend = ({ show }) => {
  const result = useQuery(ME)

  if (!show) {
    return null
  }

  if (result.loading) {
    return <div>loading</div>
  }

  console.log(result)
  return (
    <BookTable genre={result.data.me.favoriteGenre} />
  )
}


export default Recommend
