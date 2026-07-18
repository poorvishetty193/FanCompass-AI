import { renderHook, act } from '@testing-library/react';
import { useConcierge } from '../useConcierge';

global.fetch = jest.fn();

jest.mock('../useAccessibilityMode', () => ({
  useAccessibilityMode: () => ({ isAccessibilityMode: false })
}));

describe('useConcierge', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('handles successful message sending', async () => {
    (global.fetch as jest.Mock).mockResolvedValueOnce({
      ok: true,
      json: async () => ({ content: 'AI reply' })
    });

    const { result } = renderHook(() => useConcierge());

    expect(result.current.messages).toHaveLength(0);

    await act(async () => {
      await result.current.sendMessage('Hello');
    });

    expect(result.current.messages).toHaveLength(2);
    expect(result.current.messages[0].role).toBe('user');
    expect(result.current.messages[1].role).toBe('assistant');
    expect(result.current.messages[1].content).toBe('AI reply');
  });

  it('handles API errors', async () => {
    (global.fetch as jest.Mock).mockResolvedValueOnce({
      ok: false,
      status: 429
    });

    const { result } = renderHook(() => useConcierge());

    await act(async () => {
      await result.current.sendMessage('Hello');
    });

    expect(result.current.error).toContain('too quickly');
    expect(result.current.isLoading).toBe(false);
  });
});
