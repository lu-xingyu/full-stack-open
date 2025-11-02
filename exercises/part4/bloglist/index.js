const app = require('./app')
const { mongoUrl, PORT } = require('./utils/config')

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})