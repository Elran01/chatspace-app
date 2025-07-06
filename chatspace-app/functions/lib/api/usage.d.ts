import * as functions from 'firebase-functions';
import * as admin from 'firebase-admin';
export declare const trackUsage: functions.https.CallableFunction<any, Promise<{
    success: boolean;
}>, unknown>;
export declare const getDailyUsage: functions.https.CallableFunction<any, Promise<admin.firestore.DocumentData | null | undefined>, unknown>;
