import ReactDOM from 'react-dom/client'
import { Provider } from 'react-redux'

import App from './AppToolkit'
import store from './store'

// store property makes the store accessible to all components in the application
ReactDOM.createRoot(document.getElementById('root')).render(
  <Provider store={store}>
    <App />
  </Provider>
)