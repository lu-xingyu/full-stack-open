import 'core-js/stable/index.js'
import 'regenerator-runtime/runtime.js'
import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App'
import './index.css'


ReactDOM.createRoot(document.getElementById('root')).render(<App />)

/*
REACTDOM: convert the virtual DOM to true DOM provided by browser
react maintain a virtual DOM in its memory, evey time the component updates, it will compare
the difference between old DOM and the new DOM
*/
