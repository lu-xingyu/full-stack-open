import Input from './Input'
import { useState  } from 'react'
import { setUser } from '../reducers/loginUserReducer'
import blogService from '../services/blogs'
import loginService from '../services/login'
import { useDispatch } from 'react-redux'

const LoginForm = () => {
  const dispatch = useDispatch()
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')

  const loginHandler = async (event) => {
    event.preventDefault()
    try {
      const returnedUser = await loginService.login({ username, password })
      dispatch(setUser(returnedUser))
      blogService.setToken(returnedUser.token)
      window.localStorage.setItem(
        'loggedUser', JSON.stringify(returnedUser)
      )

      setUsername('')
      setPassword('')
    } catch (error) {
      console.log(error)
      dispatch(displayNoti({ message: 'wrong credentials', error: true }))
    }
  }
  return (
    <div>
      <h2>log in to application</h2>
      <form onSubmit={(event) => loginHandler(event)}>
        <Input text="username" display={username} changeHandler={setUsername} />
        <Input text="password" display={password} changeHandler={setPassword} />
        <button type='submit'>login</button>
      </form>
    </div>
  )
}

export default LoginForm