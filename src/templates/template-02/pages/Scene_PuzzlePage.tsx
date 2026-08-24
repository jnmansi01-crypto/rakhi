'use client';
// Template 02 — Scene: Dedicated Image Puzzle Page
// Dedicated scene after Audio to solve the 3x3 Photo Memory Puzzle in Template 02.

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MemoryPuzzle } from '../interactions/MemoryPuzzle';
import { audioEngine } from '@/shared/audio/audio';
import { useHaptics } from '@/shared/components/useHaptics';
import type { Locale } from '@/lib/types';

interface Props {
  photoUrls: string[];
  puzzlePhotoUrl?: string | null;
  senderName: string;
  recipientName: string;
  locale: Locale;
  onComplete: () => void;
  onBack?: () => void;
}

export function Scene_PuzzlePage({ photoUrls, puzzlePhotoUrl, senderName, recipientName, locale, onComplete, onBack }: Props) {
  const [isSolved, setIsSolved] = useState(false);
  const { vibrate } = useHaptics();

  const handleNext = () => {
    vibrate();
    audioEngine.playSwoosh();
    onComplete();
  };

  const activePuzzlePhotoUrl = puzzlePhotoUrl || photoUrls[0] || '/images/modern-rakhi.png';

  return (
    <div style={{
      position: 'absolute', inset: 0,
      background: '#120e0d',
      backgroundImage: 'radial-gradient(circle at center, #1f1412 0%, #080606 100%)',
      display: 'flex', flexDirection: 'column',
      alignItems: 'center', justifyContent: 'center',
      padding: '24px 16px',
      overflowY: 'auto',
      color: '#FFF8F0',
    }}>
      <style dangerouslySetInnerHTML={{ __html: `
        .puzzle-page-handwritten {
          font-family: 'Caveat', cursive;
        }
      ` }} />

      {/* Top-Left Swiftly Moving Animated Back Arrow Button */}
      {onBack && (
        <motion.button
          onClick={(e) => { e.stopPropagation(); onBack(); }}
          animate={{ x: [-4, 4, -4] }}
          transition={{ repeat: Infinity, duration: 1.6, ease: 'easeInOut' }}
          whileHover={{ scale: 1.15 }}
          whileTap={{ scale: 0.9 }}
          style={{
            position: 'absolute', top: 16, left: 16,
            width: 38, height: 38, borderRadius: '50%',
            background: 'rgba(242, 230, 207, 0.15)',
            border: '1px solid rgba(199, 151, 116, 0.4)',
            color: '#f2e6cf', display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontSize: '1.2rem', cursor: 'pointer', zIndex: 30,
            boxShadow: '0 4px 12px rgba(0,0,0,0.4)',
          }}
          title="Go Back"
        >
          ←
        </motion.button>
      )}

      <MemoryPuzzle
        photoUrl={activePuzzlePhotoUrl}
        onClose={handleNext}
        onSolve={() => setIsSolved(true)}
      />
    </div>
  );
}
