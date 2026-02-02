/**
 * Sentient UI Main Page
 * 
 * Single-page application with view switching.
 * Renders 3D agent background with content overlays.
 */

'use client';

import React, { useState } from 'react';
import dynamic from 'next/dynamic';
import { useTheme } from '@/providers/theme-provider';
import { useChat } from '@/hooks/use-chat';
import { SentientNav, ChatInterface, ContentOverlay, FloatingChatButton } from '@/components/Sentient';
import { type ViewMode, type Theme } from '@/types/sentient';

// Dynamic import for 3D scene (no SSR - WebGL requires browser)
const AgentScene = dynamic(
  () => import('@/components/Sentient/AgentScene'),
  { 
    ssr: false,
    loading: () => (
      <div className="absolute inset-0 bg-gray-100 dark:bg-gray-950 -z-10" />
    ),
  }
);

export default function SentientPage() {
  // View state
  const [currentView, setCurrentView] = useState<ViewMode>('AGENT');
  const [isFloatingChatOpen, setIsFloatingChatOpen] = useState(false);

  // Theme from custom provider
  const { theme, setTheme } = useTheme();
  const currentTheme: Theme = theme;

  // Chat state from unified hook
  const { messages, agentState, sendMessage, clearChat } = useChat({
    initialGreeting: "Hey! I'm Jules's AI assistant. Welcome to the site! How can I help you today?",
  });

  // Handle view change
  const handleViewChange = (view: ViewMode) => {
    setCurrentView(view);
    // Close floating chat when switching to agent view
    if (view === 'AGENT') {
      setIsFloatingChatOpen(false);
    }
  };

  // Handle theme toggle
  const handleThemeToggle = () => {
    setTheme(theme === 'light' ? 'dark' : 'light');
  };

  return (
    <div className={`relative w-full h-screen overflow-hidden`}>
      {/* Background base color */}
      <div className="absolute inset-0 bg-[#F3F4F6] dark:bg-[#030712] transition-colors duration-700" />

      {/* Global Grain Overlay */}
      <div
        className="absolute inset-0 pointer-events-none z-50 opacity-[0.03] dark:opacity-[0.05] mix-blend-overlay"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")`,
        }}
      />

      {/* 3D Background - Persistent */}
      <AgentScene
        agentState={agentState}
        viewMode={currentView}
        theme={currentTheme}
      />

      {/* Navigation Dock */}
      <SentientNav
        currentView={currentView}
        onViewChange={handleViewChange}
        theme={currentTheme}
        onThemeToggle={handleThemeToggle}
      />

      {/* Main Content */}
      <main className="absolute inset-0 z-10 pointer-events-none">
        {/* Fullscreen Agent Chat View */}
        <div
          className={`absolute inset-0 transition-all duration-700 pointer-events-none flex flex-col items-center justify-center ${
            currentView === 'AGENT'
              ? 'opacity-100 visible'
              : 'opacity-0 invisible scale-95'
          }`}
        >
          <div className="pointer-events-auto w-full h-full">
            <ChatInterface
              messages={messages}
              onSendMessage={sendMessage}
              agentState={agentState}
              mode="FULLSCREEN"
            />
          </div>
        </div>

        {/* Floating Chat for Non-Agent Views */}
        {currentView !== 'AGENT' && (
          <>
            <div className="pointer-events-auto">
              <ChatInterface
                messages={messages}
                onSendMessage={sendMessage}
                agentState={agentState}
                mode="FLOATING"
                isOpen={isFloatingChatOpen}
                onClose={() => setIsFloatingChatOpen(false)}
              />
            </div>

            <FloatingChatButton
              isOpen={isFloatingChatOpen}
              onClick={() => setIsFloatingChatOpen(!isFloatingChatOpen)}
            />
          </>
        )}

        {/* Content Overlay Views (Resume, Blog, Contact) */}
        <div
          className={`absolute inset-0 overflow-y-auto custom-scrollbar transition-all duration-700 transform ${
            currentView !== 'AGENT'
              ? 'opacity-100 translate-x-0'
              : 'opacity-0 translate-x-12 pointer-events-none'
          }`}
        >
          <div className="min-h-full flex items-start justify-center pointer-events-none">
            <div className="pointer-events-auto w-full">
              {currentView !== 'AGENT' && <ContentOverlay mode={currentView} />}
            </div>
          </div>
        </div>
      </main>

      {/* Brand Watermark (Bottom Left) */}
      <div className="absolute bottom-8 left-8 z-0 pointer-events-none opacity-40 mix-blend-multiply dark:mix-blend-overlay hidden md:block">
        <h1 className="font-serif text-2xl text-gray-900 dark:text-gray-200 italic">
          Jules.ai
        </h1>
        <p className="font-mono text-[10px] text-gray-500 dark:text-gray-500 tracking-[0.3em] mt-1">
          SYSTEM V3.2 // ONLINE
        </p>
      </div>
    </div>
  );
}