'use client';
import { useEffect } from 'react';
import { motion } from 'framer-motion';
import Image from 'next/image';
import type { Locale } from '@/lib/types';

interface Props {
  photoUrls: string[];
  senderName: string;
  recipientName: string;
  locale: Locale;
  onComplete: () => void;
}

const ITEM_HEIGHT = 450;
const START_OFFSET = 300;

function VerticalThread({ count }: { count: number }) {
  const lastPhotoTop = START_OFFSET + (count > 0 ? count - 1 : 0) * ITEM_HEIGHT + 60;
  const lastPhotoBottom = lastPhotoTop + 340;
  const finalY = count > 0 ? lastPhotoBottom + 100 : START_OFFSET / 2 + ITEM_HEIGHT;
  const totalHeight = finalY + 150;
  
  const pathParts = [];
  // Start solid thread from the first bead
  pathParts.push(`M 0 80`);
  pathParts.push(`L 0 ${START_OFFSET / 2}`);
  
  let currentY = START_OFFSET / 2;
  let i = 0;
  while (currentY < finalY) {
    const yStart = currentY;
    let yEnd = yStart + ITEM_HEIGHT;
    if (yEnd > finalY) {
      yEnd = finalY; // Clamp to finalY
    }
    const segmentLength = yEnd - yStart;
    const waveX = i % 2 === 0 ? 60 : -60;
    
    // Scale control points proportionally if it's a shorter segment
    const cpOffset = segmentLength / 3;
    
    pathParts.push(`C ${waveX} ${yStart + cpOffset}, ${-waveX} ${yEnd - cpOffset}, 0 ${yEnd}`);
    currentY = yEnd;
    i++;
  }

  const d = pathParts.join(' ');

  return (
    <>
      <style>{`
        @keyframes swayTop {
          0%, 100% { transform: rotate(5deg); }
          50% { transform: rotate(-5deg); }
        }
        @keyframes swayBottom {
          0%, 100% { transform: rotate(-6deg); }
          50% { transform: rotate(6deg); }
        }
        .tassel-top {
          transform-origin: 0px 80px;
          animation: swayTop 4.8s ease-in-out infinite;
        }
        .tassel-bottom {
          transform-origin: 0px ${finalY}px;
          animation: swayBottom 4.5s ease-in-out infinite;
        }
      `}</style>
      <svg width="100%" height={totalHeight + 100} style={{ position: 'absolute', top: 0, left: '50%', overflow: 'visible', pointerEvents: 'none', zIndex: 0 }}>
      <g>
        {/* Main Red Thread */}
        <path d={d} fill="none" stroke="#9B2247" strokeWidth="3" strokeLinecap="round" style={{ filter: 'drop-shadow(0 6px 12px rgba(0,0,0,0.8))' }} />
        {/* Gold thread twisted */}
        <path d={d} fill="none" stroke="#D4AF37" strokeWidth="1" strokeDasharray="12 8" opacity="0.9" />
        
        {/* Top Tassels (Opposite of bottom) */}
        <g className="tassel-top">
          <circle cx="0" cy="80" r="6" fill="#D4AF37" filter="drop-shadow(0 2px 4px rgba(0,0,0,0.5))" />
          <circle cx="0" cy="68" r="8" fill="#9B2247" filter="drop-shadow(0 2px 4px rgba(0,0,0,0.5))" />
          <circle cx="0" cy="56" r="6" fill="#D4AF37" filter="drop-shadow(0 2px 4px rgba(0,0,0,0.5))" />
          
          {/* Spreading strands (upwards) */}
          <g stroke="#9B2247" strokeWidth="2" strokeLinecap="round" filter="drop-shadow(0 2px 4px rgba(0,0,0,0.3))">
            <path d="M 0 52 Q -15 20 -25 -20" />
            <path d="M 0 52 Q -5 20 -10 -30" />
            <path d="M 0 52 Q 5 20 10 -30" />
            <path d="M 0 52 Q 15 20 25 -20" />
          </g>
          <g stroke="#D4AF37" strokeWidth="1" strokeLinecap="round">
            <path d="M 0 52 Q -10 20 -15 -25" />
            <path d="M 0 52 Q 0 20 0 -35" />
            <path d="M 0 52 Q 10 20 15 -25" />
          </g>
        </g>
        
        {/* Bottom Tassels */}
        <g className="tassel-bottom">
          <circle cx="0" cy={finalY} r="6" fill="#D4AF37" filter="drop-shadow(0 2px 4px rgba(0,0,0,0.5))" />
          <circle cx="0" cy={finalY + 12} r="8" fill="#9B2247" filter="drop-shadow(0 2px 4px rgba(0,0,0,0.5))" />
          <circle cx="0" cy={finalY + 24} r="6" fill="#D4AF37" filter="drop-shadow(0 2px 4px rgba(0,0,0,0.5))" />
          
          {/* Spreading strands */}
          <g stroke="#9B2247" strokeWidth="2" strokeLinecap="round" filter="drop-shadow(0 2px 4px rgba(0,0,0,0.3))">
            <path d={`M 0 ${finalY + 28} Q -15 ${finalY + 60} -25 ${finalY + 100}`} />
            <path d={`M 0 ${finalY + 28} Q -5 ${finalY + 60} -10 ${finalY + 110}`} />
            <path d={`M 0 ${finalY + 28} Q 5 ${finalY + 60} 10 ${finalY + 110}`} />
            <path d={`M 0 ${finalY + 28} Q 15 ${finalY + 60} 25 ${finalY + 100}`} />
          </g>
          <g stroke="#D4AF37" strokeWidth="1" strokeLinecap="round">
            <path d={`M 0 ${finalY + 28} Q -10 ${finalY + 60} -15 ${finalY + 105}`} />
            <path d={`M 0 ${finalY + 28} Q 0 ${finalY + 60} 0 ${finalY + 115}`} />
            <path d={`M 0 ${finalY + 28} Q 10 ${finalY + 60} 15 ${finalY + 105}`} />
          </g>
        </g>
      </g>
    </svg>
    </>
  );
}

export function Scene3_Photos({ photoUrls, senderName, recipientName, locale, onComplete }: Props) {
  const label = locale === 'hi' ? 'हमारी यादें' : 'Our memories';
  const hintText = locale === 'hi' ? 'नीचे स्क्रॉल करें' : 'Scroll down to explore';
  const skipLabel = locale === 'hi' ? 'आगे बढ़ें →' : 'Continue →';

  // Return immediately if no photos
  if (photoUrls.length === 0) {
    useEffect(() => onComplete(), [onComplete]);
    return null;
  }

  const lastPhotoTop = START_OFFSET + (photoUrls.length > 0 ? photoUrls.length - 1 : 0) * ITEM_HEIGHT + 60;
  const lastPhotoBottom = lastPhotoTop + 340;
  const finalY = photoUrls.length > 0 ? lastPhotoBottom + 100 : START_OFFSET / 2 + ITEM_HEIGHT;
  const totalScrollHeight = finalY + 300; // Give enough space for tassels and continue button

  return (
    <div className="scene" style={{
      background: 'radial-gradient(ellipse at 50% 0%, #3A1A24 0%, #160C04 40%, #0D1526 100%)',
      overflowY: 'auto',
      overflowX: 'hidden',
      height: '100dvh', // Native vertical scrolling
      width: '100%',
      position: 'relative',
      perspective: '1200px', // For 3D rotations
      scrollBehavior: 'smooth',
      display: 'block',
    }}>
      
      <div style={{ height: totalScrollHeight, position: 'relative', width: '100%' }}>
        {/* Title pinned to the top of the scroll */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          style={{ position: 'absolute', top: 100, textAlign: 'center', width: '100%', zIndex: 10 }}
        >
          <p style={{
            fontFamily: 'var(--font-script)', fontSize: '2.8rem', color: '#FFF8F0',
            textShadow: '0 4px 20px rgba(0,0,0,0.8)', margin: 0
          }}>
            {label}
          </p>
          <div style={{ width: 80, height: 1.5, margin: '12px auto', background: 'linear-gradient(90deg, transparent, #C9A84C, transparent)' }} />
          <p style={{
            fontFamily: 'var(--font-sans)', fontSize: '0.7rem', letterSpacing: '0.25em',
            color: 'rgba(255,217,160,0.8)', textTransform: 'uppercase', margin: 0
          }}>
            {hintText}
          </p>
          
          {/* Bouncing scroll indicator */}
          <motion.div
            animate={{ y: [0, 10, 0] }}
            transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
            style={{ marginTop: 24, opacity: 0.7 }}
          >
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#C9A84C" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M12 5v14M19 12l-7 7-7-7"/>
            </svg>
          </motion.div>
        </motion.div>

        {/* The Continuous Vertical Thread Background */}
        <VerticalThread count={photoUrls.length} />

        {/* The Photos placed vertically */}
        {photoUrls.map((url, i) => {
          // Stagger slightly left and right for an organic feel
          const offsetX = i % 2 === 0 ? -15 : 15;
          const rotateZStart = i % 2 === 0 ? 8 : -8;
          
          return (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 150, rotateY: i % 2 === 0 ? 45 : -45, rotateZ: rotateZStart, scale: 0.8 }}
              whileInView={{ opacity: 1, y: 0, rotateY: 0, rotateZ: 0, scale: 1 }}
              viewport={{ once: true, margin: "-10% 0px -10% 0px" }}
              transition={{ type: 'spring', stiffness: 80, damping: 20 }}
              style={{
                position: 'absolute',
                top: START_OFFSET + i * ITEM_HEIGHT + 60,
                left: '50%',
                marginLeft: -130 + offsetX, // Width is 260, so half is 130
                width: 260, height: 340,
                transformStyle: 'preserve-3d',
                zIndex: 10 + i,
              }}
            >
              <div
                style={{
                  width: '100%', height: '100%',
                  background: 'linear-gradient(145deg, #FFFDF8 0%, #F8E8D0 100%)',
                  borderRadius: 16, padding: 8, paddingBottom: 50,
                  boxShadow: '0 30px 60px rgba(0,0,0,0.9), 0 0 0 1px rgba(212,175,55,0.4)',
                  border: '1px solid rgba(212,175,55,0.3)',
                }}
              >
                {/* Pin/Bead holding the photo to the thread */}
                <div style={{
                  position: 'absolute', top: -14, left: '50%', marginLeft: -14,
                  width: 28, height: 28, borderRadius: '50%',
                  background: 'radial-gradient(circle at 35% 30%, #FFF0A0, #D4AF37, #8B6914)',
                  boxShadow: '0 6px 12px rgba(0,0,0,0.6)',
                  zIndex: 2, display: 'flex', alignItems: 'center', justifyContent: 'center'
                }}>
                  <div style={{ width: 14, height: 14, borderRadius: '50%', background: '#9B2247' }} />
                </div>

                {/* Photo container */}
                <div style={{
                  width: '100%', height: '100%',
                  background: '#EAE0D0', borderRadius: 12,
                  overflow: 'hidden', position: 'relative',
                  boxShadow: 'inset 0 2px 8px rgba(0,0,0,0.2)',
                }}>
                  <Image src={url} alt="Memory" fill sizes="260px" style={{ objectFit: 'cover' }} />
                </div>
                
                {/* Caption / Festive Motif */}
                <div style={{ position: 'absolute', bottom: 12, left: '50%', transform: 'translateX(-50%)', textAlign: 'center', width: '100%' }}>
                  <div style={{
                    display: 'inline-block', width: 24, height: 24,
                    background: '#9B2247', borderRadius: '50%',
                    boxShadow: '0 0 0 2px #D4AF37, 0 2px 4px rgba(0,0,0,0.5)',
                    color: '#D4AF37', fontSize: '12px', lineHeight: '24px',
                    fontFamily: 'var(--font-sans)', fontWeight: 'bold',
                    marginBottom: 4
                  }}>
                    ॐ
                  </div>
                </div>
              </div>
            </motion.div>
          );
        })}

        {/* Continue Button at the bottom */}
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "0px 0px -20px 0px" }}
          transition={{ duration: 0.8, delay: 0.2 }}
          style={{
            position: 'absolute',
            bottom: 60,
            width: '100%',
            display: 'flex',
            justifyContent: 'center',
            zIndex: 30,
          }}
        >
          <button
            onClick={onComplete}
            style={{
              background: 'linear-gradient(135deg, #C9A84C 0%, #F0D080 50%, #C9A84C 100%)',
              border: '1px solid rgba(212,175,55,0.6)',
              borderRadius: 100, padding: '16px 54px',
              fontFamily: 'var(--font-sans)', fontSize: '0.8rem',
              letterSpacing: '0.22em', textTransform: 'uppercase',
              color: '#3D1A00', cursor: 'pointer', fontWeight: 700,
              boxShadow: '0 12px 32px rgba(212,175,55,0.4)',
            }}
          >
            {skipLabel}
          </button>
        </motion.div>

      </div>
    </div>
  );
}
