'use client';
// Template 02 — Scene 6: Gift Reveal (Wrapped parcel package)
// Paper package wrapped in jute twine. Clicking it unfolds it to reveal voucher.

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useHaptics } from '@/shared/components/useHaptics';
import { audioEngine } from '@/shared/audio/audio';
import type { Locale, GiftType } from '@/lib/types';
import { btnStyle } from '@/shared/inputs/inputs';

interface Props {
  giftType: GiftType;
  giftTitle: string;
  giftValue: string;
  senderName: string;
  locale: Locale;
  isPreview?: boolean;
  onComplete: () => void;
}

export function Scene6_Gift({ giftType, giftTitle, giftValue, senderName, locale, isPreview, onComplete }: Props) {
  const [isOpen, setIsOpen] = useState(false);
  const [showConfetti, setShowConfetti] = useState(false);
  const { vibrate } = useHaptics();

  const handleOpen = () => {
    if (!isOpen) {
      vibrate();
      audioEngine.playPaper?.(); // Play a nice paper rustling sound
      setIsOpen(true);
      setShowConfetti(true);
      
      // Stop BGM after 4 seconds of opening the parcel
      setTimeout(() => {
        audioEngine.stopBGM?.();
      }, 4000);
    }
  };

  // Generate 45 randomized gold dust/foil confetti particles radiating outwards
  const confettiParticles = Array.from({ length: 45 }).map((_, i) => {
    const angle = (i / 45) * 360 + (Math.random() * 15 - 7.5);
    const distance = 80 + Math.random() * 180;
    const xDest = Math.cos(angle * Math.PI / 180) * distance;
    const yDest = Math.sin(angle * Math.PI / 180) * distance - (50 + Math.random() * 100);
    const size = 6 + Math.random() * 8;
    const color = ['#d4af37', '#ffd700', '#f3e5ab', '#c5a059', '#b89335'][i % 5];
    const delay = Math.random() * 0.15;
    
    return {
      id: i,
      x: xDest,
      y: yDest,
      size,
      color,
      delay,
      rotate: Math.random() * 720 - 360,
    };
  });

  return (
    <div style={{
      position: 'absolute', inset: 0,
      background: '#1d1412',
      backgroundImage: 'radial-gradient(circle at center, #2c1b18 0%, #110908 100%)',
      display: 'flex', flexDirection: 'column',
      alignItems: 'center', justifyContent: 'space-between',
      padding: '40px 24px 28px 24px',
      overflowY: 'auto',
    }}>
      {/* Header */}
      <div style={{ textAlign: 'center', zIndex: 10 }}>
        <p style={{
          fontFamily: 'monospace', fontSize: '0.75rem',
          color: 'rgba(201,168,76,0.6)', letterSpacing: '0.15em',
          textTransform: 'uppercase', margin: 0,
        }}>
          {locale === 'hi' ? 'स्नेह की पोटली' : 'THE PARCEL'}
        </p>
      </div>

      {/* Main Parcel Display */}
      <div style={{
        position: 'relative', width: '100%', flex: 1,
        display: 'flex', alignItems: 'center', justifyContent: 'center',
      }}>
        {/* Golden Pop Confetti Shower */}
        {showConfetti && (
          <div style={{ position: 'absolute', pointerEvents: 'none', zIndex: 12, width: '100%', height: '100%' }}>
            {confettiParticles.map((p) => (
              <motion.div
                key={p.id}
                initial={{ x: 0, y: 0, scale: 0.2, opacity: 1, rotate: 0 }}
                animate={{
                  x: p.x,
                  y: p.y,
                  scale: [1, 1, 0.5],
                  opacity: [1, 1, 0],
                  rotate: p.rotate,
                }}
                transition={{
                  duration: 1.6 + Math.random() * 0.6,
                  ease: [0.1, 0.8, 0.25, 1],
                  delay: p.delay,
                }}
                style={{
                  position: 'absolute',
                  top: '50%',
                  left: '50%',
                  width: p.size,
                  height: p.size * (0.4 + Math.random() * 0.6), // varied rectangle flakes
                  background: p.color,
                  borderRadius: Math.random() > 0.5 ? '50%' : '1px',
                  boxShadow: '0 2px 4px rgba(0,0,0,0.15)',
                }}
              />
            ))}
          </div>
        )}

        <AnimatePresence mode="wait">
          {!isOpen ? (
            // Wrapped Parcel Box
            <motion.div
              key="wrapped"
              initial={{ scale: 0.9, opacity: 0, rotate: -2 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 1.1, opacity: 0, rotate: 2 }}
              onClick={handleOpen}
              style={{
                width: 250, height: 200,
                background: '#caae8c', // Kraft paper texture
                border: '2px solid #b79c7b',
                borderRadius: 4,
                boxShadow: '0 20px 40px rgba(0,0,0,0.5), inset 0 0 15px rgba(0,0,0,0.1)',
                cursor: 'pointer',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                position: 'relative',
              }}
            >
              {/* Jute string wrapping */}
              <div style={{ position: 'absolute', top: 0, bottom: 0, left: '50%', width: 6, background: '#84694f', transform: 'translateX(-50%)' }} />
              <div style={{ position: 'absolute', left: 0, right: 0, top: '50%', height: 6, background: '#84694f', transform: 'translateY(-50%)' }} />

              {/* Red Wax Seal Stamp */}
              <div style={{
                position: 'absolute', top: '50%', left: '50%',
                width: 48, height: 48, borderRadius: '50%',
                background: '#9e2b25',
                border: '1px solid #7d201c',
                boxShadow: '0 4px 10px rgba(0,0,0,0.3)',
                transform: 'translate(-50%, -50%) rotate(15deg)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                color: '#fff', fontSize: '0.9rem', fontWeight: 'bold',
              }}>
                ✦
              </div>

              {/* Tiny sticker with text */}
              <div style={{
                position: 'absolute', bottom: 12, right: 12,
                background: '#fdfbfa', padding: '4px 8px', borderRadius: 2,
                border: '1px solid #ddd',
                transform: 'rotate(-5deg)',
                fontFamily: 'monospace', fontSize: '0.55rem', color: '#555',
              }}>
                {locale === 'hi' ? 'खोलें और मुस्कुराएं' : 'OPEN ME'}
              </div>
            </motion.div>
          ) : (
            // Unwrapped / Revealed Gift Display
            <motion.div
              key="revealed"
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 0.6 }}
              style={{
                width: '100%',
                maxWidth: 320,
                background: '#fdfbf7', // Paper lined card inside
                border: '1px solid #e0dcd3',
                borderRadius: 8,
                padding: '32px 24px',
                boxShadow: '0 20px 45px rgba(0,0,0,0.5)',
                textAlign: 'center',
                display: 'flex', flexDirection: 'column', alignItems: 'center',
              }}
            >
              <div style={{ marginBottom: 16 }}>
                <svg width="52" height="52" viewBox="0 0 52 52" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <rect x="8" y="20" width="36" height="26" rx="2" fill="#c5906a" stroke="#a36f4d" strokeWidth="1.5"/>
                  <rect x="4" y="16" width="44" height="8" rx="2" fill="#a36f4d"/>
                  <rect x="23" y="16" width="6" height="30" fill="#d4af37"/>
                  <path d="M26 16 C26 16 16 10 12 8 C8 6 10 2 14 4 C18 6 26 16 26 16Z" fill="#d4af37"/>
                  <path d="M26 16 C26 16 36 10 40 8 C44 6 42 2 38 4 C34 6 26 16 26 16Z" fill="#d4af37"/>
                </svg>
              </div>
              <h2 style={{ fontFamily: 'Georgia, serif', fontSize: '1.6rem', color: '#3d2b1f', margin: '0 0 8px 0' }}>
                {giftTitle}
              </h2>
              <p style={{ fontSize: '0.85rem', color: 'rgba(61,43,31,0.6)', margin: '0 0 24px 0', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                {giftType === 'surprise_message' ? (locale === 'hi' ? 'सीक्रेट नोट' : 'Secret Note') : (locale === 'hi' ? 'उपहार वाउचर' : 'Gift Voucher')}
              </p>

              {/* Gift Value Display Box */}
              <div style={{
                width: '100%',
                background: '#f7f4ec',
                border: '1px dashed #c0b89f',
                borderRadius: 12,
                padding: '20px 16px',
                marginBottom: 24,
                wordBreak: 'break-all',
              }}>
                <span style={{ fontSize: '1.1rem', fontWeight: 600, color: '#a36f4d' }}>
                  {giftValue}
                </span>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {!isPreview && (
        <div style={{ width: '100%', maxWidth: 360, zIndex: 10 }}>
          <button
            onClick={() => { vibrate(); onComplete(); }}
            disabled={!isOpen}
            style={{
              ...btnStyle,
              width: '100%',
              background: isOpen ? 'linear-gradient(135deg, #c79774, #a36f4d)' : 'rgba(255,255,255,0.05)',
              border: 'none',
              color: isOpen ? '#fff' : 'rgba(255,255,255,0.3)',
              fontWeight: 600,
              cursor: isOpen ? 'pointer' : 'not-allowed',
              boxShadow: isOpen ? '0 6px 20px rgba(163,111,77,0.3)' : 'none',
            }}
          >
            {locale === 'hi' ? 'धन्यवाद कहें' : 'Send a Thank You'}
          </button>
        </div>
      )}
    </div>
  );
}
