"use client";

import { useSyncExternalStore } from "react";

type Theme = "light" | "dark";

const STORAGE_KEY = "tgc-theme";
const CHANGE_EVENT = "tgc-theme-change";

/**
 * The theme lives on <html>, put there by the inline script in the root layout
 * before first paint. That element is the single source of truth; this
 * component subscribes to it rather than keeping a second copy in React state.
 */
const themeStore = {
  subscribe(onChange: () => void) {
    // Same-tab changes from any toggle instance...
    window.addEventListener(CHANGE_EVENT, onChange);
    // ...and changes made in another tab.
    window.addEventListener("storage", onChange);
    return () => {
      window.removeEventListener(CHANGE_EVENT, onChange);
      window.removeEventListener("storage", onChange);
    };
  },
  getSnapshot(): Theme {
    return document.documentElement.dataset.theme === "dark" ? "dark" : "light";
  },
  // Light is the default, and the prerendered HTML says so.
  getServerSnapshot(): Theme {
    return "light";
  },
};

const setTheme = (theme: Theme) => {
  document.documentElement.dataset.theme = theme;
  try {
    localStorage.setItem(STORAGE_KEY, theme);
  } catch {
    // Private browsing and blocked site data both throw. The choice still
    // applies to this page; it just will not be remembered.
  }
  window.dispatchEvent(new Event(CHANGE_EVENT));
};

export function ThemeToggle() {
  const theme = useSyncExternalStore(
    themeStore.subscribe,
    themeStore.getSnapshot,
    themeStore.getServerSnapshot,
  );

  const isDark = theme === "dark";
  const label = isDark ? "Switch to light theme" : "Switch to dark theme";

  return (
    <button
      type="button"
      onClick={() => setTheme(isDark ? "light" : "dark")}
      aria-pressed={isDark}
      aria-label={label}
      title={label}
      className="inline-flex size-8 shrink-0 items-center justify-center text-ink transition-colors hover:text-ink-muted focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring"
    >
      {/* Decorative: the button already carries an accessible name. */}
      {isDark ? (
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" aria-hidden focusable="false">
          <circle cx="12" cy="12" r="4.2" stroke="currentColor" strokeWidth="1.6" />
          <g stroke="currentColor" strokeWidth="1.6" strokeLinecap="round">
            <path d="M12 2.4v2.4M12 19.2v2.4M2.4 12h2.4M19.2 12h2.4M5.2 5.2l1.7 1.7M17.1 17.1l1.7 1.7M18.8 5.2l-1.7 1.7M6.9 17.1l-1.7 1.7" />
          </g>
        </svg>
      ) : (
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" aria-hidden focusable="false">
          <path
            d="M20.5 14.2A8.6 8.6 0 1 1 9.8 3.5a6.9 6.9 0 0 0 10.7 10.7Z"
            stroke="currentColor"
            strokeWidth="1.6"
            strokeLinejoin="round"
          />
        </svg>
      )}
    </button>
  );
}
