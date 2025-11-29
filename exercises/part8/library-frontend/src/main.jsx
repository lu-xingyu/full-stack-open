import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.jsx";

import { ApolloClient, HttpLink, InMemoryCache, createHttpLink } from '@apollo/client'
import { ApolloProvider } from '@apollo/client/react'
import { setContext } from '@apollo/client/link/context'


const authLink = setContext((_, { headers }) => {
  const token = localStorage.getItem('library-user-token')
  return {
    headers: {
      ...headers,
      authorization: token ? `Bearer ${token}` : null
    }
  }
})

const httpLink = createHttpLink({
  // uri: 'https://orange-goldfish-5gx9x65qv5g62vq9-4000.app.github.dev/'
  uri: 'http://localhost:4000/'
})
const client = new ApolloClient({
  link: authLink.concat(httpLink),
  cache: new InMemoryCache()
})

ReactDOM.createRoot(document.getElementById("root")).render(
  <ApolloProvider client={client}>
    <App />
  </ApolloProvider>
);
