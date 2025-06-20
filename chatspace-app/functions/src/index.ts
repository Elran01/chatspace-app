// ChatSpace Cloud Functions - Main Entry Point
import * as functions from 'firebase-functions';
import * as admin from 'firebase-admin';

// Initialize Firebase Admin
admin.initializeApp();

// Export AI Gateway Functions
export { aiGateway, aiComparison } from './ai/gateway';

// Export Authentication Functions
export { onUserCreate, onUserDelete } from './auth/triggers';

// Export API Functions
export { getUserProfile, updateUserProfile } from './api/users';
export { createProject, getProjects } from './api/projects';

// Export Usage Tracking Functions
export { trackUsage, getDailyUsage } from './api/usage';

// Export Scheduled Functions
export { dailyUsageAggregation, cleanupOldData } from './scheduled/maintenance';

// Health check function
export const healthCheck = functions.https.onRequest((request, response) => {
  response.status(200).json({
    status: 'healthy',
    timestamp: new Date().toISOString(),
    service: 'ChatSpace Cloud Functions',
  });
});
