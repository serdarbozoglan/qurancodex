import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'

// Self-hosted fonts (bundled via Fontsource — no runtime fonts.googleapis.com dependency).
// Inter variable includes all weights 300-900; Playfair Display ships per-weight.
import '@fontsource-variable/inter';
import '@fontsource/playfair-display/400.css';
import '@fontsource/playfair-display/700.css';
import '@fontsource/playfair-display/800.css';
import '@fontsource/playfair-display/900.css';
import '@fontsource/amiri/400.css';
import '@fontsource/amiri/700.css';
import '@fontsource/amiri/400-italic.css';
import '@fontsource/amiri-quran/400.css';
// Meal-text body serif candidates — only the active one is referenced from
// ReadingMode.jsx; the others stay imported so swapping is a one-line change.
import '@fontsource/lora/400.css';
import '@fontsource/lora/500.css';
import '@fontsource/lora/400-italic.css';
import '@fontsource/lora/500-italic.css';
import '@fontsource/crimson-pro/400.css';
import '@fontsource/crimson-pro/500.css';
import '@fontsource/crimson-pro/400-italic.css';
import '@fontsource/crimson-pro/500-italic.css';

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
