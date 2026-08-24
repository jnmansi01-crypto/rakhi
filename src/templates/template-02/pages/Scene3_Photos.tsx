'use client';
// Template 02 — Scene 3: Scrapbook Photo Collage Spread
// 3D Realistic Open Book with polaroids & handwritten captions.
// Optimized layout to prevent text overlap & image clipping.

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { audioEngine } from '@/shared/audio/audio';
import { useHaptics } from '@/shared/components/useHaptics';
import type { Locale } from '@/lib/types';

interface Props {
  photoUrls: string[];
  senderName: string;
  recipientName: string;
  locale: Locale;
  onComplete: () => void;
}

export function Scene3_Photos({ photoUrls, senderName, recipientName, locale, onComplete }: Props) {
  const [activeIdx, setActiveIdx] = useState<number | null>(null);
  const [mobilePage, setMobilePage] = useState<'left' | 'right'>('left');
  const { vibrate } = useHaptics();

  // Split photos across left and right pages
  const leftPagePhotos = photoUrls.slice(0, 2);
  const rightPagePhotos = photoUrls.slice(2, 5);

  const handleNext = () => {
    vibrate();
    audioEngine.playSwoosh();
    onComplete();
  };

  return (
    <div style={{
      position: 'absolute', inset: 0,
      background: '#150f0d',
      backgroundImage: 'radial-gradient(circle at center, #241916 0%, #0d0807 100%)',
      display: 'flex', flexDirection: 'column',
      alignItems: 'center', justifyContent: 'center',
      padding: '24px 12px',
      overflowY: 'auto',
    }}>
      <style dangerouslySetInnerHTML={{ __html: `
        .handwritten-label {
          font-family: 'Caveat', cursive;
        }
      ` }} />

      {/* 3D Open Book Spread Container */}
      <div
        className="scrapbook-container"
        style={{
          width: '98%',
          maxWidth: 680,
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'stretch',
          minHeight: 460,
          perspective: 1200,
          boxShadow: '0 30px 70px rgba(0,0,0,0.8)',
          borderRadius: 12,
        }}
      >
        {/* LEFT PAGE: Scrapbook Cardstock */}
        <motion.div 
          className="scrapbook-page-left"
          drag="x"
          dragConstraints={{ left: 0, right: 0 }}
          dragElastic={0}
          onDragEnd={(event, info) => {
            if (window.innerWidth <= 600 && info.offset.x < -40) {
              setMobilePage('right');
            }
          }}
          initial={{ rotateY: -30, opacity: 0.8 }}
          animate={{ rotateY: 0, opacity: 1 }}
          transition={{ duration: 0.6, ease: 'easeOut' }}
          style={{
            flex: 1,
            background: '#f2e6cf',
            borderRadius: '8px 0 0 8px',
            padding: '20px 16px',
            display: 'flex', flexDirection: 'column',
            justifyContent: 'space-between',
            position: 'relative',
            boxShadow: 'inset -15px 0 20px rgba(0,0,0,0.15)',
            touchAction: 'pan-y',
          }}>
          {/* Inner cardstock border */}
          <div style={{
            position: 'absolute', inset: 10,
            border: '1px solid rgba(199,151,116,0.3)',
            borderRadius: 4,
            pointerEvents: 'none',
          }} />

          {/* Top Left Handwritten Title (Cleanly Positioned) */}
          <div className="handwritten-label" style={{
            position: 'absolute', top: 16, left: 18, zIndex: 15,
            color: '#654f3b', fontSize: '1.3rem',
            fontWeight: 700,
            lineHeight: 1.2,
          }}>
            {locale === 'hi' ? 'प्यार के कच्चे धागे...' : 'Our thread of love...'}
          </div>

          {/* Left Page Photos Container */}
          <div style={{
            position: 'relative', width: '100%', flex: 1,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            marginTop: 24, marginBottom: 24,
          }}>
            {leftPagePhotos.map((url, i) => {
              const rotation = i === 0 ? -6 : 6;
              const yOffset = i === 0 ? -28 : 28;
              const xOffset = i === 0 ? -22 : 22;
              return (
                <motion.div
                  key={i}
                  onClick={() => { vibrate(); setActiveIdx(i); }}
                  initial={{ x: xOffset, y: yOffset, rotate: rotation, scale: 1 }}
                  whileHover={{ scale: 1.08, zIndex: 30, rotate: 0, x: xOffset, y: yOffset }}
                  transition={{ type: 'spring', stiffness: 300, damping: 20 }}
                  style={{
                    position: 'absolute',
                    width: '65%',
                    maxWidth: 145,
                    background: '#fff',
                    padding: '8px 8px 14px 8px',
                    boxShadow: '0 8px 20px rgba(0,0,0,0.2)',
                    border: '1px solid #e2ddd5',
                    zIndex: 5 + i,
                    cursor: 'pointer',
                  }}
                >
                  {/* Washi Tape Accent */}
                  <div style={{
                    position: 'absolute', top: -8, left: '30%', width: 45, height: 14,
                    background: 'rgba(242,238,209,0.7)', border: '1px dashed rgba(0,0,0,0.08)',
                  }} />
                  <div style={{ width: '100%', height: 112, background: '#1c1b18', overflow: 'hidden', borderRadius: 2 }}>
                    <img
                      src={url}
                      alt=""
                      style={{
                        width: '100%',
                        height: '100%',
                        objectFit: 'cover',
                        objectPosition: 'top center',
                      }}
                    />
                  </div>
                </motion.div>
              );
            })}
          </div>

          {/* Bottom Left Mobile Swipe Hint (Separated from Title) */}
          <div className="mobile-only" style={{
            position: 'absolute', bottom: 12, left: 18, zIndex: 15,
            fontSize: '0.68rem',
            color: '#a36f4d',
            fontWeight: 600,
            opacity: 0.85,
            letterSpacing: '0.04em',
          }}>
            {locale === 'hi' ? '← स्वाइप करके और फोटो देखें' : '← Swipe left to see more photos'}
          </div>
        </motion.div>

        {/* CENTRAL BINDER SPINE */}
        <div className="scrapbook-spine" style={{
          width: 24,
          background: 'linear-gradient(to right, #290e09, #150604, #290e09)',
          position: 'relative', zIndex: 25,
          display: 'flex', flexDirection: 'column',
          justifyContent: 'space-around', alignItems: 'center',
        }}>
          {Array.from({ length: 9 }).map((_, i) => (
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

        {/* RIGHT PAGE: Scrapbook Cardstock */}
        <motion.div 
          className="scrapbook-page-right"
          drag="x"
          dragConstraints={{ left: 0, right: 0 }}
          dragElastic={0}
          onDragEnd={(event, info) => {
            if (window.innerWidth <= 600 && info.offset.x > 40) {
              setMobilePage('left');
            }
            if (window.innerWidth <= 600 && info.offset.x < -40) {
              handleNext();
            }
          }}
          initial={{ rotateY: 30, opacity: 0.8 }}
          animate={{ rotateY: 0, opacity: 1 }}
          transition={{ duration: 0.6, ease: 'easeOut' }}
          style={{
            flex: 1,
            background: '#f2e6cf',
            borderRadius: '0 8px 8px 0',
            padding: '20px 16px',
            display: 'flex', flexDirection: 'column',
            justifyContent: 'space-between',
            position: 'relative',
            boxShadow: 'inset 15px 0 20px rgba(0,0,0,0.15)',
            touchAction: 'pan-y',
          }}>
          {/* Inner cardstock border */}
          <div style={{
            position: 'absolute', inset: 10,
            border: '1px solid rgba(199,151,116,0.3)',
            borderRadius: 4,
            pointerEvents: 'none',
          }} />

          {/* Top Right Handwritten Header (Cleanly Positioned) */}
          <div className="handwritten-label" style={{
            position: 'absolute', top: 16, right: 18, zIndex: 15,
            color: '#a36f4d', fontSize: '1.3rem',
            fontWeight: 700,
            lineHeight: 1.2,
          }}>
            {locale === 'hi' ? 'ये साथ हमेशा का है' : 'Bonded forever'}
          </div>

          {/* Right Page Photos Container */}
          <div style={{
            position: 'relative', width: '100%', flex: 1,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            marginTop: 24, marginBottom: 24,
          }}>
            {rightPagePhotos.map((url, i) => {
              const rotation = i === 0 ? 6 : i === 1 ? -6 : 4;
              const yOffset = i === 0 ? -28 : i === 1 ? 28 : 0;
              const xOffset = i === 0 ? -22 : i === 1 ? 22 : 0;
              const globalIdx = 2 + i;
              return (
                <motion.div
                  key={globalIdx}
                  onClick={() => { vibrate(); setActiveIdx(globalIdx); }}
                  initial={{ x: xOffset, y: yOffset, rotate: rotation, scale: 1 }}
                  whileHover={{ scale: 1.08, zIndex: 30, rotate: 0, x: xOffset, y: yOffset }}
                  transition={{ type: 'spring', stiffness: 300, damping: 20 }}
                  style={{
                    position: 'absolute',
                    background: '#fff',
                    padding: '8px 8px 14px 8px',
                    width: '65%',
                    maxWidth: 145,
                    boxShadow: '0 8px 20px rgba(0,0,0,0.2)',
                    border: '1px solid #e2ddd5',
                    cursor: 'pointer',
                    zIndex: 5 + i,
                  }}
                >
                  <div style={{
                    position: 'absolute', top: -8, left: '30%', width: 45, height: 14,
                    background: 'rgba(242,238,209,0.7)', border: '1px dashed rgba(0,0,0,0.08)',
                  }} />
                  <div style={{ width: '100%', height: 112, background: '#1c1b18', overflow: 'hidden', borderRadius: 2 }}>
                    <img
                      src={url}
                      alt=""
                      style={{
                        width: '100%',
                        height: '100%',
                        objectFit: 'cover',
                        objectPosition: 'top center',
                      }}
                    />
                  </div>
                </motion.div>
              );
            })}
          </div>

          {/* Bottom Right Prompt */}
          <div style={{ zIndex: 15, textAlign: 'center', position: 'absolute', bottom: 12, right: 18, left: 18 }}>
            <motion.div
              style={{
                fontSize: '0.72rem',
                color: '#8c7662',
                fontWeight: 600,
                letterSpacing: '0.04em',
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
                padding: '16px',
                borderRadius: 8,
                width: '100%',
                maxWidth: 320,
                boxShadow: '0 20px 40px rgba(0,0,0,0.6)',
              }}
            >
              <div style={{ width: '100%', height: 320, background: '#1c1b18', overflow: 'hidden', borderRadius: 4 }}>
                <img src={photoUrls[activeIdx]} alt="" style={{ width: '100%', height: '100%', objectFit: 'contain' }} />
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
