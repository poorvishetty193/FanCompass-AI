export const ROUTES = {
  HOME: '/',
  STAFF_LOGIN: '/staff/login',
  STAFF_DASHBOARD: '/staff/dashboard',
} as const;

export const API_ENDPOINTS = {
  CHAT: '/api/chat',
  ZONE_REPORTS: '/api/zone-reports',
} as const;

export const ERROR_MESSAGES = {
  UNKNOWN_ERROR: 'An unknown error occurred.',
  GENERIC_FAILURE: 'Something went wrong. Please try again.',
  RATE_LIMITED: 'You are sending messages too quickly. Please wait a moment.',
  AUTH_REQUIRED: 'Authentication required to perform this action.',
} as const;

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

export const COLLECTIONS = {
  USERS: 'users',
  ZONE_REPORTS: 'zoneReports',
  CHAT_SESSIONS: 'chatSessions',
} as const;

export const ZONES = {
  NORTH_GATE: 'north-gate',
  SOUTH_GATE: 'south-gate',
  EAST_CONCOURSE: 'east-concourse',
  WEST_CONCOURSE: 'west-concourse',
  VIP_LOUNGE: 'vip-lounge',
  FAN_ZONE: 'fan-zone',
} as const;

export const RATE_LIMIT = {
  WINDOW_MS: 60000,
  MAX_REQUESTS: 20,
  RETRY_AFTER_SECONDS: 60,
} as const;
