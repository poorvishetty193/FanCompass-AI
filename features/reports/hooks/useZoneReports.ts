import { useState, useEffect } from 'react';
import { subscribeToZoneReports } from '@/lib/firebase/repositories';
import type { ZoneReport } from '@/types';
import { toErrorMessage } from '@/lib/errors';
import { ERROR_MESSAGES } from '@/lib/constants';

/** Return type of the useZoneReports hook. */
export interface UseZoneReportsReturn {
  /** Array of the most recent zone reports from Firestore. */
  reports: ZoneReport[];
  /** True until the first snapshot arrives from Firestore. */
  isLoading: boolean;
  /** Non-null error message if the subscription failed. */
  error: string | null;
}

/**
 * Subscribes to real-time zone reports from Firestore and manages
 * loading/error state. Automatically cleans up the snapshot listener on unmount.
 * @param {string} [zoneId] - Optional zone ID to filter reports
 * @returns {UseZoneReportsReturn} Live reports array with loading and error state
 */
export function useZoneReports(zoneId?: string): UseZoneReportsReturn {
  const [reports, setReports] = useState<ZoneReport[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let unsubscribe: (() => void) | undefined;
    try {
      unsubscribe = subscribeToZoneReports((newReports) => {
        setReports(newReports);
        setIsLoading(false);
      }, zoneId);
    } catch (err: unknown) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setError(toErrorMessage(err) || ERROR_MESSAGES.GENERIC_FAILURE);
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setIsLoading(false);
    }
    return () => {
      if (unsubscribe) {
        unsubscribe();
      }
    };
  }, [zoneId]);

  return { reports, isLoading, error };
}
