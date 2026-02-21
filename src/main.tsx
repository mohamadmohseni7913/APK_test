import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import App from './App.tsx'
import './App.css'
import { UserProvider } from './context/AuthContext.tsx'
import Providers from './providers/QueryProvider.tsx'
import { Toaster } from 'react-hot-toast'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <Providers>
      <UserProvider>
        <App />
      </UserProvider>
      <Toaster position="top-center" />
    </Providers>
  </StrictMode>,
)
