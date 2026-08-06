'use client';
// Template 02 — Scene 3: Photos
// Polaroid photo snaps with yellowed adhesive tape.

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useHaptics } from '@/shared/components/useHaptics';
import { audioEngine } from '@/shared/audio/audio';
import type { Locale } from '@/lib/types';
import { btnStyle } from '@/shared/inputs/inputs';

interface Props {
  photoUrls: string[];
  senderName: string;
  recipientName: string;
  locale: Locale;
  onComplete: () => void;
}

export function Scene3_Photos({ photoUrls, senderName, recipientName, locale, onComplete }: Props) {
  const [activeIdx, setActiveIdx] = useState<number | null>(null);
  const { vibrate } = useHaptics();

  const handleNext = () => {
    vibrate();
    audioEngine.playSwoosh();
    onComplete();
  };

  // Fixed visual rotations/offsets for polaroids to give a scattered look
  const layoutPresets = [
    { rotate: -6, x: -10, y: -15 },
    { rotate: 5, x: 20, y: 10 },
    { rotate: -3, x: -30, y: 120 },
    { rotate: 8, x: 15, y: 150 },
    { rotate: -4, x: -5, y: 260 },
  ];

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
      <style dangerouslySetInnerHTML={{ __html: `
        @import url('https://fonts.googleapis.com/css2?family=Caveat:wght@500;700&display=swap');
        .handwritten-label {
          font-family: 'Caveat', cursive;
        }
      ` }} />

      {/* Header */}
      <div style={{ textAlign: 'center', zIndex: 10 }}>
        <p style={{
          fontFamily: 'monospace', fontSize: '0.75rem',
          color: 'rgba(201,168,76,0.6)', letterSpacing: '0.15em',
          textTransform: 'uppercase', margin: 0,
        }}>
          {locale === 'hi' ? 'खट्टी-मीठी यादें' : 'SNAPSHOTS OF US'}
        </p>
      </div>

      {/* Scattered Polaroid Pile */}
      <div style={{
        position: 'relative', width: '100%', flex: 1,
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        minHeight: 340,
      }}>
        {photoUrls.map((url, i) => {
          const preset = layoutPresets[i % layoutPresets.length];
          return (
            <motion.div
              key={i}
              initial={{ opacity: 0, scale: 0.8, rotate: 0 }}
              animate={{ opacity: 1, scale: 1, rotate: preset.rotate, x: preset.x, y: preset.y - 60 }}
              transition={{ delay: i * 0.15, duration: 0.6, ease: 'easeOut' }}
              onClick={() => { vibrate(); setActiveIdx(i); }}
              style={{
                position: 'absolute',
                background: '#fff',
                border: '1px solid #e0dcd3',
                padding: '12px 12px 32px 12px',
                width: 170,
                boxShadow: '0 8px 20px rgba(0,0,0,0.4)',
                cursor: 'pointer',
                zIndex: 5 + i,
              }}
            >
              {/* Tape piece */}
              <div style={{
                position: 'absolute', top: -10, left: '35%',
                width: 50, height: 16,
                background: 'rgba(242,238,209,0.5)',
                border: '1px dashed rgba(0,0,0,0.05)',
                transform: `rotate(${preset.rotate * -0.5}deg)`,
                zIndex: 10,
              }} />

              {/* Image Frame */}
              <div style={{ width: '100%', height: 160, background: '#1c1b18', overflow: 'hidden' }}>
                <img src={url} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
              </div>

              {/* Polaroid Footer caption */}
              <p className="handwritten-label" style={{
                fontSize: '1.2rem', color: '#3d2b1f', textAlign: 'center',
                margin: '12px 0 0 0', whiteSpace: 'nowrap', overflow: 'hidden',
              }}>
                {locale === 'hi' ? 'यादें...' : 'Memories...'}
              </p>
            </motion.div>
          );
        })}
      </div>

      {/* Fullscreen Zoom overlay */}
      <AnimatePresence>
        {activeIdx !== null && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setActiveIdx(null)}
            style={{
              position: 'fixed', inset: 0, zIndex: 1000,
              background: 'rgba(15,10,8,0.95)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              padding: 24,
            }}
          >
            <motion.div
              initial={{ scale: 0.9, rotate: 0 }}
              animate={{ scale: 1, rotate: activeIdx % 2 === 0 ? -1 : 1 }}
              exit={{ scale: 0.9, rotate: 0 }}
              style={{
                background: '#fff',
                padding: '16px 16px 40px 16px',
                width: '100%',
                maxWidth: 320,
                boxShadow: '0 20px 40px rgba(0,0,0,0.6)',
              }}
            >
              <div style={{ width: '100%', height: 300, background: '#1c1b18', overflow: 'hidden' }}>
                <img src={photoUrls[activeIdx]} alt="" style={{ width: '100%', height: '100%', objectFit: 'contain' }} />
              </div>
              <p className="handwritten-label" style={{
                fontSize: '1.4rem', color: '#3d2b1f', textAlign: 'center',
                margin: '16px 0 0 0',
              }}>
                {locale === 'hi' ? 'हमारा खूबसूरत पल 🌸' : 'A special moment 🌸'}
              </p>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Next Button */}
      <div style={{ width: '100%', maxWidth: 360, zIndex: 10 }}>
        <button
          onClick={handleNext}
          style={{
            ...btnStyle,
            width: '100%',
            background: 'linear-gradient(135deg, #c79774, #a36f4d)',
            border: 'none',
            color: '#fff',
            fontWeight: 600,
            boxShadow: '0 6px 20px rgba(163,111,77,0.3)',
          }}
        >
          {locale === 'hi' ? 'आवाज़ सुनें →' : 'Listen to Voice →'}
        </button>
      </div>
    </div>
  );
}
