import { Route, Routes } from 'react-router-dom'
import './App.css'
import AppRoutes from './routes/AppRoutes.jsx'

import {QueryClient, QueryClientProvider} from '@tanstack/react-query'
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 60 * 1000, // 5 minutes
    }
  }
});

function App() {
  return (
    <QueryClientProvider client={queryClient}>
    
      <AppRoutes />
  </QueryClientProvider>
  )
}

export default App
