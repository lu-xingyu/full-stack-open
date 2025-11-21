// Webpack will automatically find webpack.config.js and execute the content of module.exports

const path = require('path')

const config = () => {
  return {
    entry: './src/index.js',   // entry of the whole application
    output: {
      path: path.resolve(__dirname, 'build'),  // where to put the bundled  file
      filename: 'main.js'  // the name of the bundled file
    },
    devServer: {
      static: path.resolve(__dirname, 'build'),  // read static files from disk (index.html, png, fnot..), store and read bundled main.js in memory instead of disk, monitor src folder, rebundle when it changes
      compress: true,
      port: 3000,
      host: '0.0.0.0',
      client: {
        webSocketURL: 'auto',
      }
    },
    module: {
      rules: [
        {
          test: /\.js$/,  // this loader is for files that have names ending with .js.
          loader: 'babel-loader',  // the processing for those files will be done with babel-loader
          options: {  // specifying parameters for the loader
            presets: ['@babel/preset-env', '@babel/preset-react'],
          },
        },
        {
        test: /\.css$/,
        use: ['style-loader', 'css-loader'],  //  css-loader: to load the CSS files; style-loader: generate and inject a style element to the application
        },
      ],
    },
  }
}

module.exports = config
