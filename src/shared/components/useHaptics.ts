// hooks/useHaptics.ts – vibration feedback via Vibration API
'use client';
import { useCallback } from 'react';

const PATTERNS = {
  LIGHT:        [30],
  MEDIUM:       [60],
  HEAVY:        [100],
  DOUBLE:       [40, 60, 40],
  REVEAL:       [50, 40, 80, 40, 120],
  FINAL_REVEAL: [80, 60, 150, 60, 200],
  TIE_RAKHI:    [30, 20, 30, 20, 50, 20, 100],
} as const;

type HapticEvent = keyof typeof PATTERNS;

export function useHaptics() {
  const vibrate = useCallback((event: HapticEvent = 'LIGHT') => {
    if (typeof navigator !== 'undefined' && navigator.vibrate) {
      navigator.vibrate(PATTERNS[event]);
    }
  }, []);
  return { vibrate };
}
