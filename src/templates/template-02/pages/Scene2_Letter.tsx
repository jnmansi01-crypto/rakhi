'use client';
// Template 02 — Scene 2: Letter
// Immersive 3D open scrapbook spread with a central brass binder coil, 
// focused directly on the lined letter page for an instant, personal reading experience.

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useHaptics } from '@/shared/components/useHaptics';
import { audioEngine } from '@/shared/audio/audio';
import type { Locale } from '@/lib/types';

interface Props {
  letterText: string;
  senderName: string;
  recipientName: string;
  locale: Locale;
  onComplete: () => void;
}

export function Scene2_Letter({ letterText, senderName, recipientName, locale, onComplete }: Props) {
  const [displayedText, setDisplayedText] = useState('');
  const [index, setIndex] = useState(0);
  const [isDone, setIsDone] = useState(false);
  const { vibrate } = useHaptics();

  // Typewriter effect
  useEffect(() => {
    if (index < letterText.length) {
      const timeout = setTimeout(() => {
        setDisplayedText((prev) => prev + letterText.charAt(index));
        setIndex((prev) => prev + 1);
      }, 25);
      return () => clearTimeout(timeout);
    } else {
      setIsDone(true);
    }
  }, [index, letterText]);

  const skipTypewriter = () => {
    if (!isDone) {
      setDisplayedText(letterText);
      setIndex(letterText.length);
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
        position: 'absolute', inset: 0,
        background: '#120e0d',
        backgroundImage: 'radial-gradient(circle at center, #1f1412 0%, #080606 100%)',
        display: 'flex', flexDirection: 'column',
        alignItems: 'center', justifyContent: 'center',
        padding: '24px 12px',
        overflowY: 'auto',
      }}
    >
      <style dangerouslySetInnerHTML={{ __html: `
        @import url('https://fonts.googleapis.com/css2?family=Caveat:wght@500;700&family=Yatra+One&display=swap');
        .handwritten-text {
          font-family: 'Caveat', cursive;
        }
        .hindi-handwritten {
          font-family: 'Yatra One', serif !important;
          font-weight: normal !important;
        }
      ` }} />

      {/* 3D Open Book Container (Focused on Letter) */}
      <div
        className="scrapbook-container"
        style={{
          width: '95%',
          maxWidth: 520,
          display: 'flex',
          flexDirection: 'column',
          position: 'relative',
          boxShadow: '0 25px 60px rgba(0,0,0,0.65)',
          borderRadius: 16,
          overflow: 'hidden',
          background: '#3d160e',
          padding: '8px',
        }}
      >
        {/* Ruled notebook paper with letter text */}
        <motion.div 
          initial={{ rotateY: 20, opacity: 0.8 }}
          animate={{ rotateY: 0, opacity: 1 }}
          exit={{ rotateY: 90, opacity: 0 }}
          transition={{ duration: 0.6, ease: 'easeOut' }}
          style={{
            flex: 1,
            background: '#faf6ee',
            borderRadius: 12,
            padding: '28px 24px 24px 24px',
            display: 'flex', flexDirection: 'column',
            position: 'relative',
            boxShadow: 'inset 0 0 25px rgba(0,0,0,0.08)',
            overflow: 'hidden',
            minHeight: 440,
          }}>

          {/* Handcrafted scrapbook accents: 3D Roli splatters & Gold dust scatter */}
          <div style={{ position: 'absolute', inset: 0, pointerEvents: 'none', zIndex: 1 }}>
            <svg width="100%" height="100%" style={{ position: 'absolute', inset: 0 }} viewBox="0 0 300 450" preserveAspectRatio="none">
              <defs>
                <radialGradient id="rice3d" cx="35%" cy="30%" r="70%">
                  <stop offset="0%" stopColor="#ffffff" />
                  <stop offset="60%" stopColor="#fdfcf0" />
                  <stop offset="100%" stopColor="#d4cdab" />
                </radialGradient>
                <radialGradient id="roli3d" cx="35%" cy="30%" r="70%">
                  <stop offset="0%" stopColor="#d42617" />
                  <stop offset="70%" stopColor="#9c150b" />
                  <stop offset="100%" stopColor="#690a03" />
                </radialGradient>
              </defs>
              <ellipse cx="251" cy="42" rx="9" ry="3.6" fill="rgba(0,0,0,0.18)" transform="rotate(15 250 40)"/>
              <ellipse cx="250" cy="40" rx="9" ry="3.6" fill="url(#rice3d)" transform="rotate(15 250 40)"/>
              <circle cx="263" cy="56" r="6" fill="rgba(0,0,0,0.15)"/>
              <circle cx="262" cy="55" r="6" fill="url(#roli3d)"/>
              <circle cx="270" cy="90" r="2.2" fill="#d4af37" opacity="0.8"/>
              <circle cx="220" cy="140" r="1.5" fill="#e5c07b" opacity="0.9"/>
            </svg>
          </div>

          {/* Letter content container */}
          <div style={{
            overflowY: 'auto', flex: 1, zIndex: 2, paddingRight: 4,
          }}>
            <h2 className={locale === 'hi' ? 'hindi-handwritten' : 'handwritten-text'} style={{
              fontSize: locale === 'hi' ? '1.35rem' : '1.5rem', color: '#1a3b5c', margin: '0 0 16px 0',
              fontWeight: 700, lineHeight: 1.6, paddingBottom: 0
            }}>
              {locale === 'hi' ? `प्यारे ${recipientName},` : `Dearest ${recipientName},`}
            </h2>
            <p className={locale === 'hi' ? 'hindi-handwritten' : 'handwritten-text'} style={{
              fontSize: locale === 'hi' ? '1.2rem' : '1.35rem', color: '#2c3e50',
              lineHeight: 1.85, whiteSpace: 'pre-wrap', margin: 0, paddingBottom: 12
            }}>
              {displayedText}
            </p>
            {displayedText.length >= letterText.length && (
              <motion.p 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className={locale === 'hi' ? 'hindi-handwritten' : 'handwritten-text'} 
                style={{
                  fontSize: locale === 'hi' ? '1.3rem' : '1.4rem', color: '#1a3b5c', margin: '24px 0 0 0',
                  textAlign: 'right', fontWeight: 700,
                }}
              >
                — {senderName}
              </motion.p>
            )}
          </div>

          {/* Prompt to proceed */}
          {isDone && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.9 }}
              style={{
                marginTop: 14,
                textAlign: 'center',
                fontSize: '0.8rem',
                color: '#8c7662',
                fontWeight: 600,
                letterSpacing: '0.05em',
                alignSelf: 'center',
                animation: 'pulse 2s infinite',
                cursor: 'pointer',
                zIndex: 10,
              }}
              onClick={handleNext}
            >
              {locale === 'hi' ? 'आगे बढ़ने के लिए टैप करें →' : 'Tap to continue →'}
            </motion.div>
          )}
        </motion.div>
      </div>
    </div>
  );
}
