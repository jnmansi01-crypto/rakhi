'use client';
// Template 02 — Scene 4: Voice (Retro Cassette Tape Player)
// Vintage cassette tape graphics wrapped in a craft paper page container.

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
  const [isDone, setIsDone] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const { vibrate } = useHaptics();

  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.onended = () => {
        setIsPlaying(false);
        setIsDone(true);
      };
    }
  }, [voiceUrl]);

  const togglePlay = () => {
    vibrate();
    if (!audioRef.current) return;
    if (isPlaying) {
      audioRef.current.pause();
      setIsPlaying(false);
      audioEngine.restoreBGM(); // Restore background music on pause
    } else {
      audioEngine.dimBGM(); // Dim background music to listen to voice
      audioRef.current.play().catch(() => {});
      setIsPlaying(true);
    }
  };

  const handleNext = () => {
    vibrate();
    if (audioRef.current) {
      audioRef.current.pause();
    }
    audioEngine.restoreBGM(); // Make sure BGM volume is restored
    audioEngine.playSwoosh();
    onComplete();
  };

  return (
    <div style={{
      position: 'fixed', inset: 0,
      background: '#1d1412',
      backgroundImage: 'radial-gradient(circle at center, #2c1b18 0%, #110908 100%)',
      display: 'flex', flexDirection: 'column',
      alignItems: 'center', justifyContent: 'center',
      padding: 24,
      overflow: 'hidden',
    }}>
      {/* Hidden Audio element */}
      {voiceUrl && <audio ref={audioRef} src={voiceUrl} />}

      {/* Premium Scrapbook Craft Paper Page Container */}
      <motion.div
        initial={{ opacity: 0, y: 30, scale: 0.95 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.8 }}
        style={{
          width: '100%',
          maxWidth: 380,
          background: '#f6eedd', // Craft paper color
          border: '1px solid #dfd3bb',
          borderRadius: 4,
          padding: '40px 24px 32px 24px',
          boxShadow: '0 20px 50px rgba(0,0,0,0.5), inset 0 0 20px rgba(0,0,0,0.05)',
          position: 'relative',
          display: 'flex', flexDirection: 'column',
          alignItems: 'center',
          minHeight: '75vh',
          justifyContent: 'space-between',
        }}
      >
        {/* Golden Photo Corners */}
        <div style={{ position: 'absolute', top: 0, left: 0, width: 16, height: 16, borderTop: '3px solid #c79774', borderLeft: '3px solid #c79774' }} />
        <div style={{ position: 'absolute', top: 0, right: 0, width: 16, height: 16, borderTop: '3px solid #c79774', borderRight: '3px solid #c79774' }} />
        <div style={{ position: 'absolute', bottom: 0, left: 0, width: 16, height: 16, borderBottom: '3px solid #c79774', borderLeft: '3px solid #c79774' }} />
        <div style={{ position: 'absolute', bottom: 0, right: 0, width: 16, height: 16, borderBottom: '3px solid #c79774', borderRight: '3px solid #c79774' }} />

        {/* Header */}
        <div style={{ textAlign: 'center', zIndex: 10 }}>
          <p style={{
            fontFamily: 'monospace', fontSize: '0.72rem',
            color: '#8c7662', letterSpacing: '0.15em',
            textTransform: 'uppercase', margin: 0,
          }}>
            {locale === 'hi' ? 'आवाज़ की याद' : 'A VOICE FROM THE PAST'}
          </p>
        </div>

        {/* Retro Cassette Graphic Wrapper */}
        <div style={{
          width: '100%', maxWidth: 300, display: 'flex', flexDirection: 'column', alignItems: 'center',
          position: 'relative', flex: 1, justifyContent: 'center',
        }}>
          {/* Semi-transparent tape holding cassette */}
          <div style={{
            position: 'absolute', top: 40, width: 80, height: 20,
            background: 'rgba(235,224,196,0.6)', transform: 'rotate(-3deg)',
            border: '1px dashed rgba(0,0,0,0.06)', zIndex: 10,
          }} />

          <motion.div
            initial={{ scale: 0.95 }}
            animate={{ scale: 1 }}
            style={{
              width: '100%',
              height: 164,
              background: 'linear-gradient(135deg, #2b2b2b 0%, #171717 100%)',
              border: '6px solid #0f0f0f',
              borderRadius: 12,
              position: 'relative',
              boxShadow: '0 12px 30px rgba(0,0,0,0.35), inset 0 2px 4px rgba(255,255,255,0.08)',
              padding: 6,
              display: 'flex', flexDirection: 'column', justifyContent: 'space-between',
            }}
          >
            {/* Top Label */}
            <div style={{
              background: '#d4c09d',
              height: 44,
              borderRadius: 4,
              padding: '4px 10px',
              display: 'flex', flexDirection: 'column', justifyContent: 'center',
              borderBottom: '3px solid #bba683',
            }}>
              <span style={{ fontFamily: 'monospace', fontSize: '0.52rem', color: '#554734', letterSpacing: '0.05em' }}>
                SIDE A · STEREO
              </span>
              <span style={{ fontFamily: 'Georgia, serif', fontStyle: 'italic', fontSize: '0.78rem', color: '#1f1a14', fontWeight: 600 }}>
                Message from {senderName}
              </span>
            </div>

            {/* Central window with sprockets */}
            <div style={{
              background: '#0a0a0a',
              height: 52,
              borderRadius: 6,
              margin: '6px 8px',
              border: '1.5px solid #222',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-around',
              position: 'relative',
              overflow: 'hidden',
            }}>
              {/* Left sprocket */}
              <motion.div
                animate={isPlaying ? { rotate: 360 } : {}}
                transition={{ repeat: Infinity, duration: 2.5, ease: 'linear' }}
                style={{
                  width: 28, height: 28,
                  borderRadius: '50%',
                  border: '3px dashed #666',
                  background: '#1a1a1a',
                  position: 'relative',
                }}
              >
                <div style={{ position: 'absolute', inset: 6, background: '#0a0a0a', borderRadius: '50%' }} />
              </motion.div>

              {/* Clear plastic window */}
              <div style={{ width: 70, height: 16, background: 'rgba(50,50,50,0.1)', border: '1px solid #333', borderRadius: 4 }} />

              {/* Right sprocket */}
              <motion.div
                animate={isPlaying ? { rotate: 360 } : {}}
                transition={{ repeat: Infinity, duration: 2.5, ease: 'linear' }}
                style={{
                  width: 28, height: 28,
                  borderRadius: '50%',
                  border: '3px dashed #666',
                  background: '#1a1a1a',
                  position: 'relative',
                }}
              >
                <div style={{ position: 'absolute', inset: 6, background: '#0a0a0a', borderRadius: '50%' }} />
              </motion.div>
            </div>

            <div style={{ display: 'flex', justifyContent: 'center', gap: 20, paddingBottom: 2 }}>
              <div style={{ width: 10, height: 6, background: '#0a0a0a', borderRadius: 1 }} />
              <div style={{ width: 10, height: 6, background: '#0a0a0a', borderRadius: 1 }} />
            </div>
          </motion.div>

          {/* Play Key */}
          <div style={{ display: 'flex', gap: 12, marginTop: 20 }}>
            <button
              onClick={togglePlay}
              style={{
                width: 58, height: 40,
                background: isPlaying ? '#a13b2b' : '#3c6e4d',
                border: 'none', borderBottom: '4px solid rgba(0,0,0,0.4)',
                borderRadius: 6,
                color: '#fff', fontSize: '1rem',
                cursor: 'pointer',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                boxShadow: '0 6px 12px rgba(0,0,0,0.25)',
              }}
            >
              {isPlaying ? '⏸' : '▶'}
            </button>
          </div>
        </div>

        {/* Footer Next Button */}
        <div style={{ width: '100%', zIndex: 10 }}>
          <button
            onClick={handleNext}
            style={{
              ...btnStyle,
              width: '100%',
              background: 'linear-gradient(135deg, #c79774, #a36f4d)',
              border: 'none',
              color: '#fff',
              fontWeight: 600,
              boxShadow: '0 6px 20px rgba(163,111,77,0.3)',
            }}
          >
            {locale === 'hi' ? 'राखी बांधें →' : 'Tie Rakhi →'}
          </button>
        </div>
      </motion.div>
    </div>
  );
}
