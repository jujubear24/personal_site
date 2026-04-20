/**
 * Sentient Navigation Dock
 * 
 * Floating top-center navigation dock for the Sentient UI.
 * Handles view switching and theme toggle.
 */

'use client';

import React from 'react';
import { type ViewMode, type Theme, NAV_ITEMS } from '@/types/sentient';

interface SentientNavProps {
  currentView: ViewMode;
  onViewChange: (view: ViewMode) => void;
  theme: Theme;
  onThemeToggle: () => void;
  className?: string;
}

export function SentientNav({
  currentView,
  onViewChange,
  theme,
  onThemeToggle,
  className = '',
}: SentientNavProps) {
  return (
    <div
      className={`absolute top-6 left-0 w-full flex justify-center z-50 pointer-events-none ${className}`}
    >
      <nav className="pointer-events-auto bg-white/80 dark:bg-gray-900/80 backdrop-blur-xl border border-white/50 dark:border-gray-700/50 shadow-lg rounded-full px-2 py-1.5 flex gap-1 transform transition-all hover:scale-105 duration-300">
        {NAV_ITEMS.map((item) => (
          <NavButton
            key={item.value}
            item={item}
            isActive={currentView === item.value}
            onClick={() => onViewChange(item.value)}
          />
        ))}

        {/* Divider */}
        <div className="w-px h-6 bg-gray-200 dark:bg-gray-700 my-auto mx-1" />

        {/* Theme Toggle */}
        <ThemeToggleButton theme={theme} onClick={onThemeToggle} />
      </nav>
    </div>
  );
}

interface NavButtonProps {
  item: NavItem;
  isActive: boolean;
  onClick: () => void;
}

function NavButton({ item, isActive, onClick }: NavButtonProps) {
  return (
    <button
      onClick={onClick}
      className={`
        relative px-5 py-2 rounded-full text-xs font-bold tracking-widest 
        transition-all duration-500 overflow-hidden group
        ${
          isActive
            ? 'bg-gray-900 text-white dark:bg-white dark:text-gray-900 shadow-md'
            : 'text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white hover:bg-gray-100/50 dark:hover:bg-gray-800/50'
        }
      `}
    >
      <span className="relative z-10 flex items-center gap-2">
        {isActive && <span className="text-[8px] animate-pulse">{item.icon}</span>}
        {item.label}
      </span>
    </button>
  );
}

interface ThemeToggleButtonProps {
  theme: Theme;
  onClick: () => void;
}

function ThemeToggleButton({ theme, onClick }: ThemeToggleButtonProps) {
  return (
    <button
      onClick={onClick}
      className="relative px-3 py-2 rounded-full text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white hover:bg-gray-100/50 dark:hover:bg-gray-800/50 transition-all duration-300"
      aria-label="Toggle Theme"
    >
      {theme === 'light' ? <SunIcon /> : <MoonIcon />}
    </button>
  );
}

function SunIcon() {
  return (
    <svg
      width="14"
      height="14"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <circle cx="12" cy="12" r="5" />
      <line x1="12" y1="1" x2="12" y2="3" />
      <line x1="12" y1="21" x2="12" y2="23" />
      <line x1="4.22" y1="4.22" x2="5.64" y2="5.64" />
      <line x1="18.36" y1="18.36" x2="19.78" y2="19.78" />
      <line x1="1" y1="12" x2="3" y2="12" />
      <line x1="21" y1="12" x2="23" y2="12" />
      <line x1="4.22" y1="19.78" x2="5.64" y2="18.36" />
      <line x1="18.36" y1="5.64" x2="19.78" y2="4.22" />
    </svg>
  );
}

function MoonIcon() {
  return (
    <svg
      width="14"
      height="14"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" />
    </svg>
  );
}

export default SentientNav;