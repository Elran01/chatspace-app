"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
exports.aiComparison = exports.aiGateway = void 0;
// AI Gateway - Route requests to different AI providers
const functions = __importStar(require("firebase-functions"));
const admin = __importStar(require("firebase-admin"));
const openai_1 = require("openai");
const sdk_1 = require("@anthropic-ai/sdk");
const generative_ai_1 = require("@google/generative-ai");
// Initialize AI Providers
const openai = new openai_1.OpenAI({
    apiKey: functions.config().openai.api_key || process.env.OPENAI_API_KEY,
});
const anthropic = new sdk_1.Anthropic({
    apiKey: functions.config().anthropic.api_key || process.env.ANTHROPIC_API_KEY,
});
const gemini = new generative_ai_1.GoogleGenerativeAI(functions.config().google.ai_api_key || process.env.GOOGLE_AI_API_KEY);
// Token pricing per 1K tokens (approximate)
const TOKEN_PRICING = {
    'gpt-4': { input: 0.03, output: 0.06 },
    'gpt-4-turbo': { input: 0.01, output: 0.03 },
    'claude-3-opus': { input: 0.015, output: 0.075 },
    'claude-3-sonnet': { input: 0.003, output: 0.015 },
    'gemini-pro': { input: 0.0005, output: 0.0015 },
    'deepseek-chat': { input: 0.00014, output: 0.00028 },
};
// Main AI Gateway Function
exports.aiGateway = functions.https.onCall(async (request) => {
    if (!request.auth) {
        throw new functions.https.HttpsError('unauthenticated', 'User must be authenticated');
    }
    const data = request.data;
    const { model, messages, parameters = {} } = data;
    const userId = request.auth.uid;
    try {
        // Placeholder response - will be replaced with actual AI provider calls
        const response = {
            content: `Mock response from ${model} for user ${userId}`,
            model,
            tokens: 100,
            cost: 0.01,
            timestamp: admin.firestore.Timestamp.now(),
        };
        return response;
    }
    catch (error) {
        console.error('AI Gateway Error:', error);
        throw new functions.https.HttpsError('internal', 'AI request failed');
    }
});
// OpenAI Integration
async function callOpenAI(model, messages, parameters) {
    var _a, _b, _c, _d, _e;
    const modelName = model === 'gpt-4-turbo' ? 'gpt-4-turbo-preview' : model;
    const completion = await openai.chat.completions.create({
        model: modelName,
        messages,
        temperature: (_a = parameters.temperature) !== null && _a !== void 0 ? _a : 0.7,
        max_tokens: (_b = parameters.maxTokens) !== null && _b !== void 0 ? _b : 2000,
        top_p: (_c = parameters.topP) !== null && _c !== void 0 ? _c : 1,
        frequency_penalty: (_d = parameters.frequencyPenalty) !== null && _d !== void 0 ? _d : 0,
        presence_penalty: (_e = parameters.presencePenalty) !== null && _e !== void 0 ? _e : 0,
        stop: parameters.stop,
    });
    const usage = completion.usage;
    const cost = calculateCost(model, usage.prompt_tokens, usage.completion_tokens);
    return {
        content: completion.choices[0].message.content || '',
        model: model,
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
async function callClaude(model, messages, parameters) {
    var _a, _b;
    const modelName = model === 'claude-3-opus' ? 'claude-3-opus-20240229' : 'claude-3-sonnet-20240229';
    const response = await anthropic.messages.create({
        model: modelName,
        max_tokens: (_a = parameters.maxTokens) !== null && _a !== void 0 ? _a : 2000,
        temperature: (_b = parameters.temperature) !== null && _b !== void 0 ? _b : 0.7,
        messages,
    });
    const inputTokens = response.usage.input_tokens;
    const outputTokens = response.usage.output_tokens;
    const cost = calculateCost(model, inputTokens, outputTokens);
    return {
        content: response.content[0].type === 'text' ? response.content[0].text : '',
        model: model,
        tokens: inputTokens + outputTokens,
        cost,
        timestamp: admin.firestore.Timestamp.now(),
        metadata: {
            finishReason: response.stop_reason,
            usage: response.usage,
        },
    };
}
// Gemini Integration
async function callGemini(model, messages, parameters) {
    const genModel = gemini.getGenerativeModel({ model: 'gemini-pro' });
    // Convert messages to Gemini format
    const prompt = messages.map(msg => `${msg.role}: ${msg.content}`).join('\n');
    const result = await genModel.generateContent(prompt);
    const response = await result.response;
    const text = response.text();
    // Gemini doesn't provide detailed usage info, so we estimate
    const estimatedTokens = Math.ceil(text.length / 4);
    const cost = calculateCost(model, estimatedTokens * 0.7, estimatedTokens * 0.3);
    return {
        content: text,
        model: model,
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
async function callDeepSeek(model, messages, parameters) {
    // DeepSeek API is similar to OpenAI, so we can reuse the structure
    // This is a placeholder implementation
    throw new functions.https.HttpsError('unimplemented', 'DeepSeek integration not yet implemented');
}
// Calculate cost based on token usage
function calculateCost(model, inputTokens, outputTokens) {
    const pricing = TOKEN_PRICING[model];
    return (inputTokens / 1000) * pricing.input + (outputTokens / 1000) * pricing.output;
}
// Check user's usage limits
async function checkUsageLimits(userId) {
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
        throw new functions.https.HttpsError('resource-exhausted', 'Monthly token limit exceeded');
    }
}
// Track usage in Firestore
async function trackUsage(userId, response) {
    const today = new Date().toISOString().split('T')[0];
    const usageRef = admin.firestore()
        .collection('usage')
        .doc(userId)
        .collection('daily')
        .doc(today);
    await admin.firestore().runTransaction(async (transaction) => {
        const usageDoc = await transaction.get(usageRef);
        const currentUsage = usageDoc.data() || {
            tokens: {},
            costs: { total: 0, byModel: {} },
            conversations: 0,
            requests: 0,
        };
        // Update usage
        currentUsage.tokens[response.model] = (currentUsage.tokens[response.model] || 0) + response.tokens;
        currentUsage.costs.total += response.cost;
        currentUsage.costs.byModel[response.model] = (currentUsage.costs.byModel[response.model] || 0) + response.cost;
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
async function logInteraction(userId, request, response) {
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
exports.aiComparison = functions.https.onCall(async (request) => {
    if (!request.auth) {
        throw new functions.https.HttpsError('unauthenticated', 'User must be authenticated');
    }
    const data = request.data;
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
    }
    catch (error) {
        console.error('AI Comparison Error:', error);
        throw new functions.https.HttpsError('internal', 'AI comparison failed');
    }
});
//# sourceMappingURL=gateway.js.map