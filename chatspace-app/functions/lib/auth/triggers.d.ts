import * as functions from 'firebase-functions/v1';
export declare const onUserCreate: functions.CloudFunction<import("firebase-admin/auth").UserRecord>;
export declare const onUserDelete: functions.CloudFunction<import("firebase-admin/auth").UserRecord>;
