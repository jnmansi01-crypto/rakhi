'use client';
// Template 02 — Scene 1: Welcome (3D Tactile Hardcover Sibling Album)
// Real 3D rotational perspective, stacked paper page edges (~16px thickness),
// 3D spine depth, 3D floating cardstock note card with 3D Z-axis pop, and 3D wax seal.

import { useState } from 'react';
import { motion } from 'framer-motion';
import { useHaptics } from '@/shared/components/useHaptics';
import { audioEngine } from '@/shared/audio/audio';
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
    audioEngine.playPaper?.();
    setIsOpen(true);
    setTimeout(onComplete, 1100);
  };

  return (
    <div style={{
      position: 'fixed', inset: 0,
      background: '#090605',
      backgroundImage: 'radial-gradient(circle at center, #1a100d 0%, #030202 100%)',
      display: 'flex', flexDirection: 'column',
      alignItems: 'center', justifyContent: 'center',
      perspective: 1200,
      overflow: 'hidden',
    }}>
      <style dangerouslySetInnerHTML={{ __html: `
        @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,600;0,700;1,400;1,600&family=Caveat:wght@700&family=Yatra+One&display=swap');
        .cover-hindi { font-family: 'Yatra One', serif !important; letter-spacing: 0.05em !important; font-style: normal !important; }
        .handwritten-font { font-family: 'Caveat', cursive !important; }
      ` }} />

      <div style={{
        position: 'absolute', inset: 0,
        background: 'radial-gradient(circle at center, transparent 30%, rgba(0,0,0,0.85) 100%)',
        pointerEvents: 'none',
      }} />

      {/* 3D Realistic Hardcover Book Container with Rotational Perspective */}
      <motion.div
        initial={{ y: 30, opacity: 0, rotateY: -12, rotateX: 6 }}
        animate={isOpen 
          ? { rotateY: -160, x: '-35%', z: -50, opacity: 0.9, filter: 'brightness(0.4)' } 
          : { y: 0, opacity: 1, rotateY: -8, rotateX: 4 }
        }
        whileHover={isOpen ? {} : { rotateY: -2, rotateX: 2, scale: 1.02 }}
        transition={{ duration: 1, ease: [0.25, 1, 0.5, 1] }}
        style={{
          width: '85%',
          maxWidth: 340,
          height: 495,
          background: '#f4ede2',
          backgroundImage: 'radial-gradient(circle at center, #fbf7f0 0%, #ede3d3 100%)',
          borderRadius: '14px 22px 22px 14px',
          boxShadow: `
            0 35px 85px rgba(0, 0, 0, 0.9), 
            inset -10px 0 20px rgba(0, 0, 0, 0.22),
            inset 4px 0 8px rgba(255, 255, 255, 0.9),
            4px 2px 0 #ede3d3,
            8px 4px 0 #e2d7c5,
            12px 6px 0 #d8cbb7,
            16px 8px 30px rgba(0, 0, 0, 0.6)
          `,
          borderLeft: '22px solid #b8a68f',
          display: 'flex', flexDirection: 'column',
          alignItems: 'center', justifyContent: 'space-between',
          cursor: 'pointer',
          transformStyle: 'preserve-3d',
          transformOrigin: 'left center',
          padding: '34px 22px 26px 22px',
          position: 'relative',
          overflow: 'visible',
          color: '#2b231d',
        }}
        onClick={handleOpen}
      >
        {/* 3D Metallic Gold Corner Brackets */}
        {['top-left', 'top-right', 'bottom-left', 'bottom-right'].map((pos) => {
          const isTop = pos.includes('top');
          const isLeft = pos.includes('left');
          return (
            <div
              key={pos}
              style={{
                position: 'absolute',
                top: isTop ? 12 : 'auto',
                bottom: !isTop ? 12 : 'auto',
                left: isLeft ? 12 : 'auto',
                right: !isLeft ? 12 : 'auto',
                width: 24, height: 24,
                borderTop: isTop ? '2.5px solid #c99738' : 'none',
                borderBottom: !isTop ? '2.5px solid #c99738' : 'none',
                borderLeft: isLeft ? '2.5px solid #c99738' : 'none',
                borderRight: !isLeft ? '2.5px solid #c99738' : 'none',
                pointerEvents: 'none', opacity: 0.9, zIndex: 12,
                transform: 'translateZ(8px)',
                boxShadow: isTop ? '0 -1px 3px rgba(0,0,0,0.3)' : '0 1px 3px rgba(0,0,0,0.3)',
              }}
            />
          );
        })}

        {/* Outer Gold Foil Border Frame */}
        <div style={{
          position: 'absolute', inset: 14,
          border: '1.5px solid rgba(201, 151, 56, 0.4)',
          borderRadius: '8px 16px 16px 8px',
          pointerEvents: 'none',
          zIndex: 12,
          transform: 'translateZ(6px)',
        }} />

        {/* TOP SECTION: Retro Pixel Dinosaur & Cloud Graphic Badge */}
        <div style={{ zIndex: 15, textAlign: 'center', marginTop: 2, transform: 'translateZ(12px)' }}>
          <div style={{
            display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 10,
            fontSize: 22, marginBottom: 4,
            filter: 'drop-shadow(0 2px 4px rgba(0,0,0,0.15))',
          }}>
            <span>👾</span>
            <span style={{ fontSize: 16, opacity: 0.7 }}>☁️</span>
            <span>🌵</span>
          </div>

          <h2 style={{
            fontFamily: "'Playfair Display', Georgia, serif",
            fontSize: '1.1rem', fontWeight: 700, color: '#2b231d',
            margin: '0 0 4px 0', letterSpacing: '0.02em', lineHeight: 1.3,
          }}>
            {locale === 'hi' ? 'कोई भाई-बहन आहत नहीं हुआ' : 'No Siblings Were Harmed'}
          </h2>

          <span style={{
            fontFamily: "'Caveat', cursive, system-ui, sans-serif",
            fontSize: '0.88rem', fontWeight: 700, color: '#8a623a',
            letterSpacing: '0.06em', display: 'block',
          }}>
            {locale === 'hi'
              ? 'इस स्क्रैपबुक को बनाने के दौरान 🤫'
              : 'In the making of this scrapbook 🤫'}
          </span>
        </div>

        {/* CENTER SECTION: 3D Floating Cardstock Note with Washi Tape & Corner Wax Seal */}
        <div style={{
          position: 'relative', width: '100%', zIndex: 20,
          margin: '8px 0',
          transformStyle: 'preserve-3d',
        }}>
          {/* 3D Gold Washi Tape Strip */}
          <div style={{
            position: 'absolute', top: -10, left: '20%', width: 75, height: 18,
            background: 'rgba(212, 175, 55, 0.45)',
            border: '1px dashed rgba(138, 98, 58, 0.4)',
            boxShadow: '0 4px 8px rgba(0,0,0,0.15)',
            transform: 'rotate(-2deg) translateZ(36px)', zIndex: 30,
          }} />

          {/* 3D Burgundy Wax Seal Pinned at Top Right Corner (Clean alignment) */}
          <div style={{
            position: 'absolute', top: -14, right: -10, zIndex: 35,
            width: 46, height: 46, borderRadius: '50%',
            background: 'radial-gradient(circle, #b83228 0%, #801d16 70%, #520f0a 100%)',
            border: '1.5px solid #6b150e',
            boxShadow: '0 10px 20px rgba(0,0,0,0.45), inset 0 2px 4px rgba(255,255,255,0.4)',
            display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
            color: '#ffeaa7', transform: 'rotate(8deg) translateZ(42px)',
          }}>
            <span style={{ fontSize: 11, lineHeight: 1 }}>💖</span>
            <span style={{ fontSize: 5.5, fontWeight: 800, letterSpacing: '0.08em', marginTop: 1 }}>BONDED</span>
          </div>

          {/* 3D Tilted Floating Cardstock Paper Note (TranslateZ 28px) */}
          <motion.div 
            whileHover={{ scale: 1.03, rotate: 0 }}
            transition={{ type: 'spring', stiffness: 300, damping: 20 }}
            style={{
              background: '#fffefc',
              borderRadius: 12,
              padding: '16px 14px',
              border: '1px solid #e3d9cb',
              boxShadow: '0 16px 36px rgba(0,0,0,0.22), inset 0 0 10px rgba(0,0,0,0.02)',
              transform: 'rotate(-1.5deg) translateZ(28px)',
              display: 'flex', flexDirection: 'column', gap: 10,
              position: 'relative',
            }}
          >
            {/* Header Tag */}
            <div style={{
              fontSize: '0.7rem', fontWeight: 800, color: '#8a5330',
              letterSpacing: '0.08em', textTransform: 'uppercase',
              borderBottom: '1px solid #f0e6d8', paddingBottom: 4,
              textAlign: 'center',
            }}>
              {locale === 'hi' ? 'गोल्डन रूल्स 📌' : 'SIBLING AGREEMENT 📌'}
            </div>

            {/* 4 Absorbable Visual Icon Pill Badges */}
            <div style={{
              display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 8,
            }}>
              <div style={{
                background: '#f9f5ed', border: '1px solid #e8decb', borderRadius: 8,
                padding: '6px 8px', display: 'flex', alignItems: 'center', gap: 6,
                fontSize: '0.72rem', fontWeight: 700, color: '#4a3c2e',
                boxShadow: '0 2px 4px rgba(0,0,0,0.04)',
              }}>
                <span style={{ fontSize: 14 }}>🍕</span>
                <span>{locale === 'hi' ? 'फूड पार्टनर' : 'Food Stealer'}</span>
              </div>

              <div style={{
                background: '#f9f5ed', border: '1px solid #e8decb', borderRadius: 8,
                padding: '6px 8px', display: 'flex', alignItems: 'center', gap: 6,
                fontSize: '0.72rem', fontWeight: 700, color: '#4a3c2e',
                boxShadow: '0 2px 4px rgba(0,0,0,0.04)',
              }}>
                <span style={{ fontSize: 14 }}>🙄</span>
                <span>{locale === 'hi' ? 'आई रोल मास्टर' : 'Eye-Roll Partner'}</span>
              </div>

              <div style={{
                background: '#f9f5ed', border: '1px solid #e8decb', borderRadius: 8,
                padding: '6px 8px', display: 'flex', alignItems: 'center', gap: 6,
                fontSize: '0.72rem', fontWeight: 700, color: '#4a3c2e',
                boxShadow: '0 2px 4px rgba(0,0,0,0.04)',
              }}>
                <span style={{ fontSize: 14 }}>🗣️</span>
                <span>{locale === 'hi' ? 'बहस पार्टनर' : 'Argument Partner'}</span>
              </div>

              <div style={{
                background: '#f9f5ed', border: '1px solid #e8decb', borderRadius: 8,
                padding: '6px 8px', display: 'flex', alignItems: 'center', gap: 6,
                fontSize: '0.72rem', fontWeight: 700, color: '#4a3c2e',
                boxShadow: '0 2px 4px rgba(0,0,0,0.04)',
              }}>
                <span style={{ fontSize: 14 }}>🤫</span>
                <span>{locale === 'hi' ? 'राजदार' : 'Secret Keeper'}</span>
              </div>
            </div>
          </motion.div>
        </div>

        {/* BOTTOM SECTION: Personalized Title & Pulsing Tap Prompt */}
        <div style={{
          zIndex: 15, textAlign: 'center',
          display: 'flex', flexDirection: 'column', gap: 4,
          marginBottom: 4,
          transform: 'translateZ(14px)',
        }}>
          <h1 
            className={locale === 'hi' ? 'cover-hindi' : ''}
            style={{
              fontFamily: "'Playfair Display', Georgia, serif",
              fontSize: locale === 'hi' ? '1.4rem' : '1.65rem',
              fontWeight: 600,
              color: '#2b231d',
              margin: 0,
              lineHeight: 1.25,
            }}
          >
            {locale === 'hi' ? (
              <>प्यारे {recipientName} के नाम</>
            ) : (
              <>For My Favorite Human,<br /><span style={{ color: '#8a5330', fontStyle: 'italic' }}>{recipientName} ✨</span></>
            )}
          </h1>

          <div style={{
            width: 60, height: 1,
            background: 'linear-gradient(90deg, transparent, #c99738, transparent)',
            margin: '4px auto',
          }} />

          {/* Subtitle Prompt */}
          <motion.p
            animate={{ opacity: [0.65, 1, 0.65] }}
            transition={{ repeat: Infinity, duration: 2, ease: 'easeInOut' }}
            style={{
              fontFamily: "'Playfair Display', Georgia, serif",
              fontStyle: 'italic',
              fontSize: '0.78rem',
              color: '#8a5330',
              margin: 0,
              letterSpacing: '0.04em',
              fontWeight: 600,
            }}
          >
            {locale === 'hi' ? 'किताब खोलने के लिए टैप करें 📖' : 'Tap to open our story 📖'}
          </motion.p>
        </div>
      </motion.div>
    </div>
  );
}
