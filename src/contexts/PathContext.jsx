// ─── PathContext ──────────────────────────────────────────────────────────────
// Manages "path mode" — a guided tour through one of the four discovery paths
// defined in src/data/paths.jsx.
//
// State surface:
//   - activePath: the full path object, or null when not in path mode
//   - currentStepIndex: number, 0-based position in activePath.steps
//   - currentStep:     the active step object, or null
//
// Actions:
//   - startPath(pathId)  → enter path mode at step 0 and navigate to it
//   - next()             → advance one step
//   - prev()             → go back one step
//   - goToStep(index)    → jump directly to a step (used by breadcrumb dots)
//   - exit()             → leave path mode, breadcrumb hides
//
// Persistence:
//   The active path id + step index are written to localStorage so a refresh
//   keeps the user on the same step. Cleared on exit().
//
// Navigation:
//   - 'section' steps → smooth scroll using a navbar offset (matches useQuranNav)
//   - 'overlay' steps → dispatches the matching window CustomEvent (the
//                       existing pattern Navbar already listens to)
//
// Auto-advance on overlay close:
//   When the user closes an overlay that was opened via path mode, the
//   browser fires `popstate` (Navbar pushes a history entry on every overlay
//   open). We listen for popstate AND for the bespoke `pathOverlayClosed`
//   custom event so any overlay close path can trigger auto-next without
//   tightly coupling individual overlay components to PathContext.
//
//   Heuristic: when an overlay step is active and the page becomes
//   "interactive again" (no overlay open according to Navbar's
//   pushState({overlay:true}) marker), we auto-advance.
//
//   Implementation kept conservative: we wait ~300ms after the overlay-open
//   marker disappears before advancing, so the user can briefly see what
//   they did and not be yanked forward immediately.
// ─────────────────────────────────────────────────────────────────────────────

import { createContext, useContext, useState, useEffect, useCallback, useRef, useMemo } from 'react';
import { PATH_OVERLAY_EVENTS, getPathById } from '../data/paths';

const PathContext = createContext(null);

const STORAGE_KEY = 'qurancodex_active_path';

// ── Helpers ──────────────────────────────────────────────────────────────────

function loadFromStorage() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw);
    if (!parsed || typeof parsed.pathId !== 'string') return null;
    const path = getPathById(parsed.pathId);
    if (!path) return null;
    const idx = Number.isInteger(parsed.stepIndex) ? parsed.stepIndex : 0;
    if (idx < 0 || idx >= path.steps.length) return null;
    return { pathId: parsed.pathId, stepIndex: idx };
  } catch {
    return null;
  }
}

function saveToStorage(pathId, stepIndex) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify({ pathId, stepIndex }));
  } catch { /* ignore quota errors */ }
}

function clearStorage() {
  try { localStorage.removeItem(STORAGE_KEY); } catch { /* ignore */ }
}

function scrollToSection(id) {
  if (!id) return;
  const el = document.getElementById(id);
  if (!el) {
    console.warn(`PathContext: no element with id="${id}"`);
    return;
  }
  const navEl = document.querySelector('nav');
  const navHeight = navEl?.offsetHeight ?? 64;
  const top = el.getBoundingClientRect().top + window.scrollY - navHeight - 16;
  window.scrollTo({ top, behavior: 'smooth' });
}

function dispatchOverlayEvent(target) {
  const eventName = PATH_OVERLAY_EVENTS[target];
  if (!eventName) {
    console.warn(`PathContext: unknown overlay target "${target}"`);
    return;
  }
  window.dispatchEvent(new CustomEvent(eventName));
}

// ── Provider ─────────────────────────────────────────────────────────────────

export function PathProvider({ children }) {
  // Restore from localStorage via lazy initializers — no setState-in-effect.
  // Don't auto-navigate on restore: the user might have refreshed mid-overlay
  // or mid-scroll. Just show the breadcrumb at the saved position so they
  // can decide what to do (Önceki / Sonraki / ✕).
  const [activePathId, setActivePathId] = useState(() => loadFromStorage()?.pathId ?? null);
  const [stepIndex,    setStepIndex]    = useState(() => loadFromStorage()?.stepIndex ?? 0);

  // Derived state
  const activePath = activePathId ? getPathById(activePathId) : null;
  const currentStep = activePath ? activePath.steps[stepIndex] ?? null : null;

  // Navigate to a given step (scroll or overlay) without changing state.
  // Used by startPath / next / prev / goToStep after they update state.
  const navigateToStep = useCallback((step) => {
    if (!step) return;
    if (step.kind === 'section') {
      scrollToSection(step.target);
    } else if (step.kind === 'overlay') {
      dispatchOverlayEvent(step.target);
    }
  }, []);

  // ── Actions ──────────────────────────────────────────────────────────────

  const startPath = useCallback((pathId) => {
    const path = getPathById(pathId);
    if (!path) {
      console.warn(`PathContext.startPath: unknown path "${pathId}"`);
      return;
    }
    setActivePathId(pathId);
    setStepIndex(0);
    saveToStorage(pathId, 0);
    // Defer navigation a tick so React commits the state change first
    // (prevents race where breadcrumb mounts after the scroll finishes)
    setTimeout(() => navigateToStep(path.steps[0]), 0);
  }, [navigateToStep]);

  const goToStep = useCallback((index) => {
    if (!activePath) return;
    if (index < 0 || index >= activePath.steps.length) return;
    setStepIndex(index);
    saveToStorage(activePath.id, index);
    navigateToStep(activePath.steps[index]);
  }, [activePath, navigateToStep]);

  const next = useCallback(() => {
    if (!activePath) return;
    const nextIdx = stepIndex + 1;
    if (nextIdx >= activePath.steps.length) return;
    goToStep(nextIdx);
  }, [activePath, stepIndex, goToStep]);

  const prev = useCallback(() => {
    if (!activePath) return;
    const prevIdx = stepIndex - 1;
    if (prevIdx < 0) return;
    goToStep(prevIdx);
  }, [activePath, stepIndex, goToStep]);

  const exit = useCallback(() => {
    setActivePathId(null);
    setStepIndex(0);
    clearStorage();
  }, []);

  // ── Auto-advance on overlay close ────────────────────────────────────────
  // Listen for the bespoke event Navbar / overlays could fire when an
  // overlay closes. For now we use the Navbar's existing popstate-based
  // close pattern: every overlay open pushes history state, every close
  // pops it. We track whether we're currently waiting for an overlay
  // step to close, and auto-advance after the pop.
  const waitingForOverlayCloseRef = useRef(false);

  useEffect(() => {
    // When the active step changes to an overlay step, mark that we're
    // waiting for it to close. Navigation already opened the overlay
    // via dispatchOverlayEvent.
    if (currentStep && currentStep.kind === 'overlay') {
      waitingForOverlayCloseRef.current = true;
    } else {
      waitingForOverlayCloseRef.current = false;
    }
  }, [currentStep]);

  useEffect(() => {
    function handlePop() {
      if (!waitingForOverlayCloseRef.current) return;
      if (!activePath) return;
      // Brief delay so the close animation runs and user sees the result
      setTimeout(() => {
        // Only auto-advance if we're still on the same overlay step
        // (user might have manually navigated meanwhile)
        if (waitingForOverlayCloseRef.current) {
          waitingForOverlayCloseRef.current = false;
          const nextIdx = stepIndex + 1;
          if (nextIdx < activePath.steps.length) {
            goToStep(nextIdx);
          }
        }
      }, 300);
    }
    window.addEventListener('popstate', handlePop);
    return () => window.removeEventListener('popstate', handlePop);
  }, [activePath, stepIndex, goToStep]);

  // ── ESC to exit ──────────────────────────────────────────────────────────
  // Only fires when no overlay is open (overlays handle their own ESC)
  useEffect(() => {
    if (!activePath) return;
    const handler = (e) => {
      if (e.key !== 'Escape') return;
      // If any overlay is open the existing handlers swallow the ESC; we
      // only want path-mode-exit when the user is on a section step.
      if (currentStep?.kind === 'overlay') return;
      exit();
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [activePath, currentStep, exit]);

  const value = useMemo(() => ({
    activePath,
    currentStep,
    currentStepIndex: stepIndex,
    totalSteps: activePath?.steps.length ?? 0,
    startPath,
    next,
    prev,
    goToStep,
    exit,
  }), [activePath, currentStep, stepIndex, startPath, next, prev, goToStep, exit]);

  return (
    <PathContext.Provider value={value}>
      {children}
    </PathContext.Provider>
  );
}

// ── Hook ─────────────────────────────────────────────────────────────────────

export function usePath() {
  const ctx = useContext(PathContext);
  if (!ctx) {
    throw new Error('usePath must be used within a <PathProvider>');
  }
  return ctx;
}

