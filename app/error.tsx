'use client';

import { useEffect } from 'react';
import { toErrorMessage } from '@/lib/errors';
import { ERROR_MESSAGES } from '@/lib/constants';

export default function ErrorBoundary({
  error,
  reset,
}: {
  error: Error;
  reset: () => void;
}) {
  useEffect(() => {
    console.error(toErrorMessage(error));
  }, [error]);

  return (
    <div className="flex flex-col items-center justify-center min-h-[100dvh] p-4 text-center">
      <h2 className="text-xl font-bold mb-4">{ERROR_MESSAGES.GENERIC_FAILURE}</h2>
      <button
        onClick={() => reset()}
        className="min-h-[44px] min-w-[44px] px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
      >
        Try again
      </button>
    </div>
  );
}
