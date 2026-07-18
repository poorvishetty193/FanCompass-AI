import { ERROR_MESSAGES } from './constants';

/**
 * Extracts a human-readable message from an unknown caught value.
 * @param {unknown} error - The caught value from a catch block (Error, string, or anything)
 * @returns {string} A safe, displayable error message string
 */
export function toErrorMessage(error: unknown): string {
  if (error instanceof Error) return error.message;
  if (typeof error === 'string') return error;
  return ERROR_MESSAGES.UNKNOWN_ERROR;
}

/**
 * Type guard that narrows an unknown value to an Error instance.
 * @param {unknown} error - The value to check
 * @returns {boolean} True if the value is an Error instance
 */
export function isError(error: unknown): error is Error {
  return error instanceof Error;
}

/**
 * Converts any caught value into a proper Error instance.
 * @param {unknown} error - The caught value from a catch block
 * @returns {Error} An Error instance wrapping the original value
 */
export function toError(error: unknown): Error {
  if (isError(error)) return error;
  if (typeof error === 'string') return new Error(error);
  return new Error(ERROR_MESSAGES.UNKNOWN_ERROR);
}
