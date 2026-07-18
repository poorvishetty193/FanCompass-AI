import React from 'react';
import { ZONES, CROWD_LEVELS } from '@/lib/constants';
import type { CrowdLevel } from '@/features/dashboard/hooks/useStaffDashboard';

interface SubmitReportFormProps {
  zoneId: string;
  setZoneId: (id: string) => void;
  crowdLevel: CrowdLevel;
  setCrowdLevel: (level: CrowdLevel) => void;
  incidentType: string;
  setIncidentType: (type: string) => void;
  message: string;
  setMessage: (msg: string) => void;
  submitError: string | null;
  isSubmitting: boolean;
  handleSubmit: (e: React.FormEvent) => Promise<void>;
}

/**
 * Presentational component for the report submission form.
 * Wrapped in React.memo to prevent unnecessary re-renders when other dashboard state changes.
 */
export const SubmitReportForm = React.memo(function SubmitReportForm({
  zoneId, setZoneId,
  crowdLevel, setCrowdLevel,
  incidentType, setIncidentType,
  message, setMessage,
  submitError, isSubmitting,
  handleSubmit
}: SubmitReportFormProps) {
  return (
    <div className="bg-gray-900 rounded-lg shadow p-6 mb-8 border border-gray-800">
      <h2 className="text-xl font-semibold mb-4">Submit Zone Report</h2>
      
      {submitError && (
        <div className="mb-4 p-4 bg-red-900/50 border border-red-500 text-red-200 rounded-md">
          {submitError}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label htmlFor="zone" className="block text-sm font-medium mb-1">Zone</label>
            <select
              id="zone"
              value={zoneId}
              onChange={(e) => setZoneId(e.target.value)}
              className="w-full rounded-md bg-gray-800 border-gray-700 text-white min-h-[44px] px-3 focus:ring-blue-500 focus:border-blue-500 text-base"
            >
              {Object.entries(ZONES).map(([key, val]) => (
                <option key={val} value={val}>{key.replace('_', ' ')}</option>
              ))}
            </select>
          </div>
          <div>
            <label htmlFor="crowdLevel" className="block text-sm font-medium mb-1">Crowd Level</label>
            <select
              id="crowdLevel"
              value={crowdLevel}
              onChange={(e) => setCrowdLevel(e.target.value as CrowdLevel)}
              className="w-full rounded-md bg-gray-800 border-gray-700 text-white min-h-[44px] px-3 focus:ring-blue-500 focus:border-blue-500 text-base"
            >
              {Object.entries(CROWD_LEVELS).map(([key, val]) => (
                <option key={val} value={val}>{key}</option>
              ))}
            </select>
          </div>
        </div>

        <div>
          <label htmlFor="incidentType" className="block text-sm font-medium mb-1">Incident Type (Optional)</label>
          <input
            id="incidentType"
            type="text"
            value={incidentType}
            onChange={(e) => setIncidentType(e.target.value)}
            placeholder="e.g., Spill, Broken Gate, Medical"
            className="w-full rounded-md bg-gray-800 border-gray-700 text-white min-h-[44px] px-3 focus:ring-blue-500 focus:border-blue-500 text-base"
          />
        </div>

        <div>
          <label htmlFor="message" className="block text-sm font-medium mb-1">Details</label>
          <textarea
            id="message"
            required
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            rows={3}
            className="w-full rounded-md bg-gray-800 border-gray-700 text-white min-h-[44px] p-3 focus:ring-blue-500 focus:border-blue-500 text-base"
            placeholder="Describe the current situation..."
          />
        </div>

        <button
          type="submit"
          disabled={isSubmitting}
          className="w-full bg-blue-600 text-white rounded-md min-h-[44px] font-medium hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        >
          {isSubmitting ? 'Submitting...' : 'Submit Report'}
        </button>
      </form>
    </div>
  );
});
