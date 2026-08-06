'use client';
// Template 02 — Scene 1: Welcome
// Cosmic starfield arrival. Deep navy, silver particles, constellation reveal.
// Independent of Template 01. Shares only: useHaptics, Locale type.

import { useEffect, useRef, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useHaptics } from '@/shared/components/useHaptics';
import type { Locale } from '@/lib/types';

interface Props {
  senderName: string;
  recipientName: string;
  locale: Locale;
  onComplete: () => void;
}

// ── Starfield canvas ──────────────────────────────────────────────────────────
function Starfield() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const resize = () => { canvas.width = window.innerWidth; canvas.height = window.innerHeight; };
    resize();
    window.addEventListener('resize', resize);

    const stars = Array.from({ length: 180 }, () => ({
      x: Math.random() * canvas.width,
      y: Math.random() * canvas.height,
      r: 0.2 + Math.random() * 1.4,
      alpha: 0.1 + Math.random() * 0.9,
      speed: 0.002 + Math.random() * 0.004,
      phase: Math.random() * Math.PI * 2,
    }));

    let raf: number;
    let t = 0;
    const draw = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      t += 0.01;
      stars.forEach(s => {
        const pulse = s.alpha * (0.6 + 0.4 * Math.sin(t * s.speed * 100 + s.phase));
        ctx.beginPath();
        ctx.arc(s.x, s.y, s.r, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(200,210,255,${pulse})`;
        ctx.fill();
      });
      raf = requestAnimationFrame(draw);
    };
    draw();
    return () => { cancelAnimationFrame(raf); window.removeEventListener('resize', resize); };
  }, []);

  return <canvas ref={canvasRef} style={{ position: 'absolute', inset: 0, pointerEvents: 'none' }} />;
}

// ── Main Scene ────────────────────────────────────────────────────────────────
const MESSAGES_EN = (sender: string) => [
  `${sender} made something\nspecial for you.`,
  `Open your heart.\nThis is just for you.`,
];
const MESSAGES_HI = (sender: string) => [
  `${sender} ने तुम्हारे लिए\nकुछ खास बनाया है।`,
  `दिल खोलो।\nयह सिर्फ तुम्हारे लिए है।`,
];

export function Scene1_Welcome({ senderName, recipientName, locale, onComplete }: Props) {
  const [phase, setPhase] = useState(0); // 0=intro, 1=msg1, 2=msg2, 3=name reveal, 4=cta
  const { vibrate } = useHaptics();
  const messages = locale === 'hi' ? MESSAGES_HI(senderName) : MESSAGES_EN(senderName);

  useEffect(() => {
    const timers = [
      setTimeout(() => setPhase(1), 800),
      setTimeout(() => setPhase(2), 3200),
      setTimeout(() => setPhase(3), 5600),
      setTimeout(() => setPhase(4), 7400),
    ];
    return () => timers.forEach(clearTimeout);
  }, []);

  const handleTap = () => {
    if (phase < 4) return;
    vibrate();
    onComplete();
  };

  return (
    <div
      onClick={handleTap}
      style={{
        position: 'fixed', inset: 0,
        background: 'radial-gradient(ellipse at 30% 20%, #1a1f3a 0%, #0a0e1a 60%, #050810 100%)',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        cursor: phase >= 4 ? 'pointer' : 'default',
        overflow: 'hidden',
      }}
    >
      <Starfield />

      {/* Ambient nebula glow */}
      <motion.div
        animate={{ scale: [1, 1.2, 1], opacity: [0.15, 0.3, 0.15] }}
        transition={{ duration: 6, repeat: Infinity, ease: 'easeInOut' }}
        style={{
          position: 'absolute', width: 500, height: 500, borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(124,131,253,0.25) 0%, transparent 70%)',
          filter: 'blur(60px)', pointerEvents: 'none',
        }}
      />

      <div style={{ position: 'relative', zIndex: 10, textAlign: 'center', padding: '0 32px', maxWidth: 420 }}>

        {/* Phase 1 & 2 — floating messages */}
        <AnimatePresence mode="wait">
          {(phase === 1 || phase === 2) && (
            <motion.p
              key={phase}
              initial={{ opacity: 0, y: 20, filter: 'blur(8px)' }}
              animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
              exit={{ opacity: 0, y: -16, filter: 'blur(8px)' }}
              transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
              style={{
                fontFamily: 'system-ui, -apple-system, sans-serif',
                fontSize: 'clamp(1.2rem, 5vw, 1.6rem)',
                fontWeight: 300,
                color: 'rgba(220,225,255,0.85)',
                lineHeight: 1.5,
                letterSpacing: '0.02em',
                whiteSpace: 'pre-line',
              }}
            >
              {messages[phase - 1]}
            </motion.p>
          )}
        </AnimatePresence>

        {/* Phase 3 — recipient name */}
        <AnimatePresence>
          {phase >= 3 && (
            <motion.div
              initial={{ opacity: 0, scale: 0.85 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 1.2, ease: [0.22, 1, 0.36, 1] }}
            >
              {/* Decorative line above */}
              <motion.div
                initial={{ scaleX: 0 }}
                animate={{ scaleX: 1 }}
                transition={{ duration: 0.8, delay: 0.3 }}
                style={{
                  height: 1, background: 'linear-gradient(90deg, transparent, rgba(168,174,255,0.6), transparent)',
                  marginBottom: 28,
                }}
              />
              <p style={{
                fontFamily: 'system-ui, sans-serif',
                fontSize: '0.75rem',
                letterSpacing: '0.22em',
                textTransform: 'uppercase',
                color: 'rgba(168,174,255,0.6)',
                marginBottom: 12,
                fontWeight: 400,
              }}>
                {locale === 'hi' ? 'के लिए' : 'For'}
              </p>
              <h1 style={{
                fontFamily: 'Georgia, serif',
                fontSize: 'clamp(2.4rem, 10vw, 4rem)',
                fontWeight: 400,
                background: 'linear-gradient(135deg, #c8c8ff 0%, #ffffff 40%, #a8aeff 100%)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                backgroundClip: 'text',
                letterSpacing: '-0.01em',
                lineHeight: 1.1,
                marginBottom: 28,
              }}>
                {recipientName}
              </h1>
              <motion.div
                initial={{ scaleX: 0 }}
                animate={{ scaleX: 1 }}
                transition={{ duration: 0.8, delay: 0.5 }}
                style={{
                  height: 1, background: 'linear-gradient(90deg, transparent, rgba(168,174,255,0.6), transparent)',
                  marginBottom: 40,
                }}
              />
            </motion.div>
          )}
        </AnimatePresence>

        {/* Phase 4 — CTA */}
        <AnimatePresence>
          {phase >= 4 && (
            <motion.div
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7 }}
            >
              <motion.div
                animate={{ opacity: [0.5, 1, 0.5] }}
                transition={{ duration: 2, repeat: Infinity }}
                style={{
                  fontFamily: 'system-ui, sans-serif',
                  fontSize: '0.78rem',
                  letterSpacing: '0.18em',
                  textTransform: 'uppercase',
                  color: 'rgba(168,174,255,0.7)',
                }}
              >
                {locale === 'hi' ? 'खोलने के लिए टैप करें' : 'Tap to begin'}
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
