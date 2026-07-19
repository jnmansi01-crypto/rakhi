'use client';
import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useHaptics } from '@/hooks/useHaptics';
import { audioEngine } from '@/lib/audio';
import type { Locale } from '@/lib/types';
import { t } from '@/lib/i18n';

interface Props {
  voiceUrl: string | null;
  senderName: string;
  locale: Locale;
  onComplete: () => void;
}

// Marigold petal positions (ambient)
const PETALS = [
  { id: 1, x: 15, delay: 0.5,  duration: 8,  hue: '#E8751A' },
  { id: 2, x: 80, delay: 2.1,  duration: 11, hue: '#E8961A' },
  { id: 3, x: 42, delay: 3.7,  duration: 9,  hue: '#C9A84C' },
  { id: 4, x: 65, delay: 1.2,  duration: 10, hue: '#E8751A' },
];

// Gold sparkle positions
const SPARKLES = [
  { id: 1, x: '25%', y: '18%', delay: 0.3 },
  { id: 2, x: '75%', y: '22%', delay: 1.5 },
  { id: 3, x: '15%', y: '65%', delay: 2.2 },
  { id: 4, x: '85%', y: '70%', delay: 0.7 },
  { id: 5, x: '50%', y: '85%', delay: 3.1 },
];

// Play/Pause Icons
const PlayIcon = () => (
  <svg width="32" height="32" viewBox="0 0 24 24" fill="rgba(255,255,255,0.9)">
    <path d="M8 5 V19 L19 12 Z" />
  </svg>
);

const PauseIcon = () => (
  <svg width="32" height="32" viewBox="0 0 24 24" fill="rgba(255,255,255,0.9)">
    <path d="M6 5 H10 V19 H6 Z M14 5 H18 V19 H14 Z" />
  </svg>
);

const CheckIcon = () => (
  <svg width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="rgba(255,255,255,0.9)" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="20 6 9 17 4 12"></polyline>
  </svg>
);

export function Scene4_Voice({ voiceUrl, senderName, locale, onComplete }: Props) {
  const [status, setStatus] = useState<'idle' | 'playing' | 'done'>('idle');
  const [progress, setProgress] = useState(0);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const { vibrate } = useHaptics();
  const animRef = useRef<number>(0);

  const skipLabel = locale === 'hi' ? 'आगे बढ़ें →' : 'Continue →';

  // Skip if no voice
  useEffect(() => {
    if (!voiceUrl) { onComplete(); return; }

    audioRef.current = new Audio(voiceUrl);
    audioRef.current.onended = () => { 
      setStatus('done'); 
      setProgress(1); 
      audioEngine.restoreBGM(); 
    };
    audioRef.current.ontimeupdate = () => {
      if (audioRef.current) {
        setProgress(audioRef.current.currentTime / (audioRef.current.duration || 1));
      }
    };
    return () => { 
      audioRef.current?.pause(); 
      audioEngine.restoreBGM();
      cancelAnimationFrame(animRef.current); 
    };
  }, [voiceUrl, onComplete]);

  const toggle = () => {
    if (!audioRef.current) return;
    if (status === 'playing') {
      audioRef.current.pause();
      audioEngine.restoreBGM();
      setStatus('idle');
    } else {
      audioRef.current.play().catch(() => {});
      audioEngine.dimBGM();
      setStatus('playing');
      vibrate('MEDIUM');
    }
  };

  if (!voiceUrl) return null;

  return (
    <div className="scene" style={{
      background: 'radial-gradient(ellipse at 50% 25%, #2A1505 0%, #160C04 45%, #0D1526 100%)',
      overflow: 'hidden',
      display: 'flex', flexDirection: 'column',
    }}>
      {/* ── Ambient gold rings ─────────────────── */}
      {[240, 320, 400].map((size, i) => (
        <motion.div
          key={i}
          initial={{ opacity: 0 }}
          animate={{ opacity: [0.03, 0.06, 0.03] }}
          transition={{ duration: 5 + i * 2, repeat: Infinity, delay: i * 0.6, ease: 'easeInOut' }}
          style={{
            position: 'absolute',
            width: size, height: size,
            borderRadius: '50%',
            border: '1px solid var(--gold)',
            top: '32%', left: '50%',
            transform: 'translate(-50%, -50%)',
            pointerEvents: 'none',
          }}
        />
      ))}

      {/* ── Gold sparkles ────────────────────────────── */}
      {SPARKLES.map(s => (
        <motion.div
          key={s.id}
          initial={{ opacity: 0, scale: 0 }}
          animate={{ opacity: [0, 1, 0], scale: [0, 1, 0] }}
          transition={{
            duration: 2.5,
            delay: s.delay,
            repeat: Infinity,
            repeatDelay: 3 + s.id,
            ease: 'easeOut',
          }}
          style={{
            position: 'absolute',
            left: s.x, top: s.y,
            width: 4, height: 4,
            borderRadius: '50%',
            background: '#C9A84C',
            boxShadow: '0 0 8px #C9A84C',
            pointerEvents: 'none',
          }}
        />
      ))}

      {/* ── Marigold petals falling ───────────────────────── */}
      {PETALS.map(p => (
        <motion.div
          key={p.id}
          initial={{ y: -20, x: `${p.x}vw`, opacity: 0, rotate: 0 }}
          animate={{
            y: '110vh',
            x: [`${p.x}vw`, `${p.x + 5}vw`, `${p.x - 3}vw`, `${p.x}vw`],
            opacity: [0, 0.7, 0.7, 0],
            rotate: [0, 180, 360, 540],
          }}
          transition={{
            duration: p.duration,
            delay: p.delay,
            repeat: Infinity,
            repeatDelay: 2.5,
            ease: 'linear',
            times: [0, 0.1, 0.9, 1],
          }}
          style={{
            position: 'absolute',
            top: 0,
            width: 11,
            height: 15,
            borderRadius: '50% 0 50% 0',
            background: `linear-gradient(135deg, ${p.hue}, ${p.hue}99)`,
            boxShadow: `0 0 8px ${p.hue}66`,
            pointerEvents: 'none',
          }}
        />
      ))}

      {/* Title */}
      <motion.p
        initial={{ opacity: 0, y: -16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 0.2 }}
        style={{
          position: 'absolute', top: '12%',
          fontFamily: 'var(--font-serif)', fontStyle: 'italic',
          fontSize: '1.25rem', color: '#FFF8F0',
          textAlign: 'center', padding: '0 32px',
          textShadow: '0 2px 10px rgba(0,0,0,0.5)',
        }}
      >
        {locale === 'hi'
          ? `${senderName} की आवाज़ में कुछ ख़ास है...`
          : `${senderName} has something to say...`}
      </motion.p>
      
      {/* Decorative Divider */}
      <motion.div
        initial={{ opacity: 0, scaleX: 0 }}
        animate={{ opacity: 1, scaleX: 1 }}
        transition={{ duration: 0.8, delay: 0.4 }}
        style={{
          position: 'absolute', top: '20%',
          width: 80, height: 1.5,
          background: 'linear-gradient(90deg, transparent, var(--gold), transparent)',
        }}
      />

      {/* Divine Manifestation Player */}
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.8, delay: 0.5 }}
        style={{
          flex: 1,
          display: 'flex', flexDirection: 'column',
          alignItems: 'center', justifyContent: 'center',
          position: 'relative',
          zIndex: 10,
        }}
      >
        {/* Swirling Golden Dust */}
        <AnimatePresence>
          {status !== 'idle' && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1, rotate: 360 }}
              exit={{ opacity: 0 }}
              transition={{ 
                opacity: { duration: 2 },
                rotate: { duration: 25, repeat: Infinity, ease: 'linear' } 
              }}
              style={{
                position: 'absolute',
                width: 300, height: 300,
                pointerEvents: 'none',
                zIndex: 0,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
              }}
            >
              {Array.from({ length: 32 }).map((_, i) => {
                // Pseudo-random deterministic values to prevent hydration errors
                const radius = 100 + ((i * 23) % 70); 
                const angle = (i * 360) / 32;
                const size = 2 + ((i * 7) % 4);
                const delay = (i * 11) % 3;
                const duration = 2 + ((i * 5) % 3);

                return (
                  <motion.div
                    key={`dust-${i}`}
                    animate={{ 
                      opacity: [0.1, 0.9, 0.1],
                      scale: [0.8, 1.5, 0.8]
                    }}
                    transition={{
                      duration: duration,
                      repeat: Infinity,
                      delay: delay,
                      ease: 'easeInOut'
                    }}
                    style={{
                      position: 'absolute',
                      width: size, height: size,
                      borderRadius: '50%',
                      background: '#FFF0A0',
                      boxShadow: '0 0 12px #C9A84C, 0 0 4px #FFF0A0',
                      transform: `rotate(${angle}deg) translateY(${radius}px)`,
                    }}
                  />
                );
              })}
            </motion.div>
          )}
        </AnimatePresence>

        <motion.div
          onClick={toggle}
          whileTap={{ scale: 0.95 }}
          animate={status === 'playing' ? {
            y: [0, -10, 0],
            rotateX: [0, 5, 0],
            rotateY: [0, -5, 0],
            boxShadow: ['0 10px 40px rgba(201,168,76,0.2)', '0 20px 50px rgba(201,168,76,0.5)', '0 10px 40px rgba(201,168,76,0.2)']
          } : {
            y: 0, rotateX: 0, rotateY: 0,
            boxShadow: '0 10px 30px rgba(0,0,0,0.8)'
          }}
          transition={{ duration: 5, repeat: status === 'playing' ? Infinity : 0, ease: 'easeInOut' }}
          style={{
            position: 'relative',
            width: 220, height: 220,
            cursor: 'pointer',
            borderRadius: '50%',
            perspective: 1000,
            zIndex: 1,
          }}
        >
          {/* Base Dark Blurred Coin */}
          <div style={{
            position: 'absolute', inset: 0,
            borderRadius: '50%', overflow: 'hidden',
            border: '4px solid #C9A84C',
            filter: `grayscale(1) brightness(0.25) contrast(1.2) blur(${status === 'idle' ? 8 : Math.max(0, 8 - progress * 20)}px)`,
            transition: 'filter 0.5s ease',
          }}>
            <img src="/images/laxmi-coin.png" alt="Coin base" style={{ width: '100%', height: '100%', objectFit: 'cover', transform: 'scale(1.15)' }} />
          </div>

          {/* Top Golden Coin (Fades in and focuses) */}
          <div style={{
            position: 'absolute', inset: 0,
            borderRadius: '50%', overflow: 'hidden',
            border: '4px solid #C9A84C',
            opacity: progress, // Slowly fades in over the entire audio duration!
            filter: `blur(${status === 'idle' ? 8 : Math.max(0, 8 - progress * 20)}px)`,
            transition: 'opacity 0.2s linear, filter 0.5s ease',
          }}>
            <img src="/images/laxmi-coin.png" alt="Coin gold" style={{ width: '100%', height: '100%', objectFit: 'cover', transform: 'scale(1.15)' }} />
            
            {/* Dynamic soft light across the gold coin */}
            {status === 'playing' && (
              <motion.div
                animate={{ left: ['-100%', '100%'] }}
                transition={{ duration: 6, repeat: Infinity, ease: 'easeInOut' }}
                style={{
                  position: 'absolute', top: 0, width: '60%', height: '100%',
                  background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.2), transparent)',
                  transform: 'skewX(-30deg)',
                  pointerEvents: 'none',
                }}
              />
            )}
          </div>
          
          {/* Play overlay for discovery */}
          {status === 'idle' && (
            <div style={{
              position: 'absolute', inset: 0,
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              background: 'rgba(0,0,0,0.5)', borderRadius: '50%',
              backdropFilter: 'blur(4px)',
            }}>
              <PlayIcon />
            </div>
          )}
        </motion.div>

        <p className="hint-text" style={{ 
          color: 'var(--gold)',
          opacity: 0.7,
        }}>
          {status === 'idle' ? t('listen', locale) : status === 'playing' ? (locale === 'hi' ? 'बज रहा है...' : 'playing...') : '✦'}
        </p>
      </motion.div>

      <AnimatePresence>
        {(status === 'done' || status === 'idle') && (
          <motion.button
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.6, delay: status === 'done' ? 0.6 : 2 }}
            onClick={onComplete}
            style={{
              position: 'absolute', bottom: '9%',
              zIndex: 20,
              background: 'linear-gradient(135deg, #E8751A 0%, #C9A84C 100%)',
              border: 'none',
              borderRadius: 100, padding: '14px 46px',
              fontFamily: 'var(--font-sans)', fontSize: '0.75rem',
              letterSpacing: '0.22em', textTransform: 'uppercase',
              color: '#FFF8F0', cursor: 'pointer',
              boxShadow: '0 8px 32px rgba(232,117,26,0.45)',
            }}
          >
            {skipLabel}
          </motion.button>
        )}
      </AnimatePresence>
    </div>
  );
}
