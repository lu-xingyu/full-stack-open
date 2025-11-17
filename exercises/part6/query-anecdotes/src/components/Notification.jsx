const Notification = ({ noti }) => {
  const style = {
    border: 'solid',
    padding: 10,
    borderWidth: 1,
    marginBottom: 5
  }

  if (!noti) {
    return null
  } else {
    return (
      <div style={style}>
        {noti}
      </div>
    )
  }
}

export default Notification
