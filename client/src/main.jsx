import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import App from './App.jsx'
import { CssBaseline } from '@mui/material'

createRoot(document.getElementById('root')).render(
  <>
    {/* adding cssBaseline -> to apply the css starter code like margin/padding as zero */}
    <CssBaseline />

    {/* main -> app component */}
    <App />
  </>
)
