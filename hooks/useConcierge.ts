import { useState, useCallback } from 'react';
import { toErrorMessage } from '@/lib/errors';
import { ERROR_MESSAGES, API_ENDPOINTS, ANALYTICS_EVENTS, LANGUAGES } from '@/lib/constants';
import { trackEvent } from '@/lib/analytics';
import type { ChatMessageInput } from '@/types';
import { useAccessibilityMode } from './useAccessibilityMode';

/** A chat message with a client-generated unique ID for React keys. */
export interface ChatMessage extends ChatMessageInput {
  id: string;
}

/** Return type of the useConcierge hook. */
export interface UseConciergeReturn {
  /** Ordered array of user and assistant messages in the conversation. */
  messages: ChatMessage[];
  /** True while waiting for the AI concierge response. */
  isLoading: boolean;
  /** Non-null error message string when the last request failed. */
  error: string | null;
  /** Currently selected language for the concierge responses. */
  language: string;
  /** Callback to change the concierge language. */
  handleLanguageChange: (newLanguage: string) => void;
  /** Sends a user message to the concierge API and appends the response. */
  sendMessage: (content: string) => Promise<void>;
}

/**
 * Manages the full state of the AI Concierge chat: messages, loading,
 * errors, language selection, and accessibility mode integration.
 * @returns {UseConciergeReturn} Chat state and action handlers
 */
export function useConcierge(): UseConciergeReturn {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [language, setLanguage] = useState(LANGUAGES.ENGLISH);
  const { isAccessibilityMode } = useAccessibilityMode();

  const handleLanguageChange = (newLanguage: string): void => {
    setLanguage(newLanguage);
    trackEvent(ANALYTICS_EVENTS.LANGUAGE_CHANGED, { language: newLanguage });
  };

  const sendMessage = useCallback(async (content: string): Promise<void> => {
    if (!content.trim()) return;

    setError(null);
    setIsLoading(true);

    const userMessage: ChatMessage = { id: Date.now().toString(), role: 'user', content };
    setMessages((prev) => [...prev, userMessage]);
    trackEvent(ANALYTICS_EVENTS.CHAT_MESSAGE_SENT, { language, accessibility: isAccessibilityMode });

    try {
      const response = await fetch(API_ENDPOINTS.CONCIERGE, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          messages: [...messages, userMessage].map((m) => ({ role: m.role, content: m.content })),
          language,
          isAccessibilityMode,
        }),
      });

      if (!response.ok) {
        if (response.status === 429) {
          throw new Error(ERROR_MESSAGES.RATE_LIMITED);
        }
        throw new Error(ERROR_MESSAGES.GENERIC_FAILURE);
      }

      const data: { content: string } = await response.json();

      const assistantMessage: ChatMessage = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: data.content,
      };
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
