import { renderHook } from '@testing-library/react';
import { useZoneReports } from '@/features/reports/hooks/useZoneReports';
import { subscribeToZoneReports } from '@/lib/firebase/repositories';

jest.mock('@/lib/firebase/repositories', () => ({
  subscribeToZoneReports: jest.fn()
}));

describe('useZoneReports', () => {
  it('subscribes and cleans up on unmount', () => {
    const unsubscribeMock = jest.fn();
    (subscribeToZoneReports as jest.Mock).mockReturnValue(unsubscribeMock);

    const { unmount } = renderHook(() => useZoneReports());

    expect(subscribeToZoneReports).toHaveBeenCalled();
    unmount();
    expect(unsubscribeMock).toHaveBeenCalled();
  });
});
