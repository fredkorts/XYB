import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App'
import Providers from './core/providers/providers'
import './core/i18n/index'
import './index.css'

// Debug: Check for service workers
if ('serviceWorker' in navigator) {
  navigator.serviceWorker.getRegistrations().then(registrations => {
    if (registrations.length > 0) {
      console.warn('Service workers detected:', registrations)
      registrations.forEach(registration => {
        console.log('SW scope:', registration.scope)
      })
    }
  })
}

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <Providers>
      <App />
    </Providers>
  </React.StrictMode>
)
