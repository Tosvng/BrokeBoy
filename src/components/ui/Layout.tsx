import React from "react";
import { useTheme } from "./ThemeProvider";

interface LayoutProps {
  children: React.ReactNode;
  hideNav?: boolean;
  activeTab?: string;
  onFab?: () => void;
}

export const Layout: React.FC<LayoutProps> = ({ children, hideNav = false, onFab }) => {
  const { isDark, setTheme, theme } = useTheme();

  return (
    <div className="min-h-screen bg-surface flex flex-col text-on-surface transition-colors duration-300">
      {/* Top header */}
      <header className="sticky top-0 z-50 w-full glass-panel border-b border-white/5 px-5 py-4">
        <div className="flex items-center justify-between max-w-lg mx-auto">
          <div className="flex items-center gap-2">
            {/* Logo mark */}
            <div className="w-7 h-7 rounded-md bg-primary-gradient flex items-center justify-center">
              <span className="text-on-primary font-bold text-xs">B</span>
            </div>
            <span className="font-sans font-bold text-sm tracking-widest text-on-surface uppercase">BrokeBoy</span>
          </div>
          <div className="flex items-center gap-3">
            {/* Bell icon */}
            <button className="p-2 rounded-full hover:bg-surface-container-high transition-colors text-on-surface-variant" aria-label="Notifications">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"/>
                <path d="M13.73 21a2 2 0 0 1-3.46 0"/>
              </svg>
            </button>
            {/* Theme toggle */}
            <button
              onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
              className="p-2 rounded-full hover:bg-surface-container-high transition-colors text-on-surface-variant"
              aria-label="Toggle theme"
            >
              {isDark ? (
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="4"/><path d="M12 2v2M12 20v2m-7.07-14.07 1.41 1.41M17.66 17.66l1.41 1.41M2 12h2M20 12h2m-4.93-7.07-1.41 1.41M6.34 17.66l-1.41 1.41"/></svg>
              ) : (
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 3a6 6 0 0 0 9 9 9 9 0 1 1-9-9Z"/></svg>
              )}
            </button>
          </div>
        </div>
      </header>

      {/* Scrollable content area with bottom padding for nav */}
      <main className="flex-1 w-full max-w-lg mx-auto overflow-y-auto pb-28">
        {children}
      </main>

      {/* FAB */}
      {!hideNav && onFab && (
        <button
          onClick={onFab}
          className="fixed bottom-20 right-5 z-50 w-14 h-14 rounded-full bg-primary-gradient shadow-gold flex items-center justify-center text-on-primary text-2xl font-light transition-transform active:scale-95 hover:scale-105"
          aria-label="Create new goal"
        >
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
            <path d="M12 5v14M5 12h14"/>
          </svg>
        </button>
      )}
    </div>
  );
};
