'use client';
// Template 02 — Scene 2: Letter
// Immersive 3D open scrapbook spread with a central brass binder coil, 
// a decorative left-hand page, and the lined letter page on the right.
// Uses a robust state-based typewriter effect and a single gorgeous 3D Laddoo sweet illustration.

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useHaptics } from '@/shared/components/useHaptics';
import { audioEngine } from '@/shared/audio/audio';
import type { Locale } from '@/lib/types';
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
  const [index, setIndex] = useState(0);
  const [isDone, setIsDone] = useState(false);
  const { vibrate } = useHaptics();

  // Robust, state-based typewriter effect (prevents character skipping in all environments)
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

  const [mobilePage, setMobilePage] = useState<'left' | 'right'>('left');

  // Automatically switch to the letter page (right) on mobile once typing starts
  useEffect(() => {
    if (displayedText.length > 3) {
      setMobilePage('right');
    }
  }, [displayedText]);
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

      {/* 3D Open Book Wrapper */}
      <div
        className="scrapbook-container"
        style={{
          width: '95%',
          maxWidth: 680,
          display: 'flex',
          position: 'relative',
          boxShadow: '0 25px 60px rgba(0,0,0,0.65)',
          borderRadius: 12,
          overflow: 'hidden',
          background: '#3d160e', // Leather backing visible on edges
          padding: '8px',
        }}
      >
        <style dangerouslySetInnerHTML={{ __html: `
          .scrapbook-container {
            flex-direction: row;
            aspect-ratio: 1.32;
            height: auto;
          }
          .scrapbook-page-left {
            display: flex !important;
          }
          .scrapbook-page-right {
            display: flex !important;
          }
          @media (max-width: 600px) {
            .scrapbook-container {
              flex-direction: column !important;
              aspect-ratio: 0.72 !important;
              height: auto !important;
            }
            .scrapbook-spine {
              display: none !important;
            }
            .scrapbook-page-left {
              display: ${mobilePage === 'left' ? 'flex' : 'none'} !important;
              border-radius: 8px !important;
            }
            .scrapbook-page-right {
              display: ${mobilePage === 'right' ? 'flex' : 'none'} !important;
              border-radius: 8px !important;
            }
          }
        ` }} />

        {/* Mobile Page Toggle Tabs */}
        <div className="mobile-only" style={{
          display: 'none',
          position: 'absolute', top: 12, left: '50%', transform: 'translateX(-50%)',
          zIndex: 100, gap: 8,
        }}>
          <style dangerouslySetInnerHTML={{ __html: `
            @media (max-width: 600px) {
              .mobile-only { display: flex !important; }
            }
          ` }} />
          <button
            onClick={(e) => { e.stopPropagation(); setMobilePage('left'); }}
            style={{
              background: mobilePage === 'left' ? '#C9A84C' : 'rgba(255,255,255,0.08)',
              border: 'none', color: mobilePage === 'left' ? '#080408' : '#FFF8F0',
              padding: '4px 12px', borderRadius: 20, fontSize: '0.68rem', fontWeight: 600, cursor: 'pointer'
            }}
          >
            {locale === 'hi' ? 'स्वागत' : 'Intro'}
          </button>
          <button
            onClick={(e) => { e.stopPropagation(); setMobilePage('right'); }}
            style={{
              background: mobilePage === 'right' ? '#C9A84C' : 'rgba(255,255,255,0.08)',
              border: 'none', color: mobilePage === 'right' ? '#080408' : '#FFF8F0',
              padding: '4px 12px', borderRadius: 20, fontSize: '0.68rem', fontWeight: 600, cursor: 'pointer'
            }}
          >
            {locale === 'hi' ? 'चिट्ठी' : 'Letter'}
          </button>
        </div>

        {/* LEFT PAGE: Scrapbook Cardstock (Decorative / Photo frame) */}
        <div className="scrapbook-page-left" style={{
          flex: 1,
          background: '#f2e6cf',
          borderRadius: '8px 0 0 8px',
          padding: 24,
          display: 'flex', flexDirection: 'column',
          alignItems: 'center', justifyContent: 'center',
          position: 'relative',
          boxShadow: 'inset -15px 0 20px rgba(0,0,0,0.15)', // Shadow curving into the spine
          backgroundImage: 'radial-gradient(circle at 10% 10%, rgba(255,255,255,0.15) 0%, transparent 80%)',
        }}>
          {/* Faint gold frame */}
          <div style={{
            position: 'absolute', inset: 12,
            border: '1px solid rgba(199,151,116,0.3)',
            borderRadius: 4,
          }} />

          {/* Handcrafted scrapbook accents: 3D Roli splatters, 3D Chawal grains & Gold dust scatter */}
          <div style={{ position: 'absolute', inset: 0, pointerEvents: 'none', zIndex: 1 }}>
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
              {/* Rice shadows */}
              <ellipse cx="41" cy="42" rx="10" ry="4" fill="rgba(0,0,0,0.18)" transform="rotate(35 40 40)"/>
              <ellipse cx="65" cy="38" rx="9" ry="3.6" fill="rgba(0,0,0,0.18)" transform="rotate(-15 64 36)"/>
              {/* Rice bodies */}
              <ellipse cx="40" cy="40" rx="10" ry="4" fill="url(#rice3d)" transform="rotate(35 40 40)"/>
              <ellipse cx="64" cy="36" rx="9" ry="3.6" fill="url(#rice3d)" transform="rotate(-15 64 36)"/>
              
              {/* Roli splatters with drop shadows */}
              <circle cx="27" cy="71" r="6" fill="rgba(0,0,0,0.15)"/>
              <circle cx="26" cy="70" r="6" fill="url(#roli3d)"/>
              <circle cx="34" cy="80" r="3.5" fill="url(#roli3d)"/>
              <circle cx="21" cy="82" r="2.5" fill="url(#roli3d)"/>

              {/* Scattered Gold Dust */}
              <circle cx="25" cy="120" r="2.2" fill="#d4af37" opacity="0.8"/>
              <circle cx="50" cy="110" r="1.5" fill="#e5c07b" opacity="0.9"/>
              <circle cx="80" cy="80" r="2.5" fill="#d4af37" opacity="0.8"/>
              <circle cx="95" cy="130" r="1.8" fill="#e5c07b" opacity="0.7"/>
              <circle cx="38" cy="62" r="1.2" fill="#d4af37" opacity="0.9"/>

              {/* Bottom Right Cluster */}
              <ellipse cx="251" cy="382" rx="9" ry="3.6" fill="rgba(0,0,0,0.18)" transform="rotate(-40 250 380)"/>
              <ellipse cx="250" cy="380" rx="9" ry="3.6" fill="url(#rice3d)" transform="rotate(-40 250 380)"/>
              <circle cx="239" cy="409" r="7" fill="rgba(0,0,0,0.15)"/>
              <circle cx="238" cy="408" r="7" fill="url(#roli3d)"/>
            </svg>
          </div>

          {/* Sibling keepsake card with premium 3D Laddoo sweet (No emojis) */}
          <div style={{
            width: '85%', height: '70%',
            border: '1px solid #d4c8af',
            background: '#faf6ee',
            padding: 12,
            boxShadow: '0 8px 20px rgba(0,0,0,0.15)',
            transform: 'rotate(-2deg)',
            display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
            gap: 12,
            zIndex: 2,
          }}>
              {/* Secure container wrapper for Laddoo SVG */}
              <div style={{ width: 110, height: 110, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <svg viewBox="0 0 120 120" width="100%" height="100%">
                  <defs>
                    <radialGradient id="laddoo3d" cx="35%" cy="35%" r="65%">
                      <stop offset="0%" stopColor="#fff0ad" />
                      <stop offset="25%" stopColor="#f5ba42" />
                      <stop offset="70%" stopColor="#d18315" />
                      <stop offset="100%" stopColor="#804700" />
                    </radialGradient>
                    <radialGradient id="shadow3d" cx="50%" cy="50%" r="50%">
                      <stop offset="0%" stopColor="rgba(0, 0, 0, 0.45)" />
                      <stop offset="100%" stopColor="rgba(0, 0, 0, 0)" />
                    </radialGradient>
                    <linearGradient id="pistachioGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                      <stop offset="0%" stopColor="#a4c263" />
                      <stop offset="100%" stopColor="#557519" />
                    </linearGradient>
                  </defs>

                  {/* Soft 3D drop shadow underneath */}
                  <ellipse cx="60" cy="92" rx="34" ry="10" fill="url(#shadow3d)" />

                  {/* Pleated brown paper liner cup */}
                  <path d="M 32 78 L 22 90 L 98 90 L 88 78 Z" fill="#4d3124" stroke="#311e15" strokeWidth="1" />
                  {/* Pleat lines */}
                  <path d="M 32 78 L 22 90 M 41 80 L 37 90 M 50 81 L 50 90 M 60 81 L 60 90 M 70 81 L 73 90 M 79 80 L 85 90 M 88 78 L 98 90" stroke="#311e15" strokeWidth="0.8" />

                  {/* The 3D Laddoo Sphere */}
                  <circle cx="60" cy="62" r="32" fill="url(#laddoo3d)" stroke="#6b3a00" strokeWidth="0.5" />

                  {/* Real Pistachio Sliver on top */}
                  <path d="M 52 46 Q 60 38 68 44 Q 60 52 52 46 Z" fill="url(#pistachioGrad)" stroke="#3e5414" strokeWidth="0.5" />
                  {/* Saffron thread decoration */}
                  <path d="M 58 48 Q 66 52 64 62" stroke="#d43f3f" strokeWidth="1.2" fill="none" strokeLinecap="round" />
                  <path d="M 66 46 Q 74 44 70 54" stroke="#d43f3f" strokeWidth="1" fill="none" strokeLinecap="round" />

                  {/* Tiny shiny silver foil flakes (Varak) */}
                  <path d="M 42 58 L 48 55 L 45 62 Z" fill="#fff" opacity="0.9" />
                  <path d="M 72 65 L 75 62 L 78 68 Z" fill="#fff" opacity="0.85" />
                </svg>
              </div>

            <p className={locale === 'hi' ? 'hindi-handwritten' : 'handwritten-text'} style={{
              fontSize: locale === 'hi' ? '1.15rem' : '1.4rem', color: '#8c7662', margin: 0, textAlign: 'center', lineHeight: 1.2
            }}>
              {locale === 'hi' ? 'मीठी यादें, अटूट बंधन...' : 'Tied with sweetness...'}
            </p>
          </div>
        </div>

        {/* CENTRAL BINDER SPINE (Realistic brass coil overlay) */}
        <div className="scrapbook-spine" style={{
          width: 24,
          background: 'linear-gradient(to right, #290e09 0%, #150604 50%, #290e09 100%)',
          position: 'relative',
          zIndex: 10,
          display: 'flex', flexDirection: 'column',
          justifyContent: 'space-around',
          alignItems: 'center',
          boxShadow: '0 0 10px rgba(0,0,0,0.5)',
        }}>
          {/* Spirals */}
          {Array.from({ length: 10 }).map((_, i) => (
            <div
              key={i}
              style={{
                width: 28, height: 8,
                background: 'linear-gradient(to bottom, #d4af37, #856414, #d4af37)',
                borderRadius: 4,
                boxShadow: '0 2px 4px rgba(0,0,0,0.4)',
                transform: 'rotate(-5deg)',
              }}
            />
          ))}
        </div>

        {/* RIGHT PAGE: Ruled notebook paper with letter text */}
        <div style={{
          flex: 1,
          background: '#faf6ee',
          borderRadius: '0 8px 8px 0',
          padding: '24px 16px 20px 24px',
          display: 'flex', flexDirection: 'column',
          position: 'relative',
          boxShadow: 'inset 15px 0 20px rgba(0,0,0,0.15)', // Shadow curving into the spine
          overflow: 'hidden',
        }}>
          {/* Auto-aligning dynamic notebook lines relative to letter text line height */}
          <div style={{
            position: 'absolute', inset: 0,
            top: 24, bottom: 20,
            pointerEvents: 'none',
            zIndex: 1,
          }} />

          {/* Handcrafted scrapbook accents: 3D Roli splatters, 3D Chawal grains & Gold dust scatter */}
          <div style={{ position: 'absolute', inset: 0, pointerEvents: 'none', zIndex: 1 }}>
            <svg width="100%" height="100%" style={{ position: 'absolute', inset: 0 }} viewBox="0 0 300 450" preserveAspectRatio="none">
              {/* Top Right Cluster */}
              <ellipse cx="251" cy="42" rx="9" ry="3.6" fill="rgba(0,0,0,0.18)" transform="rotate(15 250 40)"/>
              <ellipse cx="250" cy="40" rx="9" ry="3.6" fill="url(#rice3d)" transform="rotate(15 250 40)"/>
              <circle cx="263" cy="56" r="6" fill="rgba(0,0,0,0.15)"/>
              <circle cx="262" cy="55" r="6" fill="url(#roli3d)"/>
              <circle cx="258" cy="62" r="3" fill="url(#roli3d)"/>

              {/* Gold Dust Scatter across margins */}
              <circle cx="270" cy="90" r="2.2" fill="#d4af37" opacity="0.8"/>
              <circle cx="220" cy="140" r="1.5" fill="#e5c07b" opacity="0.9"/>
              <circle cx="245" cy="190" r="2.5" fill="#d4af37" opacity="0.8"/>
              <circle cx="230" cy="250" r="1.2" fill="#e5c07b" opacity="0.7"/>
              <circle cx="260" cy="300" r="1.8" fill="#d4af37" opacity="0.8"/>

              {/* Bottom Left Cluster */}
              <circle cx="35" cy="381" r="6" fill="rgba(0,0,0,0.15)"/>
              <circle cx="34" cy="380" r="6" fill="url(#roli3d)"/>
              <ellipse cx="51" cy="377" rx="9" ry="3.6" fill="rgba(0,0,0,0.18)" transform="rotate(50 50 375)"/>
              <ellipse cx="50" cy="375" rx="9" ry="3.6" fill="url(#rice3d)" transform="rotate(50 50 375)"/>
            </svg>
          </div>

          {/* Letter content container */}
          <div style={{
            overflowY: 'auto', flex: 1, zIndex: 2, paddingRight: 4,
          }}>
            <h2 className={locale === 'hi' ? 'hindi-handwritten' : 'handwritten-text'} style={{
              fontSize: locale === 'hi' ? '1.25rem' : '1.4rem', color: '#1a3b5c', margin: '0 0 16px 0',
              fontWeight: 700, lineHeight: 1.6, paddingBottom: 0
            }}>
              {locale === 'hi' ? `प्यारे ${recipientName},` : `Dearest ${recipientName},`}
            </h2>

            {/* Split text into rows and render notebook lines dynamically underneath each row */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: 0 }}>
              {displayedText.split('\n').map((line, rIdx) => {
                const isBlank = !line.trim();
                return (
                  <div 
                    key={rIdx} 
                    style={{ 
                      minHeight: isBlank ? 16 : 28,
                      display: 'flex',
                      alignItems: 'center',
                      paddingBottom: isBlank ? 0 : 2
                    }}
                  >
                    <p className={locale === 'hi' ? 'hindi-handwritten' : 'handwritten-text'} style={{
                      fontSize: locale === 'hi' ? '1.15rem' : '1.25rem', color: '#2b4f74', margin: 0,
                      lineHeight: 1.5, whiteSpace: 'pre-wrap', width: '100%'
                    }}>
                      {line || ' '}
                    </p>
                  </div>
                );
              })}
            </div>

            {isDone && (
              <motion.p 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className={locale === 'hi' ? 'hindi-handwritten' : 'handwritten-text'} 
                style={{
                  fontSize: locale === 'hi' ? '1.25rem' : '1.35rem', color: '#1a3b5c', margin: '24px 0 0 0',
                  textAlign: 'right', fontWeight: 700,
                }}
              >
                — {senderName}
              </motion.p>
            )}
          </div>

          {/* Action button */}
          {isDone && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              style={{ marginTop: 16, zIndex: 10 }}
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
                  fontSize: '0.8rem',
                  padding: '10px 16px',
                  boxShadow: '0 4px 12px rgba(163,111,77,0.3)',
                }}
              >
                {locale === 'hi' ? 'यादें देखें →' : 'View Memories →'}
              </button>
            </motion.div>
          )}
        </div>
      </div>
    </div>
  );
}
