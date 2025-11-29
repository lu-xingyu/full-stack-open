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
    author {
      name
    }
    genres
  }
}`

export const BOOK_BY_GENRE = gql `
query booksByGenre ($genre: String) {
  allBooks (genre: $genre) {
      title
      published
      author {
        name
        born
    }
  }
}
`

export const NEW_BOOK = gql `
mutation createNewBook ($title: String!, $author: String!, $published: Int!, $genres: [String!]) {
  addBook(
    title: $title,
    author: $author,
    published: $published,
    genres: $genres
  ) {
      title
      published
      author {
        name
        born
    }
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


export const LOGIN = gql `
mutation Login ($name: String!, $password: String!) {
  login(
    username: $name,
    password: $password
  ) {
    value
  }
}`

export const ME = gql `
query {
  me {
    username
    favoriteGenre
  }
}
`
