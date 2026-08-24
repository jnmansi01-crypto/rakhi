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
}

export function Scene_PuzzlePage({ photoUrls, puzzlePhotoUrl, senderName, recipientName, locale, onComplete }: Props) {
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

      <MemoryPuzzle
        photoUrl={activePuzzlePhotoUrl}
        onClose={handleNext}
        onSolve={() => setIsSolved(true)}
      />
    </div>
  );
}
