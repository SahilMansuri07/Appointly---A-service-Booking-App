import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import 'bootstrap/dist/css/bootstrap.min.css';
import './index.css'
import App from './App.jsx'
import { Toaster } from 'react-hot-toast'
import { BrowserRouter, Route, Routes } from 'react-router-dom'
import { Provider } from 'react-redux'
import { store } from './redux/store.js'
import Loader from './components/common/Loader.jsx';
// import 'bootstrap/dist/js/bootstrap.bundle.min.js';


createRoot(document.getElementById('root')).render(
  <StrictMode>
      <Provider store={store}>
        
          <BrowserRouter>
            <App />
          </BrowserRouter>
       
      </Provider>
      <Toaster
      position="top-right"
      gutter={12}
      containerStyle={{
        margin: '25px',
      }}
      toastOptions={{
        success: {
          duration: 3000,
          iconTheme: {
            primary: '#22c55e',
            secondary: '#fff',
          },
        },

        error: {
          duration: 5000,
          iconTheme: {
            primary: '#ef4444',
            secondary: '#fff',
          },
        },

        style: {
          fontSize: '14px',
          maxWidth: '420px',
          padding: '14px 18px',

          background: 'var(--toast-bg)',
          color: 'var(--toast-text)',

          border: '1px solid var(--toast-border)',
          borderRadius: '12px',

          boxShadow: '0 8px 24px rgba(0,0,0,0.12)',
        },
      }}
    />

  </StrictMode>,
)
