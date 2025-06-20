// Usage Tracking API Functions
import * as functions from 'firebase-functions';
import * as admin from 'firebase-admin';

export const trackUsage = functions.https.onCall(async request => {
  if (!request.auth) {
    throw new functions.https.HttpsError(
      'unauthenticated',
      'User must be authenticated'
    );
  }

  // Implementation for tracking usage
  return { success: true };
});

export const getDailyUsage = functions.https.onCall(async request => {
  if (!request.auth) {
    throw new functions.https.HttpsError(
      'unauthenticated',
      'User must be authenticated'
    );
  }

  const userId = request.auth.uid;
  const today = new Date().toISOString().split('T')[0];

  const usageDoc = await admin
    .firestore()
    .collection('usage')
    .doc(userId)
    .collection('daily')
    .doc(today)
    .get();

  return usageDoc.exists ? usageDoc.data() : null;
});
