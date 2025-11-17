import { createContext, useReducer } from 'react'

const notiReducer = (state, action) => {
  switch (action.type) {
    case 'SET':
      return action.payload
    case 'RESET':
      return null
    default:
      return null
  }
}



const NotiContext = createContext()

export const NotiContextProvider = (props) => {
    const [noti, notiDispatch] = useReducer(notiReducer, null)

    return (
        <NotiContext.Provider value={{ noti, notiDispatch }}>
            {props.children}
        </NotiContext.Provider>
    )
} 

export default NotiContext