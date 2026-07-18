/**
 * Internal navigation route paths used across the application.
 * @returns {Record<string, string>} Map of route name to path string
 */
export const ROUTES = {
  HOME: '/',
  STAFF_LOGIN: '/staff/login',
  STAFF_DASHBOARD: '/staff/dashboard',
} as const;

/**
 * Internal API endpoint paths consumed by client-side hooks.
 * @returns {Record<string, string>} Map of endpoint name to API path
 */
export const API_ENDPOINTS = {
  CONCIERGE: '/api/concierge',
  ZONE_REPORTS: '/api/zone-reports',
} as const;

/**
 * User-facing and logging error message strings.
 * Every user-visible error must reference one of these constants.
 * @returns {Record<string, string>} Map of error key to message string
 */
export const ERROR_MESSAGES = {
  UNKNOWN_ERROR: 'An unknown error occurred.',
  GENERIC_FAILURE: 'Something went wrong. Please try again.',
  RATE_LIMITED: 'You are sending messages too quickly. Please wait a moment.',
  AUTH_REQUIRED: 'Authentication required to perform this action.',
  MESSAGES_REQUIRED: 'Messages are required.',
  MISSING_FIELDS: 'Missing required fields.',
  REPORT_FAILED: 'Failed to create report.',
} as const;

/**
 * Google Analytics 4 custom event names tracked throughout the app.
 * Minimum 8 events are required per GS-3.
 * @returns {Record<string, string>} Map of event key to GA4 event name string
 */
export const ANALYTICS_EVENTS = {
  CHAT_MESSAGE_SENT: 'chat_message_sent',
  ZONE_REPORT_SUBMITTED: 'zone_report_submitted',
  LANGUAGE_CHANGED: 'language_changed',
  ROUTE_REQUESTED: 'route_requested',
  ACCESSIBILITY_MODE_TOGGLED: 'accessibility_mode_toggled',
  STAFF_LOGIN: 'staff_login',
  ALERT_ACKNOWLEDGED: 'alert_acknowledged',
  CONCIERGE_RESPONSE_RECEIVED: 'concierge_response_received',
} as const;

/**
 * Firestore collection name strings.
 * All Firestore queries must use these constants — never inline strings.
 * @returns {Record<string, string>} Map of collection key to Firestore path
 */
export const COLLECTIONS = {
  USERS: 'users',
  ZONE_REPORTS: 'zoneReports',
  CHAT_SESSIONS: 'chatSessions',
} as const;

/**
 * Predefined stadium zone identifiers for zone reports.
 * @returns {Record<string, string>} Map of zone key to zone slug
 */
export const ZONES = {
  NORTH_GATE: 'north-gate',
  SOUTH_GATE: 'south-gate',
  EAST_CONCOURSE: 'east-concourse',
  WEST_CONCOURSE: 'west-concourse',
  VIP_LOUNGE: 'vip-lounge',
  FAN_ZONE: 'fan-zone',
} as const;

/**
 * In-memory rate limiting configuration.
 * WINDOW_MS: sliding window duration in milliseconds (60 s).
 * MAX_REQUESTS: max requests per window per IP.
 * RETRY_AFTER_SECONDS: value sent in the Retry-After response header.
 */
export const RATE_LIMIT = {
  WINDOW_MS: 60000,
  MAX_REQUESTS: 20,
  RETRY_AFTER_SECONDS: 60,
} as const;

/**
 * Supported languages for the AI Concierge.
 * @returns {Record<string, string>} Map of language key to display name
 */
export const LANGUAGES = {
  ENGLISH: 'English',
  SPANISH: 'Spanish',
  FRENCH: 'French',
  PORTUGUESE: 'Portuguese',
} as const;

/**
 * Crowd level values for zone reports.
 * @returns {Record<string, string>} Map of level key to level value
 */
export const CROWD_LEVELS = {
  LOW: 'low',
  MEDIUM: 'medium',
  HIGH: 'high',
  CRITICAL: 'critical',
} as const;

/**
 * Cookie key used to persist accessibility mode preference.
 */
export const ACCESSIBILITY_COOKIE_KEY = 'fancompass_accessibility_mode';

/**
 * Placeholder staff identifier used when auth UID is unavailable.
 */
export const STAFF_PLACEHOLDER = 'staff-placeholder';
