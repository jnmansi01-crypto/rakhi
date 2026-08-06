'use client';
// Template 02 — Scene 1: Welcome (The Scrapbook Album Cover)
// A vintage leather album lying on a rustic wooden desk.

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useHaptics } from '@/shared/components/useHaptics';
import type { Locale } from '@/lib/types';

interface Props {
  senderName: string;
  recipientName: string;
  locale: Locale;
  onComplete: () => void;
}

export function Scene1_Welcome({ senderName, recipientName, locale, onComplete }: Props) {
  const [isOpen, setIsOpen] = useState(false);
  const { vibrate } = useHaptics();

  const handleOpen = () => {
    vibrate();
    setIsOpen(true);
    setTimeout(onComplete, 1200); // Allow time for flip animation
  };

  return (
    <div style={{
      position: 'fixed', inset: 0,
      background: '#1d1412', // Dark mahogany wood desk color
      backgroundImage: 'radial-gradient(circle at center, #2c1b18 0%, #110908 100%)',
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      perspective: 1500,
      overflow: 'hidden',
    }}>
      {/* Table grain overlay */}
      <div style={{
        position: 'absolute', inset: 0,
        opacity: 0.05,
        backgroundImage: 'repeating-linear-gradient(0deg, transparent, transparent 2px, #fff 2px, #fff 4px)',
        pointerEvents: 'none',
      }} />

      {/* Cinematic shadow vignette */}
      <div style={{
        position: 'absolute', inset: 0,
        background: 'radial-gradient(circle at 50% 30%, transparent 30%, rgba(0,0,0,0.8) 100%)',
        pointerEvents: 'none',
      }} />

      <motion.div
        initial={{ y: 50, opacity: 0, rotateX: 20 }}
        animate={isOpen 
          ? { rotateY: -110, x: '-30%', z: -100, opacity: 0.9, filter: 'brightness(0.5)' } 
          : { y: 0, opacity: 1, rotateX: 5 }
        }
        transition={{ duration: 1.2, ease: [0.25, 1, 0.5, 1] }}
        style={{
          width: '88%',
          maxWidth: 360,
          height: 480,
          background: 'linear-gradient(135deg, #422a22 0%, #291812 100%)', // Leather textures
          borderRadius: '8px 24px 24px 8px',
          boxShadow: '0 30px 60px rgba(0,0,0,0.8), inset -4px 0 10px rgba(0,0,0,0.5)',
          borderLeft: '15px solid #1a0f0b', // Thick album spine
          display: 'flex', flexDirection: 'column',
          alignItems: 'center', justifyContent: 'center',
          cursor: 'pointer',
          transformStyle: 'preserve-3d',
          transformOrigin: 'left center',
          padding: 24,
          position: 'relative',
        }}
        onClick={handleOpen}
      >
        {/* Metal corners */}
        <div style={{ position: 'absolute', top: 0, right: 0, width: 24, height: 24, borderTop: '4px solid #b5945b', borderRight: '4px solid #b5945b', borderRadius: '0 24px 0 0' }} />
        <div style={{ position: 'absolute', bottom: 0, right: 0, width: 24, height: 24, borderBottom: '4px solid #b5945b', borderRight: '4px solid #b5945b', borderRadius: '0 0 24px 0' }} />

        {/* Paper title label taped in center */}
        <div style={{
          background: '#fcf8ee',
          border: '1px solid #d4c8af',
          borderRadius: 4,
          padding: '24px 20px',
          width: '85%',
          textAlign: 'center',
          boxShadow: '0 4px 15px rgba(0,0,0,0.2)',
          display: 'flex', flexDirection: 'column', gap: 12,
          transform: 'rotate(-2deg)',
        }}>
          {/* Decorative masking tape pieces */}
          <div style={{ position: 'absolute', top: -14, left: '30%', width: 50, height: 18, background: 'rgba(235,224,196,0.6)', transform: 'rotate(-5deg)', border: '1px dashed rgba(0,0,0,0.08)' }} />
          <div style={{ position: 'absolute', bottom: -14, right: '25%', width: 55, height: 18, background: 'rgba(235,224,196,0.6)', transform: 'rotate(3deg)', border: '1px dashed rgba(0,0,0,0.08)' }} />

          <p style={{
            fontFamily: 'monospace',
            fontSize: '0.72rem',
            color: 'rgba(0,0,0,0.4)',
            letterSpacing: '0.15em',
            textTransform: 'uppercase',
            margin: 0,
          }}>
            {locale === 'hi' ? 'स्मृति मंजूषा' : 'MEMORIES INKED'}
          </p>

          <h1 style={{
            fontFamily: 'Georgia, serif',
            fontSize: '1.6rem',
            fontWeight: 400,
            color: '#3d2b1f',
            margin: 0,
            lineHeight: 1.3,
            fontStyle: 'italic',
          }}>
            {locale === 'hi' ? (
              <>प्रिय {recipientName}<br />के लिए...</>
            ) : (
              <>For my dearest<br />{recipientName}</>
            )}
          </h1>

          <div style={{ height: 1, background: '#e8dec9', margin: '4px 0' }} />

          <p style={{
            fontFamily: 'monospace',
            fontSize: '0.68rem',
            color: '#8c7662',
            margin: 0,
          }}>
            {locale === 'hi' ? 'खोलने के लिए टैप करें' : 'Tap to open album'}
          </p>
        </div>
      </motion.div>
    </div>
  );
}
