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
exports.healthCheck = exports.cleanupOldData = exports.dailyUsageAggregation = exports.getDailyUsage = exports.trackUsage = exports.getProjects = exports.createProject = exports.updateUserProfile = exports.getUserProfile = exports.onUserDelete = exports.onUserCreate = exports.aiComparison = exports.aiGateway = void 0;
// ChatSpace Cloud Functions - Main Entry Point
const functions = __importStar(require("firebase-functions"));
const admin = __importStar(require("firebase-admin"));
// Initialize Firebase Admin
admin.initializeApp();
// Export AI Gateway Functions
var gateway_1 = require("./ai/gateway");
Object.defineProperty(exports, "aiGateway", { enumerable: true, get: function () { return gateway_1.aiGateway; } });
Object.defineProperty(exports, "aiComparison", { enumerable: true, get: function () { return gateway_1.aiComparison; } });
// Export Authentication Functions
var triggers_1 = require("./auth/triggers");
Object.defineProperty(exports, "onUserCreate", { enumerable: true, get: function () { return triggers_1.onUserCreate; } });
Object.defineProperty(exports, "onUserDelete", { enumerable: true, get: function () { return triggers_1.onUserDelete; } });
// Export API Functions
var users_1 = require("./api/users");
Object.defineProperty(exports, "getUserProfile", { enumerable: true, get: function () { return users_1.getUserProfile; } });
Object.defineProperty(exports, "updateUserProfile", { enumerable: true, get: function () { return users_1.updateUserProfile; } });
var projects_1 = require("./api/projects");
Object.defineProperty(exports, "createProject", { enumerable: true, get: function () { return projects_1.createProject; } });
Object.defineProperty(exports, "getProjects", { enumerable: true, get: function () { return projects_1.getProjects; } });
// Export Usage Tracking Functions
var usage_1 = require("./api/usage");
Object.defineProperty(exports, "trackUsage", { enumerable: true, get: function () { return usage_1.trackUsage; } });
Object.defineProperty(exports, "getDailyUsage", { enumerable: true, get: function () { return usage_1.getDailyUsage; } });
// Export Scheduled Functions
var maintenance_1 = require("./scheduled/maintenance");
Object.defineProperty(exports, "dailyUsageAggregation", { enumerable: true, get: function () { return maintenance_1.dailyUsageAggregation; } });
Object.defineProperty(exports, "cleanupOldData", { enumerable: true, get: function () { return maintenance_1.cleanupOldData; } });
// Health check function
exports.healthCheck = functions.https.onRequest((request, response) => {
    response.status(200).json({
        status: 'healthy',
        timestamp: new Date().toISOString(),
        service: 'ChatSpace Cloud Functions'
    });
});
//# sourceMappingURL=index.js.map