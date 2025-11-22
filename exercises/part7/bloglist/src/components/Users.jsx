import { useSelector } from 'react-redux'
import { Link } from 'react-router-dom'

const Users = () => {
  const allUsers = useSelector(state => state.users)
  if (allUsers.length === 0) {
    return (
      <div>loading users</div>
    )
  }
  return (
    <div>
      <h2>Users</h2>
      <table>
        <thead>
          <tr>
            <th></th>
            <th>blogs created</th>
          </tr>
        </thead>
        <tbody>
          {allUsers.map(user => 
            <tr key={user.id}>
              <td>
                <Link to={`/users/${user.id}`}>{user.username}</Link>
              </td>
              <td>{user.blogs.length}</td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  )
}

export default Users