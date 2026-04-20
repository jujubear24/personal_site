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

/* -------------------------------------------------------------------------- */
/*                              SUB-COMPONENTS                                 */
/* -------------------------------------------------------------------------- */

/**
 * Cinematic "Decoder" Text Effect for Titles
 */
const ScrambleTitle: React.FC<{ 
  text: string; 
  delay?: number; 
  className?: string;
}> = ({ text, delay = 0, className = "" }) => {
  const [display, setDisplay] = useState("");
  const [opacity, setOpacity] = useState(0);
  
  useEffect(() => {
    let timeout: ReturnType<typeof setTimeout>;
    let interval: ReturnType<typeof setInterval>;
    
    const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789_";
    
    timeout = setTimeout(() => {
      setOpacity(1);
      let iteration = 0;
      
      interval = setInterval(() => {
        setDisplay(
          text.split("").map((letter, index) => {
            if (index < iteration) {
              return text[index];
            }
            return chars[Math.floor(Math.random() * chars.length)];
          }).join("")
        );
        
        if (iteration >= text.length) { 
          clearInterval(interval);
        }
        
        iteration += 1/3; 
      }, 30);
    }, delay);

    return () => {
      clearTimeout(timeout);
      clearInterval(interval);
    };
  }, [text, delay]);

  return (
    <span 
      className={`inline-block transition-opacity duration-300 ${className}`} 
      style={{ opacity }}
    >
      {display}
    </span>
  );
};

/**
 * Typewriter animation for assistant messages
 */
const TypewriterText: React.FC<{ 
  text: string; 
  speed?: number; 
  delay?: number;
}> = ({ text, speed = 20, delay = 0 }) => {
  const [displayedText, setDisplayedText] = useState('');
  const [startTyping, setStartTyping] = useState(false);

  useEffect(() => {
    const startTimer = setTimeout(() => setStartTyping(true), delay);
    return () => clearTimeout(startTimer);
  }, [delay]);

  useEffect(() => {
    if (!startTyping) return;

    let index = 0;
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
  }, [text, startTyping, speed]);

  return <span>{displayedText}</span>;
};

/**
 * Reusable Circular Avatar - Minimal "Arlo" Style
 */
const CircularAvatar: React.FC<{ 
  pulsing?: boolean; 
  size?: "sm" | "md" | "lg";
}> = ({ pulsing = false, size = "md" }) => {
  let dims: string, innerRing: string, core: string;
  
  switch (size) {
    case "lg":
      dims = "w-24 h-24";
      innerRing = "w-14 h-14";
      core = "w-4 h-4";
      break;
    case "sm":
      dims = "w-6 h-6";
      innerRing = "w-3 h-3";
      core = "w-1 h-1";
      break;
    default: // md
      dims = "w-16 h-16";
      innerRing = "w-10 h-10";
      core = "w-2.5 h-2.5";
  }

  return (
    <div className={`relative ${dims} flex items-center justify-center transition-all duration-500`}>
      {/* Glow for Active State */}
      {(pulsing || size === 'lg' || size === 'md') && (
        <div className="absolute inset-0 bg-red-500/5 dark:bg-red-500/10 rounded-full blur-xl animate-pulse" />
      )}

      {/* Outer Ring */}
      <div 
        className={`absolute inset-0 border border-gray-300/50 dark:border-gray-600/30 rounded-full ${
          pulsing ? 'animate-spin-slow' : 'opacity-80'
        }`} 
      />
      
      {/* Middle Ring - Brushed Gold Look */}
      <div 
        className={`${innerRing} absolute border border-amber-500/40 dark:border-amber-400/30 rounded-full shadow-[0_0_10px_rgba(245,158,11,0.1)]`} 
      />
      
      {/* Core - Dimensional Ruby Red */}
      <div 
        className={`${core} bg-gradient-to-tr from-red-600 to-red-400 rounded-full ${
          pulsing ? 'animate-pulse' : ''
        } shadow-[0_0_8px_rgba(239,68,68,0.5)] relative overflow-hidden`}
      >
        {/* Specular Highlight on Core */}
        <div className="absolute top-[20%] right-[20%] w-[30%] h-[30%] bg-white/40 rounded-full blur-[0.5px]" />
      </div>
    </div>
  );
};

/**
 * AI Suggestion Chips for new conversations
 */
const SUGGESTIONS = [
  { label: "Who is Jules?", icon: "✦", query: "Who is Jules?" },
  { label: "Technical Skills", icon: "⚡", query: "What are Jules's top technical skills?" },
  { label: "View Projects", icon: "◈", query: "Tell me about the projects Jules has worked on." },
  { label: "Contact", icon: "✉", query: "How can I contact Jules?" }
];

/* -------------------------------------------------------------------------- */
/*                              MAIN COMPONENT                                 */
/* -------------------------------------------------------------------------- */

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
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Auto-scroll to bottom on new messages
  useEffect(() => {
    if (isOpen) {
      setTimeout(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
      }, 100);
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

  const isWelcomeState = messages.length <= 1;

  /* -------------------------------------------------------------------------- */
  /*                              RENDER: FULLSCREEN                            */
  /* -------------------------------------------------------------------------- */
  if (mode === 'FULLSCREEN') {
    return (
      <div className="absolute inset-0 z-20 flex flex-col pointer-events-none overflow-hidden font-sans">
        
        {/* Chat Container (Bottom Section) */}
        <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-full max-w-4xl h-[85%] flex flex-col px-4 pb-10 md:px-0 transition-all duration-500">
          
          {/* Messages Window */}
          <div className="flex-1 w-full relative mb-4 rounded-t-3xl overflow-hidden pointer-events-auto">
            
            {/* Gradient Mask for top fade */}
            <div className="absolute top-0 left-0 w-full h-32 bg-gradient-to-b from-[#F3F4F6] dark:from-[#030712] to-transparent z-10 pointer-events-none" />

            <div 
              ref={scrollContainerRef}
              className="absolute inset-0 overflow-y-auto custom-scrollbar flex flex-col px-4 md:px-12 py-6"
            >
              {/* Welcome Hero Section */}
              {isWelcomeState && (
                <div className="mt-auto mb-16 relative w-full flex flex-col items-center justify-center animate-float">
                  
                  {/* Atmospheric Glow Behind */}
                  <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-gradient-to-tr from-amber-100/10 to-transparent dark:from-white/5 dark:to-transparent rounded-full blur-[100px] pointer-events-none animate-pulse-slow" />

                  {/* Avatar Container with Spacing */}
                  <div className="mb-10 relative opacity-0 animate-[fadeIn_0.8s_ease-out_forwards] flex flex-col items-center">
                    {/* Medium Avatar */}
                    <CircularAvatar pulsing={true} size="md" />
                    
                    {/* Nameplate */}
                    <div className="mt-8 flex flex-col items-center">
                      <span className="font-mono text-gray-900 dark:text-gray-100 font-bold text-xs tracking-[0.3em] uppercase mb-2">
                        ARLO
                      </span>
                      <div className="flex items-center gap-1.5">
                        <span className="w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse shadow-[0_0_5px_rgba(34,197,94,0.5)]" />
                        <span className="font-mono text-green-600 dark:text-green-500 uppercase tracking-widest text-[9px] font-bold">
                          Online
                        </span>
                      </div>
                    </div>
                  </div>
                  
                  {/* Main Welcome Message */}
                  <div className="min-h-[60px] opacity-0 animate-[fadeIn_0.8s_ease-out_0.5s_forwards] transform translate-y-2 text-center max-w-xl mx-auto">
                    <h2 className="text-xl md:text-2xl font-light font-sans text-gray-800 dark:text-gray-100 leading-relaxed">
                      <TypewriterText 
                        text="Hey there. I'm Arlo — think of me as Jules' digital right hand. What brings you here?" 
                        delay={800} 
                        speed={30} 
                      />
                    </h2>
                  </div>
                </div>
              )}

              {/* Message List */}
              {!isWelcomeState && (
                <>
                  <div className="flex-1" />
                  {messages.map((msg, idx) => {
                    const isUser = msg.role === 'user';
                    const isLast = idx === messages.length - 1;
                    
                    return (
                      <div 
                        key={idx} 
                        className={`flex w-full mb-8 animate-fadeIn ${isUser ? 'justify-end' : 'justify-start'}`}
                      >
                        {/* Circular Avatar (Small) for Chat History */}
                        {!isUser && (
                          <div className="flex-none mr-4 mt-1">
                            <CircularAvatar 
                              pulsing={agentState === AgentState.SPEAKING && isLast} 
                              size="sm" 
                            />
                          </div>
                        )}

                        {/* Message Bubble */}
                        <div className={`
                          max-w-[85%] md:max-w-[75%] px-6 py-4 text-[15px] leading-relaxed shadow-sm
                          ${isUser 
                            ? 'bg-gray-900 dark:bg-gray-100 text-white dark:text-gray-900 rounded-[2rem] rounded-tr-sm font-medium'
                            : 'text-gray-900 dark:text-white pl-0 font-medium'
                          }
                        `}>
                          {isUser ? (
                            <p className="font-sans">{msg.content}</p>
                          ) : (
                            <div className="font-sans">
                              {isLast ? <TypewriterText text={msg.content} /> : msg.content}
                            </div>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </>
              )}
              
              {/* Loading Indicator */}
              {agentState === AgentState.THINKING && (
                <div className="flex w-full justify-start mb-6 animate-fadeIn pl-12">
                  <div className="flex gap-1.5 items-center bg-gray-50 dark:bg-gray-800/50 border border-gray-100 dark:border-gray-800 px-4 py-2 rounded-full backdrop-blur-sm">
                    <div className="w-1.5 h-1.5 rounded-full bg-amber-500 animate-bounce" style={{ animationDelay: '0ms' }} />
                    <div className="w-1.5 h-1.5 rounded-full bg-amber-500 animate-bounce" style={{ animationDelay: '200ms' }} />
                    <div className="w-1.5 h-1.5 rounded-full bg-amber-500 animate-bounce" style={{ animationDelay: '400ms' }} />
                  </div>
                </div>
              )}

              <div ref={messagesEndRef} className="h-4" />
            </div>
          </div>
          
          {/* Input Area */}
          <div className="flex-none w-full pointer-events-auto z-30 px-4 md:px-12">
            
            {/* Suggestions - Staggered Fade In & Centered */}
            {isWelcomeState && (
              <div className="flex flex-wrap gap-3 mb-8 justify-center">
                {SUGGESTIONS.map((s, i) => (
                  <button
                    key={i}
                    onClick={() => handleSuggestionClick(s.query)}
                    style={{ animationDelay: `${1500 + (i * 100)}ms` }}
                    className="opacity-0 animate-[fadeIn_0.5s_ease-out_forwards] flex items-center gap-2 bg-white dark:bg-gray-800 hover:bg-amber-50 dark:hover:bg-gray-700 border border-gray-200 dark:border-gray-700 px-4 py-3 rounded-2xl transition-all duration-200 group text-left shadow-sm hover:shadow-md hover:border-amber-200 dark:hover:border-gray-600"
                  >
                    <span className="text-amber-500 dark:text-amber-400 text-sm group-hover:scale-110 transition-transform">
                      {s.icon}
                    </span>
                    <span className="text-sm font-medium text-gray-700 dark:text-gray-200">
                      {s.label}
                    </span>
                  </button>
                ))}
              </div>
            )}

            {/* Main Input Bar */}
            <form onSubmit={handleSubmit} className="relative max-w-full mx-auto animate-fadeIn">
              <div className={`
                relative flex items-center bg-white dark:bg-gray-900 rounded-[2rem] 
                transition-all duration-300 border border-gray-300 dark:border-gray-600
                ${input.trim() 
                  ? 'shadow-lg ring-1 ring-amber-500/20 dark:ring-amber-500/20 border-amber-500/50' 
                  : 'shadow-md'
                }
                focus-within:ring-2 focus-within:ring-amber-500/20 dark:focus-within:ring-amber-500/20 focus-within:border-amber-500/50
              `}>
                
                <input
                  ref={inputRef}
                  type="text"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  placeholder="Ask Arlo anything..."
                  className="w-full bg-transparent text-gray-900 dark:text-white pl-8 pr-16 py-5 outline-none font-sans text-base font-medium placeholder-gray-400 dark:placeholder-gray-500"
                  autoFocus
                />
                
                {/* Submit Icon */}
                <div className="absolute right-4 flex items-center gap-2">
                  {input.trim() ? (
                    <button 
                      type="submit" 
                      className="p-2 rounded-full bg-gray-900 dark:bg-white text-white dark:text-black hover:opacity-90 transition-all animate-fadeIn shadow-sm"
                    >
                      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                        <line x1="22" y1="2" x2="11" y2="13" />
                        <polygon points="22 2 15 22 11 13 2 9 22 2" />
                      </svg>
                    </button>
                  ) : (
                    <div className="p-2 text-gray-300 dark:text-gray-600">
                      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <line x1="22" y1="2" x2="11" y2="13" />
                        <polygon points="22 2 15 22 11 13 2 9 22 2" />
                      </svg>
                    </div>
                  )}
                </div>
              </div>
              
              {/* Footer Info */}
              <div className="text-center mt-3 opacity-60">
                <p className="text-[10px] text-gray-400 dark:text-gray-500 font-semibold tracking-wide">
                  Arlo may display inaccurate info, please double-check.
                </p>
              </div>
            </form>
          </div>
        </div>
      </div>
    );
  }

  /* -------------------------------------------------------------------------- */
  /*                             RENDER: FLOATING                               */
  /* -------------------------------------------------------------------------- */
  const containerClasses = `fixed bottom-6 right-6 w-[350px] md:w-[400px] h-[500px] bg-white/95 dark:bg-gray-900/95 backdrop-blur-xl border border-gray-200 dark:border-gray-800 shadow-2xl rounded-2xl overflow-hidden flex flex-col z-50 transition-all duration-300 origin-bottom-right ${
    isOpen 
      ? 'opacity-100 scale-100 translate-y-0' 
      : 'opacity-0 scale-90 translate-y-4 pointer-events-none'
  }`;

  return (
    <div className={containerClasses}>
      {/* Header */}
      <div className="px-5 py-4 border-b border-gray-100 dark:border-gray-800 flex items-center justify-between bg-white/50 dark:bg-gray-800/50 backdrop-blur-md">
        <div className="flex items-center gap-3">
          <CircularAvatar pulsing={agentState === AgentState.SPEAKING} size="sm" />
          <div className="flex flex-col">
            <span className="font-bold text-gray-900 dark:text-white text-sm tracking-wide">
              ARLO
            </span>
            <span className="text-[10px] text-green-600 dark:text-green-500 font-bold uppercase tracking-wider flex items-center gap-1">
              <span className="w-1 h-1 bg-green-500 rounded-full shadow-[0_0_4px_rgba(34,197,94,0.6)]" />
              Online
            </span>
          </div>
        </div>
        <button 
          onClick={onClose} 
          className="p-1 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-400 hover:text-gray-900 dark:hover:text-white transition-all"
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <line x1="18" y1="6" x2="6" y2="18" />
            <line x1="6" y1="6" x2="18" y2="18" />
          </svg>
        </button>
      </div>

      {/* Message Stream */}
      <div className="flex-1 overflow-y-auto p-5 space-y-6 custom-scrollbar bg-white dark:bg-gray-950">
        {messages.map((msg, idx) => {
          const isUser = msg.role === 'user';
          const isLast = idx === messages.length - 1;
          return (
            <div key={idx} className={`flex ${isUser ? 'justify-end' : 'justify-start'}`}>
              {!isUser && (
                <div className="flex-none mr-2 mt-1">
                  <CircularAvatar size="sm" />
                </div>
              )}
              
              <div className={`max-w-[85%] relative ${
                isUser 
                  ? 'bg-gray-900 dark:bg-gray-100 text-white dark:text-gray-900 rounded-2xl rounded-tr-sm font-medium' 
                  : 'text-gray-900 dark:text-white font-medium'
              } px-4 py-2.5 text-[13px] leading-relaxed`}>
                {msg.role === 'assistant' ? (
                  <div className="font-sans">
                    {isLast && isOpen ? <TypewriterText text={msg.content} /> : msg.content}
                  </div>
                ) : (
                  <p className="font-sans">{msg.content}</p>
                )}
              </div>
            </div>
          );
        })}
        
        {agentState === AgentState.THINKING && (
          <div className="flex items-center gap-1.5 px-4 pl-10">
            <div className="w-1.5 h-1.5 rounded-full bg-amber-500 animate-bounce" style={{ animationDelay: '0ms' }} />
            <div className="w-1.5 h-1.5 rounded-full bg-amber-500 animate-bounce" style={{ animationDelay: '200ms' }} />
            <div className="w-1.5 h-1.5 rounded-full bg-amber-500 animate-bounce" style={{ animationDelay: '400ms' }} />
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Input Field */}
      <form onSubmit={handleSubmit} className="p-4 bg-white dark:bg-gray-900 border-t border-gray-100 dark:border-gray-800">
        <div className="relative flex items-center bg-gray-100 dark:bg-gray-800 rounded-full focus-within:ring-1 focus-within:ring-amber-500/30 dark:focus-within:ring-amber-500/30 transition-all border border-transparent focus-within:border-amber-500/30">
          <input
            ref={inputRef}
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Message Arlo..."
            className="w-full bg-transparent text-gray-900 dark:text-white px-4 py-3 outline-none font-sans text-sm font-medium placeholder-gray-500 dark:placeholder-gray-400"
          />
          <button 
            type="submit" 
            disabled={!input.trim()}
            className="mr-2 p-1.5 rounded-full text-gray-900 dark:text-white hover:bg-gray-200 dark:hover:bg-gray-600 disabled:opacity-30 transition-all"
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
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