import ReactDOM from 'react-dom/client'
import App from './App'

import { ApolloClient, InMemoryCache, createHttpLink } from '@apollo/client'
import { ApolloProvider } from '@apollo/client/react'
import { setContext } from '@apollo/client/link/context'

const authLink = setContext((_, { headers }) => {
  const token = localStorage.getItem('phonenumbers-user-token')
  return {
    headers: {
      ...headers,
      authorization: token ? `Bearer ${token}` : null,
    }
  }
})

// _: last context;
// { headers }: headers of current context, httpLink will read the context before it send the request
// callback fn of setContext will be called before the request is sent, the return value is the new context

const httpLink = createHttpLink({
  uri: 'https://orange-goldfish-5gx9x65qv5g62vq9-4000.app.github.dev/',
})

const client = new ApolloClient({
  cache: new InMemoryCache(),
  link: authLink.concat(httpLink)
})


ReactDOM.createRoot(document.getElementById('root')).render(

  <ApolloProvider client={client}>
    <App />

  </ApolloProvider>
)
