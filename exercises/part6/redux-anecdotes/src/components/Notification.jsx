import { useSelector } from 'react-redux'

const Notification = () => {
  const style = {
    border: 'solid',
    padding: 10,
    borderWidth: 1,
    marginBottom: 10
  }

  const content =  useSelector(({ notification }) => notification)
  if (content) {
    return <div style={style}>{content}</div>
  }
}

export default Notification
