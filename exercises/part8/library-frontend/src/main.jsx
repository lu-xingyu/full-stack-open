import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.jsx";

import { ApolloClient, HttpLink, InMemoryCache, createHttpLink,
  split
} from '@apollo/client'
import { ApolloProvider } from '@apollo/client/react'
import { setContext } from '@apollo/client/link/context'

import { getMainDefinition } from '@apollo/client/utilities'
import { GraphQLWsLink } from '@apollo/client/link/subscriptions'
import { createClient } from 'graphql-ws'

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
  uri: 'https://orange-goldfish-5gx9x65qv5g62vq9-4000.app.github.dev/'
  // uri: 'http://localhost:4000/'
})

const wsLink = new GraphQLWsLink(
  createClient({
    url: 'wss://orange-goldfish-5gx9x65qv5g62vq9-4000.app.github.dev/',
    on: {
      connected: () => {
        console.log('WebSocket connected');
      },
      closed: (event) => {
        console.log('WebSocket closed', event);
      },
      error: (err) => {
        console.error('WebSocket failed', err);
      }
    },
    connectionParams: {
      authToken: localStorage.getItem('library-user-token')
    }
  })
)

const splitLink = split(
  ({ query }) => {
    const definition = getMainDefinition (query)
    return (
      definition.kind === 'OperationDefinition' &&
      definition.operation === 'subscription'
    )
  },
  wsLink,
  authLink.concat(httpLink)
)

const client = new ApolloClient({
  link: splitLink,
  cache: new InMemoryCache()
})

ReactDOM.createRoot(document.getElementById("root")).render(
  <ApolloProvider client={client}>
    <App />
  </ApolloProvider>
);
