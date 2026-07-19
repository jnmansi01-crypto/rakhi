'use client';
import { useEffect, useRef, useState } from 'react';
import type React from 'react';
import { motion, useMotionValue, useSpring, useTransform } from 'framer-motion';
import Link from 'next/link';
import { RakhiHero } from '../components/RakhiHero';
import { getDaysUntilRakhi } from '@/lib/dateUtils';

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
        overflow: 'hidden',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: '0',
        background: '#0D1526',
      }}
    >
      {/* ── Background mandala image ───────────────────────── */}
      <motion.div
        style={{
          position: 'absolute', inset: 0,
          backgroundImage: 'url(/hero-bg.png)',
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          opacity: 0.5,
          x: glowX, y: glowY,
        }}
      />

      {/* ── Vignette overlay ───────────────────────────────── */}
      <div style={{
        position: 'absolute', inset: 0,
        background: 'radial-gradient(ellipse at 50% 40%, transparent 15%, rgba(13,21,38,0.55) 55%, rgba(13,21,38,0.92) 100%)',
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
          {/* Logo */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <span style={{ fontSize: '1.3rem' }}>🌸</span>
            <span style={{
              fontFamily: 'var(--font-serif)', fontStyle: 'italic',
              fontSize: '1.1rem', color: '#FFF8F0',
              letterSpacing: '0.02em',
            }}>
              Rakhi
            </span>
          </div>

          {/* Days counter */}
          {daysInfo.days > 0 && mounted && daysInfo.date && (
            <div style={{
              background: 'rgba(201,168,76,0.12)',
              border: '1px solid rgba(201,168,76,0.28)',
              borderRadius: 100,
              padding: '5px 14px',
              display: 'flex', alignItems: 'center', gap: 6,
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
            A gift from the heart
          </motion.p>

          {/* Headline */}
          <h1 style={{
            fontFamily: 'var(--font-serif)',
            fontSize: 'clamp(1.75rem, 8vw, 2.6rem)',
            color: '#FFF8F0',
            lineHeight: 1.2,
            marginBottom: 12,
            fontWeight: 700,
            letterSpacing: '-0.01em',
          }}>
            Send a Rakhi<br />
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
          </h1>

          {/* Sub */}
          <p style={{
            fontFamily: 'var(--font-serif)',
            fontStyle: 'italic',
            fontSize: '0.97rem',
            color: 'rgba(255,248,240,0.48)',
            lineHeight: 1.75,
            marginBottom: 32,
          }}>
            An immersive digital ritual — letter, voice,<br />
            memories, Rakhi-tying &amp; a gift, all in one link.
          </p>

          {/* Journey preview dots */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.9 }}
            style={{
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
              gap: 0,
              marginBottom: 32,
            }}
          >
            {JOURNEY.map((step, i) => (
              <div key={step.label} style={{ display: 'flex', alignItems: 'center' }}>
                <motion.div
                  initial={{ scale: 0, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{ delay: 1 + i * 0.1, duration: 0.4, ease: [0.34, 1.56, 0.64, 1] }}
                  style={{
                    display: 'flex', flexDirection: 'column',
                    alignItems: 'center', gap: 6,
                  }}
                >
                  <motion.div
                    whileHover={{ scale: 1.08, boxShadow: '0 0 20px rgba(201,168,76,0.25)' }}
                    style={{
                      width: 50, height: 50, borderRadius: '50%',
                      background: 'linear-gradient(145deg, rgba(201,168,76,0.14), rgba(201,168,76,0.04))',
                      border: '1px solid rgba(201,168,76,0.28)',
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                      backdropFilter: 'blur(10px)',
                      boxShadow: '0 4px 20px rgba(0,0,0,0.35)',
                    }}
                  >
                    {step.icon}
                  </motion.div>
                  <span style={{
                    fontFamily: 'var(--font-sans)',
                    fontSize: '0.58rem',
                    letterSpacing: '0.1em',
                    color: 'rgba(201,168,76,0.6)',
                    textTransform: 'uppercase',
                    fontWeight: 500,
                  }}>
                    {step.label}
                  </span>
                </motion.div>
                {i < JOURNEY.length - 1 && (
                  <div style={{
                    width: 20, height: 1, margin: '0 2px',
                    background: 'linear-gradient(90deg, rgba(201,168,76,0.4), rgba(201,168,76,0.1))',
                    marginBottom: 18,
                  }}/>
                )}
              </div>
            ))}
          </motion.div>
        </motion.div>

        {/* ── CTA ──────────────────────────────────────────── */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.7, ease: [0.16, 1, 0.3, 1] }}
          style={{ width: '100%', paddingBottom: 8 }}
        >
          <Link href="/create" style={{ textDecoration: 'none', display: 'block' }}>
            <motion.div
              whileHover={{ scale: 1.025 }}
              whileTap={{ scale: 0.97 }}
              style={{
                position: 'relative',
                width: '100%',
                padding: '19px 32px',
                borderRadius: 100,
                background: 'linear-gradient(135deg, #E8751A 0%, #C0392B 100%)',
                boxShadow: '0 16px 60px rgba(232,117,26,0.5), 0 4px 20px rgba(192,57,43,0.3)',
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
              <span style={{ fontSize: '1.2rem' }}>🎀</span>
              <span style={{
                fontFamily: 'var(--font-sans)',
                fontSize: '1rem',
                fontWeight: 600,
                letterSpacing: '0.04em',
                color: '#FFF8F0',
              }}>
                Create Rakhi Gift
              </span>
            </motion.div>
          </Link>

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
    </div>
  );
}
