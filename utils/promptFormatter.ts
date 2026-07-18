/**
 * Formats the system prompt for the AI Concierge, injecting live data.
 * @param {string} language - The requested output language
 * @param {boolean} isAccessibilityMode - Whether accessibility mode is enabled
 * @param {string} reportSummary - The summarized string of live zone reports
 * @returns {string} The fully formatted system prompt
 */
export function formatConciergePrompt(
  language: string,
  isAccessibilityMode: boolean,
  reportSummary: string
): string {
  const basePrompt = `You are the FanCompass AI Concierge for the FIFA World Cup 2026.
You must respond in ${language || 'English'}.`;

  const accessibilityPrompt = isAccessibilityMode
    ? '\nThe user has Accessibility Mode enabled. You MUST prioritize step-free/wheelchair-accessible routes and note nearest accessible transport/drop-off points.'
    : '';

  const operationalPrompt = `
LIVE OPERATIONAL INTELLIGENCE:
Here is the current real-time crowd and incident report from stadium staff:
${reportSummary}

Incorporate this live data into your navigational advice naturally. If a user asks about a zone that is "high" or "critical" crowd level, warn them and suggest alternatives if possible.`;

  return `${basePrompt}${accessibilityPrompt}\n${operationalPrompt}`;
}
