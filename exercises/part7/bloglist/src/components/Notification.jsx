import { useSelector } from 'react-redux'

const Notification = () => {
  const { message, error } = useSelector(state => state.notification)

  if (message === null) {
    return null
  }

  if (error) {
    return(
      <div className = 'error'>
        {message}
      </div>
    )
  } else {
    return (
      <div className = 'success'>
        {message}
      </div>
    )
  }
}

export default Notification
