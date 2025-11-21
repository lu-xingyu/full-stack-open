// Webpack will automatically find webpack.config.js and execute the content of module.exports

const path = require('path')

const config = (env, argv) => {
  console.log('argv.mode:', argv.mode)
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
      client: {
        webSocketURL: {
          protocol: 'wss',  // 使用加密 WebSocket，因为页面是 https://
          hostname: 'orange-goldfish-5gx9x65qv5g62vq9-3000.app.github.dev',
          port: 443,        // 外部浏览器访问 HTTPS 默认端口
          pathname: '/ws',
        },
      }
    },
    devtool: 'source-map',
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
