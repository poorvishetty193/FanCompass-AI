import { useState, useCallback } from 'react';
import { toErrorMessage } from '@/lib/errors';
import { ERROR_MESSAGES, API_ENDPOINTS, ANALYTICS_EVENTS } from '@/lib/constants';
import { trackEvent } from '@/lib/analytics';
import type { ChatMessageInput } from '@/types';
import { useAccessibilityMode } from './useAccessibilityMode';

export interface ChatMessage extends ChatMessageInput {
  id: string;
}

export function useConcierge() {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [language, setLanguage] = useState('English');
  const { isAccessibilityMode } = useAccessibilityMode();

  const handleLanguageChange = (newLanguage: string) => {
    setLanguage(newLanguage);
    trackEvent(ANALYTICS_EVENTS.LANGUAGE_CHANGED, { language: newLanguage });
  };

  const sendMessage = useCallback(async (content: string) => {
    if (!content.trim()) return;
    
    setError(null);
    setIsLoading(true);
    
    const userMessage: ChatMessage = { id: Date.now().toString(), role: 'user', content };
    setMessages((prev) => [...prev, userMessage]);
    trackEvent(ANALYTICS_EVENTS.CHAT_MESSAGE_SENT, { language, accessibility: isAccessibilityMode });

    try {
      const response = await fetch(API_ENDPOINTS.CHAT, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          messages: [...messages, userMessage].map(m => ({ role: m.role, content: m.content })),
          language,
          isAccessibilityMode
        })
      });

      if (!response.ok) {
        if (response.status === 429) {
          throw new Error(ERROR_MESSAGES.RATE_LIMITED);
        }
        throw new Error(ERROR_MESSAGES.GENERIC_FAILURE);
      }

      const data = await response.json();
      
      const assistantMessage: ChatMessage = { id: (Date.now() + 1).toString(), role: 'assistant', content: data.content };
      setMessages((prev) => [...prev, assistantMessage]);
      trackEvent(ANALYTICS_EVENTS.CONCIERGE_RESPONSE_RECEIVED);
      
    } catch (err: unknown) {
      setError(toErrorMessage(err));
    } finally {
      setIsLoading(false);
    }
  }, [messages, language, isAccessibilityMode]);

  return { messages, isLoading, error, language, handleLanguageChange, sendMessage };
}
