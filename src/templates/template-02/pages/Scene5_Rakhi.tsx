'use client';
// Template 02 — Scene 5: Rakhi (Cotton Thread Rakhi Tying)
// Redesigned with premium textured craft paper board and layered luxury Rakhi bead thread.

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
  
  const dragX = useMotionValue(0);
  const dragY = useMotionValue(0);

  const checkTieThreshold = () => {
    const currentX = dragX.get();
    const currentY = dragY.get();

    // Distance to center target area
    const dist = Math.sqrt(Math.pow(currentX, 2) + Math.pow(currentY - (-50), 2));

    if (dist < 60) {
      vibrate();
      audioEngine.playMagic();
      setIsTied(true);
      
      confetti({
        particleCount: 100,
        spread: 80,
        origin: { y: 0.65 },
        colors: ['#b89053', '#d43f3f', '#ffffff', '#e6c89c'],
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
        alignItems: 'center', justifyContent: 'center',
        padding: 24,
        overflow: 'hidden',
      }}
    >
      {/* Premium Scrapbook Craft Paper Page Container */}
      <motion.div
        initial={{ opacity: 0, y: 30, scale: 0.95 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.8 }}
        style={{
          width: '100%',
          maxWidth: 380,
          background: '#f6eedd', // Craft paper color
          border: '1px solid #dfd3bb',
          borderRadius: 4,
          padding: '40px 24px 32px 24px',
          boxShadow: '0 20px 50px rgba(0,0,0,0.5), inset 0 0 20px rgba(0,0,0,0.05)',
          position: 'relative',
          display: 'flex', flexDirection: 'column',
          alignItems: 'center',
          minHeight: '75vh',
          justifyContent: 'space-between',
        }}
      >
        {/* Golden Photo Corners */}
        <div style={{ position: 'absolute', top: 0, left: 0, width: 16, height: 16, borderTop: '3px solid #c79774', borderLeft: '3px solid #c79774' }} />
        <div style={{ position: 'absolute', top: 0, right: 0, width: 16, height: 16, borderTop: '3px solid #c79774', borderRight: '3px solid #c79774' }} />
        <div style={{ position: 'absolute', bottom: 0, left: 0, width: 16, height: 16, borderBottom: '3px solid #c79774', borderLeft: '3px solid #c79774' }} />
        <div style={{ position: 'absolute', bottom: 0, right: 0, width: 16, height: 16, borderBottom: '3px solid #c79774', borderRight: '3px solid #c79774' }} />

        {/* Header */}
        <div style={{ textAlign: 'center', zIndex: 10 }}>
          <p style={{
            fontFamily: 'monospace', fontSize: '0.72rem',
            color: '#8c7662', letterSpacing: '0.15em',
            textTransform: 'uppercase', margin: 0,
          }}>
            {locale === 'hi' ? 'राखी बंधन अनुष्ठान' : 'THE SACRED THREAD RITUAL'}
          </p>
        </div>

        {/* Interactive Area */}
        <div style={{
          position: 'relative', width: '100%', flex: 1,
          display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
          minHeight: 280,
        }}>
          {/* Target Wrist Sketch */}
          <div style={{
            width: 130, height: 130,
            border: '2px dashed rgba(199, 151, 116, 0.4)',
            borderRadius: '50%',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            position: 'relative',
            marginBottom: 60,
          }}>
            <span style={{ fontSize: '0.68rem', fontFamily: 'monospace', color: '#8c7662', textTransform: 'uppercase', textAlign: 'center', letterSpacing: '0.05em' }}>
              {locale === 'hi' ? 'यहां लाएं' : 'DRAG TO TIE'}
            </span>
            <div style={{ position: 'absolute', inset: -8, border: '1px solid rgba(199, 151, 116, 0.1)', borderRadius: '50%' }} />
          </div>

          {/* Premium Silk & Gold Thread Rakhi */}
          <AnimatePresence>
            {!isTied ? (
              <motion.div
                drag
                dragConstraints={containerRef}
                dragElastic={0.15}
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
                {/* Braided Red & Gold side threads */}
                <div style={{ width: 100, height: 4, background: 'linear-gradient(90deg, transparent, #c84040 30%, #e5c07b 70%, #c84040)' }} />
                
                {/* Detailed Beaded Centerpiece */}
                <div style={{
                  width: 58, height: 58, borderRadius: '50%',
                  background: 'radial-gradient(circle, #e5c07b 0%, #b89053 50%, #7c5c2d 100%)', // Gold plate
                  border: '1px solid #7c5c2d',
                  boxShadow: '0 8px 20px rgba(0,0,0,0.3)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  margin: '0 -29px',
                  zIndex: 2,
                  position: 'relative',
                }}>
                  {/* Silk flower petals overlay */}
                  <div style={{
                    position: 'absolute', width: 44, height: 44, borderRadius: '50%',
                    border: '3px dotted #d43f3f', background: 'transparent'
                  }} />
                  {/* Central Crimson Gemstone */}
                  <div style={{
                    width: 20, height: 20, borderRadius: '50%',
                    background: 'radial-gradient(circle, #ff5e5e 0%, #a11f1f 100%)',
                    boxShadow: '0 0 6px rgba(161,31,31,0.5)',
                  }} />
                </div>

                <div style={{ width: 100, height: 4, background: 'linear-gradient(90deg, #c84040, #e5c07b 30%, #c84040 70%, transparent)' }} />
              </motion.div>
            ) : (
              // Tied state: Rakhi locked onto the wrist target
              <motion.div
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ type: 'spring', damping: 15 }}
                style={{
                  position: 'absolute',
                  top: '32%',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                }}
              >
                <div style={{ width: 220, height: 4, background: 'linear-gradient(90deg, transparent, #c84040, #e5c07b, #c84040, transparent)', zIndex: 1 }} />
                <div style={{
                  width: 66, height: 66, borderRadius: '50%',
                  background: 'radial-gradient(circle, #e5c07b 0%, #b89053 60%, #7c5c2d 100%)',
                  boxShadow: '0 0 30px rgba(184,144,83,0.5)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  margin: '0 -33px',
                  zIndex: 2,
                  position: 'relative',
                }}>
                  <div style={{ position: 'absolute', width: 50, height: 50, borderRadius: '50%', border: '3px dotted #d43f3f' }} />
                  <div style={{ width: 22, height: 22, borderRadius: '50%', background: 'radial-gradient(circle, #ff5e5e 0%, #a11f1f 100%)' }} />
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
                fontSize: '1.15rem',
                color: '#3d2b1f',
                fontStyle: 'italic',
                marginTop: 20,
                textAlign: 'center',
              }}
            >
              {locale === 'hi' ? `राखी बंधी, सदैव आपका स्नेह 🌸` : `Tied with endless love 🌸`}
            </motion.p>
          )}
        </div>

        {/* Footer Next Button */}
        <div style={{ width: '100%', zIndex: 10 }}>
          <button
            onClick={handleNext}
            disabled={!isTied}
            style={{
              ...btnStyle,
              width: '100%',
              background: isTied ? 'linear-gradient(135deg, #c79774, #a36f4d)' : 'rgba(0,0,0,0.05)',
              border: isTied ? 'none' : '1px dashed rgba(140,118,98,0.3)',
              color: isTied ? '#fff' : 'rgba(61,43,31,0.4)',
              fontWeight: 600,
              cursor: isTied ? 'pointer' : 'not-allowed',
              boxShadow: isTied ? '0 6px 20px rgba(163,111,77,0.3)' : 'none',
            }}
          >
            {locale === 'hi' ? 'उपहार खोलें →' : 'Unwrap Gift →'}
          </button>
        </div>
      </motion.div>
    </div>
  );
}
