'use client';
import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence, useMotionValue, useTransform } from 'framer-motion';
import { useHaptics } from '@/hooks/useHaptics';
import { audioEngine } from '@/lib/audio';
import { CelebrationOverlay } from '@/components/shared/CelebrationOverlay';
import type { Locale, GiftType } from '@/lib/types';
import { t } from '@/lib/i18n';

interface Props {
  giftType: GiftType;
  giftTitle: string;
  giftValue: string;
  senderName: string;
  locale: Locale;
  onComplete: () => void;
}

const GIFT_ICONS: Record<GiftType, string> = {
  voucher:          '🎁',
  payment_link:     '💸',
  coupon:           '🎟️',
  surprise_message: '💌',
};

const GIFT_LABELS: Record<GiftType, { en: string; hi: string }> = {
  voucher:          { en: 'Your Gift Voucher', hi: 'आपका गिफ्ट वाउचर' },
  payment_link:     { en: 'Your Gift Money',   hi: 'आपकी गिफ्ट राशि' },
  coupon:           { en: 'Your Special Coupon', hi: 'आपका स्पेशल कूपन' },
  surprise_message: { en: 'A Surprise Message', hi: 'एक सरप्राइज संदेश' },
};

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
      <path d="M50 30 C30 10 5 10 10 30 C15 50 40 40 50 30Z" fill="url(#gold-bow)" />
      <path d="M50 30 C70 10 95 10 90 30 C85 50 60 40 50 30Z" fill="url(#gold-bow)" />
      <path d="M50 30 Q35 45 20 55 Q35 50 45 35 Z" fill="url(#gold-bow)" opacity="0.9" />
      <path d="M50 30 Q65 45 80 55 Q65 50 55 35 Z" fill="url(#gold-bow)" opacity="0.9" />
      <ellipse cx="50" cy="30" rx="8" ry="10" fill="url(#gold-bow)" />
    </svg>
  );
}

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
      <div style={{ width: '80%', height: '80%', border: '1px dashed rgba(201,168,76,0.6)', borderRadius: '50%' }} />
    </div>
  );
}

export function Scene6_GiftReveal({ giftType, giftTitle, giftValue, senderName, locale, onComplete }: Props) {
  const [phase, setPhase] = useState<'idle' | 'opening' | 'revealed'>('idle');
  const { vibrate } = useHaptics();
  const y = useMotionValue(0);

  const action = giftType === 'voucher' || giftType === 'payment_link'
    ? { label: locale === 'hi' ? 'पाएं →' : 'Claim Gift →', href: giftValue }
    : null;

  const handleDragEnd = (event: any, info: any) => {
    // If dragged up sufficiently
    if (info.offset.y < -80) {
      vibrate('FINAL_REVEAL');
      setPhase('opening');
      audioEngine.playMagic();
      setTimeout(() => setPhase('revealed'), 1500); // Wait for card to slide up before full reveal
      setTimeout(() => audioEngine.stopBGM(), 5000); // Fade out music 5 seconds after opening
    } else {
      vibrate('MEDIUM'); // Snap back
    }
  };

  return (
    <div className="scene" style={{
      background: 'radial-gradient(ellipse at 50% 30%, #2A1505 0%, #160C04 45%, #0D1526 100%)',
      overflow: 'hidden',
      display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center'
    }}>
      {phase === 'revealed' && <CelebrationOverlay count={80} />}

      {/* Ambient Gold Rings */}
      {[280, 400, 520].map((size, i) => (
        <motion.div
          key={`ring-${i}`}
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

      {/* Ambient dust */}
      {[...Array(30)].map((_, i) => {
        const left = (i * 13) % 100;
        const top = (i * 29) % 100;
        const duration = 5 + (i % 4) * 2;
        const delay = (i % 5) * 0.5;
        return (
          <motion.div
            key={`dust-${i}`}
            initial={{ opacity: 0, y: 0, x: 0 }}
            animate={{ 
              opacity: [0, 0.5, 0.5, 0], 
              y: [-10, 40],
              x: [(i % 2 === 0 ? -15 : 15), (i % 2 === 0 ? 15 : -15)],
            }}
            transition={{ 
              duration: duration, 
              repeat: Infinity, 
              delay: delay,
              ease: "easeInOut"
            }}
            style={{
              position: 'absolute',
              width: 2.5, height: 2.5, borderRadius: '50%',
              background: 'var(--gold)',
              left: `${left}%`,
              top: `${top}%`,
              filter: 'blur(1px)'
            }}
          />
        );
      })}

      <motion.p
        initial={{ opacity: 0, y: -16 }}
        animate={{ opacity: phase === 'revealed' ? 0 : 1, y: 0 }}
        style={{
          position: 'absolute', top: '10%',
          fontFamily: 'var(--font-serif)', fontStyle: 'italic',
          fontSize: '1.2rem', color: '#FFF8F0',
          textAlign: 'center',
          pointerEvents: 'none'
        }}
      >
        {t('your_gift', locale)}
      </motion.p>

      {/* Hint */}
      <AnimatePresence>
        {phase === 'idle' && (
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: [0, 0.7, 0.7, 0] }}
            exit={{ opacity: 0 }}
            transition={{ duration: 2.8, repeat: Infinity, delay: 1 }}
            className="hint-text"
            style={{ position: 'absolute', bottom: '15%', color: 'rgba(201,168,76,0.8)', pointerEvents: 'none' }}
          >
            {t('lift_to_reveal', locale)}
          </motion.p>
        )}
      </AnimatePresence>

      <div style={{ position: 'relative', width: 220, height: 220, top: '5%' }}>
        
        {/* Gift Card (Inside the Box) */}
        <AnimatePresence>
          {(phase === 'opening' || phase === 'revealed') && (
            <motion.div
              initial={{ y: 20, scale: 0.5, opacity: 0 }}
              animate={phase === 'revealed' 
                ? { y: -80, scale: 1.1, opacity: 1, zIndex: 50 } 
                : { y: -100, scale: 0.6, opacity: 1, zIndex: 5 } // Slides up slightly first
              }
              transition={{ duration: 1.5, ease: [0.16, 1, 0.3, 1] }}
              style={{
                position: 'absolute', left: '50%',
                marginLeft: -140, // Half of 280
                width: 280,
                background: 'linear-gradient(145deg, #FFFDF8 0%, #FFF8F0 100%)',
                borderRadius: 20,
                padding: '32px 24px',
                boxShadow: '0 40px 100px rgba(0,0,0,0.5)',
                border: '1.5px solid rgba(201,168,76,0.5)',
                textAlign: 'center',
              }}
            >
              <div style={{ position: 'absolute', inset: 8, border: '1px solid rgba(201,168,76,0.2)', borderRadius: 12, pointerEvents: 'none' }} />
              
              <p style={{
                fontFamily: 'var(--font-sans)', fontSize: '0.7rem',
                letterSpacing: '0.18em', textTransform: 'uppercase',
                color: 'var(--gold)', marginBottom: 12,
              }}>
                {GIFT_LABELS[giftType][locale]}
              </p>

              <div style={{ fontSize: '3.5rem', marginBottom: 16 }}>
                {GIFT_ICONS[giftType]}
              </div>

              <p style={{
                fontFamily: 'var(--font-serif)', fontSize: '1.3rem',
                color: 'var(--night-blue)', fontWeight: 600, marginBottom: 12,
              }}>
                {giftTitle}
              </p>

              {(giftType === 'coupon' || giftType === 'surprise_message') && (
                <div style={{
                  background: 'rgba(201,168,76,0.05)',
                  border: '1px dashed rgba(201,168,76,0.4)',
                  borderRadius: 8, padding: '12px 16px', marginBottom: 20,
                }}>
                  <p style={{
                    fontFamily: giftType === 'coupon' ? 'monospace' : 'var(--font-serif)',
                    fontSize: giftType === 'coupon' ? '1.2rem' : '0.95rem',
                    color: 'var(--night-blue)',
                    fontStyle: giftType === 'surprise_message' ? 'italic' : undefined,
                    letterSpacing: giftType === 'coupon' ? '0.12em' : undefined,
                  }}>
                    {giftValue}
                  </p>
                </div>
              )}

              {action && (
                <a
                  href={action.href}
                  target="_blank" rel="noopener noreferrer"
                  style={{
                    display: 'inline-block',
                    background: 'linear-gradient(135deg, var(--saffron), var(--deep-red))',
                    color: '#FFF8F0', textDecoration: 'none',
                    fontFamily: 'var(--font-sans)', fontSize: '0.8rem',
                    letterSpacing: '0.08em', padding: '12px 28px',
                    borderRadius: 100,
                    boxShadow: '0 8px 25px rgba(232,117,26,0.4)',
                    marginBottom: 12,
                  }}
                >
                  {action.label}
                </a>
              )}

              <p style={{
                fontFamily: 'var(--font-script)', fontSize: '1.2rem',
                color: 'var(--gold)', marginTop: 12,
              }}>
                with love, {senderName} 🌸
              </p>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Box Base (The lower half) */}
        <motion.div
          animate={phase === 'idle' ? { y: [0, -8, 0] } : { y: 20, opacity: phase === 'revealed' ? 0 : 1 }}
          transition={{ duration: 3, repeat: phase === 'idle' ? Infinity : 0, ease: 'easeInOut' }}
          style={{
            position: 'absolute', inset: 0,
            background: 'linear-gradient(135deg, #7A1B29 0%, #4A0B14 100%)',
            borderRadius: 24,
            boxShadow: '0 40px 100px rgba(0,0,0,0.7), inset 0 2px 4px rgba(255,255,255,0.15)',
            border: '1px solid rgba(201,168,76,0.2)',
            zIndex: 10, pointerEvents: 'none'
          }}
        >
          {/* Inner dark void of the box */}
          <div style={{
            position: 'absolute', inset: 8,
            background: '#0D0508', borderRadius: 16,
            boxShadow: 'inset 0 20px 40px rgba(0,0,0,0.9)'
          }} />

          {/* Front overlapping lip */}
          <div style={{
             position: 'absolute', bottom: 0, left: 0, right: 0, height: '60%',
             background: 'linear-gradient(135deg, #7A1B29 0%, #4A0B14 100%)',
             borderRadius: '0 0 24px 24px',
             borderTop: '1px solid rgba(201,168,76,0.4)',
             boxShadow: '0 -4px 12px rgba(0,0,0,0.5)'
          }}>
             {/* Vertical ribbon on base */}
             <div style={{
               position: 'absolute', top: 0, bottom: 0, left: '50%',
               transform: 'translateX(-50%)', width: 28,
               background: 'linear-gradient(90deg, #C9A84C 0%, #FFF8F0 50%, #C9A84C 100%)',
               boxShadow: '0 4px 12px rgba(0,0,0,0.4)'
             }}/>
          </div>
        </motion.div>

        {/* Box Lid (Draggable) */}
        <AnimatePresence>
          {phase === 'idle' && (
            <motion.div
              drag="y"
              dragConstraints={{ top: -200, bottom: 0 }}
              dragElastic={0.2}
              onDragStart={() => vibrate('LIGHT')}
              onDragEnd={handleDragEnd}
              whileDrag={{ cursor: 'grabbing' }}
              animate={{ y: [0, -8, 0] }}
              transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
              exit={{ y: -600, rotate: 15, opacity: 0, scale: 1.1, transition: { duration: 1.2, ease: "easeIn" } }}
              style={{
                y,
                position: 'absolute', top: -10, left: -10, right: -10, height: '55%',
                background: 'linear-gradient(135deg, #9B2247 0%, #7A1B29 100%)',
                borderRadius: 24,
                boxShadow: '0 20px 40px rgba(0,0,0,0.6)',
                border: '1px solid rgba(201,168,76,0.4)',
                zIndex: 20, cursor: 'grab', touchAction: 'none'
              }}
            >
              {/* Vertical ribbon on lid */}
              <div style={{
                position: 'absolute', top: 0, bottom: 0, left: '50%',
                transform: 'translateX(-50%)', width: 28,
                background: 'linear-gradient(90deg, #C9A84C 0%, #FFF8F0 50%, #C9A84C 100%)',
                boxShadow: '0 4px 12px rgba(0,0,0,0.4)'
              }}/>
              {/* Horizontal ribbon on lid */}
              <div style={{
                position: 'absolute', left: 0, right: 0, top: '50%',
                transform: 'translateY(-50%)', height: 28,
                background: 'linear-gradient(180deg, #C9A84C 0%, #FFF8F0 50%, #C9A84C 100%)',
                boxShadow: '0 4px 12px rgba(0,0,0,0.4)'
              }}/>
              
              {/* Premium Seal */}
              <div style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', width: 76, height: 76 }}>
                <PremiumSeal />
              </div>
              
              {/* Golden Bow */}
              <div style={{ position: 'absolute', top: -38, left: '50%', transform: 'translateX(-50%)' }}>
                <GoldenBow />
              </div>
            </motion.div>
          )}
        </AnimatePresence>

      </div>

      <AnimatePresence>
        {phase === 'revealed' && (
          <motion.button
            key="done"
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.5 }}
            onClick={onComplete}
            style={{
              position: 'absolute', bottom: '8%',
              background: 'transparent',
              border: '1.5px solid var(--gold)',
              borderRadius: 100, padding: '12px 36px',
              fontFamily: 'var(--font-sans)', fontSize: '0.75rem',
              letterSpacing: '0.2em', textTransform: 'uppercase',
              color: 'var(--gold)', cursor: 'pointer', zIndex: 100
            }}
          >
            {locale === 'hi' ? 'धन्यवाद 🌸' : 'Thank you 🌸'}
          </motion.button>
        )}
      </AnimatePresence>
    </div>
  );
}
