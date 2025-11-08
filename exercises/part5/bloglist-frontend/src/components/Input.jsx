const Input = ({text, diaplay, changeHandler}) => (
    <div>
        <label>
            {text}
            <input value={diaplay} onChange={({ target }) => changeHandler(target.value)}></input>
        </label>
    </div>

)

export default Input