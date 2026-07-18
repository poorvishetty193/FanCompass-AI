export type ZoneReportResult =
  | { success: true; reportId: string }
  | { success: false; error: string };

export interface ZoneReportInput {
  zoneId: string;
  crowdLevel: 'low' | 'medium' | 'high' | 'critical';
  incidentType?: string;
  message: string;
}

export interface ZoneReport extends ZoneReportInput {
  id: string;
  createdAt: number;
  reportedBy: string;
}

export interface ChatMessageInput {
  role: 'user' | 'assistant' | 'system';
  content: string;
}

export interface ChatSession {
  id: string;
  userId?: string;
  createdAt: number;
  updatedAt: number;
}
