import type { AIProvider } from './types';
import { GeminiProvider } from './gemini';

/**
 * Factory for getting the active AI provider instance.
 * Allows easy swapping of models or providers (e.g., to Claude) in the future.
 * @returns {AIProvider} The active AI provider
 */
export function getAIProvider(): AIProvider {
  // Dependency injection point. Can be configured via env variables later.
  return new GeminiProvider();
}
