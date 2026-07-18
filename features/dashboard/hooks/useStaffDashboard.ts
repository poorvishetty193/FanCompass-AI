import { useState, useEffect, useCallback } from 'react';
import { signInWithPopup, GoogleAuthProvider, onAuthStateChanged, User } from 'firebase/auth';
import { auth } from '@/lib/firebase/client';
import { ZONES, ERROR_MESSAGES } from '@/lib/constants';
import { toErrorMessage } from '@/lib/errors';

export type CrowdLevel = 'low' | 'medium' | 'high' | 'critical';

export interface UseStaffDashboardReturn {
  user: User | null;
  isAuthLoading: boolean;
  zoneId: string;
  setZoneId: (id: string) => void;
  crowdLevel: CrowdLevel;
  setCrowdLevel: (level: CrowdLevel) => void;
  incidentType: string;
  setIncidentType: (type: string) => void;
  message: string;
  setMessage: (msg: string) => void;
  isSubmitting: boolean;
  submitError: string | null;
  handleLogin: () => Promise<void>;
  handleSubmit: (e: React.FormEvent) => Promise<void>;
}

/**
 * Hook containing all business logic, state, and authentication for the Staff Dashboard.
 * @returns {UseStaffDashboardReturn} The dashboard state and callbacks
 */
export function useStaffDashboard(): UseStaffDashboardReturn {
  const [user, setUser] = useState<User | null>(null);
  const [isAuthLoading, setIsAuthLoading] = useState(true);

  const [zoneId, setZoneId] = useState<string>(ZONES.NORTH_GATE);
  const [crowdLevel, setCrowdLevel] = useState<CrowdLevel>('low');
  const [incidentType, setIncidentType] = useState('');
  const [message, setMessage] = useState('');
  
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);

  useEffect(() => {
    let unsubscribe: (() => void) | undefined;
    try {
      unsubscribe = onAuthStateChanged(auth, (currentUser) => {
        setUser(currentUser);
        setIsAuthLoading(false);
      }, (error) => {
        console.error('Auth error:', error);
        setIsAuthLoading(false);
      });
    } catch (err) {
      console.error('Auth initialization error:', err);
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setIsAuthLoading(false);
    }
    return () => {
      if (unsubscribe) unsubscribe();
    };
  }, []);

  const handleLogin = useCallback(async () => {
    try {
      const provider = new GoogleAuthProvider();
      await signInWithPopup(auth, provider);
    } catch (err: unknown) {
      console.error('Login error:', toErrorMessage(err));
    }
  }, []);

  const handleSubmit = useCallback(async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;
    setIsSubmitting(true);
    setSubmitError(null);

    try {
      const token = await user.getIdToken();
      const res = await fetch('/api/zone-reports', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ zoneId, crowdLevel, incidentType, message })
      });

      if (!res.ok) {
        if (res.status === 429) throw new Error(ERROR_MESSAGES.RATE_LIMITED);
        if (res.status === 401) throw new Error(ERROR_MESSAGES.AUTH_REQUIRED);
        throw new Error(ERROR_MESSAGES.GENERIC_FAILURE);
      }

      setMessage('');
      setIncidentType('');
    } catch (err: unknown) {
      setSubmitError(toErrorMessage(err));
    } finally {
      setIsSubmitting(false);
    }
  }, [user, zoneId, crowdLevel, incidentType, message]);

  return {
    user,
    isAuthLoading,
    zoneId,
    setZoneId,
    crowdLevel,
    setCrowdLevel,
    incidentType,
    setIncidentType,
    message,
    setMessage,
    isSubmitting,
    submitError,
    handleLogin,
    handleSubmit
  };
}
