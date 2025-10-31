import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App'
import Providers from './app/providers/providers'
import './i18n/index' // init translations before render
import './index.css'

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <Providers>
      <App />
    </Providers>
  </React.StrictMode>
)
