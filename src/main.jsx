import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'

// Fixed navbar + automatic scroll restoration = overlap on refresh.
// The browser restores the raw scrollY, but our sticky navbar
// (py-5 → py-3 on scroll) sits on top of the content at that offset,
// half-covering section headings. scroll-margin-top fixes anchor jumps
// but NOT history-based restoration.
//
// Fix: take manual control. On refresh the page opens at the top
// (clean hero view), and path mode — which persists via sessionStorage
// in PathContext — restores the breadcrumb at the correct step so a
// user who was mid-path doesn't lose their place. For ordinary scroll
// reading, starting at the hero after F5 is the expected behavior
// for a long-form narrative site.
if ('scrollRestoration' in history) {
  history.scrollRestoration = 'manual';
}
// Force top on initial load (defend against any residual browser
// restoration that slips through before the line above takes effect).
window.scrollTo(0, 0);

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
