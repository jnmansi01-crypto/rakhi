'use client';
// Template 02 — Scene 5: Rakhi Tying (Premium Final Version)
// Before tie: Left page shows an elegant ritual instruction + styled range slider
// After tie: Both pages transition to a clean celebratory spread, 
//            with the Rakhi thread + medallion as the only cross-page element,
//            and gold-shimmer calligraphy on the right.

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useHaptics } from '@/shared/components/useHaptics';
import { audioEngine } from '@/shared/audio/audio';
import type { Locale } from '@/lib/types';
import confetti from 'canvas-confetti';
import { btnStyle } from '@/shared/inputs/inputs';

interface Props {
  recipientName: string;
  senderName: string;
  locale: Locale;
  onComplete: () => void;
}

export function Scene5_Rakhi({ recipientName, senderName, locale, onComplete }: Props) {
  const [value, setValue] = useState(0);
  const [isTied, setIsTied] = useState(false);
  const { vibrate } = useHaptics();

  const progress = value / 100;

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (isTied) return;
    const v = Number(e.target.value);
    setValue(v);

    if (v >= 94) {
      setValue(100);
      setIsTied(true);
      vibrate();
      audioEngine.playMagic();
      setTimeout(() => {
        confetti({ particleCount: 140, spread: 80, origin: { y: 0.58 }, colors: ['#c59f33', '#8a1c14', '#fff', '#e5c07b'] });
        setTimeout(() => confetti({ particleCount: 60, spread: 120, origin: { y: 0.5, x: 0.3 }, colors: ['#d4af37', '#fff'] }), 300);
      }, 100);
    }
  };

  const handleNext = () => {
    vibrate();
    audioEngine.playSwoosh();
    onComplete();
  };

  const [mobilePage, setMobilePage] = useState<'left' | 'right'>('left');

  // Automatically flip page to right side on mobile once the Rakhi is successfully tied!
  useEffect(() => {
    if (isTied) {
      const timer = setTimeout(() => {
        setMobilePage('right');
      }, 900);
      return () => clearTimeout(timer);
    }
  }, [isTied]);

  return (
    <div style={{
      position: 'absolute', inset: 0,
      background: isTied ? '#1c0c09' : '#120e0d',
      backgroundImage: isTied 
        ? 'radial-gradient(circle at center, #361712 0%, #150604 100%)' 
        : 'radial-gradient(ellipse at 50% 50%, #1f1412 0%, #080606 100%)',
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      padding: '24px 12px',
      overflowY: 'auto',
      transition: 'all 1.2s ease-in-out',
    }}>
      {/* Dynamic celebratory aura glow overlay when tied */}
      {isTied && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: [0.3, 0.5, 0.3] }}
          transition={{ duration: 6, repeat: Infinity, ease: 'easeInOut' }}
          style={{
            position: 'absolute', inset: 0,
            backgroundImage: 'radial-gradient(circle at 50% 40%, rgba(212,175,55,0.18) 0%, transparent 70%)',
            pointerEvents: 'none',
            zIndex: 1,
          }}
        />
      )}
      <style dangerouslySetInnerHTML={{ __html: `
        @import url('https://fonts.googleapis.com/css2?family=Caveat:wght@500;700&family=Great+Vibes&family=Playfair+Display:ital,wght@0,400;0,600;1,400&family=Yatra+One&display=swap');
        .hw { font-family: 'Caveat', cursive; }
        .calli { font-family: 'Great Vibes', cursive; }
        .hindi-calli { font-family: 'Yatra One', serif; }
        .serif { font-family: 'Playfair Display', serif; }

        @keyframes goldShimmer {
          0%   { background-position: 0% 50%; }
          50%  { background-position: 100% 50%; }
          100% { background-position: 0% 50%; }
        }
        @keyframes floatUp {
          0%,100% { transform: translateY(0); }
          50%      { transform: translateY(-4px); }
        }

        /* ── Range Slider ── */
        .rakhi-slider {
          -webkit-appearance: none; appearance: none;
          width: 100%; height: 6px; border-radius: 3px;
          background: transparent; outline: none; cursor: grab; border: none;
          position: relative; z-index: 3;
        }
        .rakhi-slider:active { cursor: grabbing; }
        .rakhi-slider:disabled { cursor: default; opacity: 0; pointer-events: none; }

        .rakhi-slider::-webkit-slider-thumb {
          -webkit-appearance: none; appearance: none;
          width: 38px; height: 38px; border-radius: 50%; margin-top: -16px;
          background: radial-gradient(circle at 35% 35%, #f9e396 0%, #d4af37 55%, #856414 100%);
          border: 2px solid #6b4e10;
          box-shadow: 0 6px 16px rgba(0,0,0,0.45), inset 0 2px 3px rgba(255,255,255,0.45);
          cursor: grab; transition: transform 0.12s, box-shadow 0.12s;
        }
        .rakhi-slider::-webkit-slider-thumb:active {
          transform: scale(1.18); cursor: grabbing;
          box-shadow: 0 8px 22px rgba(0,0,0,0.5), inset 0 2px 3px rgba(255,255,255,0.4);
        }
        .rakhi-slider::-moz-range-thumb {
          width: 38px; height: 38px; border-radius: 50%;
          background: radial-gradient(circle at 35% 35%, #f9e396 0%, #d4af37 55%, #856414 100%);
          border: 2px solid #6b4e10; cursor: grab;
          box-shadow: 0 6px 16px rgba(0,0,0,0.45);
        }
        .rakhi-slider::-webkit-slider-runnable-track {
          height: 6px; border-radius: 3px; background: transparent;
        }
        .rakhi-slider::-moz-range-track {
          height: 6px; border-radius: 3px; background: transparent;
        }
      ` }} />

      {/* Open Book Spread */}
      <div
        className="scrapbook-container"
        style={{
          width: '95%',
          maxWidth: 680,
          display: 'flex',
          position: 'relative',
          boxShadow: '0 25px 60px rgba(0,0,0,0.65), 0 0 0 1px rgba(212,175,55,0.08)',
          borderRadius: 12,
          overflow: 'visible',
          background: '#3d160e',
          padding: '8px',
        }}
      >
        <style dangerouslySetInnerHTML={{ __html: `
          .scrapbook-container {
            flex-direction: row;
            aspect-ratio: 1.32;
            height: auto;
            perspective: 1000px;
          }
          .scrapbook-page-left {
            display: flex !important;
            transform-origin: right center;
          }
          .scrapbook-page-right {
            display: flex !important;
            transform-origin: left center;
          }
          @media (max-width: 600px) {
            .scrapbook-container {
              flex-direction: column !important;
              aspect-ratio: auto !important; /* Allow dynamic height content */
              min-height: 480px !important;
              width: 100% !important;
              height: auto !important;
              padding: 6px !important;
            }
            .scrapbook-spine {
              display: none !important;
            }
            .scrapbook-page-left {
              display: ${mobilePage === 'left' ? 'flex' : 'none'} !important;
              width: ${mobilePage === 'left' ? '100%' : '0'} !important;
              height: ${mobilePage === 'left' ? '100%' : '0'} !important;
              overflow: ${mobilePage === 'left' ? 'visible' : 'hidden'} !important;
              padding: ${mobilePage === 'left' ? '28px 24px 24px !important' : '0'} !important;
              border-radius: 8px !important;
            }
            .scrapbook-page-right {
              display: ${mobilePage === 'right' ? 'flex' : 'none'} !important;
              width: ${mobilePage === 'right' ? '100%' : '0'} !important;
              height: ${mobilePage === 'right' ? '100%' : '0'} !important;
              overflow: ${mobilePage === 'right' ? 'visible' : 'hidden'} !important;
              padding: ${mobilePage === 'right' ? '32px 24px 28px !important' : '0'} !important;
              border-radius: 8px !important;
            }
          }
        ` }} />

        {/* ── LEFT PAGE ── */}
        <div
          className="scrapbook-page-left"
          style={{
            flex: 1, borderRadius: '8px 0 0 8px',
            padding: '24px 20px 20px',
            display: 'flex', flexDirection: 'column',
            alignItems: 'center', justifyContent: 'space-between',
            position: 'relative',
            boxShadow: 'inset -18px 0 24px rgba(0,0,0,0.12)',
          }}
        >
          {/* Subtle grid lines background overlay */}
          <div style={{ position: 'absolute', inset: 12, border: '1px solid rgba(199,151,116,0.3)', borderRadius: 4, zIndex: 1 }} />

          {/* Aksht & Roli detailing splattered realistic vector overlay */}
          <div style={{ position: 'absolute', inset: 0, pointerEvents: 'none', zIndex: 2 }}>
            <svg width="100%" height="100%" style={{ position: 'absolute', inset: 0 }} viewBox="0 0 300 450" preserveAspectRatio="none">
              <defs>
                {/* 3D Chawal (Rice) Gradient */}
                <radialGradient id="rice3d" cx="35%" cy="30%" r="70%">
                  <stop offset="0%" stopColor="#ffffff" />
                  <stop offset="60%" stopColor="#fdfcf0" />
                  <stop offset="100%" stopColor="#d4cdab" />
                </radialGradient>
                {/* 3D Roli (Crimson powder) Gradient */}
                <radialGradient id="roli3d" cx="35%" cy="30%" r="70%">
                  <stop offset="0%" stopColor="#d42617" />
                  <stop offset="70%" stopColor="#9c150b" />
                  <stop offset="100%" stopColor="#690a03" />
                </radialGradient>
              </defs>
              {/* Top Left Cluster */}
              <ellipse cx="41" cy="42" rx="10" ry="4" fill="rgba(0,0,0,0.18)" transform="rotate(35 40 40)"/>
              <ellipse cx="65" cy="38" rx="9" ry="3.6" fill="rgba(0,0,0,0.18)" transform="rotate(-15 64 36)"/>
              <ellipse cx="40" cy="40" rx="10" ry="4" fill="url(#rice3d)" transform="rotate(35 40 40)"/>
              <ellipse cx="64" cy="36" rx="9" ry="3.6" fill="url(#rice3d)" transform="rotate(-15 64 36)"/>
              <circle cx="27" cy="71" r="6" fill="rgba(0,0,0,0.15)"/>
              <circle cx="26" cy="70" r="6" fill="url(#roli3d)"/>
              <circle cx="34" cy="80" r="3.5" fill="url(#roli3d)"/>

              {/* Gold Dust Scatter */}
              <circle cx="25" cy="120" r="2.2" fill="#d4af37" opacity="0.8"/>
              <circle cx="80" cy="80" r="1.5" fill="#e5c07b" opacity="0.9"/>
              <circle cx="95" cy="130" r="2.0" fill="#d4af37" opacity="0.8"/>

              {/* Bottom Right Cluster */}
              <ellipse cx="251" cy="382" rx="9" ry="3.6" fill="rgba(0,0,0,0.18)" transform="rotate(-30 250 380)"/>
              <ellipse cx="250" cy="380" rx="9" ry="3.6" fill="url(#rice3d)" transform="rotate(-30 250 380)"/>
            </svg>
          </div>

          {/* Sibling card container (Thali representation) */}
          <div style={{
            position: 'relative', width: '100%', flex: 1, zIndex: 3,
            display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center'
          }}>
            <AnimatePresence mode="wait">
              {!isTied ? (
                <motion.div
                  key="untied-state"
                  exit={{ opacity: 0, y: -12 }}
                  transition={{ duration: 0.4 }}
                  style={{ width: '88%', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 20 }}
                >
                  {/* Ritual instruction */}
                  <div style={{ textAlign: 'center' }}>
                    <p className="hw" style={{ fontSize: '1.3rem', color: '#7c6454', margin: 0 }}>
                      {locale === 'hi' ? 'धागे को दाईं ओर खींचें' : 'Slide to tie the Rakhi'}
                    </p>
                    <p className="serif" style={{ fontSize: '0.62rem', color: 'rgba(140,118,98,0.5)', letterSpacing: '0.1em', margin: '6px 0 0', textTransform: 'uppercase' }}>
                      {locale === 'hi' ? '→ पवित्र अनुष्ठान' : '→ Sacred Ritual'}
                    </p>
                  </div>

                  {/* Slider track container */}
                  <div style={{ position: 'relative', width: '100%', height: 6 }}>
                    <div style={{
                      position: 'absolute', inset: 0, borderRadius: 3,
                      background: 'rgba(199,151,116,0.15)',
                      border: '1px solid rgba(199,151,116,0.2)',
                    }} />
                    <div style={{
                      position: 'absolute', top: 0, left: 0, height: '100%',
                      width: `${progress * 100}%`, borderRadius: 3,
                      background: 'repeating-linear-gradient(90deg, #c84040 0px, #c84040 7px, #d4af37 7px, #d4af37 14px)',
                      transition: 'width 0.04s linear',
                    }} />
                    <input
                      className="rakhi-slider"
                      type="range" min={0} max={100} step={1}
                      value={value}
                      onChange={handleChange}
                      style={{ position: 'absolute', top: '50%', left: 0, width: '100%', transform: 'translateY(-50%)' }}
                    />
                  </div>
                </motion.div>
              ) : (
                <motion.div
                  key="tied-state"
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.7, delay: 0.3, ease: 'easeOut' }}
                  style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 16, textAlign: 'center' }}
                >
                  <svg width="64" height="40" viewBox="0 0 64 40" fill="none">
                    <path d="M 0 20 Q 10 20 18 20" stroke="#c84040" strokeWidth="2.5" strokeLinecap="round"/>
                    <path d="M 46 20 Q 54 20 64 20" stroke="#c84040" strokeWidth="2.5" strokeLinecap="round"/>
                    <path d="M 18 20 C 18 8 32 8 32 20 C 32 32 46 32 46 20" stroke="#d4af37" strokeWidth="2" fill="none" strokeLinecap="round"/>
                    <path d="M 18 20 C 18 32 32 32 32 20 C 32 8 46 8 46 20" stroke="#c84040" strokeWidth="2" fill="none" strokeLinecap="round" opacity="0.7"/>
                    <circle cx="32" cy="20" r="4" fill="#d4af37" stroke="#856414" strokeWidth="1"/>
                  </svg>
                  <p className="hw" style={{ fontSize: '1.4rem', color: '#7c6454', margin: 0, lineHeight: 1.2 }}>
                    {locale === 'hi' ? 'रिश्ते की डोर बंधी' : 'The bond is made'}
                  </p>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Bottom gold ornament */}
          <div style={{ width: '50%', height: 1, background: 'linear-gradient(90deg, transparent, rgba(212,175,55,0.5), transparent)', marginBottom: 4 }} />
        </div>

        {/* ── CENTRAL BINDER SPINE ── */}
        <div className="scrapbook-spine" style={{
          width: 24, flexShrink: 0,
          background: 'linear-gradient(to right, #290e09, #150604, #290e09)',
          position: 'relative', zIndex: 10,
          display: 'flex', flexDirection: 'column',
          justifyContent: 'space-around', alignItems: 'center',
        }}>
          {Array.from({ length: 10 }).map((_, i) => (
            <div key={i} style={{
              width: 28, height: 8,
              background: 'linear-gradient(to bottom, #d4af37, #856414, #d4af37)',
              borderRadius: 4, boxShadow: '0 2px 4px rgba(0,0,0,0.4)',
              transform: 'rotate(-5deg)',
            }} />
          ))}
        </div>

        {/* ── RIGHT PAGE ── */}
        <div
          className="scrapbook-page-right"
          style={{
            flex: 1, borderRadius: '0 8px 8px 0',
            padding: '24px 20px 20px',
            display: 'flex', flexDirection: 'column',
            justifyContent: 'space-between',
            position: 'relative',
            boxShadow: 'inset 18px 0 24px rgba(0,0,0,0.1)',
          }}
        >
          {/* Handcrafted scrapbook accents: 3D Roli splatters, 3D Chawal grains & Gold dust scatter */}
          <div style={{ position: 'absolute', inset: 0, pointerEvents: 'none', zIndex: 1 }}>
            <svg width="100%" height="100%" style={{ position: 'absolute', inset: 0 }}>
              {/* Top Right Cluster */}
              <ellipse cx="251" cy="22" rx="6.5" ry="2.8" fill="rgba(0,0,0,0.15)" transform="rotate(-30 250 20)"/>
              <ellipse cx="250" cy="20" rx="6.5" ry="2.8" fill="url(#rice3d)" transform="rotate(-30 250 20)"/>
              <circle cx="263" cy="31" r="3.5" fill="rgba(0,0,0,0.15)"/>
              <circle cx="262" cy="30" r="3.5" fill="url(#roli3d)"/>

              {/* Gold Dust Scatter */}
              <circle cx="270" cy="55" r="1.2" fill="#d4af37" opacity="0.6"/>
              <circle cx="215" cy="115" r="1.6" fill="#d4af37" opacity="0.7"/>
              <circle cx="230" cy="210" r="0.8" fill="#e5c07b" opacity="0.8"/>

              {/* Bottom Left Cluster */}
              <circle cx="25" cy="281" r="4.5" fill="rgba(0,0,0,0.15)"/>
              <circle cx="24" cy="280" r="4.5" fill="url(#roli3d)"/>
              <ellipse cx="41" cy="277" rx="6.8" ry="3" fill="rgba(0,0,0,0.15)" transform="rotate(45 40 275)"/>
              <ellipse cx="40" cy="275" rx="6.8" ry="3" fill="url(#rice3d)" transform="rotate(45 40 275)"/>
            </svg>
          </div>
          <div style={{ position: 'absolute', inset: 14, border: '1px solid rgba(199,151,116,0.25)', borderRadius: 4, pointerEvents: 'none' }} />

          {/* Faint Gold Dust & Akshat Grains detailing */}
          <div style={{ position: 'absolute', inset: 0, opacity: 0.1, pointerEvents: 'none', zIndex: 0 }}>
            <svg width="60" height="60" style={{ position: 'absolute', top: 24, right: 24 }} viewBox="0 0 60 60">
              <path d="M15 15 L17 20 L22 20 L18 23 L20 28 L15 25 L10 28 L12 23 L8 20 L13 20 Z" fill="#d4af37"/>
              <ellipse cx="25" cy="40" rx="4.2" ry="2.1" fill="#d4af37" transform="rotate(-30 25 40)"/>
            </svg>
            <svg width="60" height="60" style={{ position: 'absolute', bottom: 24, left: 24 }} viewBox="0 0 60 60">
              <ellipse cx="30" cy="20" rx="4" ry="2" fill="#d4af37" transform="rotate(45 30 20)"/>
              <ellipse cx="42" cy="35" rx="3.5" ry="1.8" fill="#d4af37" transform="rotate(15 42 35)"/>
            </svg>
          </div>

          {/* Top ornament */}
          <div style={{ width: '70%', marginLeft: 'auto', display: 'flex', alignItems: 'center', gap: 8, zIndex: 2 }}>
            <div style={{ flex: 1, height: 1, background: 'linear-gradient(90deg, transparent, #d4af37)' }} />
            <div style={{ width: 6, height: 6, borderRadius: '50%', background: '#d4af37', opacity: 0.7 }} />
            <div style={{ flex: 1, height: 1, background: 'linear-gradient(90deg, #d4af37, transparent)' }} />
          </div>

          {/* Main content area */}
          <div style={{
            flex: 1, display: 'flex', flexDirection: 'column',
            alignItems: 'center', justifyContent: 'center',
            textAlign: 'center', padding: '12px 8px',
          }}>
            <AnimatePresence mode="wait">
              {!isTied ? (
                <motion.div
                  key="guide"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 0.4 + progress * 0.6 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  transition={{ duration: 0.3 }}
                  style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 10 }}
                >
                  <div style={{
                    width: 44, height: 44, borderRadius: '50%',
                    border: '1.5px dashed rgba(197,159,51,0.5)',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                  }}>
                    <div style={{ width: 10, height: 10, borderRadius: '50%', background: 'rgba(197,159,51,0.6)' }} />
                  </div>
                  <p className="serif" style={{ fontSize: '0.58rem', color: 'rgba(140,118,98,0.6)', textTransform: 'uppercase', letterSpacing: '0.12em', margin: 0 }}>
                    {locale === 'hi' ? 'यहाँ बांधें' : 'Tie Here'}
                  </p>
                </motion.div>
              ) : (
                <motion.div
                  key="calli"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 1, delay: 0.5, ease: [0.22, 1, 0.36, 1] }}
                  style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 12 }}
                >
                  <h1 className={locale === 'hi' ? 'hindi-calli' : 'calli'} style={{
                    fontSize: locale === 'hi' ? 'clamp(1.8rem, 4.5vw, 2.5rem)' : 'clamp(2.2rem, 5vw, 3.2rem)',
                    margin: 0, lineHeight: 1.1,
                    background: 'linear-gradient(100deg, #8a1c14 0%, #d4af37 45%, #a36f4d 100%)',
                    backgroundSize: '200% auto',
                    WebkitBackgroundClip: 'text',
                    WebkitTextFillColor: 'transparent',
                    animation: 'goldShimmer 4s ease-in-out infinite',
                  }}>
                    {locale === 'hi' ? 'शुभ रक्षाबंधन' : 'Happy Rakshabandhan'}
                  </h1>

                  {/* Gold rule */}
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8, width: '80%' }}>
                    <div style={{ flex: 1, height: 1, background: 'linear-gradient(90deg, transparent, #d4af37)' }} />
                    <div style={{ width: 5, height: 5, borderRadius: '50%', background: '#d4af37' }} />
                    <div style={{ flex: 1, height: 1, background: 'linear-gradient(90deg, #d4af37, transparent)' }} />
                  </div>

                  <p className="hw" style={{ fontSize: '1.15rem', color: '#7c6454', margin: 0, lineHeight: 1.4 }}>
                    {locale === 'hi'
                      ? `सदा मुस्कुराते रहो, ${recipientName}`
                      : `With endless love for ${recipientName}`}
                  </p>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Bottom ornament */}
          <div style={{ width: '50%', height: 1, background: 'linear-gradient(90deg, transparent, rgba(212,175,55,0.5), transparent)', marginBottom: 4, alignSelf: 'center' }} />

          {/* Swipe swipe guide prompting next page instead of button */}
          <div style={{ zIndex: 10, textAlign: 'center', marginTop: 12 }}>
            <motion.div
              initial={{ opacity: 0 }}
              animate={isTied ? { opacity: 0.9 } : { opacity: 0.3 }}
              style={{
                fontSize: '0.72rem',
                color: isTied ? '#8c7662' : '#c8b6a6',
                fontWeight: 600,
                letterSpacing: '0.05em',
                alignSelf: 'center',
                animation: isTied ? 'pulse 2s infinite' : 'none',
                cursor: isTied ? 'pointer' : 'not-allowed',
              }}
              onClick={() => {
                if (isTied) {
                  handleNext();
                }
              }}
            >
              {isTied 
                ? (locale === 'hi' ? 'उपहार खोलने के लिए आगे स्वाइप करें →' : 'Swipe left to unwrap gift →')
                : (locale === 'hi' ? 'आगे बढ़ने के लिए पहले राखी बांधें' : 'Complete the ritual to proceed')}
            </motion.div>
          </div>
        </div>

        {/* ── SVG THREAD across full spread (grows with progress) ── */}
        {!isTied && progress > 0.01 && (
          <svg
            style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', pointerEvents: 'none', zIndex: 80 }}
            viewBox="0 0 100 100" preserveAspectRatio="none"
          >
            <defs>
              <linearGradient id="tg5" x1="0" y1="0" x2="1" y2="0">
                <stop offset="0%" stopColor="#c84040"/>
                <stop offset="40%" stopColor="#d4af37"/>
                <stop offset="60%" stopColor="#d4af37"/>
                <stop offset="100%" stopColor="#c84040"/>
              </linearGradient>
            </defs>
            {/* Left segment */}
            <path
              d={`M 2 50 Q ${1 + Math.min(progress * 2, 1) * 22} 52 ${2 + Math.min(progress * 2, 1) * 44} 50`}
              stroke="url(#tg5)" strokeWidth="1.2" fill="none" strokeLinecap="round"
            />
            {/* Right segment */}
            {progress > 0.52 && (
              <path
                d={`M 98 50 Q ${99 - Math.max((progress - 0.5) * 2, 0) * 22} 52 ${98 - Math.max((progress - 0.5) * 2, 0) * 44} 50`}
                stroke="url(#tg5)" strokeWidth="1.2" fill="none" strokeLinecap="round"
              />
            )}
          </svg>
        )}

        {/* ── TIED STATE: Full thread + Medallion (replaces partial thread) ── */}
        <AnimatePresence>
          {isTied && (
            <motion.div
              key="tied-overlay"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              style={{
                position: 'absolute', inset: 0,
                pointerEvents: 'none', zIndex: 90,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
              }}
            >
              {/* Complete thread across full spread */}
              <div style={{
                position: 'absolute',
                top: '50%', left: 8, right: 8,
                transform: 'translateY(-50%)',
                height: 4, borderRadius: 2,
                background: 'repeating-linear-gradient(90deg, #d4af37 0px,#d4af37 8px,#c84040 8px,#c84040 16px)',
                boxShadow: '0 2px 8px rgba(0,0,0,0.2)',
              }} />

              {/* 3D Gold Medallion at crease */}
              <motion.div
                initial={{ scale: 0, rotate: -240 }}
                animate={{ scale: 1, rotate: 0 }}
                transition={{ duration: 0.85, type: 'spring', stiffness: 100, damping: 12, delay: 0.1 }}
                style={{ position: 'relative', zIndex: 10 }}
              >
                <div style={{
                  width: 72, height: 72, borderRadius: '50%',
                  background: 'radial-gradient(circle at 40% 35%, #fdf0a0 0%, #d4af37 55%, #856414 100%)',
                  border: '2px solid #6b4e10',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  boxShadow: '0 12px 30px rgba(0,0,0,0.5), 0 0 0 4px rgba(212,175,55,0.15), inset 0 3px 5px rgba(255,255,255,0.35)',
                  position: 'relative',
                  animation: 'floatUp 4s ease-in-out infinite',
                }}>
                  {/* Sunburst rays */}
                  {Array.from({ length: 12 }).map((_, i) => (
                    <div key={i} style={{
                      position: 'absolute',
                      width: 78, height: i % 2 === 0 ? 1.5 : 1,
                      background: i % 2 === 0
                        ? 'linear-gradient(90deg, transparent, rgba(212,175,55,0.8), transparent)'
                        : 'linear-gradient(90deg, transparent, rgba(212,175,55,0.4), transparent)',
                      transform: `rotate(${i * 15}deg)`,
                    }} />
                  ))}
                  {/* Dotted ring */}
                  <div style={{ position: 'absolute', inset: 6, borderRadius: '50%', border: '2px dotted rgba(255,248,240,0.85)' }} />
                  {/* Ruby gemstone */}
                  <div style={{
                    width: 24, height: 24, borderRadius: '50%',
                    background: 'radial-gradient(circle at 35% 30%, #ff8080 0%, #d42020 45%, #7f0b0b 100%)',
                    border: '1.5px solid #5a0909',
                    boxShadow: 'inset 0 2px 5px rgba(255,255,255,0.5), 0 3px 8px rgba(0,0,0,0.4)',
                    position: 'relative',
                  }}>
                    {/* White specular highlight */}
                    <div style={{ position: 'absolute', top: 4, left: 5, width: 6, height: 4, borderRadius: '50%', background: '#fff', opacity: 0.8, transform: 'rotate(-20deg)' }} />
                  </div>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
