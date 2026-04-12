import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'

// Fixed navbar + automatic scroll restoration = overlap on refresh.
// The browser restores the raw scrollY, but our sticky navbar
// (py-5 → py-3 on scroll) sits on top of the content at that offset,
// half-covering section headings. scroll-margin-top fixes anchor jumps
// but NOT history-based restoration. Disabling automatic restoration
// lets the PathContext restore effect take over for path-mode users,
// and lets ordinary visitors land at wherever the browser remembered
// (usually 0 on a cold load).
if ('scrollRestoration' in history) {
  history.scrollRestoration = 'manual';
}

// Restore scroll position when user navigates back from a section scroll.
// useQuranNav.scrollToSection pushes { section: id } entries; when the user
// presses back, the browser pops that entry and we restore the previous
// scroll position (saved via replaceState before the push).
window.addEventListener('popstate', (e) => {
  if (e.state?.scrollY != null) {
    window.scrollTo({ top: e.state.scrollY, behavior: 'smooth' });
  }
});

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
