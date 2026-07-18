import { generateText } from 'ai';
import { getAIProvider } from '@/lib/ai/client';
import { getRecentZoneReports } from '@/lib/firebase/repositories';
import { generateReportSummary } from '@/utils/reportSummary';
import { formatConciergePrompt } from '@/utils/promptFormatter';
import { sanitizeInput } from '@/lib/sanitize';
import type { ChatMessageInput } from '@/types';

export interface ConciergeServicePayload {
  messages: ChatMessageInput[];
  language?: string;
  isAccessibilityMode?: boolean;
}

/**
 * Service orchestrating the AI Concierge logic.
 * Fetches reports, formats prompts, sanitizes user input, and calls the AI provider.
 * @param {ConciergeServicePayload} payload - The validated request payload
 * @returns {Promise<string>} The AI's generated response text
 */
export async function generateConciergeResponse(payload: ConciergeServicePayload): Promise<string> {
  const { messages, language = 'English', isAccessibilityMode = false } = payload;

  // Sanitize the most recent user message
  const lastMessage = messages[messages.length - 1];
  if (lastMessage.role === 'user') {
    lastMessage.content = sanitizeInput(lastMessage.content);
  }

  // Fetch operational context
  const reports = await getRecentZoneReports();
  const reportSummary = generateReportSummary(reports);

  // Format the system prompt
  const systemPrompt = formatConciergePrompt(language, isAccessibilityMode, reportSummary);

  // Invoke AI provider
  const provider = getAIProvider();
  
  const { text } = await generateText({
    model: provider.getModel(),
    system: systemPrompt,
    messages: messages.map(m => ({
      role: m.role as 'user' | 'assistant',
      content: m.content,
    })),
  });

  return text;
}
