'use client';
// Template 02 — Scene 6: Gift Reveal (Wrapped parcel package)
// Paper package wrapped in jute twine. Clicking it unfolds it to reveal voucher.

import { useState } from 'react';
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
  onComplete: () => void;
}

export function Scene6_Gift({ giftType, giftTitle, giftValue, senderName, locale, onComplete }: Props) {
  const [isOpen, setIsOpen] = useState(false);
  const { vibrate } = useHaptics();

  const handleOpen = () => {
    if (!isOpen) {
      vibrate();
      audioEngine.playPaper?.(); // Play a nice paper rustling sound
      setIsOpen(true);
    }
  };

  return (
    <div style={{
      position: 'fixed', inset: 0,
      background: '#1d1412',
      backgroundImage: 'radial-gradient(circle at center, #2c1b18 0%, #110908 100%)',
      display: 'flex', flexDirection: 'column',
      alignItems: 'center', justifyContent: 'space-between',
      padding: '40px 24px 28px 24px',
      overflow: 'hidden',
    }}>
      {/* Header */}
      <div style={{ textAlign: 'center', zIndex: 10 }}>
        <p style={{
          fontFamily: 'monospace', fontSize: '0.75rem',
          color: 'rgba(201,168,76,0.6)', letterSpacing: '0.15em',
          textTransform: 'uppercase', margin: 0,
        }}>
          {locale === 'hi' ? 'उपहार पेटी' : 'THE PARCEL'}
        </p>
      </div>

      {/* Main Parcel Display */}
      <div style={{
        position: 'relative', width: '100%', flex: 1,
        display: 'flex', alignItems: 'center', justifyContent: 'center',
      }}>
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
                印
              </div>

              {/* Tiny sticker with text */}
              <div style={{
                position: 'absolute', bottom: 12, right: 12,
                background: '#fdfbfa', padding: '4px 8px', borderRadius: 2,
                border: '1px solid #ddd',
                transform: 'rotate(-5deg)',
                fontFamily: 'monospace', fontSize: '0.55rem', color: '#555',
              }}>
                {locale === 'hi' ? 'खोलें' : 'OPEN ME'}
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
              <div style={{ fontSize: '3rem', marginBottom: 16 }}>🎁</div>
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

      {/* Reply Button */}
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
          {locale === 'hi' ? 'उत्तर भेजें 🌸' : 'Send Reply 🌸'}
        </button>
      </div>
    </div>
  );
}
