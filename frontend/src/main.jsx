import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import { AppProvider } from './contexts/AppContext'
import { AdminProvider } from './contexts/AdminContext'
import App from './App'
import './index.css'
import './App.css'
import './pages/Auth.css'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <BrowserRouter>
      <AppProvider>
        <AdminProvider>
          <App />
        </AdminProvider>
      </AppProvider>
    </BrowserRouter>
  </StrictMode>,
)