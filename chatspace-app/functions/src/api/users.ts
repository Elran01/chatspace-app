// User API Functions
import * as functions from 'firebase-functions';
import * as admin from 'firebase-admin';

export const getUserProfile = functions.https.onCall(async request => {
  if (!request.auth) {
    throw new functions.https.HttpsError(
      'unauthenticated',
      'User must be authenticated'
    );
  }

  const userId = request.auth.uid;
  const userDoc = await admin.firestore().collection('users').doc(userId).get();

  if (!userDoc.exists) {
    throw new functions.https.HttpsError('not-found', 'User profile not found');
  }

  return userDoc.data();
});

export const updateUserProfile = functions.https.onCall(async request => {
  if (!request.auth) {
    throw new functions.https.HttpsError(
      'unauthenticated',
      'User must be authenticated'
    );
  }

  const userId = request.auth.uid;
  const updates = request.data;

  await admin
    .firestore()
    .collection('users')
    .doc(userId)
    .update({
      ...updates,
      updatedAt: admin.firestore.Timestamp.now(),
    });

  return { success: true };
});
