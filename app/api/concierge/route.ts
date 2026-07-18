import { rateLimit } from '@/lib/rate-limit';
import { sanitizeInput } from '@/lib/sanitize';
import { getRecentZoneReports } from '@/lib/firebase/repositories';
import { toErrorMessage } from '@/lib/errors';
import { ERROR_MESSAGES } from '@/lib/constants';
import { generateText } from 'ai';
import { google } from '@ai-sdk/google';

export async function POST(req: Request): Promise<Response> {
  const ip = req.headers.get('x-forwarded-for') || '127.0.0.1';
  const { success, limit, remaining, reset } = rateLimit(ip);

  if (!success) {
    return new Response(JSON.stringify({ error: ERROR_MESSAGES.RATE_LIMITED }), {
      status: 429,
      headers: {
        'Content-Type': 'application/json',
        'X-RateLimit-Limit': limit.toString(),
        'X-RateLimit-Remaining': remaining.toString(),
        'Retry-After': Math.ceil((reset - Date.now()) / 1000).toString(),
      },
    });
  }

  try {
    const body = await req.json();
    const { messages, language, isAccessibilityMode } = body;
    
    if (!messages || !Array.isArray(messages) || messages.length === 0) {
      return new Response(JSON.stringify({ error: 'Messages are required' }), { status: 400 });
    }

    const lastMessage = messages[messages.length - 1];
    if (lastMessage.role === 'user') {
      lastMessage.content = sanitizeInput(lastMessage.content);
    }

    const reports = await getRecentZoneReports();
    const reportSummary = reports.length > 0 
      ? reports.map(r => `${r.zoneId}: ${r.crowdLevel} crowd. ${r.incidentType ? 'Incident: ' + r.incidentType : ''}`).join(' | ')
      : 'No current crowd reports.';

    const systemPrompt = `
      You are the FanCompass AI Concierge for the FIFA World Cup 2026.
      You must respond in ${language || 'English'}.
      ${isAccessibilityMode ? 'The user has Accessibility Mode enabled. You MUST prioritize step-free/wheelchair-accessible routes and note nearest accessible transport/drop-off points.' : ''}
      
      LIVE OPERATIONAL INTELLIGENCE:
      Here is the current real-time crowd and incident report from stadium staff:
      ${reportSummary}
      
      Incorporate this live data into your navigational advice naturally. If a user asks about a zone that is "high" or "critical" crowd level, warn them and suggest alternatives if possible.
    `;

    const { text } = await generateText({
      model: google('gemini-1.5-flash'),
      system: systemPrompt,
      messages: messages.map(m => ({
        role: m.role as 'user' | 'assistant',
        content: m.content
      }))
    });

    return new Response(JSON.stringify({ content: text }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (error: unknown) {
    console.error('Concierge Error:', toErrorMessage(error));
    return new Response(JSON.stringify({ error: ERROR_MESSAGES.GENERIC_FAILURE }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
}
