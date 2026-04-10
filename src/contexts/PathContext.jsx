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
// Persistence (two stores, intentionally different):
//   - Active path (id + step index) → sessionStorage. Survives F5 refresh
//     so the user doesn't lose their place by accident, but ends when the
//     tab closes. New tab = clean slate. This matches user expectations
//     for guided tours (Shepherd.js, Driver.js, Intro.js all use this
//     pattern). A returning visitor next week shouldn't be dropped back
//     into a half-finished tour from days ago.
//   - Completed paths → localStorage. Long-lived achievement marker:
//     "I have walked this path before". PathCards reads this and shows
//     a check badge on completed cards.
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
// Separate key from active-path state so completing a path and then starting
// a new one don't interfere with each other. Stored as a JSON array of ids.
const COMPLETED_KEY = 'qurancodex_completed_paths';

// ── Helpers ──────────────────────────────────────────────────────────────────

// Active path lives in sessionStorage — see header doc for rationale.
function loadFromStorage() {
  try {
    const raw = sessionStorage.getItem(STORAGE_KEY);
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
    sessionStorage.setItem(STORAGE_KEY, JSON.stringify({ pathId, stepIndex }));
  } catch { /* ignore quota errors */ }
}

function clearStorage() {
  try { sessionStorage.removeItem(STORAGE_KEY); } catch { /* ignore */ }
}

function loadCompletedFromStorage() {
  try {
    const raw = localStorage.getItem(COMPLETED_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed)) return [];
    return parsed.filter((id) => typeof id === 'string');
  } catch {
    return [];
  }
}

function saveCompletedToStorage(ids) {
  try {
    localStorage.setItem(COMPLETED_KEY, JSON.stringify(ids));
  } catch { /* ignore quota errors */ }
}

function scrollToSection(id) {
  if (!id) return;
  const el = document.getElementById(id);
  if (!el) {
    console.warn(`PathContext: no element with id="${id}"`);
    return;
  }
  // Defer one animation frame so any pending React render commits first.
  // Without this, prev/next on a section step computed `top` against the
  // PRE-render layout, then the new step's render sometimes settled
  // slightly differently and the scroll missed.
  requestAnimationFrame(() => {
    const navEl = document.querySelector('nav');
    const navHeight = navEl?.offsetHeight ?? 64;
    const top = el.getBoundingClientRect().top + window.scrollY - navHeight - 16;
    // eslint-disable-next-line no-console
    console.log('[PathMode] scrollToSection', { id, elTop: el.getBoundingClientRect().top, scrollY: window.scrollY, navHeight, finalTop: top });
    window.scrollTo({ top, behavior: 'smooth' });
  });
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
  // Restore from sessionStorage via lazy initializers — no setState-in-effect.
  // The breadcrumb shows up automatically at the saved position. For the
  // re-navigation behavior on restore (overlay re-open), see the dedicated
  // useEffect below — section steps stay quiet (the user might be reading
  // section content already), but overlay steps re-open the modal so the
  // app's "current step" state matches the visible DOM.
  const [activePathId, setActivePathId] = useState(() => loadFromStorage()?.pathId ?? null);
  const [stepIndex,    setStepIndex]    = useState(() => loadFromStorage()?.stepIndex ?? 0);

  // Completed paths are persisted across sessions so the PathCards section
  // can show a checkmark badge on previously-finished paths. A small array —
  // 4 paths today, unlikely to grow dramatically — kept as JSON.
  const [completedPathIds, setCompletedPathIds] = useState(() => loadCompletedFromStorage());

  // Transient flag: true for the ~1.5s between clicking "Yolu Tamamla" and
  // the breadcrumb fading out. Lets the breadcrumb render the success state
  // without needing its own timer to coordinate with the unmount animation.
  const [isCompleting, setIsCompleting] = useState(false);

  // Derived state
  const activePath = activePathId ? getPathById(activePathId) : null;
  const currentStep = activePath ? activePath.steps[stepIndex] ?? null : null;

  // Navigate to a given step (scroll or overlay) without changing state.
  // Used by startPath / next / prev / goToStep after they update state.
  const navigateToStep = useCallback((step) => {
    if (!step) return;
    // eslint-disable-next-line no-console
    console.log('[PathMode] navigateToStep', { kind: step.kind, target: step.target, label: step.labelTr });
    if (step.kind === 'section') {
      scrollToSection(step.target);
    } else if (step.kind === 'overlay') {
      dispatchOverlayEvent(step.target);
    }
  }, []);

  // ── Refs for overlay coordination ────────────────────────────────────────
  // waitingForOverlayCloseRef: when on an overlay step, this is true and the
  // popstate handler will auto-advance to the next step on close.
  // skipAutoAdvanceRef: when the user explicitly navigates (next/prev/dot/
  // exit) while on an overlay step, we manually trigger history.back() to
  // close the overlay, then run our own navigation. This flag suppresses
  // the popstate auto-advance during that window so we don't double-fire.
  // completionScrollListenerRef: holds the one-time popstate handler that
  // completePath registers for overlay-step finishes. Stored in a ref so
  // startPath() and exit() can manually remove it if the user moves on
  // without ever closing the still-open completion modal — preventing a
  // dangling listener from firing on an unrelated future overlay close.
  const waitingForOverlayCloseRef = useRef(false);
  const skipAutoAdvanceRef = useRef(false);
  const completionScrollListenerRef = useRef(null);

  // Helper: tear down a leftover completionScroll listener if one is active.
  // Called by startPath, exit, and completePath itself before re-arming.
  const clearCompletionScrollListener = useCallback(() => {
    if (completionScrollListenerRef.current) {
      window.removeEventListener('popstate', completionScrollListenerRef.current);
      completionScrollListenerRef.current = null;
    }
  }, []);

  // ── Actions ──────────────────────────────────────────────────────────────

  const startPath = useCallback((pathId) => {
    const path = getPathById(pathId);
    if (!path) {
      console.warn(`PathContext.startPath: unknown path "${pathId}"`);
      return;
    }
    // If a previous completion left a one-time scroll listener registered
    // (user finished a path with an overlay last step but never closed
    // that overlay), tear it down — otherwise it would fire later when
    // an unrelated overlay closes and yank them to PathCards.
    clearCompletionScrollListener();
    setActivePathId(pathId);
    setStepIndex(0);
    saveToStorage(pathId, 0);
    // Defer navigation a tick so React commits the state change first
    // (prevents race where breadcrumb mounts after the scroll finishes)
    setTimeout(() => navigateToStep(path.steps[0]), 0);
  }, [navigateToStep, clearCompletionScrollListener]);

  // Smart goToStep: if we're currently on an overlay step, close the
  // current overlay first (history.back), wait briefly for unmount,
  // then open the new step.
  //
  // Why sequential rather than parallel: Navbar's popstate handler closes
  // overlays via a state-based if-else chain whose order doesn't match
  // path-mode step order. If both the old and new overlay state were
  // true at the same time, popstate would close whichever the chain
  // matched first — possibly the new one we just opened. Sequential
  // close-then-open avoids that race entirely.
  //
  // Why 60ms (was 350ms): the previous 350ms timer left a visible flash
  // of the homepage between the two modals. The actual close work is
  // synchronous — by the time the next animation frame runs the old
  // modal is unmounted. 60ms gives one frame of headroom for the
  // popstate handler + Navbar state batch to settle, then the new modal
  // mounts. Empirically near-imperceptible swap, no homepage flash.
  const goToStep = useCallback((index) => {
    // eslint-disable-next-line no-console
    console.log('[PathMode] goToStep', { requestedIndex: index, currentStepIndex: stepIndex, currentTarget: activePath?.steps[stepIndex]?.target, nextTarget: activePath?.steps[index]?.target });
    if (!activePath) return;
    if (index < 0 || index >= activePath.steps.length) return;

    const currentIsOverlay = activePath.steps[stepIndex]?.kind === 'overlay';

    if (currentIsOverlay) {
      // Tell the popstate handler not to auto-advance during this manual
      // navigation — we're handling everything ourselves.
      skipAutoAdvanceRef.current = true;
      window.history.back();
      // Wait one render frame's worth, then navigate to the target.
      setTimeout(() => {
        skipAutoAdvanceRef.current = false;
        setStepIndex(index);
        saveToStorage(activePath.id, index);
        navigateToStep(activePath.steps[index]);
      }, 60);
    } else {
      setStepIndex(index);
      saveToStorage(activePath.id, index);
      navigateToStep(activePath.steps[index]);
    }
  }, [activePath, stepIndex, navigateToStep]);

  const next = useCallback(() => {
    if (!activePath) return;
    const nextIdx = stepIndex + 1;
    if (nextIdx >= activePath.steps.length) return;
    goToStep(nextIdx);
  }, [activePath, stepIndex, goToStep]);

  const prev = useCallback(() => {
    // eslint-disable-next-line no-console
    console.log('[PathMode] prev() called', { activePath: activePath?.id, stepIndex });
    if (!activePath) {
      // eslint-disable-next-line no-console
      console.log('[PathMode] prev: no activePath, bailing');
      return;
    }
    const prevIdx = stepIndex - 1;
    if (prevIdx < 0) {
      // eslint-disable-next-line no-console
      console.log('[PathMode] prev: already at first step, bailing');
      return;
    }
    // eslint-disable-next-line no-console
    console.log('[PathMode] prev: calling goToStep', prevIdx);
    goToStep(prevIdx);
  }, [activePath, stepIndex, goToStep]);

  // completePath — called when the user clicks "Yolu Tamamla" on the last
  // step. Marks the path as completed in localStorage, shows a brief success
  // state in the breadcrumb, then exits path mode.
  //
  // Stay-in-place rule:
  //   - Section step: user stays where they are. The Conclusion is right
  //     below them, the page has its own narrative arc. No scroll.
  //   - Overlay step: the modal stays OPEN — the user might still be
  //     reading. We don't yank them out. But once they close the modal
  //     themselves (their decision, their timing), we softly scroll the
  //     page to #path-cards so they land on the entry point they came
  //     from, see the new ✓ badge on the completed card, and have a
  //     natural prompt to start another path.
  //
  // The "modal closed" signal comes from popstate — Navbar's existing
  // pushState({overlay:true}) pattern. This is the same channel the
  // auto-advance handler already uses. We register a one-time listener
  // 1.5s after completion (after the success cue clears) so it doesn't
  // accidentally fire on the close that completing itself might trigger.
  const completePath = useCallback(() => {
    if (!activePath) return;

    const lastStep = activePath.steps[activePath.steps.length - 1];
    const lastIsOverlay = lastStep?.kind === 'overlay';

    // Record completion (dedupe — a user can re-run a path)
    setCompletedPathIds((prev) => {
      if (prev.includes(activePath.id)) return prev;
      const next = [...prev, activePath.id];
      saveCompletedToStorage(next);
      return next;
    });

    // Enter the "✓ tamamlandı" micro-moment; breadcrumb reads this flag
    setIsCompleting(true);

    // After 1.5s, clear active path state. AnimatePresence on the breadcrumb
    // handles the fade-out animation when activePath becomes null.
    setTimeout(() => {
      setIsCompleting(false);
      setActivePathId(null);
      setStepIndex(0);
      clearStorage();

      // Overlay-step completion: register a one-time popstate listener so
      // that when the user eventually closes the still-open modal, we soft
      // scroll to PathCards. Section-step completion does nothing here —
      // the user is already on the page and stays put.
      //
      // The listener is stored in completionScrollListenerRef so startPath
      // and exit can tear it down if the user never actually closes the
      // completion modal. Without that escape hatch, a stale listener
      // could fire on a future unrelated overlay close.
      if (lastIsOverlay) {
        // Clear any prior listener (defensive — shouldn't happen, but
        // keeps the ref invariant: at most one listener at a time)
        clearCompletionScrollListener();
        const handleClose = () => {
          completionScrollListenerRef.current = null;
          window.removeEventListener('popstate', handleClose);
          // Soft scroll to PathCards. Same offset math as scrollToSection
          // helper above so the section sits below the fixed navbar.
          const el = document.getElementById('path-cards');
          if (!el) return;
          const navEl = document.querySelector('nav');
          const navHeight = navEl?.offsetHeight ?? 64;
          const top = el.getBoundingClientRect().top + window.scrollY - navHeight - 16;
          window.scrollTo({ top, behavior: 'smooth' });
        };
        completionScrollListenerRef.current = handleClose;
        window.addEventListener('popstate', handleClose);
      }
    }, 1500);
  }, [activePath, clearCompletionScrollListener]);

  // exit handles the same overlay-close-first concern as goToStep.
  // If we exit while on an overlay step, close the overlay first so the
  // page is in a clean state for the user.
  const exit = useCallback(() => {
    // Tear down any leftover completion scroll listener — see startPath
    // for the same defensive cleanup.
    clearCompletionScrollListener();

    const currentIsOverlay = activePath?.steps[stepIndex]?.kind === 'overlay';
    if (currentIsOverlay) {
      skipAutoAdvanceRef.current = true;
      window.history.back();
      setTimeout(() => {
        skipAutoAdvanceRef.current = false;
        setActivePathId(null);
        setStepIndex(0);
        clearStorage();
      }, 100);
    } else {
      setActivePathId(null);
      setStepIndex(0);
      clearStorage();
    }
  }, [activePath, stepIndex, clearCompletionScrollListener]);

  // ── Restore re-open ──────────────────────────────────────────────────────
  // F5/refresh case: sessionStorage holds the active path id + step index,
  // and the lazy initializers above pulled it back into state. But if the
  // restored step is an overlay step, the modal is NOT actually open yet —
  // the page just mounted. State and DOM are out of sync.
  //
  // Without this effect, clicking "Sonraki" after a refresh on an overlay
  // step would call goToStep, which sees currentIsOverlay === true and
  // calls window.history.back() against an empty history entry, sending
  // the user out of the page entirely.
  //
  // Fix: on first mount only, if the restored step is an overlay step,
  // dispatch its open event so the modal mounts. Section steps need no
  // re-open because the section is already in the DOM as part of normal
  // page render.
  const restoreHandledRef = useRef(false);
  useEffect(() => {
    if (restoreHandledRef.current) return;
    restoreHandledRef.current = true;
    if (currentStep && currentStep.kind === 'overlay') {
      // Defer one tick so any other mount-time effects (Navbar's overlay
      // event listeners) are wired up before we dispatch.
      setTimeout(() => dispatchOverlayEvent(currentStep.target), 0);
    }
    // Intentionally only checks the FIRST mount-time value of currentStep.
    // Subsequent currentStep changes are handled by goToStep / next / prev.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // ── Auto-advance on overlay close ────────────────────────────────────────
  // When an overlay step is active and the user closes it (via overlay's ✕,
  // ESC, or backdrop), the browser pops the history entry Navbar pushed on
  // open. We listen for that pop and advance to the next step automatically
  // — unless we're in the middle of a manual navigation (skipAutoAdvanceRef).

  useEffect(() => {
    // Track whether the active step is an overlay step. The popstate handler
    // only auto-advances when this is true.
    if (currentStep && currentStep.kind === 'overlay') {
      waitingForOverlayCloseRef.current = true;
    } else {
      waitingForOverlayCloseRef.current = false;
    }
  }, [currentStep]);

  useEffect(() => {
    function handlePop() {
      if (skipAutoAdvanceRef.current) return;       // manual nav in progress
      if (!waitingForOverlayCloseRef.current) return;
      if (!activePath) return;
      // Brief delay so the close animation runs and the user sees the result
      setTimeout(() => {
        // Only auto-advance if we're still on the same overlay step
        // (user might have manually navigated meanwhile)
        if (skipAutoAdvanceRef.current) return;
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
      // Don't cut short the "Yolu Tamamla" success moment — the auto-timer
      // will close the breadcrumb in ~1.5s anyway.
      if (isCompleting) return;
      exit();
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [activePath, currentStep, exit, isCompleting]);

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
    // Completion surface
    completePath,
    isCompleting,
    completedPathIds,
    isPathCompleted: (id) => completedPathIds.includes(id),
  }), [activePath, currentStep, stepIndex, startPath, next, prev, goToStep, exit, completePath, isCompleting, completedPathIds]);

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

