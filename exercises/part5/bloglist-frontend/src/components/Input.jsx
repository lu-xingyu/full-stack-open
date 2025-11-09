const Input = ({ text, display, changeHandler }) => (
  <div>
    <label>
      {text}
      <input value={display} onChange={({ target }) => changeHandler(target.value)}></input>
    </label>
  </div>

)

export default Input