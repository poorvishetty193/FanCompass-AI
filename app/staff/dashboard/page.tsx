'use client';

import { useState, useEffect } from 'react';
import { signInWithPopup, GoogleAuthProvider, onAuthStateChanged, User } from 'firebase/auth';
import { auth } from '@/lib/firebase/client';
import Navigation from '@/components/Navigation';
import { useZoneReports } from '@/hooks/useZoneReports';
import { ZONES, ERROR_MESSAGES } from '@/lib/constants';
import { toErrorMessage } from '@/lib/errors';
import { SubmitReportForm } from '@/components/dashboard/SubmitReportForm';
import { RecentReportsTable } from '@/components/dashboard/RecentReportsTable';

type CrowdLevel = 'low' | 'medium' | 'high' | 'critical';

export default function DashboardPage() {
  const [user, setUser] = useState<User | null>(null);
  const [isAuthLoading, setIsAuthLoading] = useState(true);

  const { reports, isLoading: reportsLoading, error: reportsError } = useZoneReports();
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
      setIsAuthLoading(false);
    }
    return () => {
      if (unsubscribe) unsubscribe();
    };
  }, []);

  const handleLogin = async () => {
    try {
      const provider = new GoogleAuthProvider();
      await signInWithPopup(auth, provider);
    } catch (err: unknown) {
      console.error('Login error:', toErrorMessage(err));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
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
  };

  if (isAuthLoading) {
    return <div className="flex min-h-[100dvh] items-center justify-center"><div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div></div>;
  }

  if (!user) {
    return (
      <>
        <Navigation />
        <div className="flex flex-col items-center justify-center min-h-[100dvh] bg-black p-4">
          <h1 className="text-2xl font-bold mb-4">Staff Login</h1>
          <button 
            onClick={handleLogin}
            className="min-h-[44px] min-w-[44px] px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
          >
            Sign in with Google
          </button>
        </div>
      </>
    );
  }

  return (
    <>
      <Navigation />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 min-h-[100dvh]">
        <h1 className="text-2xl font-bold mb-6">Staff Dashboard</h1>
        
        <SubmitReportForm
          zoneId={zoneId} setZoneId={setZoneId}
          crowdLevel={crowdLevel} setCrowdLevel={setCrowdLevel}
          incidentType={incidentType} setIncidentType={setIncidentType}
          message={message} setMessage={setMessage}
          submitError={submitError} isSubmitting={isSubmitting}
          handleSubmit={handleSubmit}
        />

        <RecentReportsTable 
          reports={reports} 
          isLoading={reportsLoading} 
          error={reportsError} 
        />
      </div>
    </>
  );
}
