'use client';

import { useEffect, useRef } from 'react';

/**
 * useFocusTrap — modal/dialog focus trap hook (WCAG 2.1 SC 2.4.3).
 *
 * Behavior:
 *   1. On mount (when `active` is true), captures the currently focused
 *      element as the "trigger" so focus can return there on unmount.
 *   2. Moves focus to the first focusable descendant of the container.
 *   3. Intercepts Tab / Shift+Tab while the container is mounted: if focus
 *      would leave the container, wraps it back to the opposite boundary.
 *   4. On unmount (or when `active` becomes false), restores focus to the
 *      original trigger element, provided it is still in the DOM.
 *
 * Notes:
 *   - Existing Esc handlers (e.g. CLAUDE.md §13.3 standard) are NOT touched.
 *     This hook only owns Tab key wrapping + initial/final focus placement.
 *   - Container ref must be attached to the modal root element. The query
 *     for focusables runs against `container.querySelectorAll(...)`, so any
 *     element with role=dialog can use this hook as-is.
 *   - SSR-safe: the effect body only runs client-side; `document`/`window`
 *     are never touched during render.
 *
 * @param {boolean} active - Whether the trap is engaged (typically the
 *                           modal's `open` state).
 * @returns {import('react').RefObject<HTMLElement>} Ref to attach to the
 *                                                  modal container.
 */
export default function useFocusTrap(active = true) {
  const containerRef = useRef(null);
  const previousFocusRef = useRef(null);

  useEffect(() => {
    if (!active) return;
    const container = containerRef.current;
    if (!container) return;

    // Remember whoever was focused before the modal opened so we can
    // restore focus on close (e.g. the button that triggered the open).
    previousFocusRef.current = document.activeElement;

    // Query focusable descendants. Standard set per WAI-ARIA APG.
    const FOCUSABLE_SELECTOR = [
      'a[href]',
      'button:not([disabled])',
      'input:not([disabled])',
      'textarea:not([disabled])',
      'select:not([disabled])',
      '[tabindex]:not([tabindex="-1"])',
    ].join(',');

    const getFocusable = () =>
      Array.from(container.querySelectorAll(FOCUSABLE_SELECTOR)).filter(
        (el) => !el.hasAttribute('disabled') && el.offsetParent !== null,
      );

    // Move focus into the modal on mount.
    const initialFocusables = getFocusable();
    if (initialFocusables.length > 0) {
      initialFocusables[0].focus();
    } else {
      // No focusable children — focus the container itself so the modal
      // is still keyboard-reachable (requires tabindex on container).
      if (!container.hasAttribute('tabindex')) {
        container.setAttribute('tabindex', '-1');
      }
      container.focus();
    }

    // Tab boundary wrapping. Re-query on every keydown because modal
    // contents (e.g. picker dropdowns, conditional buttons) can change
    // while the trap is active.
    const handleKey = (e) => {
      if (e.key !== 'Tab') return;
      const list = getFocusable();
      if (list.length === 0) return;
      const first = list[0];
      const last = list[list.length - 1];

      if (e.shiftKey && document.activeElement === first) {
        e.preventDefault();
        last.focus();
      } else if (!e.shiftKey && document.activeElement === last) {
        e.preventDefault();
        first.focus();
      }
    };

    document.addEventListener('keydown', handleKey);

    return () => {
      document.removeEventListener('keydown', handleKey);
      // Restore focus to the trigger if it is still in the DOM. Guard
      // against the case where the trigger was unmounted while the modal
      // was open (then focus would throw / land on <body>).
      const prev = previousFocusRef.current;
      if (prev && typeof prev.focus === 'function' && document.body.contains(prev)) {
        prev.focus();
      }
    };
  }, [active]);

  return containerRef;
}
