// Firebase data model types for ChatSpace
import { Timestamp } from 'firebase/firestore';

// AI Model types
export type AIModel =
  | 'gpt-4'
  | 'gpt-4-turbo'
  | 'claude-3-opus'
  | 'claude-3-sonnet'
  | 'gemini-pro'
  | 'deepseek-chat';

export type SubscriptionPlan = 'free' | 'basic' | 'pro' | 'team';
export type SubscriptionStatus =
  | 'active'
  | 'cancelled'
  | 'past_due'
  | 'trialing';

// User data model
export interface User {
  id: string;
  email: string;
  displayName: string;
  photoURL?: string;
  subscription: {
    plan: SubscriptionPlan;
    status: SubscriptionStatus;
    expiresAt: Timestamp;
    customerId: string;
  };
  usage: {
    tokensUsed: number;
    conversationsCount: number;
    lastActive: Timestamp;
    limits: {
      monthlyTokens: number;
      conversations: number;
      projects: number;
    };
  };
  preferences: {
    defaultModel: AIModel;
    theme: 'light' | 'dark' | 'system';
    canvasSettings: CanvasSettings;
  };
  createdAt: Timestamp;
  updatedAt: Timestamp;
}

// Project data model
export interface Project {
  id: string;
  name: string;
  description: string;
  ownerId: string;
  collaborators: string[];
  settings: {
    defaultModel: AIModel;
    canvasConfig: CanvasSettings;
    sharing: {
      public: boolean;
      allowInvites: boolean;
    };
  };
  metadata: {
    conversationsCount: number;
    canvasDocsCount: number;
    filesCount: number;
    lastActivity: Timestamp;
  };
  createdAt: Timestamp;
  updatedAt: Timestamp;
}

// Conversation data model
export interface Conversation {
  id: string;
  projectId: string;
  title: string;
  model: AIModel;
  messages: Message[];
  context: {
    systemPrompt?: string;
    parameters: AIModelParameters;
    files: string[];
  };
  metadata: {
    messageCount: number;
    tokensUsed: number;
    cost: number;
    lastMessage: Timestamp;
  };
  createdAt: Timestamp;
  updatedAt: Timestamp;
}

// Message data model
export interface Message {
  id: string;
  role: 'user' | 'assistant' | 'system';
  content: string;
  model?: AIModel;
  tokens?: number;
  cost?: number;
  timestamp: Timestamp;
  metadata?: {
    regenerated?: boolean;
    edited?: boolean;
    attachments?: string[];
  };
}

// Canvas document data model
export interface CanvasDocument {
  id: string;
  projectId: string;
  title: string;
  content: string;
  version: number;
  collaborators: CanvasCollaborator[];
  history: CanvasVersion[];
  settings: CanvasSettings;
  createdAt: Timestamp;
  updatedAt: Timestamp;
  lastEditBy: string;
}

export interface CanvasCollaborator {
  userId: string;
  cursor?: {
    position: number;
    selection: [number, number];
  };
  lastSeen: Timestamp;
}

export interface CanvasVersion {
  version: number;
  changes: string;
  timestamp: Timestamp;
  userId: string;
  summary: string;
}

export interface CanvasSettings {
  autoSave: boolean;
  collaborativeEditing: boolean;
  aiAssistance: boolean;
  versionHistory: boolean;
}

// AI Model parameters
export interface AIModelParameters {
  temperature?: number;
  maxTokens?: number;
  topP?: number;
  frequencyPenalty?: number;
  presencePenalty?: number;
  stop?: string[];
}

// Prompt template data model
export interface PromptTemplate {
  id: string;
  title: string;
  template: string;
  description: string;
  tags: string[];
  variables: PromptVariable[];
  userId: string;
  public: boolean;
  usage: number;
  ratings: {
    average: number;
    count: number;
  };
  createdAt: Timestamp;
  updatedAt: Timestamp;
}

export interface PromptVariable {
  name: string;
  type: 'text' | 'number' | 'select' | 'textarea';
  defaultValue?: string;
  options?: string[];
  required: boolean;
}

// File data model
export interface FileDocument {
  id: string;
  name: string;
  type: string;
  size: number;
  projectId: string;
  uploadedBy: string;
  processing: {
    status: 'pending' | 'processing' | 'completed' | 'failed';
    summary?: string;
    extractedText?: string;
  };
  storage: {
    path: string;
    url: string;
    permissions: 'private' | 'project' | 'public';
  };
  uploadedAt: Timestamp;
  updatedAt: Timestamp;
}

// Usage tracking data model
export interface UsageRecord {
  userId: string;
  date: string; // YYYY-MM-DD format
  tokens: {
    [key in AIModel]?: number;
  };
  costs: {
    total: number;
    byModel: {
      [key in AIModel]?: number;
    };
  };
  conversations: number;
  requests: number;
}

// Authentication context type
export interface AuthUser {
  uid: string;
  email: string | null;
  displayName: string | null;
  photoURL: string | null;
  emailVerified: boolean;
}

// API response types
export interface APIResponse<T = unknown> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}

export interface AIResponse {
  content: string;
  model: AIModel;
  tokens: number;
  cost: number;
  timestamp: Timestamp;
}

// Firestore collection names (constants)
export const COLLECTIONS = {
  USERS: 'users',
  PROJECTS: 'projects',
  CONVERSATIONS: 'conversations',
  CANVAS: 'canvas',
  PROMPTS: 'prompts',
  FILES: 'files',
  USAGE: 'usage',
} as const;
