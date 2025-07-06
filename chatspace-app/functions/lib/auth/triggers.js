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
exports.onUserDelete = exports.onUserCreate = void 0;
// Authentication Triggers - Handle user lifecycle events
const functions = __importStar(require("firebase-functions/v1"));
const admin = __importStar(require("firebase-admin"));
// Create user document when user signs up
exports.onUserCreate = functions.auth.user().onCreate(async (user) => {
    const userDoc = {
        id: user.uid,
        email: user.email || '',
        displayName: user.displayName || '',
        photoURL: user.photoURL || '',
        subscription: {
            plan: 'free',
            status: 'active',
            expiresAt: admin.firestore.Timestamp.fromDate(new Date(Date.now() + 30 * 24 * 60 * 60 * 1000)), // 30 days
            customerId: '',
        },
        usage: {
            tokensUsed: 0,
            conversationsCount: 0,
            lastActive: admin.firestore.Timestamp.now(),
            limits: {
                monthlyTokens: 10000, // Free tier limit
                conversations: 50,
                projects: 5,
            },
        },
        preferences: {
            defaultModel: 'gpt-4',
            theme: 'system',
            canvasSettings: {
                autoSave: true,
                collaborativeEditing: true,
                aiAssistance: true,
                versionHistory: true,
            },
        },
        createdAt: admin.firestore.Timestamp.now(),
        updatedAt: admin.firestore.Timestamp.now(),
    };
    await admin.firestore().collection('users').doc(user.uid).set(userDoc);
    console.log('User document created for:', user.uid);
});
// Clean up user data when user is deleted
exports.onUserDelete = functions.auth.user().onDelete(async (user) => {
    const batch = admin.firestore().batch();
    // Delete user document
    batch.delete(admin.firestore().collection('users').doc(user.uid));
    // Delete user's projects and associated data
    const projectsSnapshot = await admin.firestore()
        .collection('projects')
        .where('ownerId', '==', user.uid)
        .get();
    projectsSnapshot.docs.forEach(doc => {
        batch.delete(doc.ref);
    });
    // Delete usage data
    const usageSnapshot = await admin.firestore()
        .collection('usage')
        .where('userId', '==', user.uid)
        .get();
    usageSnapshot.docs.forEach(doc => {
        batch.delete(doc.ref);
    });
    await batch.commit();
    console.log('User data cleaned up for:', user.uid);
});
//# sourceMappingURL=triggers.js.map