import * as functions from 'firebase-functions';
import * as admin from 'firebase-admin';
export declare const createProject: functions.https.CallableFunction<any, Promise<{
    name: any;
    description: any;
    ownerId: string;
    collaborators: never[];
    createdAt: admin.firestore.Timestamp;
    updatedAt: admin.firestore.Timestamp;
    id: string;
}>, unknown>;
export declare const getProjects: functions.https.CallableFunction<any, Promise<{
    id: string;
}[]>, unknown>;
