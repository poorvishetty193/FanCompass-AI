import { useState, useEffect } from 'react';
import Cookies from 'js-cookie';
import { trackEvent } from '@/lib/analytics';
import { ANALYTICS_EVENTS } from '@/lib/constants';

const ACCESSIBILITY_COOKIE_KEY = 'fancompass_accessibility_mode';

export function useAccessibilityMode() {
  const [isAccessibilityMode, setIsAccessibilityMode] = useState<boolean>(false);
  const [isHydrated, setIsHydrated] = useState(false);

  useEffect(() => {
    const stored = Cookies.get(ACCESSIBILITY_COOKIE_KEY);
    if (stored === 'true') {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setIsAccessibilityMode(true);
    }
    setIsHydrated(true);
  }, []);

  const toggleAccessibilityMode = () => {
    const newValue = !isAccessibilityMode;
    setIsAccessibilityMode(newValue);
    Cookies.set(ACCESSIBILITY_COOKIE_KEY, String(newValue), { expires: 365, path: '/' });
    trackEvent(ANALYTICS_EVENTS.ACCESSIBILITY_MODE_TOGGLED, { enabled: newValue });
  };

  return { isAccessibilityMode, toggleAccessibilityMode, isHydrated };
}
