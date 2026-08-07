'use client';
// Template 02 — Scene 3: Photos
// Premium 3D open scrapbook spread with a scattered photo collage 
// across two cardstock pages, decorated with neutral Rakhi-themed annotations.

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useHaptics } from '@/shared/components/useHaptics';
import { audioEngine } from '@/shared/audio/audio';
import type { Locale } from '@/lib/types';
import { btnStyle } from '@/shared/inputs/inputs';

interface Props {
  photoUrls: string[];
  senderName: string;
  recipientName: string;
  locale: Locale;
  onComplete: () => void;
}

export function Scene3_Photos({ photoUrls, senderName, recipientName, locale, onComplete }: Props) {
  const [activeIdx, setActiveIdx] = useState<number | null>(null);
  const { vibrate } = useHaptics();

  const handleNext = () => {
    vibrate();
    audioEngine.playSwoosh();
    onComplete();
  };

  // Separate photos between left and right pages
  const leftPagePhotos = photoUrls.slice(0, 2);
  const rightPagePhotos = photoUrls.slice(2, 5);

  const [mobilePage, setMobilePage] = useState<'left' | 'right'>('left');

  return (
    <div style={{
      position: 'absolute', inset: 0,
      background: '#120e0d',
      backgroundImage: 'radial-gradient(circle at center, #1f1412 0%, #080606 100%)',
      display: 'flex', flexDirection: 'column',
      alignItems: 'center', justifyContent: 'center',
      padding: '24px 12px',
      overflowY: 'auto',
    }}>
      <style dangerouslySetInnerHTML={{ __html: `
        @import url('https://fonts.googleapis.com/css2?family=Caveat:wght@500;700&display=swap');
        .handwritten-label {
          font-family: 'Caveat', cursive;
        }
      ` }} />

      {/* 3D Open Book Spread Container */}
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
              aspect-ratio: 0.72 !important;
              height: auto !important;
            }
            .scrapbook-spine {
              display: none !important;
            }
            .scrapbook-page-left {
              display: ${mobilePage === 'left' ? 'flex' : 'none'} !important;
              width: ${mobilePage === 'left' ? '100%' : '0'} !important;
              height: ${mobilePage === 'left' ? '100%' : '0'} !important;
              overflow: ${mobilePage === 'left' ? 'visible' : 'hidden'} !important;
              padding: ${mobilePage === 'left' ? '24px' : '0'} !important;
              border-radius: 8px !important;
            }
            .scrapbook-page-right {
              display: ${mobilePage === 'right' ? 'flex' : 'none'} !important;
              width: ${mobilePage === 'right' ? '100%' : '0'} !important;
              height: ${mobilePage === 'right' ? '100%' : '0'} !important;
              overflow: ${mobilePage === 'right' ? 'visible' : 'hidden'} !important;
              padding: ${mobilePage === 'right' ? '24px 16px' : '0'} !important;
              border-radius: 8px !important;
            }
          }
        ` }} />

        {/* LEFT PAGE: Scrapbook Cardstock (Photos 1 & 2) */}
        <motion.div 
          className="scrapbook-page-left"
          drag="x"
          dragConstraints={{ left: 0, right: 0 }}
          onDragEnd={(event, info) => {
            if (window.innerWidth <= 600 && info.offset.x < -40) {
              setMobilePage('right');
            }
          }}
          initial={{ rotateY: -30, opacity: 0.8 }}
          animate={{ rotateY: 0, opacity: 1 }}
          exit={{ rotateY: -90, opacity: 0 }}
          transition={{ duration: 0.6, ease: 'easeOut' }}
          style={{
            flex: 1,
            background: '#f2e6cf',
            borderRadius: '8px 0 0 8px',
            padding: '24px 16px',
            display: 'flex', flexDirection: 'column',
            alignItems: 'center', justifyContent: 'space-between',
            position: 'relative',
            boxShadow: 'inset -15px 0 20px rgba(0,0,0,0.15)',
            cursor: 'grab',
            touchAction: 'none',
          }}>
          {/* Subtle grid lines background */}
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
              {/* Rice grain shadows */}
              <ellipse cx="41" cy="42" rx="10" ry="4" fill="rgba(0,0,0,0.18)" transform="rotate(35 40 40)"/>
              <ellipse cx="65" cy="38" rx="9" ry="3.6" fill="rgba(0,0,0,0.18)" transform="rotate(-15 64 36)"/>
              {/* Rice grain bodies */}
              <ellipse cx="40" cy="40" rx="10" ry="4" fill="url(#rice3d)" transform="rotate(35 40 40)"/>
              <ellipse cx="64" cy="36" rx="9" ry="3.6" fill="url(#rice3d)" transform="rotate(-15 64 36)"/>
              {/* Roli splatters */}
              <circle cx="27" cy="71" r="6" fill="rgba(0,0,0,0.15)"/>
              <circle cx="26" cy="70" r="6" fill="url(#roli3d)"/>
              <circle cx="34" cy="80" r="3.5" fill="url(#roli3d)"/>

              {/* Gold Dust Scatter */}
              <circle cx="25" cy="120" r="2.2" fill="#d4af37" opacity="0.8"/>
              <circle cx="80" cy="80" r="1.5" fill="#e5c07b" opacity="0.9"/>
              <circle cx="95" cy="130" r="2.0" fill="#d4af37" opacity="0.8"/>

              {/* Bottom Right Rice */}
              <ellipse cx="251" cy="382" rx="9" ry="3.6" fill="rgba(0,0,0,0.18)" transform="rotate(-30 250 380)"/>
              <ellipse cx="250" cy="380" rx="9" ry="3.6" fill="url(#rice3d)" transform="rotate(-30 250 380)"/>
            </svg>
          </div>

          {/* Left Collage Content */}
          <div style={{ position: 'relative', width: '100%', flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            {leftPagePhotos.map((url, i) => {
              const rotation = i === 0 ? -6 : 8;
              const yOffset = i === 0 ? -40 : 50;
              const xOffset = i === 0 ? -15 : 15;
              return (
                <motion.div
                  key={i}
                  onClick={() => { vibrate(); setActiveIdx(i); }}
                  whileHover={{ scale: 1.08, zIndex: 10, rotate: 0 }}
                  style={{
                    position: 'absolute',
                    width: '78%',
                    maxWidth: 160,
                    background: '#fff',
                    padding: '8px 8px 20px 8px',
                    boxShadow: '0 8px 18px rgba(0,0,0,0.18)',
                    border: '1px solid #e2ddd5',
                    transform: `rotate(${rotation}deg) translate(${xOffset}px, ${yOffset}px)`,
                    zIndex: 5 + i,
                  }}
                >
                  <div style={{
                    position: 'absolute', top: -10, left: '30%', width: 45, height: 14,
                    background: 'rgba(242,238,209,0.5)', border: '1px dashed rgba(0,0,0,0.05)',
                  }} />
                  <div style={{ width: '100%', height: 110, background: '#1c1b18', overflow: 'hidden' }}>
                    <img src={url} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                  </div>
                  <p className="handwritten-label" style={{ fontSize: '0.95rem', color: '#554734', textAlign: 'center', margin: '6px 0 0 0' }}>
                    {i === 0 
                      ? (locale === 'hi' ? 'बचपन की अटखेलियां' : 'Sweet Childhood') 
                      : (locale === 'hi' ? 'वो नोक-झोंक और प्यार' : 'Playful Fights')
                    }
                  </p>
                </motion.div>
              );
            })}

            {/* Sticky note handwritten caption */}
            {leftPagePhotos.length > 0 && (
              <div className="handwritten-label" style={{
                position: 'absolute', bottom: 12, left: 16,
                transform: 'rotate(-4deg)',
                color: '#654f3b', fontSize: '1.25rem',
                lineHeight: 1.2,
              }}>
                {locale === 'hi' ? 'प्यार के कच्चे धागे, रिश्ते पक्के...' : 'Our thread of love...'}
              </div>
            )}
            {/* Visual swipe prompt on mobile */}
            <div className="mobile-only" style={{
              position: 'absolute', bottom: 4, right: 16,
              fontSize: '0.65rem',
              color: '#c79774',
              fontWeight: 600,
              opacity: 0.8,
              letterSpacing: '0.05em',
              animation: 'pulse 2s infinite',
            }}>
              {locale === 'hi' ? '← स्वाइप करके और फोटो देखें' : '← Swipe left to see more photos'}
            </div>
          </div>
        </motion.div>

        {/* CENTRAL BINDER SPINE */}
        <div className="scrapbook-spine" style={{
          width: 24,
          background: 'linear-gradient(to right, #290e09, #150604, #290e09)',
          position: 'relative', zIndex: 10,
          display: 'flex', flexDirection: 'column',
          justifyContent: 'space-around', alignItems: 'center',
        }}>
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

        {/* RIGHT PAGE: Scrapbook Cardstock (Photos 3, 4 & 5) */}
        <motion.div 
          className="scrapbook-page-right"
          drag="x"
          dragConstraints={{ left: 0, right: 0 }}
          onDragEnd={(event, info) => {
            if (window.innerWidth <= 600 && info.offset.x > 40) {
              setMobilePage('left');
            }
          }}
          initial={{ rotateY: 30, opacity: 0.8 }}
          animate={{ rotateY: 0, opacity: 1 }}
          exit={{ rotateY: 90, opacity: 0 }}
          transition={{ duration: 0.6, ease: 'easeOut' }}
          style={{
            flex: 1,
            background: '#f2e6cf',
            borderRadius: '0 8px 8px 0',
            padding: '24px 16px 20px 16px',
            display: 'flex', flexDirection: 'column',
            justifyContent: 'space-between',
            position: 'relative',
            boxShadow: 'inset 15px 0 20px rgba(0,0,0,0.15)',
            cursor: 'grab',
            touchAction: 'none',
          }}>
          <div style={{
            position: 'absolute', inset: 12,
            border: '1px solid rgba(199,151,116,0.3)',
            borderRadius: 4,
          }} />

          {/* Handcrafted scrapbook accents: 3D Roli splatters, 3D Chawal grains & Gold dust scatter */}
          <div style={{ position: 'absolute', inset: 0, pointerEvents: 'none', zIndex: 1 }}>
            <svg width="100%" height="100%" style={{ position: 'absolute', inset: 0 }} viewBox="0 0 300 450" preserveAspectRatio="none">
              {/* Top Right Cluster */}
              <ellipse cx="251" cy="42" rx="9" ry="3.6" fill="rgba(0,0,0,0.18)" transform="rotate(25 250 40)"/>
              <ellipse cx="250" cy="40" rx="9" ry="3.6" fill="url(#rice3d)" transform="rotate(25 250 40)"/>
              <circle cx="263" cy="56" r="6" fill="rgba(0,0,0,0.15)"/>
              <circle cx="262" cy="55" r="6" fill="url(#roli3d)"/>

              {/* Gold Dust Scatter */}
              <circle cx="270" cy="90" r="2.2" fill="#d4af37" opacity="0.8"/>
              <circle cx="215" cy="140" r="1.5" fill="#d4af37" opacity="0.7"/>
              <circle cx="235" cy="210" r="1.2" fill="#e5c07b" opacity="0.8"/>

              {/* Bottom Left Cluster */}
              <circle cx="35" cy="381" r="6" fill="rgba(0,0,0,0.15)"/>
              <circle cx="34" cy="380" r="6" fill="url(#roli3d)"/>
              <ellipse cx="51" cy="377" rx="9" ry="3.6" fill="rgba(0,0,0,0.18)" transform="rotate(-40 50 375)"/>
              <ellipse cx="50" cy="375" rx="9" ry="3.6" fill="url(#rice3d)" transform="rotate(-40 50 375)"/>
            </svg>
          </div>

          {/* Right Collage Content */}
          <div style={{ position: 'relative', width: '100%', flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            {rightPagePhotos.map((url, i) => {
              const rotation = i === 0 ? 5 : i === 1 ? -6 : 4;
              const yOffset = i === 0 ? -50 : i === 1 ? 40 : 100;
              const xOffset = i === 0 ? -25 : i === 1 ? 25 : -10;
              const globalIdx = 2 + i;
              return (
                <motion.div
                  key={globalIdx}
                  onClick={() => { vibrate(); setActiveIdx(globalIdx); }}
                  style={{
                    position: 'absolute',
                    background: '#fff',
                    padding: '8px 8px 24px 8px',
                    width: 120,
                    boxShadow: '0 8px 16px rgba(0,0,0,0.25)',
                    cursor: 'pointer',
                    transform: `rotate(${rotation}deg) translate(${xOffset}px, ${yOffset}px)`,
                    zIndex: 5 + i,
                  }}
                >
                  <div style={{
                    position: 'absolute', top: -10, left: '30%', width: 40, height: 14,
                    background: 'rgba(242,238,209,0.5)', border: '1px dashed rgba(0,0,0,0.05)',
                  }} />
                  <div style={{ width: '100%', height: 105, background: '#1c1b18', overflow: 'hidden' }}>
                    <img src={url} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                  </div>
                  <p className="handwritten-label" style={{ fontSize: '0.95rem', color: '#554734', textAlign: 'center', margin: '4px 0 0 0' }}>
                    {locale === 'hi' ? 'हर मुश्किल में साथ' : 'Love & Protection'}
                  </p>
                </motion.div>
              );
            })}

            {/* Handwritten overlay text */}
            <div className="handwritten-label" style={{
              position: 'absolute', top: 12, right: 16,
              transform: 'rotate(5deg)',
              color: '#a36f4d', fontSize: '1.25rem',
            }}>
              {locale === 'hi' ? 'ये साथ हमेशा का है' : 'Bonded forever'}
            </div>
          </div>

          {/* Swipe swipe guide prompting next page instead of button */}
          <div style={{ zIndex: 10, textAlign: 'center', marginTop: 12 }}>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.9 }}
              style={{
                fontSize: '0.72rem',
                color: '#8c7662',
                fontWeight: 600,
                letterSpacing: '0.05em',
                alignSelf: 'center',
                animation: 'pulse 2s infinite',
                cursor: 'pointer',
              }}
              onClick={handleNext}
            >
              {locale === 'hi' ? 'आवाज़ सुनने के लिए आगे स्वाइप करें →' : 'Swipe left to listen to voice →'}
            </motion.div>
          </div>
        </motion.div>
      </div>

      {/* Fullscreen zoom overlay */}
      <AnimatePresence>
        {activeIdx !== null && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setActiveIdx(null)}
            style={{
              position: 'fixed', inset: 0, zIndex: 1000,
              background: 'rgba(15,10,8,0.95)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              padding: 24,
            }}
          >
            <motion.div
              initial={{ scale: 0.9, rotate: 0 }}
              animate={{ scale: 1, rotate: activeIdx % 2 === 0 ? -1 : 1 }}
              exit={{ scale: 0.9, rotate: 0 }}
              style={{
                background: '#fff',
                padding: '16px 16px 40px 16px',
                width: '100%',
                maxWidth: 320,
                boxShadow: '0 20px 40px rgba(0,0,0,0.6)',
              }}
            >
              <div style={{ width: '100%', height: 300, background: '#1c1b18', overflow: 'hidden' }}>
                <img src={photoUrls[activeIdx]} alt="" style={{ width: '100%', height: '100%', objectFit: 'contain' }} />
              </div>
              <p className="handwritten-label" style={{
                fontSize: '1.4rem', color: '#3d2b1f', textAlign: 'center',
                margin: '16px 0 0 0',
              }}>
                {locale === 'hi' ? 'हमारा खूबसूरत पल' : 'A special moment'}
              </p>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
