'use client';
// Template 02 — Scene 2: Letter
// A torn piece of ruled notebook paper with handwritten blue ink.

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useHaptics } from '@/shared/components/useHaptics';
import { audioEngine } from '@/shared/audio/audio';
import type { Locale } from '@/lib/types';
import { t } from '@/lib/i18n';
import { btnStyle } from '@/shared/inputs/inputs';

interface Props {
  letterText: string;
  senderName: string;
  recipientName: string;
  locale: Locale;
  onComplete: () => void;
}

export function Scene2_Letter({ letterText, senderName, recipientName, locale, onComplete }: Props) {
  const [displayedText, setDisplayedText] = useState('');
  const [isDone, setIsDone] = useState(false);
  const { vibrate } = useHaptics();

  // Typewriter effect
  useEffect(() => {
    let index = 0;
    const interval = setInterval(() => {
      setDisplayedText((prev) => prev + letterText.charAt(index));
      index++;
      if (index >= letterText.length) {
        clearInterval(interval);
        setIsDone(true);
      }
    }, 30); // 30ms per character

    return () => clearInterval(interval);
  }, [letterText]);

  const skipTypewriter = () => {
    if (!isDone) {
      setDisplayedText(letterText);
      setIsDone(true);
      vibrate();
    }
  };

  const handleNext = () => {
    vibrate();
    audioEngine.playSwoosh();
    onComplete();
  };

  return (
    <div 
      onClick={skipTypewriter}
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
      {/* Import Caveat font locally for this scene */}
      <style dangerouslySetInnerHTML={{ __html: `
        @import url('https://fonts.googleapis.com/css2?family=Caveat:wght@500;700&display=swap');
        .handwritten-text {
          font-family: 'Caveat', cursive;
        }
      ` }} />

      <motion.div
        initial={{ opacity: 0, y: 30, scale: 0.95 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.8, ease: 'easeOut' }}
        style={{
          width: '100%',
          maxWidth: 380,
          background: '#f6eedd', // Craft paper color
          border: '1px solid #dfd3bb',
          borderRadius: 4,
          padding: '40px 24px 32px 32px',
          boxShadow: '0 20px 50px rgba(0,0,0,0.5), inset 0 0 20px rgba(0,0,0,0.05)',
          position: 'relative',
          display: 'flex', flexDirection: 'column',
          maxHeight: '85vh',
        }}
      >
        {/* Lined paper ruled line background effect */}
        <div style={{
          position: 'absolute', inset: 0,
          top: 40, bottom: 32,
          backgroundImage: 'linear-gradient(rgba(176,197,222,0.4) 1px, transparent 1px)',
          backgroundSize: '100% 28px',
          pointerEvents: 'none',
        }} />

        {/* Paper torn binder hole line on left */}
        <div style={{
          position: 'absolute', top: 0, bottom: 0, left: 16, width: 1,
          background: 'rgba(235,100,100,0.25)',
          pointerEvents: 'none',
        }} />

        {/* Outer Scroll container for longer text */}
        <div style={{
          overflowY: 'auto', flex: 1, position: 'relative', zIndex: 2,
          paddingLeft: 12, paddingRight: 4,
        }}>
          <h2 className="handwritten-text" style={{
            fontSize: '1.8rem', color: '#1a3b5c', margin: '0 0 16px 0',
            fontWeight: 700, lineHeight: '28px',
          }}>
            {locale === 'hi' ? `प्रिय ${recipientName},` : `Dearest ${recipientName},`}
          </h2>

          <p className="handwritten-text" style={{
            fontSize: '1.5rem', color: '#2b4f74', margin: 0,
            lineHeight: '28px', whiteSpace: 'pre-wrap', minHeight: 120,
          }}>
            {displayedText}
          </p>

          {isDone && (
            <motion.p 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.6 }}
              className="handwritten-text" 
              style={{
                fontSize: '1.6rem', color: '#1a3b5c', margin: '24px 0 0 0',
                textAlign: 'right', fontWeight: 700, lineHeight: '28px',
              }}
            >
              — {senderName}
            </motion.p>
          )}
        </div>

        {/* Next button */}
        {isDone && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            style={{ marginTop: 24, zIndex: 10, alignSelf: 'center', width: '100%' }}
          >
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
              {locale === 'hi' ? 'यादें देखें →' : 'View Memories →'}
            </button>
          </motion.div>
        )}
      </motion.div>
    </div>
  );
}
