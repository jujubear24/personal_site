/**
 * Unified Chat Hook
 * 
 * Provides chat functionality for the Sentient UI using the
 * existing FastAPI backend (/api/v1/root_agent/).
 */

'use client';

import { useState, useCallback, useEffect, useRef } from 'react';
import { sendMessage, startNewSession } from '@/lib/api';
import type { SentientMessage, AgentState } from '@/types/sentient';
import { AgentState as AgentStateEnum } from '@/types/sentient';

const STORAGE_KEY = 'sentientChatHistory';
const SPEAKING_DURATION = 3000; // ms to show "speaking" state

export interface UseChatOptions {
  /**
   * Initial greeting message from the assistant
   */
  initialGreeting?: string;

  /**
   * localStorage key for persisting chat history
   * @default 'sentientChatHistory'
   */
  storageKey?: string;

  /**
   * Duration (ms) to show "speaking" state after response
   * @default 3000
   */
  speakingDuration?: number;
}

export interface UseChatReturn {
  /**
   * Current list of messages
   */
  messages: SentientMessage[];

  /**
   * Current agent state (IDLE, THINKING, SPEAKING)
   */
  agentState: AgentState;

  /**
   * Send a message to the agent
   */
  sendMessage: (text: string, files?: File[]) => Promise<void>;

  /**
   * Clear chat history and start fresh
   */
  clearChat: () => void;

  /**
   * Whether this is the user's first message
   */
  isFirstPrompt: boolean;
}

const DEFAULT_GREETING = "Hey! I'm Jules's AI assistant. Welcome to the site! How can I help you today?";

export function useChat(options: UseChatOptions = {}): UseChatReturn {
  const {
    initialGreeting = DEFAULT_GREETING,
    storageKey = STORAGE_KEY,
    speakingDuration = SPEAKING_DURATION,
  } = options;

  // Initialize messages with greeting
  const [messages, setMessages] = useState<SentientMessage[]>(() => [
    {
      role: 'assistant',
      content: initialGreeting,
      timestamp: Date.now(),
    },
  ]);

  const [agentState, setAgentState] = useState<AgentState>(AgentStateEnum.IDLE);
  const [isFirstPrompt, setIsFirstPrompt] = useState(true);
  const [isHydrated, setIsHydrated] = useState(false);

  // Ref for speaking timeout cleanup
  const speakingTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  // Load from localStorage on mount
  useEffect(() => {
    setIsHydrated(true);

    try {
      const stored = localStorage.getItem(storageKey);
      if (stored) {
        const parsed = JSON.parse(stored) as SentientMessage[];
        if (Array.isArray(parsed) && parsed.length > 0) {
          setMessages(parsed);
          setIsFirstPrompt(false);
        }
      }
    } catch (error) {
      console.error('Failed to load chat history:', error);
    }
  }, [storageKey]);

  // Persist to localStorage when messages change
  useEffect(() => {
    if (!isHydrated) return;

    try {
      localStorage.setItem(storageKey, JSON.stringify(messages));
    } catch (error) {
      console.error('Failed to save chat history:', error);
    }
  }, [messages, storageKey, isHydrated]);

  // Cleanup speaking timeout on unmount
  useEffect(() => {
    return () => {
      if (speakingTimeoutRef.current) {
        clearTimeout(speakingTimeoutRef.current);
      }
    };
  }, []);

  const handleSendMessage = useCallback(
    async (text: string, files?: File[]) => {
      const trimmedText = text.trim();
      if (!trimmedText) return;

      // Create and add user message
      const userMessage: SentientMessage = {
        role: 'user',
        content: trimmedText,
        timestamp: Date.now(),
      };

      setMessages((prev) => [...prev, userMessage]);
      setAgentState(AgentStateEnum.THINKING);
      setIsFirstPrompt(false);

      try {
        // Call FastAPI backend
        const response = await sendMessage(trimmedText, files);

        // Create assistant message from response
        const assistantMessage: SentientMessage = {
          role: 'assistant',
          content: response.response,
          timestamp: Date.now(),
        };

        setMessages((prev) => [...prev, assistantMessage]);
        setAgentState(AgentStateEnum.SPEAKING);

        // Clear any existing timeout
        if (speakingTimeoutRef.current) {
          clearTimeout(speakingTimeoutRef.current);
        }

        // Return to idle after speaking duration
        speakingTimeoutRef.current = setTimeout(() => {
          setAgentState(AgentStateEnum.IDLE);
        }, speakingDuration);

      } catch (error) {
        console.error('Chat error:', error);
        
        // Add error message
        const errorMessage: SentientMessage = {
          role: 'assistant',
          content: "I'm having trouble connecting right now. Please try again!",
          timestamp: Date.now(),
        };
        
        setMessages((prev) => [...prev, errorMessage]);
        setAgentState(AgentStateEnum.IDLE);
      }
    },
    [speakingDuration]
  );

  const clearChat = useCallback(() => {
    // Clear backend session
    startNewSession();

    // Clear speaking timeout
    if (speakingTimeoutRef.current) {
      clearTimeout(speakingTimeoutRef.current);
    }

    // Reset state
    setAgentState(AgentStateEnum.IDLE);
    setIsFirstPrompt(true);
    setMessages([
      {
        role: 'assistant',
        content: initialGreeting,
        timestamp: Date.now(),
      },
    ]);

    // Clear storage
    try {
      localStorage.removeItem(storageKey);
    } catch (error) {
      console.error('Failed to clear chat history:', error);
    }
  }, [initialGreeting, storageKey]);

  return {
    messages,
    agentState,
    sendMessage: handleSendMessage,
    clearChat,
    isFirstPrompt,
  };
}