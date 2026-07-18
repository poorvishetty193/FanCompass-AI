import React from 'react';
import type { ZoneReport } from '@/types';

interface RecentReportsTableProps {
  reports: ZoneReport[];
  isLoading: boolean;
  error: string | null;
}

/**
 * Presentational component displaying recent reports.
 * Wrapped in React.memo to prevent unnecessary re-renders.
 */
export const RecentReportsTable = React.memo(function RecentReportsTable({
  reports, isLoading, error
}: RecentReportsTableProps) {
  return (
    <div className="bg-gray-900 rounded-lg shadow overflow-hidden border border-gray-800">
      <div className="px-6 py-4 border-b border-gray-800">
        <h2 className="text-xl font-semibold">Live Reports Feed</h2>
      </div>
      
      {error && (
        <div className="p-4 m-4 bg-red-900/50 border border-red-500 text-red-200 rounded-md">
          {error}
        </div>
      )}

      {isLoading ? (
        <div className="p-8 text-center text-gray-400">Loading live reports...</div>
      ) : reports.length === 0 ? (
        <div className="p-8 text-center text-gray-400">No recent reports.</div>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full whitespace-nowrap">
            <thead className="bg-gray-800">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Time</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Zone</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Crowd</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Incident</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Details</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-800 bg-gray-900">
              {reports.map((report) => (
                <tr key={report.id} className="hover:bg-gray-800/50 transition-colors">
                  <td className="px-6 py-4 text-sm text-gray-300">
                    {new Date(report.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </td>
                  <td className="px-6 py-4 text-sm font-medium text-white">
                    {report.zoneId}
                  </td>
                  <td className="px-6 py-4 text-sm">
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                      report.crowdLevel === 'critical' ? 'bg-red-900/50 text-red-400 border border-red-800' :
                      report.crowdLevel === 'high' ? 'bg-orange-900/50 text-orange-400 border border-orange-800' :
                      report.crowdLevel === 'medium' ? 'bg-yellow-900/50 text-yellow-400 border border-yellow-800' :
                      'bg-green-900/50 text-green-400 border border-green-800'
                    }`}>
                      {report.crowdLevel}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-300">
                    {report.incidentType || '-'}
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-400 whitespace-normal">
                    {report.message}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
});
