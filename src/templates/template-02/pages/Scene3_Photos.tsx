'use client';
// Template 02 — Scene 3: Scrapbook Photo Collage Spread
// Featuring 3D Book Page Flip transitions on mobile (Left Page -> Right Page)
// and 2-Page open spread on desktop with responsive swipe navigation.

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { audioEngine } from '@/shared/audio/audio';
import { useHaptics } from '@/shared/components/useHaptics';
import { SwipeIndicator } from '../components/SwipeIndicator';
import type { Locale } from '@/lib/types';

interface Props {
  photoUrls: string[];
  senderName: string;
  recipientName: string;
  locale: Locale;
  onComplete: () => void;
  onBack?: () => void;
}

export function Scene3_Photos({ photoUrls, senderName, recipientName, locale, onComplete, onBack }: Props) {
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

  const handlePrevious = () => {
    vibrate();
    audioEngine.playSwoosh();
    if (mobilePage === 'right') {
      setMobilePage('left');
    } else if (onBack) {
      onBack();
    }
  };

  const goToRightPage = () => {
    vibrate();
    audioEngine.playSwoosh();
    setMobilePage('right');
  };

  const goToLeftPage = () => {
    vibrate();
    audioEngine.playSwoosh();
    setMobilePage('left');
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
      perspective: 1200,
    }}>
      <style dangerouslySetInnerHTML={{ __html: `
        .handwritten-label {
          font-family: 'Caveat', cursive;
        }
        @media (min-width: 601px) {
          .scrapbook-container {
            flex-direction: row !important;
            max-width: 680px !important;
          }
          .scrapbook-page-left, .scrapbook-page-right {
            display: flex !important;
          }
          .scrapbook-spine {
            display: flex !important;
          }
        }
        @media (max-width: 600px) {
          .scrapbook-container {
            flex-direction: column !important;
            max-width: 360px !important;
            min-height: 480px !important;
          }
          .scrapbook-spine {
            display: none !important;
          }
        }
      ` }} />

      {/* Top-Left Swiftly Moving Animated Back Arrow Button */}
      {(onBack || mobilePage === 'right') && (
        <motion.button
          onClick={handlePrevious}
          animate={{ x: [-4, 4, -4] }}
          transition={{ repeat: Infinity, duration: 1.6, ease: 'easeInOut' }}
          whileHover={{ scale: 1.15 }}
          whileTap={{ scale: 0.9 }}
          style={{
            position: 'absolute', top: 16, left: 16,
            width: 38, height: 38, borderRadius: '50%',
            background: 'rgba(242, 230, 207, 0.15)',
            border: '1px solid rgba(199, 151, 116, 0.4)',
            color: '#f2e6cf', display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontSize: '1.2rem', cursor: 'pointer', zIndex: 35,
            boxShadow: '0 4px 12px rgba(0,0,0,0.4)',
          }}
          title="Go Back"
        >
          ←
        </motion.button>
      )}

      {/* 3D Open Book Spread Container with Direct Touch/Pan Gesture Detection */}
      <motion.div
        className="scrapbook-container"
        onPanEnd={(e, info) => {
          if (info.offset.x < -25 || info.velocity.x < -150) {
            // Swipe Left (Forward)
            if (mobilePage === 'left') {
              goToRightPage();
            } else {
              handleNext();
            }
          } else if (info.offset.x > 25 || info.velocity.x > 150) {
            // Swipe Right (Backward)
            if (mobilePage === 'right') {
              goToLeftPage();
            } else if (onBack) {
              handlePrevious();
            }
          }
        }}
        style={{
          width: '98%',
          maxWidth: 680,
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'stretch',
          minHeight: 460,
          borderRadius: 12,
          boxShadow: '0 30px 70px rgba(0,0,0,0.8)',
          touchAction: 'none',
        }}
      >
        <AnimatePresence mode="wait" custom={mobilePage}>
          {/* LEFT PAGE: Scrapbook Cardstock (Page 1) */}
          {(typeof window === 'undefined' || window.innerWidth > 600 || mobilePage === 'left') && (
            <motion.div 
              key="left-page"
              className="scrapbook-page-left"
              initial={{ rotateY: -60, opacity: 0 }}
              animate={{ rotateY: 0, opacity: 1 }}
              exit={{ rotateY: -60, opacity: 0 }}
              transition={{ duration: 0.45, ease: [0.25, 1, 0.5, 1] }}
              style={{
                flex: 1,
                background: '#faf6ee',
                borderRadius: '8px 0 0 8px',
                padding: '20px 16px 40px 16px',
                display: 'flex', flexDirection: 'column',
                justifyContent: 'space-between',
                position: 'relative',
                boxShadow: 'inset -15px 0 20px rgba(0,0,0,0.15)',
                transformOrigin: 'left center',
                transformStyle: 'preserve-3d',
              }}>
              {/* Inner cardstock border */}
              <div style={{
                position: 'absolute', inset: 10,
                border: '1px solid rgba(199,151,116,0.3)',
                borderRadius: 4,
                pointerEvents: 'none',
              }} />

              {/* Top Left Handwritten Header */}
              <div className="handwritten-label" style={{
                position: 'absolute', top: 16, left: 18, zIndex: 15,
                color: '#a36f4d', fontSize: '1.3rem',
                fontWeight: 700,
                lineHeight: 1.2,
              }}>
                {locale === 'hi' ? 'प्यारी यादें...' : 'Our thread of love...'}
              </div>

              {/* Left Page Photos Container */}
              <div style={{
                position: 'relative', width: '100%', flex: 1,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                marginTop: 24, marginBottom: 24,
              }}>
                {leftPagePhotos.map((url, i) => {
                  const rotation = i === 0 ? -7 : 5;
                  const yOffset = i === 0 ? -25 : 25;
                  const xOffset = i === 0 ? -20 : 20;
                  return (
                    <motion.div
                      key={i}
                      onClick={(e) => { e.stopPropagation(); vibrate(); setActiveIdx(i); }}
                      initial={{ x: xOffset, y: yOffset, rotate: rotation, scale: 1 }}
                      whileHover={{ scale: 1.08, zIndex: 30, rotate: 0, x: xOffset, y: yOffset }}
                      transition={{ type: 'spring', stiffness: 300, damping: 20 }}
                      style={{
                        position: 'absolute',
                        background: '#fff',
                        padding: '8px 8px 14px 8px',
                        width: '68%',
                        maxWidth: 155,
                        boxShadow: '0 8px 20px rgba(0,0,0,0.2)',
                        border: '1px solid #e2ddd5',
                        cursor: 'pointer',
                      }}
                    >
                      <div style={{
                        width: '100%', aspectRatio: '4/3', overflow: 'hidden', background: '#eee',
                      }}>
                        <img src={url} alt={`Memory ${i + 1}`} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                      </div>
                    </motion.div>
                  );
                })}
              </div>

              {/* Bottom Swipe Hint */}
              <div 
                onClick={(e) => {
                  e.stopPropagation();
                  if (window.innerWidth <= 600) {
                    goToRightPage();
                  } else {
                    handleNext();
                  }
                }}
                style={{
                  position: 'absolute', bottom: 8, left: 18, right: 18, zIndex: 25,
                  display: 'flex', justifyContent: 'center',
                }}
              >
                <SwipeIndicator
                  label={locale === 'hi' ? 'स्वाइप' : 'Swipe'}
                />
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* CENTRAL BINDER SPINE (Desktop Only) */}
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

        <AnimatePresence mode="wait" custom={mobilePage}>
          {/* RIGHT PAGE: Scrapbook Cardstock (Page 2) */}
          {(typeof window === 'undefined' || window.innerWidth > 600 || mobilePage === 'right') && (
            <motion.div 
              key="right-page"
              className="scrapbook-page-right"
              initial={{ rotateY: 60, opacity: 0 }}
              animate={{ rotateY: 0, opacity: 1 }}
              exit={{ rotateY: 60, opacity: 0 }}
              transition={{ duration: 0.45, ease: [0.25, 1, 0.5, 1] }}
              style={{
                flex: 1,
                background: '#f2e6cf',
                borderRadius: '0 8px 8px 0',
                padding: '20px 16px 40px 16px',
                display: 'flex', flexDirection: 'column',
                justifyContent: 'space-between',
                position: 'relative',
                boxShadow: 'inset 15px 0 20px rgba(0,0,0,0.15)',
                transformOrigin: 'right center',
                transformStyle: 'preserve-3d',
              }}>
              {/* Inner cardstock border */}
              <div style={{
                position: 'absolute', inset: 10,
                border: '1px solid rgba(199,151,116,0.3)',
                borderRadius: 4,
                pointerEvents: 'none',
              }} />

              {/* Top Right Handwritten Header */}
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
                      onClick={(e) => { e.stopPropagation(); vibrate(); setActiveIdx(globalIdx); }}
                      initial={{ x: xOffset, y: yOffset, rotate: rotation, scale: 1 }}
                      whileHover={{ scale: 1.08, zIndex: 30, rotate: 0, x: xOffset, y: yOffset }}
                      transition={{ type: 'spring', stiffness: 300, damping: 20 }}
                      style={{
                        position: 'absolute',
                        background: '#fff',
                        padding: '8px 8px 14px 8px',
                        width: '68%',
                        maxWidth: 155,
                        boxShadow: '0 8px 20px rgba(0,0,0,0.2)',
                        border: '1px solid #e2ddd5',
                        cursor: 'pointer',
                      }}
                    >
                      <div style={{
                        width: '100%', aspectRatio: '4/3', overflow: 'hidden', background: '#eee',
                      }}>
                        <img src={url} alt={`Memory ${globalIdx + 1}`} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                      </div>
                    </motion.div>
                  );
                })}
              </div>

              {/* Bottom Swipe Hint */}
              <div 
                onClick={(e) => {
                  e.stopPropagation();
                  handleNext();
                }}
                style={{
                  position: 'absolute', bottom: 8, left: 18, right: 18, zIndex: 25,
                  display: 'flex', justifyContent: 'center',
                }}
              >
                <SwipeIndicator
                  label={locale === 'hi' ? 'स्वाइप' : 'Swipe'}
                  onClick={handleNext}
                />
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>

      {/* Fullscreen Photo Lightbox Modal */}
      <AnimatePresence>
        {activeIdx !== null && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setActiveIdx(null)}
            style={{
              position: 'fixed', inset: 0, zIndex: 100,
              background: 'rgba(0,0,0,0.85)',
              backdropFilter: 'blur(8px)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              padding: 24, cursor: 'pointer',
            }}
          >
            <motion.div
              initial={{ scale: 0.8, rotate: -3 }}
              animate={{ scale: 1, rotate: 0 }}
              exit={{ scale: 0.8, rotate: 3 }}
              style={{
                background: '#fff',
                padding: '14px 14px 28px 14px',
                borderRadius: 8,
                maxWidth: '90vw',
                maxHeight: '80vh',
                boxShadow: '0 20px 50px rgba(0,0,0,0.5)',
                display: 'flex', flexDirection: 'column', alignItems: 'center',
              }}
            >
              <img
                src={photoUrls[activeIdx]}
                alt="Enlarged Memory"
                style={{
                  maxWidth: '100%', maxHeight: '65vh', objectFit: 'contain', borderRadius: 4,
                }}
              />
              <p className="handwritten-label" style={{
                margin: '12px 0 0 0', color: '#555', fontSize: '1.2rem', fontWeight: 600,
              }}>
                {locale === 'hi' ? 'अनमोल यादें ❤️' : 'Precious Memory ❤️'}
              </p>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
