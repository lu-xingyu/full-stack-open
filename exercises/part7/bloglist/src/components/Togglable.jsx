import { useState, useImperativeHandle } from 'react'

const Togglable = (props) => {
  const [visible, setVisible] = useState(false)
  const falseDisplay = { display: visible ? 'none' : '' }
  const trueDisplay = { display: visible ? '' : 'none' }

  const toggleVisibility = () => {
    setVisible(!visible)
  }

  useImperativeHandle(props.ref, () => {
    return { toggleVisibility }
  })

  return (
    <div>
      <div style={falseDisplay}>
        <button onClick={toggleVisibility}>{props.label}</button>
      </div>
      <div style={trueDisplay}>
        {props.children}
        <button onClick={toggleVisibility}>cancel</button>
      </div>
    </div>
  )
}

export default Togglable
