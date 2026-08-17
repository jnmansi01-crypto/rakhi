'use client';
import { useEffect, useRef, useState } from 'react';
import type React from 'react';
import { motion, useMotionValue, useSpring, useTransform, AnimatePresence } from 'framer-motion';
import Link from 'next/link';
import { RakhiHero } from '@/templates/template-01/pages/RakhiHero';
import { getDaysUntilRakhi } from '@/lib/dateUtils';
import { useHaptics } from '@/shared/components/useHaptics';
import type { Locale } from '@/lib/types';

// Gold dust particle
interface GoldDust {
  x: number; y: number; vx: number; vy: number;
  size: number; opacity: number; life: number; maxLife: number;
}

// Removed hardcoded getDaysUntil in favor of getDaysUntilRakhi

// SVG icon components for journey steps
const LetterIcon = () => (
  <svg width="22" height="22" viewBox="0 0 22 22" fill="none">
    <rect x="2" y="5" width="18" height="13" rx="2" stroke="#C9A84C" strokeWidth="1.4"/>
    <path d="M2 7l9 6 9-6" stroke="#C9A84C" strokeWidth="1.4" strokeLinecap="round"/>
    <path d="M6 11h3M6 14h6" stroke="#C9A84C" strokeWidth="1.2" strokeLinecap="round" opacity="0.5"/>
  </svg>
);
const MemoriesIcon = () => (
  <svg width="22" height="22" viewBox="0 0 22 22" fill="none">
    <rect x="2" y="5" width="18" height="13" rx="2" stroke="#C9A84C" strokeWidth="1.4"/>
    <path d="M5 5V4a1 1 0 011-1h2a1 1 0 011 1v1M13 5V4a1 1 0 011-1h2a1 1 0 011 1v1" stroke="#C9A84C" strokeWidth="1.2"/>
    <circle cx="11" cy="12" r="3.2" stroke="#C9A84C" strokeWidth="1.3"/>
    <circle cx="11" cy="12" r="1" fill="#C9A84C"/>
  </svg>
);
const VoiceIcon = () => (
  <svg width="22" height="22" viewBox="0 0 22 22" fill="none">
    <rect x="8" y="2" width="6" height="10" rx="3" stroke="#C9A84C" strokeWidth="1.4"/>
    <path d="M5 11a6 6 0 0012 0" stroke="#C9A84C" strokeWidth="1.4" strokeLinecap="round"/>
    <line x1="11" y1="17" x2="11" y2="20" stroke="#C9A84C" strokeWidth="1.4" strokeLinecap="round"/>
    <line x1="8" y1="20" x2="14" y2="20" stroke="#C9A84C" strokeWidth="1.4" strokeLinecap="round"/>
  </svg>
);
const RakhiIcon = () => (
  <svg width="22" height="22" viewBox="0 0 22 22" fill="none">
    <circle cx="11" cy="11" r="5" stroke="#C9A84C" strokeWidth="1.4"/>
    <circle cx="11" cy="11" r="2" stroke="#C9A84C" strokeWidth="1.2"/>
    <path d="M11 6a5 5 0 010 10" stroke="#E5C97A" strokeWidth="1" strokeDasharray="2 2"/>
    <path d="M2 13c1.5 0 2.5-1 4-1s2 1.5 3 2" stroke="#C9A84C" strokeWidth="1.3" strokeLinecap="round"/>
    <path d="M20 13c-1.5 0-2.5-1-4-1s-2 1.5-3 2" stroke="#C9A84C" strokeWidth="1.3" strokeLinecap="round"/>
    <path d="M6 16c1-1.5 3-3 5-3s4 1.5 5 3" stroke="#C9A84C" strokeWidth="1.1" strokeLinecap="round" opacity="0.6"/>
  </svg>
);
const GiftIcon = () => (
  <svg width="22" height="22" viewBox="0 0 22 22" fill="none">
    <rect x="3" y="9" width="16" height="11" rx="1.5" stroke="#C9A84C" strokeWidth="1.4"/>
    <rect x="2" y="6" width="18" height="4" rx="1.5" stroke="#C9A84C" strokeWidth="1.4"/>
    <line x1="11" y1="6" x2="11" y2="20" stroke="#C9A84C" strokeWidth="1.3"/>
    <path d="M11 6c0 0-2-3-4-2s-1 3 1 3h3" stroke="#C9A84C" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round"/>
    <path d="M11 6c0 0 2-3 4-2s1 3-1 3h-3" stroke="#C9A84C" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
);

// Journey steps
const JOURNEY: { icon: React.ReactNode; label: string; hi: string }[] = [
  { icon: <LetterIcon />,   label: 'Letter',   hi: 'पत्र'  },
  { icon: <MemoriesIcon />, label: 'Memories', hi: 'यादें' },
  { icon: <VoiceIcon />,   label: 'Voice',    hi: 'आवाज़' },
  { icon: <RakhiIcon />,   label: 'Rakhi',    hi: 'राखी'  },
  { icon: <GiftIcon />,    label: 'Gift',     hi: 'उपहार' },
];

export default function HomePage() {
  const canvasRef  = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [daysInfo, setDaysInfo] = useState<{ days: number, date: Date | null }>({ days: 0, date: null });
  const [mounted, setMounted] = useState(false);
  const [locale, setLocale] = useState<Locale>('en');
  const [showStepsModal, setShowStepsModal] = useState(false);
  const { vibrate } = useHaptics();

  const playHoverChime = () => {
    try {
      const AudioContextClass = window.AudioContext || (window as any).webkitAudioContext;
      if (!AudioContextClass) return;
      const ctx = new AudioContextClass();
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(880, ctx.currentTime); // A5
      osc.frequency.exponentialRampToValueAtTime(1760, ctx.currentTime + 0.1); // A6
      gain.gain.setValueAtTime(0, ctx.currentTime);
      gain.gain.linearRampToValueAtTime(0.05, ctx.currentTime + 0.05);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.5);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start();
      osc.stop(ctx.currentTime + 0.5);
    } catch (e) {
      // Ignore if audio fails
    }
  };

  useEffect(() => {
    document.body.classList.add('sender-flow');
    return () => document.body.classList.remove('sender-flow');
  }, []);

  // Parallax on mouse/gyro
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);
  const smoothX = useSpring(mouseX, { stiffness: 40, damping: 18 });
  const smoothY = useSpring(mouseY, { stiffness: 40, damping: 18 });
  const rotateX = useTransform(smoothY, [-300, 300], [6, -6]);
  const rotateY = useTransform(smoothX, [-300, 300], [-6, 6]);
  const glowX   = useTransform(smoothX, [-300, 300], [-20, 20]);
  const glowY   = useTransform(smoothY, [-300, 300], [-20, 20]);

  useEffect(() => {
    setMounted(true);
    setDaysInfo(getDaysUntilRakhi());

    // Mouse parallax
    const onMove = (e: MouseEvent) => {
      const cx = window.innerWidth  / 2;
      const cy = window.innerHeight / 2;
      mouseX.set(e.clientX - cx);
      mouseY.set(e.clientY - cy);
    };
    // Gyroscope parallax for mobile
    const onOrientation = (e: DeviceOrientationEvent) => {
      if (e.gamma != null && e.beta != null) {
        mouseX.set(e.gamma * 4);
        mouseY.set((e.beta - 45) * 4);
      }
    };
    window.addEventListener('mousemove', onMove);
    window.addEventListener('deviceorientation', onOrientation);
    return () => {
      window.removeEventListener('mousemove', onMove);
      window.removeEventListener('deviceorientation', onOrientation);
    };
  }, [mouseX, mouseY]);

  // Gold dust canvas
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const resize = () => {
      canvas.width  = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    resize();
    window.addEventListener('resize', resize);

    const dust: GoldDust[] = Array.from({ length: 80 }, () => ({
      x: Math.random() * canvas.width,
      y: Math.random() * canvas.height,
      vx: (Math.random() - 0.5) * 0.3,
      vy: -(0.3 + Math.random() * 0.5),
      size: 1 + Math.random() * 2.5,
      opacity: 0,
      life: Math.random() * 200,
      maxLife: 180 + Math.random() * 120,
    }));

    let raf: number;
    const draw = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      dust.forEach(p => {
        p.life++;
        if (p.life > p.maxLife) {
          p.life = 0;
          p.x = Math.random() * canvas.width;
          p.y = canvas.height + 10;
          p.vy = -(0.3 + Math.random() * 0.5);
          p.vx = (Math.random() - 0.5) * 0.3;
          p.maxLife = 180 + Math.random() * 120;
        }
        const lifeRatio = p.life / p.maxLife;
        p.opacity = lifeRatio < 0.15
          ? lifeRatio / 0.15
          : lifeRatio > 0.85
          ? (1 - lifeRatio) / 0.15
          : 1;
        p.x += p.vx;
        p.y += p.vy;

        // Gold gradient dot
        const grad = ctx.createRadialGradient(p.x, p.y, 0, p.x, p.y, p.size * 2);
        grad.addColorStop(0, `rgba(229,201,122,${p.opacity * 0.9})`);
        grad.addColorStop(0.5, `rgba(201,168,76,${p.opacity * 0.5})`);
        grad.addColorStop(1, 'rgba(201,168,76,0)');
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size * 2, 0, Math.PI * 2);
        ctx.fillStyle = grad;
        ctx.fill();
      });
      raf = requestAnimationFrame(draw);
    };
    draw();
    return () => { cancelAnimationFrame(raf); window.removeEventListener('resize', resize); };
  }, []);

  return (
    <div
      ref={containerRef}
      style={{
        minHeight: '100dvh',
        position: 'relative',
        overflowX: 'hidden',
        overflowY: 'auto',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: '0',
        background: '#080408',
      }}
    >
      {/* ── Cinematic dark receiver theme ────────────────── */}
      <div style={{
        position: 'absolute', inset: 0,
        background: 'radial-gradient(ellipse at 55% 15%, #2A0D1E 0%, #160818 50%, #080408 100%)',
      }}/>

      <motion.div
        style={{
          position: 'absolute', inset: 0,
          background: 'radial-gradient(circle at 80% 20%, rgba(201,168,76,0.12) 0%, transparent 60%)',
          x: glowX, y: glowY,
        }}
      />

      {/* ── Vignette overlay ───────────────────────────────── */}
      <div style={{
        position: 'absolute', inset: 0,
        background: 'radial-gradient(ellipse at 50% 50%, transparent 20%, rgba(8,4,8,0.85) 100%)',
        pointerEvents: 'none',
      }}/>

      {/* ── Gold dust canvas ───────────────────────────────── */}
      <canvas ref={canvasRef} style={{ position: 'absolute', inset: 0, pointerEvents: 'none', zIndex: 1 }} />

      {/* ── Content wrapper ────────────────────────────────── */}
      <div style={{
        position: 'relative', zIndex: 10,
        width: '100%', maxWidth: 480,
        display: 'flex', flexDirection: 'column',
        alignItems: 'center',
        padding: '0 28px',
        flex: 1,
        justifyContent: 'space-between',
        paddingTop: 'env(safe-area-inset-top, 20px)',
        paddingBottom: 'env(safe-area-inset-bottom, 28px)',
      }}>

        {/* ── Top bar ──────────────────────────────────────── */}
        <motion.div
          initial={{ opacity: 0, y: -12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.1 }}
          style={{
            width: '100%', display: 'flex',
            alignItems: 'center', justifyContent: 'space-between',
            paddingTop: 20,
          }}
        >
          {/* Logo & Lang Toggle */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
              <img 
                src="/images/loment-logo.svg" 
                alt="Loment Logo" 
                style={{ width: 32, height: 32, objectFit: 'contain' }}
              />
              <span style={{
                fontFamily: 'var(--font-sans)',
                fontWeight: 600,
                fontSize: '1.25rem',
                color: '#FFF8F0',
                letterSpacing: '0.12em',
                textTransform: 'uppercase'
              }}>
                Loment
              </span>
            </div>
            {/* Language toggle */}
            <div style={{ display: 'flex', gap: 4, background: 'rgba(255,255,255,0.05)', borderRadius: 100, padding: 2 }}>
              {(['en','hi'] as Locale[]).map(l => (
                <button key={l} onClick={() => setLocale(l)} style={{
                  padding: '4px 12px', borderRadius: 100, cursor: 'pointer', border: 'none',
                  background: locale === l ? 'rgba(201,168,76,0.3)' : 'transparent',
                  color: locale === l ? '#fff' : 'rgba(201,168,76,0.6)',
                  fontFamily: 'var(--font-sans)', fontSize: '0.75rem', letterSpacing: '0.05em', transition: 'all 0.2s'
                }}>
                  {l === 'en' ? 'EN' : 'HI'}
                </button>
              ))}
            </div>
          </div>

          {/* Days counter */}
          {daysInfo.days > 0 && mounted && daysInfo.date && (
            <div style={{
              background: 'rgba(255,255,255,0.05)',
              border: '1px solid rgba(201,168,76,0.5)',
              backdropFilter: 'blur(10px)',
              WebkitBackdropFilter: 'blur(10px)',
              borderRadius: 100,
              padding: '6px 16px',
              display: 'flex', alignItems: 'center', gap: 6,
              boxShadow: '0 4px 12px rgba(0,0,0,0.2)',
            }}>
              <span style={{
                fontFamily: 'var(--font-sans)', fontSize: '0.68rem',
                letterSpacing: '0.12em', textTransform: 'uppercase',
                color: 'var(--gold)',
              }}>
                {daysInfo.days}d left · {daysInfo.date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
              </span>
            </div>
          )}
        </motion.div>

        {/* ── Hero visual ──────────────────────────────────── */}
        <div style={{ position: 'relative', width: '100%', display: 'flex', justifyContent: 'center', paddingTop: 20 }}>

          {/* Ambient glow blob */}
          <motion.div
            animate={{
              scale:   [1, 1.15, 1],
              opacity: [0.3, 0.5, 0.3],
            }}
            transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
            style={{
              position: 'absolute', top: '50%', left: '50%',
              transform: 'translate(-50%, -50%)',
              width: 260, height: 260,
              borderRadius: '50%',
              background: 'radial-gradient(circle, rgba(232,117,26,0.35) 0%, rgba(201,168,76,0.15) 50%, transparent 70%)',
              filter: 'blur(32px)',
              pointerEvents: 'none',
            }}
          />

          {/* Rotating outer ring with tick marks */}
          <motion.svg
            animate={{ rotate: 360 }}
            transition={{ duration: 30, repeat: Infinity, ease: 'linear' }}
            style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%,-50%)', width: 240, height: 240 }}
            viewBox="0 0 240 240"
          >
            {Array.from({ length: 36 }, (_, i) => {
              const angle = (i / 36) * 2 * Math.PI;
              const inner = i % 3 === 0 ? 112 : 116;
              const outer = i % 3 === 0 ? 120 : 118;
              return (
                <line
                  key={i}
                  x1={120 + inner * Math.cos(angle)}
                  y1={120 + inner * Math.sin(angle)}
                  x2={120 + outer * Math.cos(angle)}
                  y2={120 + outer * Math.sin(angle)}
                  stroke="rgba(201,168,76,0.5)"
                  strokeWidth={i % 3 === 0 ? 1.5 : 0.8}
                />
              );
            })}
            <circle cx="120" cy="120" r="110" fill="none" stroke="rgba(201,168,76,0.18)" strokeWidth="0.8"/>
          </motion.svg>

          {/* Counter-rotating inner ring */}
          <motion.svg
            animate={{ rotate: -360 }}
            transition={{ duration: 18, repeat: Infinity, ease: 'linear' }}
            style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%,-50%)', width: 180, height: 180 }}
            viewBox="0 0 180 180"
          >
            {Array.from({ length: 8 }, (_, i) => {
              const angle = (i / 8) * 2 * Math.PI;
              return (
                <text
                  key={i}
                  x={90 + 80 * Math.cos(angle)}
                  y={90 + 80 * Math.sin(angle)}
                  textAnchor="middle" dominantBaseline="middle"
                  fontSize="12" fill="rgba(201,168,76,0.4)"
                  style={{ fontFamily: 'serif' }}
                >
                  ✦
                </text>
              );
            })}
            <circle cx="90" cy="90" r="84" fill="none" stroke="rgba(201,168,76,0.12)" strokeWidth="0.6" strokeDasharray="4 6"/>
          </motion.svg>

          <RakhiHero rotateX={rotateX} rotateY={rotateY} />
        </div>

        {/* ── Text section ─────────────────────────────────── */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.9, delay: 0.4, ease: [0.16, 1, 0.3, 1] }}
          style={{ textAlign: 'center', width: '100%' }}
        >
          {/* Script sub-label */}
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.6 }}
            style={{
              fontFamily: 'var(--font-script)',
              fontSize: '1rem',
              color: 'rgba(201,168,76,0.7)',
              marginBottom: 10,
              letterSpacing: '0.04em',
            }}
          >
            {locale === 'en' ? 'A gift from the heart' : 'दिल से दिया गया एक उपहार'}
          </motion.p>

          {/* Headline */}
          <h1 style={{
            fontFamily: 'var(--font-serif)',
            fontSize: 'clamp(2.2rem, 10vw, 3.8rem)',
            color: '#FFF8F0',
            lineHeight: 1.1,
            marginBottom: 16,
            fontWeight: 400,
            letterSpacing: '-0.02em',
          }}>
            {locale === 'en' ? (
              <>
                Send a Rakhi experience<br />
                <span style={{
                  background: 'linear-gradient(90deg, #E5C97A 0%, #C9A84C 30%, #fff9e0 50%, #C9A84C 70%, #E5C97A 100%)',
                  backgroundSize: '200% 100%',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                  backgroundClip: 'text',
                  animation: 'shimmer 3s linear infinite',
                }}>
                  they&apos;ll never forget.
                </span>
              </>
            ) : (
              <>
                एक ऐसा पल भेजें<br />
                <span style={{
                  background: 'linear-gradient(90deg, #E5C97A 0%, #C9A84C 30%, #fff9e0 50%, #C9A84C 70%, #E5C97A 100%)',
                  backgroundSize: '200% 100%',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                  backgroundClip: 'text',
                  animation: 'shimmer 3s linear infinite',
                }}>
                  जिसे वो कभी भूल न पाएं।
                </span>
              </>
            )}
          </h1>

          {/* Sub */}
          <p style={{
            fontFamily: 'var(--font-sans)',
            fontWeight: 300,
            fontSize: '0.96rem',
            color: 'rgba(255,255,255,0.75)',
            lineHeight: 1.6,
            marginBottom: 32,
            letterSpacing: '0.01em',
            maxWidth: 480,
          }}>
            {locale === 'en' ? (
              <>A personalised Rakhi experience made from your memories, voice and words — delivered as one magical link.</>
            ) : (
              <>यादों, आवाज़ और शब्दों से बना एक व्यक्तिगत राखी अनुभव — एक जादुई लिंक में।</>
            )}
          </p>
        </motion.div>

        {/* ── CTA ──────────────────────────────────────────── */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.7, ease: [0.16, 1, 0.3, 1] }}
          style={{ width: '100%', paddingBottom: 8 }}
        >
          <Link href="/select" style={{ textDecoration: 'none', display: 'block' }}>
            <motion.div
              whileHover={{ scale: 1.025 }}
              whileTap={{ scale: 0.97 }}
              onHoverStart={() => { playHoverChime(); vibrate(); }}
              style={{
                position: 'relative',
                width: '100%',
                padding: '18px 40px',
                borderRadius: 100,
                background: 'rgba(201,168,76,0.1)',
                border: '1px solid rgba(201,168,76,0.5)',
                backdropFilter: 'blur(20px)',
                WebkitBackdropFilter: 'blur(20px)',
                boxShadow: '0 8px 32px rgba(0,0,0,0.5), inset 0 2px 4px rgba(255,255,255,0.05)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: 10,
                overflow: 'hidden',
                cursor: 'pointer',
              }}
            >
              {/* Sheen sweep */}
              <motion.div
                animate={{ x: ['-100%', '200%'] }}
                transition={{ duration: 2.5, repeat: Infinity, repeatDelay: 3, ease: 'easeInOut' }}
                style={{
                  position: 'absolute', inset: 0,
                  background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.15), transparent)',
                  pointerEvents: 'none',
                }}
              />
              <span style={{
                fontFamily: 'var(--font-sans)',
                fontSize: '1rem',
                fontWeight: 400,
                letterSpacing: '0.06em',
                color: '#FFF8F0',
                textTransform: 'uppercase',
              }}>
                {locale === 'en' ? 'Create Your Experience' : 'अपना उपहार बनाएं'} <span style={{ fontFamily: 'serif' }}>→</span>
              </span>
            </motion.div>
          </Link>

          {/* Link to show Creation Steps */}
          <button
            onClick={() => setShowStepsModal(true)}
            style={{
              background: 'none',
              border: 'none',
              color: '#C9A84C',
              fontFamily: 'var(--font-sans)',
              fontSize: '0.85rem',
              fontWeight: 500,
              textDecoration: 'underline',
              textUnderlineOffset: '4px',
              cursor: 'pointer',
              marginTop: 18,
              display: 'block',
              width: '100%',
              textAlign: 'center',
              transition: 'all 0.2s ease',
              opacity: 0.9,
            }}
          >
            {locale === 'en' ? 'how to craft your experience?' : 'अनुभव कैसे बनाएं?'}
          </button>

          {/* Hindi tagline */}
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1.4 }}
            style={{
              textAlign: 'center',
              fontFamily: 'var(--font-serif)',
              fontStyle: 'italic',
              fontSize: '0.82rem',
              color: 'rgba(201,168,76,0.38)',
              marginTop: 18,
              letterSpacing: '0.03em',
            }}
          >
            राखी की हार्दिक शुभकामनाएं 🌸
          </motion.p>
        </motion.div>
      </div>

      {/* Creation Steps Modal */}
      <AnimatePresence>
        {showStepsModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            style={{
              position: 'fixed', inset: 0,
              background: 'rgba(8, 4, 8, 0.92)',
              backdropFilter: 'blur(12px)',
              WebkitBackdropFilter: 'blur(12px)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              zIndex: 999,
              padding: 16
            }}
            onClick={() => setShowStepsModal(false)}
          >
            <motion.div
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.9, y: 20 }}
              onClick={(e) => e.stopPropagation()}
              style={{
                width: '100%',
                maxWidth: 400,
                display: 'flex', flexDirection: 'column',
                alignItems: 'center',
              }}
            >
              <div style={{
                width: '100%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                marginBottom: 12,
              }}>
                <span style={{ fontSize: '0.72rem', color: '#C9A84C', letterSpacing: '0.12em', textTransform: 'uppercase', fontWeight: 600 }}>
                  {locale === 'hi' ? '6 आसान चरण' : '6 SIMPLE CREATION STEPS'}
                </span>
                <button
                  onClick={() => setShowStepsModal(false)}
                  style={{
                    background: 'rgba(255,255,255,0.08)',
                    border: '1px solid rgba(255,255,255,0.15)',
                    color: '#fff',
                    borderRadius: '50%',
                    width: 34, height: 34,
                    fontSize: '1.1rem',
                    cursor: 'pointer',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    flexShrink: 0,
                  }}
                >
                  ✕
                </button>
              </div>

              <div style={{
                width: '100%',
                maxHeight: '74vh',
                overflowY: 'auto',
                WebkitOverflowScrolling: 'touch',
                touchAction: 'pan-y',
                overscrollBehaviorY: 'contain',
                background: 'rgba(12, 6, 12, 0.95)',
                border: '1.5px solid rgba(201,168,76,0.3)',
                borderRadius: 24,
                padding: '24px 18px 24px',
                display: 'flex', flexDirection: 'column', gap: 14,
                color: '#FFF8F0',
                fontFamily: 'var(--font-sans)',
                boxSizing: 'border-box',
                boxShadow: '0 20px 40px rgba(0,0,0,0.8), 0 0 30px rgba(201,168,76,0.12)',
              }}>
                <div style={{ textAlign: 'center', marginBottom: 4 }}>
                  <h3 style={{ fontFamily: 'Georgia, serif', fontSize: '1.25rem', margin: '2px 0 4px', fontWeight: 400 }}>
                    {locale === 'hi' ? 'अपना अनुभव कैसे बनाएं' : 'How You Craft Your Experience'}
                  </h3>
                  <p style={{ fontSize: '0.75rem', color: 'rgba(255,248,240,0.6)', margin: 0 }}>
                    {locale === 'hi' ? 'केवल 2 मिनट में पूरा करें' : 'Takes less than 2 minutes'}
                  </p>
                </div>

                {[
                  {
                    num: '1', icon: '🏷️',
                    title: locale === 'hi' ? 'नाम दर्ज करें' : 'Names & Language',
                    desc: locale === 'hi' ? 'अपना और अपने भाई/बहन का नाम लिखें (अंग्रेजी या हिन्दी)।' : 'Add your name & sibling’s name in English or Devanagari.',
                  },
                  {
                    num: '2', icon: '💌',
                    title: locale === 'hi' ? 'प्यार भरा पत्र' : 'Personal Letter',
                    desc: locale === 'hi' ? '3 भावुक टेम्पलेट्स में से चुनें या अपना संदेश लिखें।' : 'Pick from 3 pre-written emotional templates or write custom.',
                  },
                  {
                    num: '3', icon: '📷',
                    title: locale === 'hi' ? 'यादों की फ़ोटो' : 'Memories & Photos',
                    desc: locale === 'hi' ? '5 फ़ोटो तक अपलोड करें जो 3D पोलरॉइड एल्बम बनती हैं।' : 'Upload up to 5 photos transformed into 3D scrapbook polaroids.',
                  },
                  {
                    num: '4', icon: '🎙️',
                    title: locale === 'hi' ? 'आवाज़ रिकॉर्ड करें' : 'Voice Message',
                    desc: locale === 'hi' ? 'अपनी आवाज में बधाई संदेश रिकॉर्ड करें (वैकल्पिक)।' : 'Record a personal audio note in your voice (optional).',
                  },
                  {
                    num: '5', icon: '🎁',
                    title: locale === 'hi' ? 'डिजिटल शगुन' : 'Digital Shagun / Gift',
                    desc: locale === 'hi' ? 'अमेज़न वाउचर, पैसे, कूपन या सीक्रेट मैसेज जोड़ें।' : 'Attach Amazon Vouchers, UPI money, Coupons, or Secret Messages.',
                  },
                  {
                    num: '6', icon: '🚀',
                    title: locale === 'hi' ? 'पूर्वावलोकन और साझा करें' : 'Instant Link & Share',
                    desc: locale === 'hi' ? 'व्हाट्सएप पर तुरंत एक क्लिक में लिंक भेजें।' : 'Generate an interactive keepsake link & share on WhatsApp.',
                  },
                ].map((st) => (
                  <div key={st.num} style={{
                    background: 'rgba(255,255,255,0.03)',
                    border: '1px solid rgba(201,168,76,0.18)',
                    borderRadius: 14,
                    padding: '12px 14px',
                    display: 'flex', gap: 12, alignItems: 'flex-start',
                  }}>
                    <div style={{
                      width: 32, height: 32, borderRadius: 10,
                      background: 'rgba(201,168,76,0.12)',
                      border: '1px solid rgba(201,168,76,0.3)',
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                      fontSize: '1rem', flexShrink: 0,
                    }}>
                      {st.icon}
                    </div>
                    <div style={{ flex: 1 }}>
                      <h4 style={{ fontSize: '0.82rem', margin: 0, color: '#FFF8F0', fontWeight: 600 }}>
                        {st.num}. {st.title}
                      </h4>
                      <p style={{ fontSize: '0.72rem', margin: '4px 0 0', color: 'rgba(255,248,240,0.65)', lineHeight: 1.4 }}>
                        {st.desc}
                      </p>
                    </div>
                  </div>
                ))}

                <Link href="/select" style={{ textDecoration: 'none', width: '100%', marginTop: 8 }}>
                  <button
                    onClick={() => setShowStepsModal(false)}
                    style={{
                      width: '100%',
                      padding: '14px',
                      borderRadius: 12,
                      background: 'linear-gradient(135deg, #C9A84C 0%, #A37C1E 100%)',
                      color: '#080408',
                      fontWeight: 700,
                      fontSize: '0.85rem',
                      border: 'none',
                      cursor: 'pointer',
                      boxShadow: '0 4px 15px rgba(201,168,76,0.35)',
                      textAlign: 'center',
                    }}
                  >
                    {locale === 'hi' ? 'अनुभव बनाना शुरू करें →' : 'Create Your Experience →'}
                  </button>
                </Link>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ── Initial Cinematic Reveal Overlay ─────────────────── */}
      <motion.div
        initial={{ opacity: 1 }}
        animate={{ opacity: 0 }}
        transition={{ duration: 2.5, ease: 'easeInOut', delay: 0.2 }}
        style={{
          position: 'fixed', inset: 0,
          background: '#080408',
          zIndex: 9999,
          pointerEvents: 'none',
        }}
      />
    </div>
  );
}
