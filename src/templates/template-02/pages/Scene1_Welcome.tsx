'use client';
// Template 02 — Scene 1: Welcome (The Scrapbook Album Cover)
// Refined with a smaller, highly detailed gold Rakhi centerpiece at the top,
// featuring crimson-and-gold threads extending horizontally to both edges of the frame.

import { useState } from 'react';
import { motion } from 'framer-motion';
import { useHaptics } from '@/shared/components/useHaptics';
import type { Locale } from '@/lib/types';

interface Props {
  senderName: string;
  recipientName: string;
  locale: Locale;
  onComplete: () => void;
}

export function Scene1_Welcome({ senderName, recipientName, locale, onComplete }: Props) {
  const [isOpen, setIsOpen] = useState(false);
  const { vibrate } = useHaptics();

  const handleOpen = () => {
    vibrate();
    setIsOpen(true);
    setTimeout(onComplete, 1100);
  };

  return (
    <div style={{
      position: 'fixed', inset: 0,
      background: '#0d0706',
      backgroundImage: 'radial-gradient(circle at center, #1b0e0c 0%, #050202 100%)',
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      perspective: 1500,
      overflow: 'hidden',
    }}>
      <style dangerouslySetInnerHTML={{ __html: `
        @import url('https://fonts.googleapis.com/css2?family=Yatra+One&display=swap');
        .cover-hindi { font-family: 'Yatra One', serif !important; letter-spacing: 0.05em !important; font-style: normal !important; }
      ` }} />
      <div style={{
        position: 'absolute', inset: 0,
        background: 'radial-gradient(circle at center, transparent 30%, rgba(0,0,0,0.8) 100%)',
        pointerEvents: 'none',
      }} />

      <motion.div
        initial={{ y: 40, opacity: 0, rotateX: 10 }}
        animate={isOpen 
          ? { rotateY: -160, x: '-35%', z: -50, opacity: 0.9, filter: 'brightness(0.4)' } 
          : { y: 0, opacity: 1, rotateX: 0 }
        }
        transition={{ duration: 1.2, ease: [0.25, 1, 0.5, 1] }}
        style={{
          width: '85%',
          maxWidth: 340,
          height: 480,
          background: 'linear-gradient(135deg, #7c1a22 0%, #4a0d13 100%)',
          backgroundImage: `
            linear-gradient(90deg, rgba(255,255,255,0.03) 1px, transparent 1px),
            linear-gradient(135deg, #7c1a22 0%, #4a0d13 100%)
          `,
          backgroundSize: '3px 100%, 100% 100%',
          borderRadius: '16px 24px 24px 16px',
          boxShadow: `
            0 25px 55px rgba(0, 0, 0, 0.8), 
            inset -3px 0 10px rgba(0, 0, 0, 0.4),
            inset 3px 0 6px rgba(255, 255, 255, 0.08)
          `,
          borderLeft: '18px solid #2f080c',
          display: 'flex', flexDirection: 'column',
          alignItems: 'center', justifyContent: 'space-between',
          cursor: 'pointer',
          transformStyle: 'preserve-3d',
          transformOrigin: 'left center',
          padding: '48px 32px',
          position: 'relative',
        }}
        onClick={handleOpen}
      >
        {/* Elegant Gold-Foil Border Frame */}
        <div style={{
          position: 'absolute', inset: 16,
          border: '1.5px solid #d4af37',
          borderRadius: '8px 16px 16px 8px',
          pointerEvents: 'none',
          opacity: 0.75,
          boxShadow: 'inset 0 0 10px rgba(212, 175, 55, 0.1)',
        }} />

        {/* The Rakhi Centerpiece (Smaller medallion with horizontal threads) */}
        <div style={{
          width: '100%',
          height: 80,
          position: 'relative',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          marginTop: 24,
        }}>
          {/* Horizontal Red-and-Gold Braided Threads extending to borders */}
          <div style={{
            position: 'absolute', left: 16, right: 16, height: 3,
            background: 'repeating-linear-gradient(90deg, #d4af37, #d4af37 6px, #c84040 6px, #c84040 12px)',
            opacity: 0.8,
            boxShadow: '0 2px 4px rgba(0,0,0,0.3)',
          }} />

          {/* Medallion Centerpiece (Smaller size: 76px) */}
          <div style={{
            width: 76, height: 76,
            borderRadius: '50%',
            background: 'radial-gradient(circle, #f9e396 0%, #c59f33 70%, #856414 100%)',
            border: '2px solid #856414',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            boxShadow: '0 6px 15px rgba(0,0,0,0.4)',
            zIndex: 10,
            position: 'relative',
          }}>
            {/* Inner beaded circle */}
            <div style={{
              position: 'absolute', inset: 4,
              borderRadius: '50%',
              border: '2px dotted #d4af37',
              opacity: 0.9,
            }} />
            {/* Center Ruby Gemstone */}
            <div style={{
              width: 22, height: 22, borderRadius: '50%',
              background: 'radial-gradient(circle, #ff4c4c 0%, #8c1111 100%)',
              border: '1.5px solid #6b0c0c',
              boxShadow: 'inset 0 1px 3px rgba(255,255,255,0.4), 0 2px 4px rgba(0,0,0,0.3)',
            }} />
          </div>
        </div>

        {/* Hot-Stamped Typography Directly on Cover */}
        <div style={{
          textAlign: 'center',
          display: 'flex', flexDirection: 'column',
          gap: 12,
          zIndex: 10,
          marginTop: 'auto',
          paddingTop: 40,
        }}>
          <h2 
            className={locale === 'hi' ? 'cover-hindi' : ''}
            style={{
              fontFamily: 'Georgia, serif',
              fontSize: locale === 'hi' ? '1.1rem' : '0.82rem',
              color: '#d4af37',
              letterSpacing: '0.22em',
              textTransform: 'uppercase',
              margin: 0,
              textShadow: '0 1px 2px rgba(0,0,0,0.5)',
              fontWeight: 400,
            }}
          >
            {locale === 'hi' ? 'रक्षा बंधन' : 'RAKSHA BANDHAN'}
          </h2>

          <h1 
            className={locale === 'hi' ? 'cover-hindi' : ''}
            style={{
              fontFamily: 'Georgia, serif',
              fontSize: locale === 'hi' ? '1.5rem' : '1.8rem',
              fontWeight: 400,
              color: '#fff',
              textShadow: '0 2px 4px rgba(0,0,0,0.6)',
              margin: 0,
              lineHeight: 1.3,
              fontStyle: 'italic',
            }}
          >
            {locale === 'hi' ? (
              <>प्यारे {recipientName} के नाम</>
            ) : (
              <>For my dearest<br />{recipientName}</>
            )}
          </h1>

          <div style={{
            width: 80, height: 1,
            background: 'linear-gradient(90deg, transparent, #d4af37, transparent)',
            margin: '8px auto',
          }} />

          <p style={{
            fontFamily: 'Georgia, serif',
            fontStyle: 'italic',
            fontSize: '0.75rem',
            color: 'rgba(255, 248, 240, 0.65)',
            margin: 0,
            letterSpacing: '0.05em',
          }}>
            {locale === 'hi' ? 'यादों का पिटारा खोलें' : 'Tap to open album'}
          </p>
        </div>
      </motion.div>
    </div>
  );
}
