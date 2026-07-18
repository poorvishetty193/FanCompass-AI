import { ANALYTICS_EVENTS } from './constants';

export type EventName = typeof ANALYTICS_EVENTS[keyof typeof ANALYTICS_EVENTS];

/**
 * Wraps analytics event tracking.
 * @param {EventName} eventName The name of the event from constants
 * @param {Record<string, unknown>} [params] Optional parameters
 */
// eslint-disable-next-line @typescript-eslint/no-unused-vars
export function trackEvent(eventName: EventName, params?: Record<string, unknown>): void {
  try {
    if (typeof window !== 'undefined') {
      // Stub implementation. In a real app, this wraps firebase/analytics logEvent
      // To satisfy test constraints and clean code, we don't console.log directly.
    }
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  } catch (error: unknown) {
    // Swallow errors so analytics never break the app
  }
}
