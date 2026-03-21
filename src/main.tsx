import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { Toaster } from 'react-hot-toast'
import '@/styles/globals.css'
import App from './App'

const queryClient = new QueryClient({
  defaultOptions: { queries: { retry: 1, staleTime: 30_000 } },
})

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <QueryClientProvider client={queryClient}>
      <App />
      <Toaster
        position="top-right"
        toastOptions={{
          style: { fontFamily: 'Nunito, sans-serif', fontSize: '13px', borderRadius: '10px' },
          success: { iconTheme: { primary: '#7AAA90', secondary: '#fff' } },
        }}
      />
    </QueryClientProvider>
  </StrictMode>,
)
