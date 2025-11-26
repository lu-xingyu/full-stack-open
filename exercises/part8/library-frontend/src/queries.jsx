import { gql } from '@apollo/client'
import { useQuery } from '@apollo/client/react'

export const ALL_AUTHORS = gql`
query {
  allAuthors {
    name
    born
    bookCount
  }
}
`

export const ALL_BOOKS = gql`
query {
  allBooks {
    title
    published
    author
  }
}`

export const NEW_BOOK = gql `
mutation createNewBook ($title: String!, $author: String, $published: Int, $genres: [String!]) {
  addBook(
    title: $title,
    author: $author,
    published: $published,
    genres: $genres
  ) {
    title
    published
    author
  }
}
`

export const ADD_BORN = gql `
mutation editBorn ($name: String!, $setBornTo: Int!) {
  editAuthor(
    name: $name,
    setBornTo: $setBornTo
  ) {
    name
    born
  }
}`
