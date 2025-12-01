import { useState } from "react";
import Authors from "./components/Authors";
import Books from "./components/Books";
import NewBook from "./components/NewBook";
import Login from "./components/Login";
import Recommend from "./components/Recommend";
import { useQuery, useApolloClient, useSubscription} from '@apollo/client/react'
import { BOOK_ADDED, ALL_BOOKS, BOOK_BY_GENRE } from './queries'

export const updateCache = (cache, query, addedBook) => {
  const uniqByTitle = (b) => {
    let seen = new Set()
    return b.filter((item) => {
      let k = item.title
      return seen.has(k) ? false :seen.add(k)
    })
  }

  cache.updateQuery(query, (data) => {
    if (!data) return
    return {
      allBooks: uniqByTitle(data.allBooks.concat(addedBook))
    }
  })
}

const App = () => {
  const [page, setPage] = useState("authors");
  const [token, setToken] = useState(null)
  const client = useApolloClient()

  useSubscription(BOOK_ADDED, {
    onData: ({ data, client }) => {
      console.log("subscription data:", data)
      const addedBook = data.data.bookAdded
      window.alert(`new book: ${addedBook.title} added`)
      updateCache(client.cache, {query: ALL_BOOKS }, addedBook)
      for (const g of addedBook.genres) {
        updateCache(client.cache, { query: BOOK_BY_GENRE, variables: {genre: g}}, addedBook)
      }
    }
  })


  const logout = () => {
    setToken(null)
    localStorage.clear()
    client.resetStore()
  }

  return (
    <div>
      <div>
        <button onClick={() => setPage("authors")}>authors</button>
        <button onClick={() => setPage("books")}>books</button>
        { token && <button onClick={() => setPage("add")}>add book</button> }
        { !token && <button onClick={() => setPage("login")}>login</button> }
        { token && <button onClick={() => setPage("recommend")}>recommend</button> }
        { token && <button onClick={logout}>logout</button> }
      </div>

      <Authors show={page === "authors"} />

      <Books show={page === "books"} />

      <NewBook show={page === "add"} />

      <Login show={page === "login"} setToken={setToken}/>

      <Recommend show={page === "recommend"} />
    </div>
  );
};

export default App;
