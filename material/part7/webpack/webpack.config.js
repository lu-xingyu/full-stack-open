// Webpack will automatically find webpack.config.js and execute the content of module.exports

const path = require('path')

const config = () => {
  return {
    entry: './src/index.js',   // entry of the whole application
    output: {
      path: path.resolve(__dirname, 'build'),  // where to put the bundled  file
      filename: 'main.js'  // the name of the bundled file
    }
  }
}

module.exports = config
