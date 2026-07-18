import { createZoneReport, getRecentZoneReports } from '@/lib/firebase/repositories';
import type { ZoneReportInput, ZoneReportResult, ZoneReport } from '@/types';
import { sanitizeInput } from '@/lib/sanitize';

/**
 * Service for handling zone report business logic.
 */
export const ZoneReportService = {
  /**
   * Sanitizes input and delegates to the repository layer.
   * @param {ZoneReportInput} report - The unvalidated report input
   * @returns {Promise<ZoneReportResult>} Result of the creation attempt
   */
  async submitReport(report: ZoneReportInput): Promise<ZoneReportResult> {
    const sanitizedReport: ZoneReportInput = {
      ...report,
      message: sanitizeInput(report.message),
      incidentType: report.incidentType ? sanitizeInput(report.incidentType) : undefined,
    };
    
    return await createZoneReport(sanitizedReport);
  },

  /**
   * Fetches recent reports via the repository layer.
   * @param {string} [zoneId] - Optional zone filter
   * @returns {Promise<ZoneReport[]>} List of fetched reports
   */
  async getRecentReports(zoneId?: string): Promise<ZoneReport[]> {
    return await getRecentZoneReports(zoneId);
  }
};
