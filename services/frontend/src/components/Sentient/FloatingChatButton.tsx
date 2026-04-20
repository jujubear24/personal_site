/**
 * FloatingChatButton - FAB for opening floating chat
 * 
 * Appears in non-agent views to open the floating chat window.
 */

'use client';

import React from 'react';

interface FloatingChatButtonProps {
  isOpen: boolean;
  onClick: () => void;
}

const FloatingChatButton: React.FC<FloatingChatButtonProps> = ({ isOpen, onClick }) => {
  return (
    <button
      onClick={onClick}
      className={`
        pointer-events-auto fixed bottom-8 right-8 z-40 w-14 h-14 rounded-full 
        bg-gray-900 dark:bg-white text-white dark:text-gray-900 
        shadow-xl dark:shadow-amber-500/20 
        flex items-center justify-center 
        transition-all duration-300 
        hover:scale-110 hover:bg-black dark:hover:bg-gray-200 
        group
        ${isOpen ? 'rotate-90 opacity-0 pointer-events-none' : 'opacity-100'}
      `}
      aria-label={isOpen ? 'Close chat' : 'Open chat'}
    >
      {/* Online indicator */}
      <div className="absolute -top-1 -right-1 w-3 h-3 bg-green-500 rounded-full animate-pulse border-2 border-white dark:border-gray-900" />
      
      {/* Chat icon */}
      <svg
        width="24"
        height="24"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
      </svg>
    </button>
  );
};

export default FloatingChatButton;