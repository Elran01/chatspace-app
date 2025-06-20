import * as functions from 'firebase-functions';
import * as admin from 'firebase-admin';
export declare const getUserProfile: functions.https.CallableFunction<any, Promise<admin.firestore.DocumentData | undefined>, unknown>;
export declare const updateUserProfile: functions.https.CallableFunction<any, Promise<{
    success: boolean;
}>, unknown>;
