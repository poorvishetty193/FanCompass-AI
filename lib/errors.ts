export function toErrorMessage(error: unknown): string {
  if (error instanceof Error) return error.message;
  if (typeof error === 'string') return error;
  return 'An unknown error occurred.'; // We will update this after creating constants.ts
}

export function isError(error: unknown): error is Error {
  return error instanceof Error;
}

export function toError(error: unknown): Error {
  if (isError(error)) return error;
  if (typeof error === 'string') return new Error(error);
  return new Error('An unknown error occurred.');
}
