import React from 'react'
import axios from 'axios'


// <App /> => const appInstance = new App(props), render(), componentDidMount() (the sequence of execution is fixed)
// render: this.setState(); parent component pass new props; parent component re-render
// but componentDidMount() is executed only after the first render
class App extends React.Component {
  constructor(props) {
    super(props)

    this.state = {
      anecdotes: [],
      current: 0
    }
  }

  // componentDidMount is executed once right after the first time a component renders:
  componentDidMount = () => {
    axios.get('http://localhost:3001/anecdotes').then(response => {
      this.setState({ anecdotes: response.data })
    })
  }

  handleClick = () => {
    const current = Math.floor(
      Math.random() * this.state.anecdotes.length
    )
    this.setState({ current })
  }

  render() {
    if (this.state.anecdotes.length === 0) {
      return <div>no anecdotes...</div>
    }

    return (
      <div>
        <h1>anecdote of the day</h1>

        <div>
          {this.state.anecdotes[this.state.current].content}
        </div>
        <button onClick={this.handleClick}>next</button>
      </div>
    )
  }
}

export default App
