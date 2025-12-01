import { useSelector, useDispatch } from 'react-redux'
import { setUser } from '../reducers/loginUserReducer'

const LoginState = () => {
  const dispatch = useDispatch()
  const user = useSelector((state) => state.loginUser)

  if (!user) {
    return null
  }

  const logoutHandler = () => {
    window.localStorage.removeItem('loggedUser')
    dispatch(setUser(null))
  }

  return (
    <span>
      {user.username} logged in
      <button type='button' onClick={logoutHandler}>
        logout
      </button>
    </span>
  )
}

export default LoginState
