'use client';
// Template 02 — Scene 4: Voice (Retro Cassette Tape Player)
// Vintage cassette tape player presented inside the 3D open scrapbook spread.

import { useState, useRef, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useHaptics } from '@/shared/components/useHaptics';
import { audioEngine } from '@/shared/audio/audio';
import type { Locale } from '@/lib/types';
import { btnStyle } from '@/shared/inputs/inputs';

interface Props {
  voiceUrl: string | null;
  senderName: string;
  locale: Locale;
  onComplete: () => void;
}

export function Scene4_Voice({ voiceUrl, senderName, locale, onComplete }: Props) {
  const [isPlaying, setIsPlaying] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const { vibrate } = useHaptics();

  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.onended = () => {
        setIsPlaying(false);
        audioEngine.restoreBGM();
      };
    }
  }, [voiceUrl]);

  const togglePlay = () => {
    vibrate();
    if (!audioRef.current) return;
    if (isPlaying) {
      audioRef.current.pause();
      setIsPlaying(false);
      audioEngine.restoreBGM();
    } else {
      audioEngine.dimBGM();
      audioRef.current.play().catch(() => {});
      setIsPlaying(true);
    }
  };

  const handleNext = () => {
    vibrate();
    if (audioRef.current) {
      audioRef.current.pause();
    }
    audioEngine.restoreBGM();
    audioEngine.playSwoosh();
    onComplete();
  };

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

      {voiceUrl && <audio ref={audioRef} src={voiceUrl} />}

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
            {locale === 'hi' ? 'कैसेट' : 'Tape'}
          </button>
          <button
            onClick={(e) => { e.stopPropagation(); setMobilePage('right'); }}
            style={{
              background: mobilePage === 'right' ? '#C9A84C' : 'rgba(255,255,255,0.08)',
              border: 'none', color: mobilePage === 'right' ? '#080408' : '#FFF8F0',
              padding: '4px 12px', borderRadius: 20, fontSize: '0.68rem', fontWeight: 600, cursor: 'pointer'
            }}
          >
            {locale === 'hi' ? 'प्लेयर' : 'Player'}
          </button>
        </div>

        {/* LEFT PAGE: Decorative keepsakes */}
        <div className="scrapbook-page-left" style={{
          flex: 1,
          background: '#f2e6cf',
          borderRadius: '8px 0 0 8px',
          padding: 24,
          display: 'flex', flexDirection: 'column',
          alignItems: 'center', justifyContent: 'center',
          position: 'relative',
          boxShadow: 'inset -15px 0 20px rgba(0,0,0,0.15)',
        }}>
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
              <ellipse cx="41" cy="42" rx="10" ry="4" fill="rgba(0,0,0,0.18)" transform="rotate(-15 40 40)"/>
              <ellipse cx="65" cy="74" rx="9" ry="3.6" fill="rgba(0,0,0,0.18)" transform="rotate(35 64 70)"/>
              {/* Rice grain bodies */}
              <ellipse cx="40" cy="40" rx="10" ry="4" fill="url(#rice3d)" transform="rotate(-15 40 40)"/>
              <ellipse cx="64" cy="70" rx="9" ry="3.6" fill="url(#rice3d)" transform="rotate(35 64 70)"/>
              {/* Roli splatters */}
              <circle cx="27" cy="81" r="6" fill="rgba(0,0,0,0.15)"/>
              <circle cx="26" cy="80" r="6" fill="url(#roli3d)"/>

              <ellipse cx="251" cy="42" rx="9" ry="3.6" fill="rgba(0,0,0,0.18)" transform="rotate(25 250 40)"/>
              <ellipse cx="250" cy="40" rx="9" ry="3.6" fill="url(#rice3d)" transform="rotate(25 250 40)"/>
              <circle cx="263" cy="56" r="6" fill="rgba(0,0,0,0.15)"/>
              <circle cx="262" cy="55" r="6" fill="url(#roli3d)"/>
              <circle cx="270" cy="90" r="2.2" fill="#d4af37" opacity="0.8"/>
            </svg>
          </div>

          {/* Sibling card decoration */}
          <div style={{
            width: '80%', height: '65%',
            border: '1px solid #d4c8af',
            background: '#faf6ee',
            padding: 12,
            boxShadow: '0 8px 20px rgba(0,0,0,0.15)',
            transform: 'rotate(-3deg)',
            display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
            gap: 16,
          }}>
            <svg width="54" height="38" viewBox="0 0 54 38" fill="none" xmlns="http://www.w3.org/2000/svg">
              <rect x="1" y="1" width="52" height="36" rx="4" fill="#2b2b2b" stroke="#444" strokeWidth="1.5"/>
              <rect x="5" y="4" width="44" height="14" rx="2" fill="#c5b08a"/>
              <circle cx="14" cy="26" r="5" fill="#1a1a1a" stroke="#555" strokeWidth="1.5"/>
              <circle cx="14" cy="26" r="2" fill="#333"/>
              <circle cx="40" cy="26" r="5" fill="#1a1a1a" stroke="#555" strokeWidth="1.5"/>
              <circle cx="40" cy="26" r="2" fill="#333"/>
              <rect x="20" y="22" width="14" height="8" rx="1" fill="#1a1a1a"/>
              <text x="27" y="12" textAnchor="middle" fontFamily="monospace" fontSize="5" fill="#554734">SIDE A</text>
            </svg>
            <p className="handwritten-label" style={{
              fontSize: '1.4rem', color: '#8c7662', margin: 0, textAlign: 'center', lineHeight: 1.2
            }}>
              {locale === 'hi' ? 'दिल की बात, मेरी आवाज़ में...' : 'Hear my voice...'}
            </p>
          </div>
        </div>

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

        {/* RIGHT PAGE: Cassette Tape Player */}
        <div className="scrapbook-page-right" style={{
          flex: 1,
          background: '#faf6ee',
          borderRadius: '0 8px 8px 0',
          padding: '24px 16px 20px 24px',
          display: 'flex', flexDirection: 'column',
          justifyContent: 'space-between',
          position: 'relative',
          boxShadow: 'inset 15px 0 20px rgba(0,0,0,0.15)',
        }}>
          <div style={{
            position: 'absolute', inset: 12,
            border: '1px solid rgba(199,151,116,0.3)',
            borderRadius: 4,
          }} />

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

          {/* Tape Player Centerpiece */}
          <div style={{
            position: 'relative', width: '100%', flex: 1,
            display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
          }}>
            {/* Cassette Graphic Wrapper */}
            <div style={{ position: 'relative', width: '100%', maxWidth: 220 }}>
              {/* Left corner tape */}
              <div style={{
                position: 'absolute', top: -6, left: -12, width: 40, height: 14,
                background: 'rgba(235,224,196,0.5)', transform: 'rotate(-20deg)',
                border: '1px dashed rgba(0,0,0,0.05)', zIndex: 10,
              }} />
              {/* Right corner tape */}
              <div style={{
                position: 'absolute', top: -6, right: -12, width: 40, height: 14,
                background: 'rgba(235,224,196,0.5)', transform: 'rotate(20deg)',
                border: '1px dashed rgba(0,0,0,0.05)', zIndex: 10,
              }} />

              {/* Cassette Graphic */}
              <div style={{
                width: '100%',
                height: 130,
                background: 'linear-gradient(135deg, #2b2b2b 0%, #171717 100%)',
                border: '4px solid #0f0f0f',
                borderRadius: 8,
                position: 'relative',
                boxShadow: '0 8px 20px rgba(0,0,0,0.35)',
                padding: 4,
                display: 'flex', flexDirection: 'column', justifyContent: 'space-between',
              }}
              >
                <div style={{
                  background: '#d4c09d',
                  height: 32,
                  borderRadius: 4,
                  padding: '2px 8px',
                  display: 'flex', flexDirection: 'column', justifyContent: 'center',
                }}>
                <span style={{ fontFamily: 'monospace', fontSize: '0.45rem', color: '#554734' }}>SIDE A · STEREO</span>
                <span style={{ fontFamily: 'Georgia, serif', fontStyle: 'italic', fontSize: '0.68rem', color: '#1f1a14', fontWeight: 600 }}>
                  Message from {senderName}
                </span>
              </div>

              <div style={{
                background: '#0a0a0a',
                height: 40,
                borderRadius: 4,
                margin: '4px 6px',
                display: 'flex', alignItems: 'center', justifyContent: 'space-around',
              }}>
                <motion.div
                  animate={isPlaying ? { rotate: 360 } : {}}
                  transition={{ repeat: Infinity, duration: 2.5, ease: 'linear' }}
                  style={{ width: 22, height: 22, borderRadius: '50%', border: '2.5px dashed #666', background: '#1a1a1a' }}
                />
                <div style={{ width: 50, height: 12, background: 'rgba(50,50,50,0.1)', borderRadius: 2 }} />
                <motion.div
                  animate={isPlaying ? { rotate: 360 } : {}}
                  transition={{ repeat: Infinity, duration: 2.5, ease: 'linear' }}
                  style={{ width: 22, height: 22, borderRadius: '50%', border: '2.5px dashed #666', background: '#1a1a1a' }}
                />
              </div>

              <div style={{ display: 'flex', justifyContent: 'center', gap: 12 }}>
                <div style={{ width: 8, height: 4, background: '#0a0a0a' }} />
                <div style={{ width: 8, height: 4, background: '#0a0a0a' }} />
              </div>
            </div>
            </div>

            {/* Play Key */}
            <button
              onClick={togglePlay}
              style={{
                marginTop: 16,
                width: 50, height: 34,
                background: isPlaying ? '#a13b2b' : '#3c6e4d',
                border: 'none', borderBottom: '3px solid rgba(0,0,0,0.4)',
                borderRadius: 4,
                color: '#fff',
                cursor: 'pointer',
                boxShadow: '0 4px 10px rgba(0,0,0,0.2)',
              }}
            >
              {isPlaying ? '⏸' : '▶'}
            </button>
          </div>

          {/* Action button */}
          <div style={{ zIndex: 10 }}>
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
              {locale === 'hi' ? 'राखी बांधें →' : 'Tie Rakhi →'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
