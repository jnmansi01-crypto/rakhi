'use client';
// Template 02 — Scene 6: Gift Reveal (4-Parcel Mystery Box Game)
// 4 wrapped paper parcels — only 1 contains the real gift! Recipient picks until they find it.

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useHaptics } from '@/shared/components/useHaptics';
import { audioEngine } from '@/shared/audio/audio';
import type { Locale, GiftType } from '@/lib/types';
import { btnStyle } from '@/shared/inputs/inputs';

interface Props {
  giftType: GiftType;
  giftTitle: string;
  giftValue: string;
  senderName: string;
  recipientName: string;
  letterText: string;
  photoUrls: string[];
  experienceId: string;
  locale: Locale;
  isPreview?: boolean;
  onComplete: () => void;
}

export function Scene6_Gift({
  giftType,
  giftTitle,
  giftValue,
  senderName,
  recipientName,
  letterText,
  photoUrls,
  experienceId,
  locale,
  isPreview,
  onComplete,
}: Props) {
  // Parcel 2 is the winning box holding the gift!
  const WINNING_PARCEL_ID = 2;

  const [openedParcels, setOpenedParcels] = useState<number[]>([]);
  const [isWinningOpened, setIsWinningOpened] = useState(false);
  const [showConfetti, setShowConfetti] = useState(false);
  const [lastTriedFailed, setLastTriedFailed] = useState<number | null>(null);
  const [pdfLoading, setPdfLoading] = useState(false);
  const { vibrate } = useHaptics();

  const handleDownloadPDF = async () => {
    if (pdfLoading) return;
    setPdfLoading(true);
    try {
      const { downloadExperiencePDF } = await import('@/shared/utils/downloadExperiencePDF');
      await downloadExperiencePDF({
        id: experienceId,
        senderName,
        recipientName,
        letterText,
        giftType,
        giftTitle,
        giftValue,
        photoUrls,
        voiceUrl: null,
        locale,
        createdAt: Date.now(),
        openedAt: null,
      });
    } catch (e) {
      console.error('PDF generation failed:', e);
    } finally {
      setPdfLoading(false);
    }
  };

  const handlePickParcel = (parcelId: number) => {
    if (isWinningOpened || openedParcels.includes(parcelId)) return;
    vibrate();

    if (parcelId === WINNING_PARCEL_ID) {
      // Winning Parcel Found!
      audioEngine.playPaper?.();
      audioEngine.playMagic?.();
      setOpenedParcels((prev) => [...prev, parcelId]);
      setIsWinningOpened(true);
      setShowConfetti(true);
      setLastTriedFailed(null);

      // Fade BGM after 4 seconds
      setTimeout(() => {
        audioEngine.stopBGM?.();
      }, 4000);
    } else {
      // Empty Parcel (Incorrect Box)
      audioEngine.playPaper?.();
      setOpenedParcels((prev) => [...prev, parcelId]);
      setLastTriedFailed(parcelId);
    }
  };

  // Generate randomized gold dust/foil confetti particles
  const confettiParticles = Array.from({ length: 45 }).map((_, i) => {
    const angle = (i / 45) * 360 + (Math.random() * 15 - 7.5);
    const distance = 80 + Math.random() * 180;
    const xDest = Math.cos((angle * Math.PI) / 180) * distance;
    const yDest = Math.sin((angle * Math.PI) / 180) * distance - (50 + Math.random() * 100);
    const size = 6 + Math.random() * 8;
    const color = ['#d4af37', '#ffd700', '#f3e5ab', '#c5a059', '#b89335'][i % 5];
    const delay = Math.random() * 0.15;

    return {
      id: i,
      x: xDest,
      y: yDest,
      size,
      color,
      delay,
      rotate: Math.random() * 720 - 360,
    };
  });

  const PARCELS = [
    { id: 1, labelEn: 'Parcel 01', labelHi: 'पोटली 01', rot: -3 },
    { id: 2, labelEn: 'Parcel 02', labelHi: 'पोटली 02', rot: 2 },
    { id: 3, labelEn: 'Parcel 03', labelHi: 'पोटली 03', rot: -2 },
    { id: 4, labelEn: 'Parcel 04', labelHi: 'पोटली 04', rot: 3 },
  ];

  return (
    <div style={{
      position: 'absolute', inset: 0,
      background: '#1d1412',
      backgroundImage: 'radial-gradient(circle at center, #2c1b18 0%, #110908 100%)',
      display: 'flex', flexDirection: 'column',
      alignItems: 'center', justifyContent: 'space-between',
      padding: '36px 20px 24px 20px',
      overflowY: 'auto',
      color: '#FFF8F0',
    }}>
      <style dangerouslySetInnerHTML={{ __html: `
        .gift-handwritten {
          font-family: 'Caveat', cursive;
        }
      ` }} />

      {/* Header */}
      <div style={{ textAlign: 'center', zIndex: 10, marginBottom: 8 }}>
        <div style={{
          display: 'inline-flex',
          alignItems: 'center',
          gap: 6,
          background: 'rgba(212, 175, 55, 0.12)',
          border: '1px solid rgba(212, 175, 55, 0.3)',
          borderRadius: 20,
          padding: '4px 14px',
          marginBottom: 6,
        }}>
          <span style={{ fontSize: 13 }}>🎁</span>
          <span style={{
            fontFamily: 'var(--font-sans), system-ui, sans-serif',
            fontSize: 13,
            fontWeight: 600,
            letterSpacing: '0.04em',
            fontStyle: 'normal',
            color: '#f3d999',
          }}>
            {locale === 'hi' ? 'रहस्यमयी उपहार पोटली' : 'Mystery Gift Parcels'}
          </span>
        </div>

        <h3 style={{
          margin: 0,
          fontSize: '1.2rem',
          fontWeight: 700,
          color: '#FFF8F0',
        }}>
          {isWinningOpened
            ? (locale === 'hi' ? '🎉 बधाई हो! आपने सही उपहार खोज लिया!' : '🎉 Yay! You Found the Real Surprise!')
            : (locale === 'hi' ? 'केवल 1 पोटली में उपहार है! चुनें कौन सा? 🎁' : 'Only 1 parcel has the gift! Pick the right one 🎁')}
        </h3>

        {/* Try Again Banner for incorrect picks */}
        {!isWinningOpened && lastTriedFailed !== null && (
          <motion.div
            initial={{ opacity: 0, y: -6 }}
            animate={{ opacity: 1, y: 0 }}
            style={{
              marginTop: 8,
              background: 'rgba(211, 47, 47, 0.25)',
              border: '1px solid rgba(211, 47, 47, 0.6)',
              borderRadius: 16,
              padding: '4px 14px',
              fontSize: '0.82rem',
              color: '#ff8a80',
              fontWeight: 600,
              display: 'inline-flex',
              alignItems: 'center',
              gap: 6,
            }}
          >
            <span>❌</span>
            <span>
              {locale === 'hi'
                ? `पोटली 0${lastTriedFailed} खाली थी! दोबारा प्रयास करें...`
                : `Parcel 0${lastTriedFailed} was empty! Try again...`}
            </span>
          </motion.div>
        )}
      </div>

      {/* Main Parcels / Revealed Gift Container */}
      <div style={{
        position: 'relative', width: '100%', flex: 1,
        display: 'flex', alignItems: 'center', justifyContent: 'center',
      }}>
        {/* Golden Pop Confetti Shower */}
        {showConfetti && (
          <div style={{ position: 'absolute', pointerEvents: 'none', zIndex: 12, width: '100%', height: '100%' }}>
            {confettiParticles.map((p) => (
              <motion.div
                key={p.id}
                initial={{ x: 0, y: 0, scale: 0.2, opacity: 1, rotate: 0 }}
                animate={{
                  x: p.x,
                  y: p.y,
                  scale: [1, 1, 0.5],
                  opacity: [1, 1, 0],
                  rotate: p.rotate,
                }}
                transition={{
                  duration: 1.6 + Math.random() * 0.6,
                  ease: [0.1, 0.8, 0.25, 1],
                  delay: p.delay,
                }}
                style={{
                  position: 'absolute',
                  top: '50%',
                  left: '50%',
                  width: p.size,
                  height: p.size * (0.4 + Math.random() * 0.6),
                  background: p.color,
                  borderRadius: Math.random() > 0.5 ? '50%' : '1px',
                  boxShadow: '0 2px 4px rgba(0,0,0,0.15)',
                }}
              />
            ))}
          </div>
        )}

        <AnimatePresence mode="wait">
          {!isWinningOpened ? (
            /* 4 Wrapped Gift Parcels 2x2 Grid */
            <motion.div
              key="4-parcels"
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(2, 1fr)',
                gap: 16,
                justifyItems: 'center',
                alignItems: 'center',
                maxWidth: 290,
                width: '100%',
              }}
            >
              {PARCELS.map((parcel) => {
                const isOpenedEmpty = openedParcels.includes(parcel.id) && parcel.id !== WINNING_PARCEL_ID;
                return (
                  <motion.div
                    key={parcel.id}
                    whileHover={{ scale: isOpenedEmpty ? 1 : 1.06, rotate: 0 }}
                    whileTap={{ scale: isOpenedEmpty ? 1 : 0.94 }}
                    onClick={() => handlePickParcel(parcel.id)}
                    style={{
                      width: 118,
                      height: 135,
                      background: isOpenedEmpty ? '#8c7662' : '#caae8c',
                      border: isOpenedEmpty ? '2px dashed #655343' : '2px solid #b79c7b',
                      borderRadius: 8,
                      boxShadow: isOpenedEmpty ? 'none' : '0 12px 28px rgba(0,0,0,0.4), inset 0 0 12px rgba(0,0,0,0.1)',
                      cursor: isOpenedEmpty ? 'default' : 'pointer',
                      display: 'flex',
                      flexDirection: 'column',
                      alignItems: 'center',
                      justifyContent: 'center',
                      position: 'relative',
                      transform: `rotate(${parcel.rot}deg)`,
                      opacity: isOpenedEmpty ? 0.6 : 1,
                    }}
                  >
                    {!isOpenedEmpty ? (
                      <>
                        {/* Jute string wrapping */}
                        <div style={{ position: 'absolute', top: 0, bottom: 0, left: '50%', width: 5, background: '#84694f', transform: 'translateX(-50%)' }} />
                        <div style={{ position: 'absolute', left: 0, right: 0, top: '50%', height: 5, background: '#84694f', transform: 'translateY(-50%)' }} />

                        {/* Red Wax Seal Stamp */}
                        <div style={{
                          position: 'absolute', top: '50%', left: '50%',
                          width: 38, height: 38, borderRadius: '50%',
                          background: '#9e2b25',
                          border: '1px solid #7d201c',
                          boxShadow: '0 4px 8px rgba(0,0,0,0.3)',
                          transform: 'translate(-50%, -50%)',
                          display: 'flex', alignItems: 'center', justifyContent: 'center',
                          color: '#ffeaa7', fontSize: '0.8rem', fontWeight: 'bold',
                        }}>
                          {parcel.id}
                        </div>

                        {/* Parcel Label Tag */}
                        <div style={{
                          position: 'absolute', bottom: 8,
                          background: '#fdfbfa', padding: '3px 8px', borderRadius: 3,
                          border: '1px solid #ddd',
                          boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
                          fontFamily: 'monospace', fontSize: '0.6rem', color: '#555',
                          fontWeight: 600,
                        }}>
                          {locale === 'hi' ? parcel.labelHi : parcel.labelEn}
                        </div>
                      </>
                    ) : (
                      /* Empty Opened State */
                      <div style={{ textAlign: 'center', color: '#ded3c5' }}>
                        <span style={{ fontSize: 24, display: 'block', marginBottom: 4 }}>📦</span>
                        <span style={{ fontSize: '0.7rem', fontWeight: 600 }}>
                          {locale === 'hi' ? 'खाली ❌' : 'Empty ❌'}
                        </span>
                      </div>
                    )}
                  </motion.div>
                );
              })}
            </motion.div>
          ) : (
            /* Unwrapped / Revealed Winning Gift Card */
            <motion.div
              key="revealed"
              initial={{ scale: 0.85, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              transition={{ duration: 0.65, ease: [0.22, 1, 0.36, 1] }}
              style={{
                width: '100%',
                maxWidth: 340,
                background: '#fdfbf7',
                border: '1px solid #e0dcd3',
                borderRadius: 16,
                padding: '28px 24px',
                boxShadow: '0 25px 50px rgba(0,0,0,0.6)',
                textAlign: 'center',
                display: 'flex', flexDirection: 'column', alignItems: 'center',
              }}
            >
              <div style={{ marginBottom: 12 }}>
                <svg width="52" height="52" viewBox="0 0 52 52" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <rect x="8" y="20" width="36" height="26" rx="2" fill="#c5906a" stroke="#a36f4d" strokeWidth="1.5"/>
                  <rect x="4" y="16" width="44" height="8" rx="2" fill="#a36f4d"/>
                  <rect x="23" y="16" width="6" height="30" fill="#d4af37"/>
                  <path d="M26 16 C26 16 16 10 12 8 C8 6 10 2 14 4 C18 6 26 16 26 16Z" fill="#d4af37"/>
                  <path d="M26 16 C26 16 36 10 40 8 C44 6 42 2 38 4 C34 6 26 16 26 16Z" fill="#d4af37"/>
                </svg>
              </div>

              <span style={{
                fontFamily: 'var(--font-sans), system-ui, sans-serif',
                fontSize: '0.9rem',
                fontWeight: 700,
                letterSpacing: '0.04em',
                fontStyle: 'normal',
                color: '#c79774',
                marginBottom: 6,
              }}>
                {locale === 'hi' ? 'सही पोटली 02 खोली गई!' : 'WINNING PARCEL 02 UNWRAPPED!'}
              </span>

              <h2 style={{ fontFamily: 'Georgia, serif', fontSize: '1.6rem', color: '#3d2b1f', margin: '0 0 6px 0' }}>
                {giftTitle}
              </h2>
              <p style={{ fontSize: '0.8rem', color: 'rgba(61,43,31,0.6)', margin: '0 0 20px 0', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                {giftType === 'surprise_message' ? (locale === 'hi' ? 'सीक्रेट नोट' : 'Secret Note') : (locale === 'hi' ? 'उपहार वाउचर' : 'Gift Voucher')}
              </p>

              {/* Gift Value Display Box */}
              <div style={{
                width: '100%',
                background: '#f7f4ec',
                border: '1px dashed #c0b89f',
                borderRadius: 12,
                padding: '18px 16px',
                marginBottom: 20,
                wordBreak: 'break-all',
              }}>
                <span style={{ fontSize: '1.1rem', fontWeight: 600, color: '#a36f4d' }}>
                  {giftValue}
                </span>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {!isPreview && (
        <div style={{ width: '100%', maxWidth: 360, zIndex: 10, display: 'flex', flexDirection: 'column', gap: 10, marginTop: 16 }}>
          <button
            onClick={() => { vibrate(); onComplete(); }}
            disabled={!isWinningOpened}
            style={{
              ...btnStyle,
              width: '100%',
              background: isWinningOpened ? 'linear-gradient(135deg, #c79774, #a36f4d)' : 'rgba(255,255,255,0.05)',
              border: 'none',
              color: isWinningOpened ? '#fff' : 'rgba(255,255,255,0.3)',
              fontWeight: 600,
              cursor: isWinningOpened ? 'pointer' : 'not-allowed',
              boxShadow: isWinningOpened ? '0 6px 20px rgba(163,111,77,0.3)' : 'none',
            }}
          >
            {locale === 'hi' ? 'धन्यवाद कहें' : 'Send a Thank You'}
          </button>

          {isWinningOpened && (
            <button
              onClick={handleDownloadPDF}
              disabled={pdfLoading}
              style={{
                ...btnStyle,
                width: '100%',
                background: pdfLoading
                  ? 'rgba(201,168,76,0.1)'
                  : 'linear-gradient(135deg, #C9A84C 0%, #E5C97A 50%, #C9A84C 100%)',
                border: 'none',
                color: pdfLoading ? 'rgba(201,168,76,0.5)' : '#3D1A00',
                fontWeight: 700,
                cursor: pdfLoading ? 'wait' : 'pointer',
                boxShadow: pdfLoading ? 'none' : '0 6px 20px rgba(201,168,76,0.35)',
                transition: 'all 0.3s ease',
              }}
            >
              {pdfLoading
                ? (locale === 'hi' ? 'तैयार हो रहा है…' : 'Preparing keepsake…')
                : (locale === 'hi' ? '⬇ PDF सेव करें' : '⬇ Save as PDF Keepsake')}
            </button>
          )}
        </div>
      )}
    </div>
  );
}
