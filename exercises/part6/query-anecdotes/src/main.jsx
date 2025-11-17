import { createRoot } from 'react-dom/client'
import { QueryClient, QueryClientProvider, useQuery } from '@tanstack/react-query'
import App from './App.jsx'
import { NotiContextProvider } from './NotificationContext'

const queryClient = new QueryClient()

createRoot(document.getElementById('root')).render(
  <QueryClientProvider client={queryClient}>
    <NotiContextProvider>
      <App />
    </NotiContextProvider>
  </QueryClientProvider>
)