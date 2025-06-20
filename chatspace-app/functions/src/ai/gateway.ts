// AI Gateway - Route requests to different AI providers
import * as functions from 'firebase-functions';
import * as admin from 'firebase-admin';
import { OpenAI } from 'openai';
import { Anthropic } from '@anthropic-ai/sdk';
import { GoogleGenerativeAI } from '@google/generative-ai';

// AI Model Types
export type AIModel =
  | 'gpt-4'
  | 'gpt-4-turbo'
  | 'claude-3-opus'
  | 'claude-3-sonnet'
  | 'gemini-pro'
  | 'deepseek-chat';

// AI Request Interface
export interface AIRequest {
  model: AIModel;
  messages: Array<{
    role: 'user' | 'assistant' | 'system';
    content: string;
  }>;
  parameters?: {
    temperature?: number;
    maxTokens?: number;
    topP?: number;
    frequencyPenalty?: number;
    presencePenalty?: number;
    stop?: string[];
  };
  projectId?: string;
  conversationId?: string;
}

// AI Response Interface
export interface AIResponse {
  content: string;
  model: AIModel;
  tokens: number;
  cost: number;
  timestamp: admin.firestore.Timestamp;
  metadata?: {
    finishReason?: string;
    usage?: any;
  };
}

// Initialize AI Providers
const openai = new OpenAI({
  apiKey: functions.config().openai.api_key || process.env.OPENAI_API_KEY,
});

const anthropic = new Anthropic({
  apiKey: functions.config().anthropic.api_key || process.env.ANTHROPIC_API_KEY,
});

const gemini = new GoogleGenerativeAI(
  functions.config().google.ai_api_key || process.env.GOOGLE_AI_API_KEY
);

// Token pricing per 1K tokens (approximate)
const TOKEN_PRICING: Record<AIModel, { input: number; output: number }> = {
  'gpt-4': { input: 0.03, output: 0.06 },
  'gpt-4-turbo': { input: 0.01, output: 0.03 },
  'claude-3-opus': { input: 0.015, output: 0.075 },
  'claude-3-sonnet': { input: 0.003, output: 0.015 },
  'gemini-pro': { input: 0.0005, output: 0.0015 },
  'deepseek-chat': { input: 0.00014, output: 0.00028 },
};

// Main AI Gateway Function
export const aiGateway = functions.https.onCall(async request => {
  if (!request.auth) {
    throw new functions.https.HttpsError(
      'unauthenticated',
      'User must be authenticated'
    );
  }

  const data = request.data as AIRequest;
  const { model, messages, parameters = {} } = data;
  const userId = request.auth.uid;

  try {
    // Placeholder response - will be replaced with actual AI provider calls
    const response: AIResponse = {
      content: `Mock response from ${model} for user ${userId}`,
      model,
      tokens: 100,
      cost: 0.01,
      timestamp: admin.firestore.Timestamp.now(),
    };

    return response;
  } catch (error) {
    console.error('AI Gateway Error:', error);
    throw new functions.https.HttpsError('internal', 'AI request failed');
  }
});

// OpenAI Integration
async function callOpenAI(
  model: string,
  messages: any[],
  parameters: any
): Promise<AIResponse> {
  const modelName = model === 'gpt-4-turbo' ? 'gpt-4-turbo-preview' : model;

  const completion = await openai.chat.completions.create({
    model: modelName,
    messages,
    temperature: parameters.temperature ?? 0.7,
    max_tokens: parameters.maxTokens ?? 2000,
    top_p: parameters.topP ?? 1,
    frequency_penalty: parameters.frequencyPenalty ?? 0,
    presence_penalty: parameters.presencePenalty ?? 0,
    stop: parameters.stop,
  });

  const usage = completion.usage!;
  const cost = calculateCost(
    model as AIModel,
    usage.prompt_tokens,
    usage.completion_tokens
  );

  return {
    content: completion.choices[0].message.content || '',
    model: model as AIModel,
    tokens: usage.total_tokens,
    cost,
    timestamp: admin.firestore.Timestamp.now(),
    metadata: {
      finishReason: completion.choices[0].finish_reason,
      usage: completion.usage,
    },
  };
}

// Claude Integration
async function callClaude(
  model: string,
  messages: any[],
  parameters: any
): Promise<AIResponse> {
  const modelName =
    model === 'claude-3-opus'
      ? 'claude-3-opus-20240229'
      : 'claude-3-sonnet-20240229';

  const response = await anthropic.messages.create({
    model: modelName,
    max_tokens: parameters.maxTokens ?? 2000,
    temperature: parameters.temperature ?? 0.7,
    messages,
  });

  const inputTokens = response.usage.input_tokens;
  const outputTokens = response.usage.output_tokens;
  const cost = calculateCost(model as AIModel, inputTokens, outputTokens);

  return {
    content:
      response.content[0].type === 'text' ? response.content[0].text : '',
    model: model as AIModel,
    tokens: inputTokens + outputTokens,
    cost,
    timestamp: admin.firestore.Timestamp.now(),
    metadata: {
      finishReason: response.stop_reason ?? undefined,
      usage: response.usage,
    },
  };
}

// Gemini Integration
async function callGemini(
  model: string,
  messages: any[],
  parameters: any
): Promise<AIResponse> {
  const genModel = gemini.getGenerativeModel({ model: 'gemini-pro' });

  // Convert messages to Gemini format
  const prompt = messages.map(msg => `${msg.role}: ${msg.content}`).join('\n');

  const result = await genModel.generateContent(prompt);
  const response = await result.response;
  const text = response.text();

  // Gemini doesn't provide detailed usage info, so we estimate
  const estimatedTokens = Math.ceil(text.length / 4);
  const cost = calculateCost(
    model as AIModel,
    estimatedTokens * 0.7,
    estimatedTokens * 0.3
  );

  return {
    content: text,
    model: model as AIModel,
    tokens: estimatedTokens,
    cost,
    timestamp: admin.firestore.Timestamp.now(),
    metadata: {
      finishReason: 'stop',
      usage: { total_tokens: estimatedTokens },
    },
  };
}

// DeepSeek Integration (placeholder - similar to OpenAI API)
async function callDeepSeek(
  model: string,
  messages: any[],
  parameters: any
): Promise<AIResponse> {
  // DeepSeek API is similar to OpenAI, so we can reuse the structure
  // This is a placeholder implementation
  throw new functions.https.HttpsError(
    'unimplemented',
    'DeepSeek integration not yet implemented'
  );
}

// Calculate cost based on token usage
function calculateCost(
  model: AIModel,
  inputTokens: number,
  outputTokens: number
): number {
  const pricing = TOKEN_PRICING[model];
  return (
    (inputTokens / 1000) * pricing.input +
    (outputTokens / 1000) * pricing.output
  );
}

// Check user's usage limits
async function checkUsageLimits(userId: string): Promise<void> {
  const userDoc = await admin.firestore().collection('users').doc(userId).get();
  const userData = userDoc.data();

  if (!userData) {
    throw new functions.https.HttpsError('not-found', 'User not found');
  }

  const usage = userData.usage || {};
  const limits = usage.limits || {};

  // Check monthly token limit based on subscription
  const monthlyTokens = usage.tokensUsed || 0;
  const monthlyLimit = limits.monthlyTokens || 10000; // Default free tier limit

  if (monthlyTokens >= monthlyLimit) {
    throw new functions.https.HttpsError(
      'resource-exhausted',
      'Monthly token limit exceeded'
    );
  }
}

// Track usage in Firestore
async function trackUsage(userId: string, response: AIResponse): Promise<void> {
  const today = new Date().toISOString().split('T')[0];
  const usageRef = admin
    .firestore()
    .collection('usage')
    .doc(userId)
    .collection('daily')
    .doc(today);

  await admin.firestore().runTransaction(async transaction => {
    const usageDoc = await transaction.get(usageRef);
    const currentUsage = usageDoc.data() || {
      tokens: {},
      costs: { total: 0, byModel: {} },
      conversations: 0,
      requests: 0,
    };

    // Update usage
    currentUsage.tokens[response.model] =
      (currentUsage.tokens[response.model] || 0) + response.tokens;
    currentUsage.costs.total += response.cost;
    currentUsage.costs.byModel[response.model] =
      (currentUsage.costs.byModel[response.model] || 0) + response.cost;
    currentUsage.requests += 1;

    transaction.set(usageRef, currentUsage, { merge: true });

    // Update user's total usage
    const userRef = admin.firestore().collection('users').doc(userId);
    transaction.update(userRef, {
      'usage.tokensUsed': admin.firestore.FieldValue.increment(response.tokens),
      'usage.lastActive': admin.firestore.Timestamp.now(),
    });
  });
}

// Log interaction for debugging and analytics
async function logInteraction(
  userId: string,
  request: AIRequest,
  response: AIResponse
): Promise<void> {
  const logRef = admin.firestore().collection('logs').doc();

  await logRef.set({
    userId,
    model: request.model,
    projectId: request.projectId,
    conversationId: request.conversationId,
    tokens: response.tokens,
    cost: response.cost,
    timestamp: admin.firestore.Timestamp.now(),
    messageCount: request.messages.length,
  });
}

// AI Comparison Function
export const aiComparison = functions.https.onCall(async request => {
  if (!request.auth) {
    throw new functions.https.HttpsError(
      'unauthenticated',
      'User must be authenticated'
    );
  }

  const data = request.data as {
    models: AIModel[];
    messages: any[];
    parameters?: any;
  };
  const { models, messages, parameters = {} } = data;

  try {
    const responses = models.map(model => ({
      model,
      content: `Mock comparison response from ${model}`,
      tokens: 100,
      cost: 0.01,
      timestamp: admin.firestore.Timestamp.now(),
    }));

    return {
      responses,
      timestamp: admin.firestore.Timestamp.now(),
      comparison: true,
    };
  } catch (error) {
    console.error('AI Comparison Error:', error);
    throw new functions.https.HttpsError('internal', 'AI comparison failed');
  }
});
