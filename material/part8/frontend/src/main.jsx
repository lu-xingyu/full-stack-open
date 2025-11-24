import ReactDOM from 'react-dom/client'
import App from './App'

import { ApolloClient, HttpLink, InMemoryCache } from '@apollo/client'

import { ApolloProvider } from '@apollo/client/react'

const client = new ApolloClient({
  link: new HttpLink({
    uri: 'https://orange-goldfish-5gx9x65qv5g62vq9-4000.app.github.dev/'
  }),
  cache: new InMemoryCache(),
})

ReactDOM.createRoot(document.getElementById('root')).render(

  <ApolloProvider client={client}>
    <App />

  </ApolloProvider>
)
