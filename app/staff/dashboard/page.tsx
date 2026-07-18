'use client';

import { Navigation } from '@/features/navigation/components/Navigation';
import { SubmitReportForm } from '@/features/dashboard/components/SubmitReportForm';
import { RecentReportsTable } from '@/features/dashboard/components/RecentReportsTable';
import { useStaffDashboard } from '@/features/dashboard/hooks/useStaffDashboard';
import { useZoneReports } from '@/features/reports/hooks/useZoneReports';

/**
 * Pure orchestration container for the Staff Dashboard.
 * Delegates all state management to hooks and UI rendering to presentational components.
 */
export default function DashboardContainer() {
  const {
    user, isAuthLoading,
    zoneId, setZoneId,
    crowdLevel, setCrowdLevel,
    incidentType, setIncidentType,
    message, setMessage,
    isSubmitting, submitError,
    handleLogin, handleSubmit
  } = useStaffDashboard();

  const { reports, isLoading: reportsLoading, error: reportsError } = useZoneReports();

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
