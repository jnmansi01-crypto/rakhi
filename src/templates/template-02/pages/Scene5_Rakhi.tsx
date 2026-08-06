'use client';
// Template 02 — Scene 5: Rakhi (Cotton Thread Rakhi Tying)
// Simple, tactile drag-and-drop thread Rakhi tying with canvas-confetti reward.

import { useState, useRef } from 'react';
import { motion, useMotionValue, AnimatePresence } from 'framer-motion';
import { useHaptics } from '@/shared/components/useHaptics';
import { audioEngine } from '@/shared/audio/audio';
import type { Locale } from '@/lib/types';
import confetti from 'canvas-confetti';
import { btnStyle } from '@/shared/inputs/inputs';

interface Props {
  recipientName: string;
  senderName: string;
  locale: Locale;
  onComplete: () => void;
}

export function Scene5_Rakhi({ recipientName, senderName, locale, onComplete }: Props) {
  const [isTied, setIsTied] = useState(false);
  const { vibrate } = useHaptics();
  const containerRef = useRef<HTMLDivElement>(null);
  
  // Drag coordinates track
  const dragX = useMotionValue(0);
  const dragY = useMotionValue(0);

  const checkTieThreshold = () => {
    // If they drag close to center, snap and tie
    const currentX = dragX.get();
    const currentY = dragY.get();

    // The target is roughly centered at (0, -60) relative to the initial Rakhi placement
    const dist = Math.sqrt(Math.pow(currentX, 2) + Math.pow(currentY - (-70), 2));

    if (dist < 50) {
      vibrate();
      audioEngine.playMagic(); // Play a nice Eb Major 9 success chord
      setIsTied(true);
      
      // Fire confetti
      confetti({
        particleCount: 80,
        spread: 60,
        origin: { y: 0.6 },
        colors: ['#c79774', '#a8aeff', '#fff8f0'],
      });
    }
  };

  const handleNext = () => {
    vibrate();
    audioEngine.playSwoosh();
    onComplete();
  };

  return (
    <div 
      ref={containerRef}
      style={{
        position: 'fixed', inset: 0,
        background: '#1d1412',
        backgroundImage: 'radial-gradient(circle at center, #2c1b18 0%, #110908 100%)',
        display: 'flex', flexDirection: 'column',
        alignItems: 'center', justifyContent: 'space-between',
        padding: '40px 24px 28px 24px',
        overflow: 'hidden',
      }}
    >
      {/* Header */}
      <div style={{ textAlign: 'center', zIndex: 10 }}>
        <p style={{
          fontFamily: 'monospace', fontSize: '0.75rem',
          color: 'rgba(201,168,76,0.6)', letterSpacing: '0.15em',
          textTransform: 'uppercase', margin: 0,
        }}>
          {locale === 'hi' ? 'राखी धागा' : 'THE SACRED THREAD'}
        </p>
      </div>

      {/* Main Canvas / Tying Area */}
      <div style={{
        position: 'relative', width: '100%', flex: 1,
        display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
      }}>
        {/* Swirled wrist sketch target */}
        <div style={{
          width: 140, height: 140,
          border: '2.5px dashed rgba(168, 174, 255, 0.25)',
          borderRadius: '50%',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          position: 'relative',
          marginBottom: 80,
        }}>
          <span style={{ fontSize: '0.75rem', fontFamily: 'monospace', color: 'rgba(255,255,255,0.3)', textTransform: 'uppercase', textAlign: 'center' }}>
            {locale === 'hi' ? 'यहां लाएं' : 'Drag here'}
          </span>
          <div style={{ position: 'absolute', inset: -8, border: '1px solid rgba(255,255,255,0.05)', borderRadius: '50%' }} />
        </div>

        {/* Handwoven Thread Rakhi */}
        <AnimatePresence>
          {!isTied ? (
            <motion.div
              drag
              dragConstraints={containerRef}
              dragElastic={0.2}
              style={{
                x: dragX,
                y: dragY,
                cursor: 'grab',
                position: 'absolute',
                zIndex: 50,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
              }}
              onDragEnd={checkTieThreshold}
            >
              {/* Cotton Threads extending sideways */}
              <div style={{ width: 120, height: 3, background: 'linear-gradient(90deg, transparent, #c79774, #a8aeff, #c79774)' }} />
              
              {/* Colorful circular flower core */}
              <div style={{
                width: 54, height: 54, borderRadius: '50%',
                background: '#a8aeff',
                border: '4px double #fcf8ee',
                boxShadow: '0 8px 16px rgba(0,0,0,0.5)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                color: '#fff', fontSize: '1.2rem',
                margin: '0 -27px',
                zIndex: 2,
              }}>
                🌸
              </div>

              <div style={{ width: 120, height: 3, background: 'linear-gradient(90deg, #c79774, #a8aeff, #c79774, transparent)' }} />
            </motion.div>
          ) : (
            // Tied / Constellation State
            <motion.div
              initial={{ scale: 0.5, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              style={{
                position: 'absolute',
                top: '32%',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
              }}
            >
              {/* Full wrist tie lines */}
              <div style={{ width: 220, height: 4, background: 'linear-gradient(90deg, transparent, #a8aeff, transparent)', zIndex: 1 }} />
              <div style={{
                width: 72, height: 72, borderRadius: '50%',
                background: 'rgba(168, 174, 255, 0.15)',
                border: '2px solid #a8aeff',
                boxShadow: '0 0 25px rgba(168, 174, 255, 0.6)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                color: '#fff', fontSize: '1.8rem',
                margin: '0 -36px',
                zIndex: 2,
              }}>
                🌸
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {isTied && (
          <motion.p
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            style={{
              fontFamily: 'Georgia, serif',
              fontSize: '1.2rem',
              color: '#FFF8F0',
              fontStyle: 'italic',
              marginTop: -20,
              textAlign: 'center',
            }}
          >
            {locale === 'hi' ? `राखी बंधी, स्नेह अमर रहे 🌸` : `Tied with absolute love 🌸`}
          </motion.p>
        )}
      </div>

      {/* Next Button */}
      <div style={{ width: '100%', maxWidth: 360, zIndex: 10 }}>
        <button
          onClick={handleNext}
          disabled={!isTied}
          style={{
            ...btnStyle,
            width: '100%',
            background: isTied ? 'linear-gradient(135deg, #c79774, #a36f4d)' : 'rgba(255,255,255,0.05)',
            border: 'none',
            color: isTied ? '#fff' : 'rgba(255,255,255,0.3)',
            fontWeight: 600,
            cursor: isTied ? 'pointer' : 'not-allowed',
            boxShadow: isTied ? '0 6px 20px rgba(163,111,77,0.3)' : 'none',
          }}
        >
          {locale === 'hi' ? 'उपहार देखें →' : 'Unwrap Gift →'}
        </button>
      </div>
    </div>
  );
}
