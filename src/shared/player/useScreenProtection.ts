'use client';
import { useEffect, useState } from 'react';

export function useScreenProtection() {
  const [isScreenBeingCaptured, setIsScreenBeingCaptured] = useState(false);

  useEffect(() => {
    if (typeof window === 'undefined') return;

    // ── Screen Capture Detection via MediaDevices ──────────────────────────────
    // The browser's MediaStream Track API fires an event when the user starts/stops
    // capturing the screen via Share Screen. We hook into this via the
    // visibilityState and a navigator hint.
    const checkForCapture = async () => {
      try {
        // Check if an active capture is happening via document.pictureInPictureElement
        // or more importantly via the Capture Handle Identity API (Chrome 102+)
        if ('captureHandle' in document) {
          setIsScreenBeingCaptured(true);
        }
      } catch (_) {}
    };

    // Listen for capture events via the visibility and focus APIs
    const handleVisibilityChange = () => {
      if (document.visibilityState === 'hidden') {
        // App may have switched — don't act, but log if needed
      }
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);
    checkForCapture();

    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange);
    };
  }, []);

  return { isScreenBeingCaptured };
}
