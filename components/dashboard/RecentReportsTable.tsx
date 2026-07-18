import type { ZoneReport } from '@/types';

interface RecentReportsTableProps {
  reports: ZoneReport[];
  isLoading: boolean;
  error: string | null;
}

export function RecentReportsTable({ reports, isLoading, error }: RecentReportsTableProps) {
  const getCrowdBadge = (level: string) => {
    switch (level) {
      case 'low': return 'bg-green-100 text-green-800';
      case 'medium': return 'bg-yellow-100 text-yellow-800';
      case 'high': return 'bg-orange-100 text-orange-800';
      case 'critical': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-800 text-gray-300';
    }
  };

  return (
    <div className="bg-gray-900 shadow rounded-lg p-6 border border-gray-800">
      <h2 className="text-lg font-medium mb-4">Recent Reports</h2>
      <div className="overflow-x-auto" aria-live="polite">
        {isLoading ? (
          <div>Loading reports...</div>
        ) : error ? (
          <div className="text-red-600">{error}</div>
        ) : reports.length === 0 ? (
          <div className="text-gray-400">No reports found.</div>
        ) : (
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-800">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Time</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Zone</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Crowd</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Message</th>
              </tr>
            </thead>
            <tbody className="bg-gray-900 divide-y divide-gray-800">
              {reports.map(report => (
                <tr key={report.id}>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-400">
                    {new Date(report.createdAt).toLocaleTimeString()}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-100">
                    {report.zoneId}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getCrowdBadge(report.crowdLevel)}`}>
                      {report.crowdLevel}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-400">
                    {report.incidentType && <span className="font-bold mr-1">{report.incidentType}:</span>}
                    {report.message}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}
