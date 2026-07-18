import { useState, useEffect } from 'react';
import { subscribeToZoneReports } from '@/lib/firebase/repositories';
import type { ZoneReport } from '@/types';
import { toErrorMessage } from '@/lib/errors';
import { ERROR_MESSAGES } from '@/lib/constants';

export function useZoneReports(zoneId?: string) {
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
