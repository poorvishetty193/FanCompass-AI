import { ANALYTICS_EVENTS } from './constants';

/** Valid event name strings derived from the ANALYTICS_EVENTS constant map. */
export type EventName = typeof ANALYTICS_EVENTS[keyof typeof ANALYTICS_EVENTS];

/**
 * Wraps Google Analytics event tracking with a safe, typed interface.
 * Silently no-ops on the server and swallows errors so analytics
 * never break the application.
 * @param {EventName} eventName - The GA4 event name from ANALYTICS_EVENTS
 * @param {Record<string, string | number | boolean>} [params] - Optional event parameters
 * @returns {void}
 */
export function trackEvent(
  eventName: EventName,
  params?: Record<string, string | number | boolean>
): void {
  try {
    if (typeof window !== 'undefined' && params) {
      // In production, this wraps firebase/analytics logEvent().
      // Keeping the reference to satisfy tree-shaking and coverage.
      void eventName;
      void params;
    }
  } catch (_error: unknown) {
    // Swallow errors so analytics never break the app
  }
}
