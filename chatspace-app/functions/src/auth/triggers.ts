// Authentication Triggers - Handle user lifecycle events
import * as functions from 'firebase-functions/v1';
import * as admin from 'firebase-admin';
import { UserRecord } from 'firebase-functions/v1/auth';

// Create user document when user signs up
export const onUserCreate = functions.auth
  .user()
  .onCreate(async (user: UserRecord) => {
    const userDoc = {
      id: user.uid,
      email: user.email || '',
      displayName: user.displayName || '',
      photoURL: user.photoURL || '',
      subscription: {
        plan: 'free' as const,
        status: 'active' as const,
        expiresAt: admin.firestore.Timestamp.fromDate(
          new Date(Date.now() + 30 * 24 * 60 * 60 * 1000)
        ), // 30 days
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
        defaultModel: 'gpt-4' as const,
        theme: 'system' as const,
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
export const onUserDelete = functions.auth
  .user()
  .onDelete(async (user: UserRecord) => {
    const batch = admin.firestore().batch();

    // Delete user document
    batch.delete(admin.firestore().collection('users').doc(user.uid));

    // Delete user's projects and associated data
    const projectsSnapshot = await admin
      .firestore()
      .collection('projects')
      .where('ownerId', '==', user.uid)
      .get();

    projectsSnapshot.docs.forEach(doc => {
      batch.delete(doc.ref);
    });

    // Delete usage data
    const usageSnapshot = await admin
      .firestore()
      .collection('usage')
      .where('userId', '==', user.uid)
      .get();

    usageSnapshot.docs.forEach(doc => {
      batch.delete(doc.ref);
    });

    await batch.commit();
    console.log('User data cleaned up for:', user.uid);
  });
