import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import { PathProvider, usePath } from '../contexts/PathContext';
import { PATHS } from '../data/paths';

/**
 * PathContext — state machine & lifecycle tests (TD-3).
 *
 * Covers path mode state transitions that are unit-testable in jsdom:
 *   - startPath / next / prev / goToStep / exit / completePath
 *   - sessionStorage persistence (active path)
 *   - localStorage persistence (completed paths)
 *   - ESC key exit
 *   - Listener cleanup on completion
 *
 * NOT covered here (require real browser):
 *   - Actual smooth scrollTo behavior
 *   - CustomEvent dispatching to real overlay components
 *   - requestAnimationFrame-based scroll targeting precision
 *   - Auto-advance on real overlay close (popstate timing)
 * Manual test scenarios for those live in docs/path-mode-test-scenarios.md
 */

// Helper: render usePath with Provider wrapper
function renderPath() {
  return renderHook(() => usePath(), {
    wrapper: ({ children }) => <PathProvider>{children}</PathProvider>,
  });
}

// Clean storage before each test — tests are independent
beforeEach(() => {
  sessionStorage.clear();
  localStorage.clear();
  // Stub scroll + DOM APIs that jsdom doesn't implement
  window.scrollTo = vi.fn();
  // Stub getElementById so navigateToStep's 'section' branch doesn't warn
  // (we're testing state transitions, not DOM scroll behavior).
  const originalGetById = document.getElementById.bind(document);
  document.getElementById = vi.fn((id) => {
    const el = originalGetById(id);
    if (el) return el;
    // Return a minimal stub element for section targets
    return {
      getBoundingClientRect: () => ({ top: 100, left: 0, right: 0, bottom: 200, width: 0, height: 100, x: 0, y: 100 }),
      offsetHeight: 100,
    };
  });
});

afterEach(() => {
  vi.restoreAllMocks();
});

describe('PathContext — initial state', () => {
  it('starts with no active path', () => {
    const { result } = renderPath();
    expect(result.current.activePath).toBe(null);
    expect(result.current.currentStep).toBe(null);
    expect(result.current.currentStepIndex).toBe(0);
    expect(result.current.totalSteps).toBe(0);
  });

  it('exposes empty completedPathIds by default', () => {
    const { result } = renderPath();
    expect(result.current.completedPathIds).toEqual([]);
    expect(result.current.isPathCompleted('dil')).toBe(false);
  });
});

describe('PathContext — startPath', () => {
  it('activates a path at step 0', () => {
    const { result } = renderPath();
    act(() => result.current.startPath('dil'));

    expect(result.current.activePath?.id).toBe('dil');
    expect(result.current.currentStepIndex).toBe(0);
    expect(result.current.currentStep?.id).toBe('linguistic');
    expect(result.current.totalSteps).toBe(4);
  });

  it('persists active path to sessionStorage', () => {
    const { result } = renderPath();
    act(() => result.current.startPath('peygamberler'));

    const stored = JSON.parse(sessionStorage.getItem('qurancodex_active_path') || '{}');
    expect(stored.pathId).toBe('peygamberler');
    expect(stored.stepIndex).toBe(0);
  });

  it('ignores unknown path id', () => {
    const { result } = renderPath();
    const warnSpy = vi.spyOn(console, 'warn').mockImplementation(() => {});
    act(() => result.current.startPath('does-not-exist'));

    expect(result.current.activePath).toBe(null);
    expect(warnSpy).toHaveBeenCalled();
  });
});

describe('PathContext — next / prev navigation', () => {
  // Scenario 1 (Dil yolu): full 4-step section walk forward + backward
  it('Scenario 1: walks Dil path forward 0→1→2→3 then backward 3→2→1→0', () => {
    const { result } = renderPath();
    act(() => result.current.startPath('dil'));

    // Forward walk
    act(() => result.current.next());
    expect(result.current.currentStepIndex).toBe(1);
    expect(result.current.currentStep?.id).toBe('rhythm');

    act(() => result.current.next());
    expect(result.current.currentStepIndex).toBe(2);
    expect(result.current.currentStep?.id).toBe('sounds');

    act(() => result.current.next());
    expect(result.current.currentStepIndex).toBe(3);
    expect(result.current.currentStep?.id).toBe('rhetoric');

    // next() on last step = noop (guarded)
    act(() => result.current.next());
    expect(result.current.currentStepIndex).toBe(3);

    // Backward walk — TD-1 regression check
    act(() => result.current.prev());
    expect(result.current.currentStepIndex).toBe(2);
    expect(result.current.currentStep?.id).toBe('sounds');

    act(() => result.current.prev());
    expect(result.current.currentStepIndex).toBe(1);

    act(() => result.current.prev());
    expect(result.current.currentStepIndex).toBe(0);

    // prev() on first step = noop
    act(() => result.current.prev());
    expect(result.current.currentStepIndex).toBe(0);
  });

  it('updates sessionStorage on every step transition', () => {
    const { result } = renderPath();
    act(() => result.current.startPath('dil'));
    act(() => result.current.next());

    const stored = JSON.parse(sessionStorage.getItem('qurancodex_active_path') || '{}');
    expect(stored.stepIndex).toBe(1);

    act(() => result.current.next());
    const stored2 = JSON.parse(sessionStorage.getItem('qurancodex_active_path') || '{}');
    expect(stored2.stepIndex).toBe(2);
  });
});

describe('PathContext — goToStep (Scenario 6: dot click mid-path)', () => {
  it('jumps to an arbitrary valid index', () => {
    const { result } = renderPath();
    act(() => result.current.startPath('dil'));

    act(() => result.current.goToStep(3));
    expect(result.current.currentStepIndex).toBe(3);

    act(() => result.current.goToStep(1));
    expect(result.current.currentStepIndex).toBe(1);
  });

  it('guards against out-of-range indices', () => {
    const { result } = renderPath();
    act(() => result.current.startPath('dil'));

    act(() => result.current.goToStep(-1));
    expect(result.current.currentStepIndex).toBe(0);

    act(() => result.current.goToStep(999));
    expect(result.current.currentStepIndex).toBe(0);
  });

  it('does nothing when no active path', () => {
    const { result } = renderPath();
    act(() => result.current.goToStep(2));
    expect(result.current.currentStepIndex).toBe(0);
    expect(result.current.activePath).toBe(null);
  });
});

describe('PathContext — exit (Scenario 7: ESC exit)', () => {
  it('exit() clears active path state', () => {
    const { result } = renderPath();
    act(() => result.current.startPath('dil'));
    act(() => result.current.next());
    expect(result.current.currentStepIndex).toBe(1);

    act(() => result.current.exit());
    expect(result.current.activePath).toBe(null);
    expect(result.current.currentStepIndex).toBe(0);
  });

  it('exit() clears sessionStorage', () => {
    const { result } = renderPath();
    act(() => result.current.startPath('dil'));
    expect(sessionStorage.getItem('qurancodex_active_path')).not.toBe(null);

    act(() => result.current.exit());
    expect(sessionStorage.getItem('qurancodex_active_path')).toBe(null);
  });

  it('ESC key triggers exit on section step', () => {
    const { result } = renderPath();
    act(() => result.current.startPath('dil'));
    expect(result.current.activePath).not.toBe(null);

    act(() => {
      window.dispatchEvent(new KeyboardEvent('keydown', { key: 'Escape' }));
    });

    expect(result.current.activePath).toBe(null);
  });
});

describe('PathContext — completePath', () => {
  it('Scenario: complete a path records it in localStorage', async () => {
    vi.useFakeTimers();
    const { result } = renderPath();
    act(() => result.current.startPath('dil'));
    // Walk to last step
    act(() => result.current.goToStep(3));

    act(() => result.current.completePath());
    // isCompleting flag set
    expect(result.current.isCompleting).toBe(true);
    // Completion was recorded immediately
    expect(result.current.completedPathIds).toContain('dil');
    expect(result.current.isPathCompleted('dil')).toBe(true);

    // Fast-forward the 1.5s success-cue timer
    await act(async () => { vi.advanceTimersByTime(1600); });

    // Active path is cleared, completion flag reset
    expect(result.current.activePath).toBe(null);
    expect(result.current.isCompleting).toBe(false);
    expect(result.current.completedPathIds).toContain('dil');

    // localStorage persisted
    const stored = JSON.parse(localStorage.getItem('qurancodex_completed_paths') || '[]');
    expect(stored).toContain('dil');

    vi.useRealTimers();
  });

  it('completePath is idempotent — no duplicate ids', async () => {
    vi.useFakeTimers();
    const { result } = renderPath();
    act(() => result.current.startPath('dil'));
    act(() => result.current.goToStep(3));
    act(() => result.current.completePath());
    await act(async () => { vi.advanceTimersByTime(1600); });

    // Start again and complete again
    act(() => result.current.startPath('dil'));
    act(() => result.current.goToStep(3));
    act(() => result.current.completePath());
    await act(async () => { vi.advanceTimersByTime(1600); });

    expect(result.current.completedPathIds.filter(id => id === 'dil')).toHaveLength(1);
    vi.useRealTimers();
  });
});

describe('PathContext — sessionStorage restore', () => {
  it('restores active path from sessionStorage on mount', () => {
    sessionStorage.setItem(
      'qurancodex_active_path',
      JSON.stringify({ pathId: 'insan', stepIndex: 2 })
    );

    const { result } = renderPath();
    expect(result.current.activePath?.id).toBe('insan');
    expect(result.current.currentStepIndex).toBe(2);
    expect(result.current.currentStep?.id).toBe('dua-language');
  });

  it('ignores corrupt sessionStorage entry', () => {
    sessionStorage.setItem('qurancodex_active_path', 'not-valid-json{{');
    const { result } = renderPath();
    expect(result.current.activePath).toBe(null);
  });

  it('ignores out-of-range stepIndex in storage', () => {
    sessionStorage.setItem(
      'qurancodex_active_path',
      JSON.stringify({ pathId: 'dil', stepIndex: 999 })
    );
    const { result } = renderPath();
    expect(result.current.activePath).toBe(null);
  });
});

describe('PathContext — Scenario 5: listener leak prevention', () => {
  // When completePath runs on an overlay step, it registers a one-time
  // popstate listener that later scrolls to PathCards. If the user never
  // closes the completion modal but starts a NEW path instead, that stale
  // listener must be torn down — otherwise a future unrelated overlay close
  // would yank the page to PathCards.
  it('starting a new path after an uncompleted overlay-step completion clears old listener', async () => {
    vi.useFakeTimers();
    const { result } = renderPath();

    // Complete the Peygamberler path (all overlays — last step is overlay)
    act(() => result.current.startPath('peygamberler'));
    act(() => result.current.goToStep(2)); // last step
    act(() => result.current.completePath());
    await act(async () => { vi.advanceTimersByTime(1600); });

    // At this point, completionScrollListenerRef may still hold a popstate
    // listener waiting for the user to close the completion modal.

    // Track window.addEventListener / removeEventListener calls on popstate
    const addSpy = vi.spyOn(window, 'addEventListener');
    const removeSpy = vi.spyOn(window, 'removeEventListener');

    // Now start a new path — this should clear the dangling listener
    act(() => result.current.startPath('dil'));

    // Expect at least one removeEventListener('popstate', ...) during startPath
    // (either the completion listener or the auto-advance effect teardown).
    const popstateRemovals = removeSpy.mock.calls.filter(([ev]) => ev === 'popstate');
    expect(popstateRemovals.length).toBeGreaterThan(0);

    addSpy.mockRestore();
    removeSpy.mockRestore();
    vi.useRealTimers();
  });
});

describe('PathContext — all-section paths walk forward synchronously', () => {
  // Only paths where every step is 'section' — these don't go through the
  // history.back() + setTimeout branch, so next() applies immediately.
  // Overlay-bearing paths need fake timers; covered separately below.
  const allSectionPaths = PATHS.filter(p => p.steps.every(s => s.kind === 'section'));

  it.each(allSectionPaths.map(p => [p.id, p.steps.length]))(
    '%s (%i steps) walks end-to-end',
    (pathId, stepCount) => {
      const { result } = renderPath();
      act(() => result.current.startPath(pathId));

      for (let i = 1; i < stepCount; i++) {
        act(() => result.current.next());
        expect(result.current.currentStepIndex).toBe(i);
      }

      // Now at last step — next() is noop
      act(() => result.current.next());
      expect(result.current.currentStepIndex).toBe(stepCount - 1);
    }
  );
});

describe('PathContext — overlay-step transitions (fake timers)', () => {
  // goToStep on an overlay step calls history.back() + setTimeout(60, ...).
  // We must advance fake timers for the deferred setStepIndex to take effect.
  it('peygamberler (3 overlays) walks end-to-end with fake timers', () => {
    vi.useFakeTimers();
    const { result } = renderPath();
    act(() => result.current.startPath('peygamberler'));
    expect(result.current.currentStepIndex).toBe(0);

    // Overlay → overlay via setTimeout(60)
    act(() => { result.current.next(); vi.advanceTimersByTime(100); });
    expect(result.current.currentStepIndex).toBe(1);

    act(() => { result.current.next(); vi.advanceTimersByTime(100); });
    expect(result.current.currentStepIndex).toBe(2);

    // Last step — noop
    act(() => { result.current.next(); vi.advanceTimersByTime(100); });
    expect(result.current.currentStepIndex).toBe(2);
    vi.useRealTimers();
  });

  it('evren (2 section + 2 overlay) walks end-to-end with fake timers', () => {
    vi.useFakeTimers();
    const { result } = renderPath();
    act(() => result.current.startPath('evren'));

    // section → section (sync)
    act(() => result.current.next());
    expect(result.current.currentStepIndex).toBe(1);

    // section → overlay (sync — prev step was section, no setTimeout)
    act(() => result.current.next());
    expect(result.current.currentStepIndex).toBe(2);

    // overlay → overlay (needs timer advance)
    act(() => { result.current.next(); vi.advanceTimersByTime(100); });
    expect(result.current.currentStepIndex).toBe(3);
    vi.useRealTimers();
  });

  it('insan (3 section + 1 overlay) walks end-to-end', () => {
    vi.useFakeTimers();
    const { result } = renderPath();
    act(() => result.current.startPath('insan'));

    // 3 section transitions are sync
    act(() => result.current.next());
    expect(result.current.currentStepIndex).toBe(1);

    act(() => result.current.next());
    expect(result.current.currentStepIndex).toBe(2);

    // section → overlay — last step is overlay, current is section, sync
    act(() => result.current.next());
    expect(result.current.currentStepIndex).toBe(3);
    vi.useRealTimers();
  });
});
