const LoginState = ({ username, logoutHandler }) => (
  <p>
    {username} logged in
    <button type='button' onClick={logoutHandler}>logout</button>
  </p>
)

export default LoginState