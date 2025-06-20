// Project API Functions
import * as functions from 'firebase-functions';
import * as admin from 'firebase-admin';

export const createProject = functions.https.onCall(async request => {
  if (!request.auth) {
    throw new functions.https.HttpsError(
      'unauthenticated',
      'User must be authenticated'
    );
  }

  const { name, description } = request.data;
  const userId = request.auth.uid;

  const projectData = {
    name,
    description,
    ownerId: userId,
    collaborators: [],
    createdAt: admin.firestore.Timestamp.now(),
    updatedAt: admin.firestore.Timestamp.now(),
  };

  const projectRef = await admin
    .firestore()
    .collection('projects')
    .add(projectData);
  return { id: projectRef.id, ...projectData };
});

export const getProjects = functions.https.onCall(async request => {
  if (!request.auth) {
    throw new functions.https.HttpsError(
      'unauthenticated',
      'User must be authenticated'
    );
  }

  const userId = request.auth.uid;
  const projects = await admin
    .firestore()
    .collection('projects')
    .where('ownerId', '==', userId)
    .get();

  return projects.docs.map(doc => ({ id: doc.id, ...doc.data() }));
});
