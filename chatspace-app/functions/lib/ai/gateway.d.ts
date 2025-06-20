import * as functions from 'firebase-functions';
import * as admin from 'firebase-admin';
export type AIModel = 'gpt-4' | 'gpt-4-turbo' | 'claude-3-opus' | 'claude-3-sonnet' | 'gemini-pro' | 'deepseek-chat';
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
export declare const aiGateway: functions.https.CallableFunction<any, Promise<AIResponse>, unknown>;
export declare const aiComparison: functions.https.CallableFunction<any, Promise<{
    responses: {
        model: AIModel;
        content: string;
        tokens: number;
        cost: number;
        timestamp: admin.firestore.Timestamp;
    }[];
    timestamp: admin.firestore.Timestamp;
    comparison: boolean;
}>, unknown>;
