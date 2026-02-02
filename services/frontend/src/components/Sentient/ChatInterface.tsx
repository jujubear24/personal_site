/**
 * ChatInterface - Sentient UI Chat Component
 * 
 * Supports two modes:
 * - FULLSCREEN: Cinematic centered chat for the Agent view
 * - FLOATING: Popup chat window for other views
 */

'use client';

import React, { useState, useRef, useEffect } from 'react';
import { 
  AgentState, 
  type SentientMessage, 
  type ChatMode,
  type ChatInterfaceProps 
} from '@/types/sentient';

/**
 * Typewriter animation for assistant messages
 */
const TypewriterText: React.FC<{ text: string }> = ({ text }) => {
  const [displayedText, setDisplayedText] = useState('');

  useEffect(() => {
    let index = 0;
    const speed = 15;
    setDisplayedText('');

    const timer = setInterval(() => {
      if (index < text.length) {
        setDisplayedText((prev) => prev + text.charAt(index));
        index++;
      } else {
        clearInterval(timer);
      }
    }, speed);

    return () => clearInterval(timer);
  }, [text]);

  return <span>{displayedText}</span>;
};

/**
 * AI Suggestion Chips for new conversations
 */
const SUGGESTIONS = [
  { label: 'About Jules', query: 'Who is Jules?' },
  { label: 'Technical Skills', query: "What are Jules's top technical skills?" },
  { label: 'Projects', query: 'Tell me about the projects Jules has worked on.' },
  { label: 'Contact', query: 'How can I contact Jules?' },
];

/**
 * Main ChatInterface Component
 */
const ChatInterface: React.FC<ChatInterfaceProps> = ({
  messages,
  onSendMessage,
  agentState,
  mode,
  isOpen = true,
  onClose,
}) => {
  const [input, setInput] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Auto-scroll to bottom on new messages
  useEffect(() => {
    if (isOpen) {
      messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages, agentState, isOpen]);

  // Auto-focus input
  useEffect(() => {
    if (isOpen && inputRef.current && mode === 'FULLSCREEN') {
      inputRef.current.focus();
    }
  }, [isOpen, mode]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (input.trim() === '') return;
    onSendMessage(input);
    setInput('');
  };

  const handleSuggestionClick = (query: string) => {
    onSendMessage(query);
  };

  /* -------------------------------------------------------------------------- */
  /*                              RENDER: FULLSCREEN                            */
  /* -------------------------------------------------------------------------- */
  if (mode === 'FULLSCREEN') {
    return (
      <div className="absolute inset-0 z-20 flex flex-col items-center justify-start pt-36 pb-12 pointer-events-none">
        {/* Technical HUD Decorators */}
        <div className="absolute top-8 left-8 border-l border-t border-gray-400/50 dark:border-gray-600/50 w-6 h-6 md:w-8 md:h-8" />
        <div className="absolute top-8 right-8 border-r border-t border-gray-400/50 dark:border-gray-600/50 w-6 h-6 md:w-8 md:h-8" />
        <div className="absolute bottom-8 left-8 border-l border-b border-gray-400/50 dark:border-gray-600/50 w-6 h-6 md:w-8 md:h-8" />
        <div className="absolute bottom-8 right-8 border-r border-b border-gray-400/50 dark:border-gray-600/50 w-6 h-6 md:w-8 md:h-8" />

        <div className="absolute top-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-1">
          <div className="w-px h-8 bg-gradient-to-b from-gray-300 dark:from-gray-600 to-transparent" />
          <div className="font-mono text-[8px] tracking-[0.4em] text-gray-400 dark:text-gray-500 uppercase">
            Interactive Session
          </div>
        </div>

        {/* Status Indicator */}
        <div className="absolute top-10 left-12 flex items-center gap-2">
          <div
            className={`w-1.5 h-1.5 rounded-full transition-colors duration-500 ${
              agentState === AgentState.THINKING
                ? 'bg-amber-400 animate-pulse'
                : 'bg-emerald-500'
            }`}
          />
          <span className="font-mono text-[9px] text-gray-400 dark:text-gray-500 uppercase tracking-widest">
            {agentState === AgentState.THINKING ? 'Computing...' : 'System Ready'}
          </span>
        </div>

        {/* Cinematic Message Stream */}
        <div
          className="w-full max-w-3xl px-6 md:px-12 pointer-events-auto mb-8 space-y-6 max-h-[40vh] overflow-y-auto custom-scrollbar flex flex-col justify-end"
          style={{
            maskImage: 'linear-gradient(to bottom, transparent, black 15%)',
            WebkitMaskImage: 'linear-gradient(to bottom, transparent, black 15%)',
          }}
        >
          {messages.map((msg, idx) => {
            const isLast = idx === messages.length - 1;
            if (msg.role === 'assistant') {
              return (
                <div
                  key={idx}
                  className="flex flex-col items-center text-center animate-fadeIn"
                >
                  <div className="font-serif text-3xl md:text-5xl text-gray-800 dark:text-gray-100 italic leading-tight max-w-2xl drop-shadow-sm">
                    {isLast ? <TypewriterText text={msg.content} /> : msg.content}
                  </div>
                </div>
              );
            } else {
              return (
                <div key={idx} className="flex justify-center animate-fadeIn py-2">
                  <div className="bg-white/40 dark:bg-gray-800/40 backdrop-blur-md border border-white/50 dark:border-gray-700/50 px-4 py-2 rounded-full shadow-sm">
                    <p className="font-mono text-xs text-gray-600 dark:text-gray-300 tracking-wide">
                      {msg.content}
                    </p>
                  </div>
                </div>
              );
            }
          })}

          {agentState === AgentState.THINKING && (
            <div className="flex justify-center py-4">
              <div className="flex gap-1.5">
                <span className="w-1.5 h-1.5 bg-gray-400 rounded-full animate-bounce" />
                <span
                  className="w-1.5 h-1.5 bg-gray-400 rounded-full animate-bounce"
                  style={{ animationDelay: '100ms' }}
                />
                <span
                  className="w-1.5 h-1.5 bg-gray-400 rounded-full animate-bounce"
                  style={{ animationDelay: '200ms' }}
                />
              </div>
            </div>
          )}
          <div ref={messagesEndRef} className="h-2" />
        </div>

        {/* AI Suggestion Chips */}
        {messages.length < 3 && (
          <div
            className="w-full max-w-xl px-6 mb-6 flex flex-wrap justify-center gap-2 pointer-events-auto animate-fadeIn"
            style={{ animationDelay: '300ms' }}
          >
            {SUGGESTIONS.map((s, i) => (
              <button
                key={i}
                onClick={() => handleSuggestionClick(s.query)}
                className="bg-white/40 dark:bg-gray-800/40 hover:bg-white/80 dark:hover:bg-gray-700/80 backdrop-blur-sm border border-white/50 dark:border-gray-700/50 hover:border-amber-400/50 px-3 py-1.5 rounded-full text-[10px] font-mono text-gray-600 dark:text-gray-300 uppercase tracking-wider transition-all duration-300 transform hover:-translate-y-0.5"
              >
                {s.label}
              </button>
            ))}
          </div>
        )}

        {/* Input Command Line */}
        <div className="w-full max-w-xl pointer-events-auto px-6 mb-4 md:mb-0">
          <form onSubmit={handleSubmit} className="relative group">
            <div className="absolute -inset-0.5 bg-gradient-to-r from-gray-200 via-amber-200/50 to-gray-200 dark:from-gray-800 dark:via-amber-900/40 dark:to-gray-800 rounded-full opacity-0 group-hover:opacity-100 transition duration-500 blur" />
            <div className="relative flex items-center bg-white/80 dark:bg-gray-900/80 backdrop-blur-xl rounded-full border border-white/60 dark:border-gray-700/60 shadow-lg transition-all focus-within:ring-1 focus-within:ring-amber-400/30">
              <input
                ref={inputRef}
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Type a message to begin..."
                className="w-full bg-transparent text-center text-gray-900 dark:text-gray-100 px-6 py-4 outline-none font-sans text-sm placeholder-gray-400 dark:placeholder-gray-500"
                autoFocus
              />
              <button
                type="submit"
                disabled={!input.trim()}
                className="absolute right-2 p-2 rounded-full bg-gray-900 dark:bg-gray-100 text-white dark:text-gray-900 hover:bg-gray-700 dark:hover:bg-gray-300 disabled:opacity-0 disabled:scale-75 transition-all duration-300"
              >
                <svg
                  width="16"
                  height="16"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <line x1="22" y1="2" x2="11" y2="13" />
                  <polygon points="22 2 15 22 11 13 2 9 22 2" />
                </svg>
              </button>
            </div>
            <div className="text-center mt-3">
              <span className="font-mono text-[9px] text-gray-400 dark:text-gray-600 tracking-[0.2em] opacity-60">
                PRESS ENTER TO SEND
              </span>
            </div>
          </form>
        </div>
      </div>
    );
  }

  /* -------------------------------------------------------------------------- */
  /*                             RENDER: FLOATING                               */
  /* -------------------------------------------------------------------------- */
  const containerClasses = `fixed bottom-6 right-6 w-[350px] md:w-[400px] h-[500px] bg-white/90 dark:bg-gray-900/90 backdrop-blur-xl border border-white/60 dark:border-gray-700/60 shadow-2xl rounded-2xl overflow-hidden flex flex-col z-50 transition-all duration-300 origin-bottom-right ${
    isOpen
      ? 'opacity-100 scale-100 translate-y-0'
      : 'opacity-0 scale-90 translate-y-4 pointer-events-none'
  }`;

  return (
    <div className={containerClasses}>
      {/* Header */}
      <div className="px-5 py-3 border-b border-gray-900/5 dark:border-white/10 flex items-center justify-between bg-white/40 dark:bg-gray-800/40">
        <div className="flex items-center gap-3">
          <div
            className={`w-1.5 h-1.5 rounded-full ${
              agentState !== AgentState.IDLE
                ? 'bg-amber-500 shadow-[0_0_10px_rgba(245,158,11,0.5)]'
                : 'bg-green-500 shadow-[0_0_10px_rgba(34,197,94,0.3)]'
            }`}
          />
          <span className="font-mono text-[10px] font-bold text-gray-600 dark:text-gray-400 tracking-widest uppercase">
            {agentState === AgentState.THINKING ? 'Processing...' : 'Uplink Active'}
          </span>
        </div>
        <button
          onClick={onClose}
          className="text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors"
        >
          <svg
            width="14"
            height="14"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
          >
            <line x1="18" y1="6" x2="6" y2="18" />
            <line x1="6" y1="6" x2="18" y2="18" />
          </svg>
        </button>
      </div>

      {/* Message Stream */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4 custom-scrollbar bg-white/20 dark:bg-black/20">
        {messages.map((msg, idx) => {
          const isLast = idx === messages.length - 1;
          return (
            <div
              key={idx}
              className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              <div
                className={`max-w-[90%] ${
                  msg.role === 'user'
                    ? 'bg-gray-900 dark:bg-white text-gray-50 dark:text-gray-900 rounded-2xl rounded-tr-sm shadow-md'
                    : 'bg-white dark:bg-gray-800 text-gray-800 dark:text-gray-200 border border-gray-100 dark:border-gray-700 rounded-2xl rounded-tl-sm shadow-sm'
                } px-4 py-3 text-sm leading-relaxed`}
              >
                {msg.role === 'assistant' ? (
                  <div className="font-serif text-[15px]">
                    {isLast && isOpen ? <TypewriterText text={msg.content} /> : msg.content}
                  </div>
                ) : (
                  <p className="font-sans text-[13px]">{msg.content}</p>
                )}
              </div>
            </div>
          );
        })}

        {agentState === AgentState.THINKING && (
          <div className="flex items-center gap-1 px-4 text-gray-400">
            <span className="w-1 h-1 bg-gray-400 rounded-full animate-bounce" />
            <span
              className="w-1 h-1 bg-gray-400 rounded-full animate-bounce"
              style={{ animationDelay: '75ms' }}
            />
            <span
              className="w-1 h-1 bg-gray-400 rounded-full animate-bounce"
              style={{ animationDelay: '150ms' }}
            />
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Input Field */}
      <form
        onSubmit={handleSubmit}
        className="p-3 bg-white/60 dark:bg-gray-900/60 border-t border-gray-900/5 dark:border-white/10 backdrop-blur-md"
      >
        <div className="relative flex items-center bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 focus-within:border-amber-400 focus-within:ring-1 focus-within:ring-amber-400/20 transition-all">
          <input
            ref={inputRef}
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Ask me anything..."
            className="w-full bg-transparent text-gray-900 dark:text-white px-4 py-3 outline-none font-sans text-sm placeholder-gray-400 dark:placeholder-gray-500"
          />
          <button
            type="submit"
            disabled={!input.trim()}
            className="mr-1 p-2 rounded-lg text-amber-600 dark:text-amber-500 hover:bg-amber-50 dark:hover:bg-amber-900/20 disabled:opacity-30 transition-all"
          >
            <svg
              width="18"
              height="18"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <line x1="22" y1="2" x2="11" y2="13" />
              <polygon points="22 2 15 22 11 13 2 9 22 2" />
            </svg>
          </button>
        </div>
      </form>
    </div>
  );
};

export default ChatInterface;