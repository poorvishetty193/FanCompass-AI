import { google } from '@ai-sdk/google';
import type { AIProvider } from './types';
import type { LanguageModel } from 'ai';

export class GeminiProvider implements AIProvider {
  private modelName: string;

  /**
   * Constructs the Gemini AI Provider.
   * @param {string} [modelName='gemini-1.5-flash'] - The specific Gemini model version
   */
  constructor(modelName = 'gemini-1.5-flash') {
    this.modelName = modelName;
  }

  /**
   * Gets the configured Google Gemini model instance.
   * @returns {LanguageModel} The Vercel AI SDK model
   */
  getModel(): LanguageModel {
    return google(this.modelName);
  }
}
