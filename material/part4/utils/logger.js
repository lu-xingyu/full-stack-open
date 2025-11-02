const info = (...params) => { //collect all the parameters and store them in an array called params
  console.log(...params)  // spread all the elements in array params and pass them as input for console.log
}


const error = (...params) => {
  console.error(...params)
}

module.exports = { info, error }