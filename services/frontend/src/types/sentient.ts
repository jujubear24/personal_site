/**
 * Sentient UI Type Definitions
 * 
 * Types specific to the Sentient UI experience.
 */

/**
 * Agent visual/interaction state
 */
export enum AgentState {
  IDLE = 'IDLE',
  THINKING = 'THINKING',
  SPEAKING = 'SPEAKING',
}

/**
 * Current view mode in the Sentient UI
 */
export type ViewMode = 'AGENT' | 'RESUME' | 'BLOG' | 'CONTACT';

/**
 * Chat interface display mode
 */
export type ChatMode = 'FULLSCREEN' | 'FLOATING';

/**
 * Theme setting
 */
export type Theme = 'light' | 'dark';

/**
 * Chat message format for Sentient UI
 * Compatible with FastAPI backend response format
 */
export interface SentientMessage {
  role: 'user' | 'assistant';
  content: string;
  timestamp: number;
}

/**
 * Navigation item for the floating dock
 */
export interface NavItem {
  label: string;
  value: ViewMode;
  icon: string;
}

/**
 * Props for the AgentScene 3D component
 */
export interface AgentSceneProps {
  agentState: AgentState;
  viewMode: ViewMode;
  theme: Theme;
}

/**
 * Props for the ChatInterface component
 */
export interface ChatInterfaceProps {
  messages: SentientMessage[];
  onSendMessage: (text: string) => void;
  agentState: AgentState;
  mode: ChatMode;
  isOpen?: boolean;
  onClose?: () => void;
}

/**
 * Props for ContentOverlay component
 */
export interface ContentOverlayProps {
  mode: ViewMode;
}

/**
 * Visual configuration for shaders
 */
export const VISUAL_CONFIG = {
  accentColor: '#D4A373', // Gold/Bronze
  backgroundColor: '#F3F4F6', // Light Grey
  darkBackgroundColor: '#030712', // Deep Black
  ditherScale: 2.0,
} as const;

/**
 * Default navigation items
 */
export const NAV_ITEMS: NavItem[] = [
  { label: 'Agent', value: 'AGENT', icon: '◈' },
  { label: 'Resume', value: 'RESUME', icon: 'R' },
  { label: 'Blog', value: 'BLOG', icon: 'B' },
  { label: 'Contact', value: 'CONTACT', icon: '@' },
];