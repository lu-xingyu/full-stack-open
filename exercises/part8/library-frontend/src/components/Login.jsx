import { useState, useEffect } from "react";
import { useMutation } from '@apollo/client/react'
import { LOGIN } from "../queries"

const Login = ({ show, setToken }) => {
  const [name, setName] = useState('')
  const [password, setPassword] = useState('')
  const [ loginUser, result ] = useMutation(LOGIN)

  useEffect(() => {
    if (result.data) {
      const token = result.data.login.value
      setToken(token)
      localStorage.setItem('library-user-token', token)
    }
  }, [result.data])

  const login = async (event) => {
    event.preventDefault()
    loginUser({ variables: { name, password } })
    setName('')
    setPassword('')
  }

  if (!show || result.data) {
    return null
  }
  return (
    <form onSubmit={login}>
      <div>
        name
        <input value={name} onChange={({ target }) => setName(target.value)} />
      </div>
      <div>
        password
        <input value={password} onChange={({ target }) => setPassword(target.value)} />
      </div>
      <button type='submit'>login</button>
    </form>
  )
}

export default Login
