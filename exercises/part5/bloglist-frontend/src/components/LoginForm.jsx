import Input from './Input'
const LoginForm = ({ username, password, loginHandler, setUsername, setPassword }) => (
    <div>
        <h2>log in to application</h2>
        <form onSubmit={(event) => loginHandler(event)}>
            <Input text="username" display={username} changeHandler={setUsername} />
            <Input text="password" display={password} changeHandler={setPassword} />
        <button type='submit'>login</button>
        </form>
    </div>
)

export default LoginForm