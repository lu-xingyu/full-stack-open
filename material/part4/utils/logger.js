//collect all the parameters and store them in an array called params
const info = (...params) => { 
  if (process.env.NODE_ENV !== 'test') {
    console.log(...params)  // spread all the elements in array params and pass them as input for console.log
  }
}

const error = (...params) => {
  if (process.env.NODE_ENV !== 'test') {
    console.error(...params)
  }
}

module.exports = { info, error }