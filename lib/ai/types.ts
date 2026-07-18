import type { LanguageModel } from 'ai';

export interface AIProvider {
  /**
   * Returns the underlying Vercel AI SDK LanguageModel instance.
   * @returns {LanguageModel} The configured model instance
   */
  getModel(): LanguageModel;
}
