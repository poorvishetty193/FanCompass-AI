import type { ZoneReport } from '@/types';

/**
 * Summarizes an array of zone reports into a readable string for the AI prompt.
 * @param {ZoneReport[]} reports - Array of zone reports to summarize
 * @returns {string} Formatted summary of current crowd levels and incidents
 */
export function generateReportSummary(reports: ZoneReport[]): string {
  if (reports.length === 0) {
    return 'No current crowd reports.';
  }

  return reports
    .map((r) => {
      let text = `${r.zoneId}: ${r.crowdLevel} crowd.`;
      if (r.incidentType) {
        text += ` Incident: ${r.incidentType}`;
      }
      return text;
    })
    .join(' | ');
}
