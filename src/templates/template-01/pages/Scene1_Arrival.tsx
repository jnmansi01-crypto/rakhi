'use client';
import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useHaptics } from '@/shared/components/useHaptics';
import type { Locale } from '@/lib/types';
import { t } from '@/lib/i18n';

interface Props {
  senderName: string;
  recipientName: string;
  locale: Locale;
  onComplete: () => void;
}

// Ambient marigold petals
const PETALS = [
  { id: 1, x: 15, delay: 0.2,  duration: 9,  hue: '#E8751A' },
  { id: 2, x: 85, delay: 1.5,  duration: 11, hue: '#C9A84C' },
  { id: 3, x: 35, delay: 2.8,  duration: 8,  hue: '#E8961A' },
  { id: 4, x: 65, delay: 0.8,  duration: 10, hue: '#E8751A' },
];

// Gold sparkle positions
const SPARKLES = [
  { id: 1, x: '22%', y: '25%', delay: 0.5 },
  { id: 2, x: '78%', y: '18%', delay: 1.2 },
  { id: 3, x: '12%', y: '65%', delay: 2.4 },
  { id: 4, x: '85%', y: '75%', delay: 0.9 },
  { id: 5, x: '50%', y: '85%', delay: 3.1 },
];

// SVG Lotus for the gift seal
function PremiumSeal() {
  return (
    <div style={{
      width: '100%', height: '100%',
      borderRadius: '50%',
      background: 'radial-gradient(circle at 35% 30%, #E8751A 0%, #9B2247 60%, #4A0B14 100%)',
      boxShadow: '0 8px 24px rgba(155,34,71,0.6), inset 0 2px 4px rgba(255,255,255,0.4)',
      border: '2px solid rgba(201,168,76,0.8)',
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      position: 'relative'
    }}>
      {/* Intricate gold dots ring */}
      <svg width="100%" height="100%" viewBox="0 0 100 100" style={{ position: 'absolute', inset: 0 }}>
        <circle cx="50" cy="50" r="42" fill="none" stroke="rgba(201,168,76,0.6)" strokeWidth="1" strokeDasharray="3 4" />
      </svg>
      {/* Center Lotus */}
      <svg width="32" height="32" viewBox="0 0 24 24" fill="none">
        <path d="M12 3 C11.5 6.5 10 9 10 12 C10 14 11 15 12 15 C13 15 14 14 14 12 C14 9 12.5 6.5 12 3Z" fill="rgba(255,255,255,0.95)"/>
        <path d="M5 9 C6.5 10 8 11.5 8.5 13.5 C9 15.5 8 17 10 17.5 C10 15.5 9 13.5 7 11.5Z" fill="rgba(255,255,255,0.85)"/>
        <path d="M19 9 C17.5 10 16 11.5 15.5 13.5 C15 15.5 16 17 14 17.5 C14 15.5 15 13.5 17 11.5Z" fill="rgba(255,255,255,0.85)"/>
        <path d="M8 18 Q12 15 16 18" stroke="rgba(255,255,255,0.7)" strokeWidth="1.5" fill="none" strokeLinecap="round"/>
        <circle cx="12" cy="14.5" r="2" fill="rgba(255,255,255,1)"/>
      </svg>
    </div>
  );
}

// Elegant Bow SVG
function GoldenBow() {
  return (
    <svg width="100" height="60" viewBox="0 0 100 60" style={{ filter: 'drop-shadow(0 8px 12px rgba(0,0,0,0.5))' }}>
      <defs>
        <linearGradient id="gold-bow" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#FFF8F0" />
          <stop offset="30%" stopColor="#C9A84C" />
          <stop offset="70%" stopColor="#A07830" />
          <stop offset="100%" stopColor="#E8751A" />
        </linearGradient>
      </defs>
      {/* Left loop */}
      <path d="M50 30 C30 10 5 10 10 30 C15 50 40 40 50 30Z" fill="url(#gold-bow)" />
      {/* Right loop */}
      <path d="M50 30 C70 10 95 10 90 30 C85 50 60 40 50 30Z" fill="url(#gold-bow)" />
      {/* Left tail */}
      <path d="M50 30 Q35 45 20 55 Q35 50 45 35 Z" fill="url(#gold-bow)" opacity="0.9" />
      {/* Right tail */}
      <path d="M50 30 Q65 45 80 55 Q65 50 55 35 Z" fill="url(#gold-bow)" opacity="0.9" />
      {/* Center knot */}
      <ellipse cx="50" cy="30" rx="8" ry="10" fill="url(#gold-bow)" />
    </svg>
  );
}

export function Scene1_Arrival({ senderName, recipientName, locale, onComplete }: Props) {
  const [phase, setPhase] = useState<'landing' | 'landed' | 'ready'>('landing');
  const { vibrate } = useHaptics();

  useEffect(() => {
    // Drop animation takes about 1.2s
    const t1 = setTimeout(() => { vibrate('HEAVY'); setPhase('landed'); }, 1200);
    const t2 = setTimeout(() => setPhase('ready'), 2200);
    return () => { clearTimeout(t1); clearTimeout(t2); };
  }, [vibrate]);

  return (
    <div
      className="scene"
      style={{
        background: 'radial-gradient(ellipse at 50% 30%, #2A1505 0%, #160C04 45%, #0D1526 100%)',
        cursor: phase === 'ready' ? 'pointer' : 'default',
        overflow: 'hidden',
      }}
      onClick={() => phase === 'ready' && onComplete()}
    >
      {/* ── Ambient concentric gold rings ─────────────────── */}
      {[280, 400, 520].map((size, i) => (
        <motion.div
          key={i}
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: [0.02, 0.06, 0.02], scale: 1 }}
          transition={{ duration: 6 + i * 2, repeat: Infinity, delay: i * 0.5, ease: 'easeInOut' }}
          style={{
            position: 'absolute',
            width: size, height: size,
            borderRadius: '50%',
            border: '1px solid var(--gold)',
            top: '40%', left: '50%',
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
            x: [`${p.x}vw`, `${p.x + 6}vw`, `${p.x - 4}vw`, `${p.x}vw`],
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
            width: 12,
            height: 16,
            borderRadius: '50% 0 50% 0',
            background: `linear-gradient(135deg, ${p.hue}, ${p.hue}99)`,
            boxShadow: `0 0 8px ${p.hue}66`,
            pointerEvents: 'none',
          }}
        />
      ))}

      {/* ── Gift parcel dropping in ───────────────────────── */}
      <motion.div
        initial={{ y: -400, rotate: -10, scale: 0.7 }}
        animate={phase === 'landing'
          ? { y: -400, rotate: -10, scale: 0.7 }
          : { y: 0, rotate: 0, scale: 1 }
        }
        transition={{ type: 'spring', stiffness: 140, damping: 15, mass: 1.2 }}
        style={{ position: 'relative', zIndex: 10, top: '-5%' }}
      >
        {/* Box shadow on ground */}
        <motion.div
          initial={{ scaleX: 0, opacity: 0 }}
          animate={phase !== 'landing'
            ? { scaleX: 1, opacity: 0.5 }
            : { scaleX: 0, opacity: 0 }
          }
          transition={{ delay: 0.1, duration: 0.5 }}
          style={{
            position: 'absolute',
            bottom: -25, left: '50%',
            transform: 'translateX(-50%)',
            width: 180, height: 25,
            borderRadius: '50%',
            background: 'rgba(0,0,0,0.8)',
            filter: 'blur(10px)',
          }}
        />

        {/* Impact glow ring */}
        {phase !== 'landing' && (
          <motion.div
            initial={{ scale: 0.5, opacity: 0.8 }}
            animate={{ scale: 2.5, opacity: 0 }}
            transition={{ duration: 1, ease: 'easeOut' }}
            style={{
              position: 'absolute',
              bottom: -20, left: '50%',
              marginLeft: -75,
              width: 150, height: 40,
              borderRadius: '50%',
              border: '2px solid var(--gold)',
              filter: 'blur(2px)',
            }}
          />
        )}

        {/* The parcel */}
        <motion.div
          animate={phase === 'landed' || phase === 'ready'
            ? { y: [0, -15, 0] }
            : {}
          }
          transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut', delay: 0.2 }}
          style={{
            width: 200, height: 200,
            position: 'relative',
          }}
        >
          {/* Box body - Premium Velvet/Crimson */}
          <div style={{
            position: 'absolute', inset: 0,
            background: 'linear-gradient(135deg, #7A1B29 0%, #4A0B14 100%)',
            borderRadius: 24,
            boxShadow: '0 40px 100px rgba(0,0,0,0.7), inset 0 2px 4px rgba(255,255,255,0.15)',
            border: '1px solid rgba(201,168,76,0.2)',
            overflow: 'hidden',
          }}>
            {/* Subtle Paisley/Mandala texture overlay */}
            <svg style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', opacity: 0.08 }}>
              <defs>
                <pattern id="mandala-pattern" x="0" y="0" width="40" height="40" patternUnits="userSpaceOnUse">
                  <path d="M20 0 L25 15 L40 20 L25 25 L20 40 L15 25 L0 20 L15 15 Z" fill="#C9A84C"/>
                  <circle cx="20" cy="20" r="3" fill="#FFF"/>
                </pattern>
              </defs>
              <rect width="100%" height="100%" fill="url(#mandala-pattern)"/>
            </svg>

            {/* Corner gold brackets */}
            {[
              { top: 12, left: 12, rotate: 0 },
              { top: 12, right: 12, rotate: 90 },
              { bottom: 12, right: 12, rotate: 180 },
              { bottom: 12, left: 12, rotate: 270 },
            ].map((pos, i) => (
              <svg key={i} width="24" height="24" viewBox="0 0 24 24"
                style={{ 
                  position: 'absolute', 
                  top: pos.top, bottom: pos.bottom, left: pos.left, right: pos.right,
                  transform: `rotate(${pos.rotate}deg)`,
                  opacity: 0.6
                }}>
                <path d="M2 22 L2 8 Q2 2 8 2 L22 2" fill="none" stroke="#C9A84C" strokeWidth="2" strokeLinecap="round"/>
                <circle cx="6" cy="6" r="1.5" fill="#C9A84C"/>
              </svg>
            ))}

            {/* Ribbon glow under layer */}
            <div style={{
              position: 'absolute', top: 0, bottom: 0, left: '50%', transform: 'translateX(-50%)',
              width: 32, background: 'rgba(201,168,76,0.2)', filter: 'blur(8px)',
            }}/>
            <div style={{
              position: 'absolute', left: 0, right: 0, top: '50%', transform: 'translateY(-50%)',
              height: 32, background: 'rgba(201,168,76,0.2)', filter: 'blur(8px)',
            }}/>
          </div>

          {/* Vertical gold foil ribbon */}
          <div style={{
            position: 'absolute', top: -2, bottom: -2, left: '50%',
            transform: 'translateX(-50%)', width: 28,
            background: 'linear-gradient(90deg, #C9A84C 0%, #FFF8F0 50%, #C9A84C 100%)',
            boxShadow: '0 4px 12px rgba(0,0,0,0.4), inset 0 0 8px rgba(155,34,71,0.2)',
          }}>
            {/* Ribbed texture on ribbon */}
            <div style={{ position: 'absolute', left: 4, right: 4, top: 0, bottom: 0, borderLeft: '1px solid rgba(0,0,0,0.05)', borderRight: '1px solid rgba(0,0,0,0.05)' }} />
          </div>

          {/* Horizontal gold foil ribbon */}
          <div style={{
            position: 'absolute', left: -2, right: -2, top: '50%',
            transform: 'translateY(-50%)', height: 28,
            background: 'linear-gradient(180deg, #C9A84C 0%, #FFF8F0 50%, #C9A84C 100%)',
            boxShadow: '0 4px 12px rgba(0,0,0,0.4), inset 0 0 8px rgba(155,34,71,0.2)',
          }}>
            {/* Ribbed texture on ribbon */}
            <div style={{ position: 'absolute', top: 4, bottom: 4, left: 0, right: 0, borderTop: '1px solid rgba(0,0,0,0.05)', borderBottom: '1px solid rgba(0,0,0,0.05)' }} />
          </div>

          {/* Center Premium Seal */}
          <div style={{
            position: 'absolute', top: '50%', left: '50%',
            transform: 'translate(-50%, -50%)',
            width: 76, height: 76,
          }}>
            <motion.div
              animate={{ rotate: [0, 8, -8, 0] }}
              transition={{ duration: 6, repeat: Infinity, ease: 'easeInOut' }}
              style={{ width: '100%', height: '100%' }}
            >
              <PremiumSeal />
            </motion.div>
          </div>

          {/* Golden Bow on top */}
          <div style={{
            position: 'absolute', top: -38, left: '50%',
            transform: 'translateX(-50%)',
            zIndex: 15,
          }}>
            <GoldenBow />
          </div>
        </motion.div>
      </motion.div>

      {/* ── Text and CTA ──────────────────────────────────── */}
      <motion.div
        initial={{ opacity: 0, y: 24 }}
        animate={phase === 'ready' ? { opacity: 1, y: 0 } : { opacity: 0, y: 24 }}
        transition={{ duration: 0.8, ease: 'easeOut' }}
        style={{
          position: 'absolute', bottom: '15%',
          textAlign: 'center', padding: '0 32px',
          width: '100%',
          pointerEvents: 'none',
        }}
      >
        <p style={{
          fontFamily: 'var(--font-sans)',
          fontSize: '0.8rem',
          textTransform: 'uppercase',
          letterSpacing: '0.15em',
          color: 'rgba(201,168,76,0.8)',
          marginBottom: 12,
        }}>
          {t('from', locale)} {senderName}
        </p>
        
        <p style={{
          fontFamily: 'var(--font-script)',
          fontSize: '2.4rem',
          color: '#FFF8F0',
          lineHeight: 1.1,
          textShadow: '0 2px 10px rgba(0,0,0,0.5)',
        }}>
          {locale === 'hi' ? `${recipientName}, यह तुम्हारे लिए है` : `${recipientName}, this is for you.`}
        </p>

        {/* Pulsing "Tap to open" hint */}
        <motion.p
          animate={{ opacity: [0.3, 0.8, 0.3] }}
          transition={{ duration: 2.5, repeat: Infinity, ease: 'easeInOut' }}
          style={{
            marginTop: 36,
            fontFamily: 'var(--font-sans)',
            fontSize: '0.75rem',
            letterSpacing: '0.25em',
            textTransform: 'uppercase',
            color: 'var(--gold)',
          }}
        >
          {locale === 'hi' ? 'खोलने के लिए टैप करें' : 'Tap to open'}
        </motion.p>
      </motion.div>
    </div>
  );
}
