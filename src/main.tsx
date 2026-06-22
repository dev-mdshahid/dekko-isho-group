import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { HelmetProvider } from 'react-helmet-async'
import './styles/normalize.css'
import './styles/webflow.css'
import './styles/site.css'
import './styles/gallery.css'
import './styles/sustainability.css'
import './styles/manufacturing.css'
import './styles/legacy-fouc.css'
import './styles/legacy-interactions.css'
import App from './App.tsx'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <HelmetProvider>
      <App />
    </HelmetProvider>
  </StrictMode>,
)
