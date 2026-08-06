'use client';
// Template 02 — Scene 4: Voice (Retro Cassette Tape Player)
// Vintage cassette tape graphics with rotating wheels during playback.

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
      alignItems: 'center', justifyContent: 'space-between',
      padding: '40px 24px 28px 24px',
      overflow: 'hidden',
    }}>
      {/* Hidden Audio element */}
      {voiceUrl && <audio ref={audioRef} src={voiceUrl} />}

      {/* Header */}
      <div style={{ textAlign: 'center', zIndex: 10 }}>
        <p style={{
          fontFamily: 'monospace', fontSize: '0.75rem',
          color: 'rgba(201,168,76,0.6)', letterSpacing: '0.15em',
          textTransform: 'uppercase', margin: 0,
        }}>
          {locale === 'hi' ? 'आवाज़ का संदेश' : 'A VOICE FROM THE PAST'}
        </p>
      </div>

      {/* Retro Cassette Graphic Wrapper */}
      <div style={{
        width: '100%', maxWidth: 320, display: 'flex', flexDirection: 'column', alignItems: 'center',
      }}>
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.8 }}
          style={{
            width: '100%',
            height: 180,
            background: 'linear-gradient(135deg, #2b2b2b 0%, #171717 100%)',
            border: '8px solid #0f0f0f',
            borderRadius: 16,
            position: 'relative',
            boxShadow: '0 25px 50px rgba(0,0,0,0.6), inset 0 2px 5px rgba(255,255,255,0.1)',
            padding: 8,
            display: 'flex', flexDirection: 'column', justifyContent: 'space-between',
          }}
        >
          {/* Top Label */}
          <div style={{
            background: '#d4c09d',
            height: 48,
            borderRadius: 4,
            padding: '6px 12px',
            display: 'flex', flexDirection: 'column', justifyContent: 'center',
            borderBottom: '4px solid #bba683',
          }}>
            <span style={{ fontFamily: 'monospace', fontSize: '0.55rem', color: '#554734', letterSpacing: '0.05em' }}>
              SIDE A · STEREO
            </span>
            <span style={{ fontFamily: 'Georgia, serif', fontStyle: 'italic', fontSize: '0.85rem', color: '#1f1a14', fontWeight: 600 }}>
              Message from {senderName}
            </span>
          </div>

          {/* Central window with sprockets */}
          <div style={{
            background: '#0a0a0a',
            height: 60,
            borderRadius: 8,
            margin: '8px 12px',
            border: '2px solid #222',
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
                width: 32, height: 32,
                borderRadius: '50%',
                border: '4px dashed #666',
                background: '#1a1a1a',
                position: 'relative',
              }}
            >
              <div style={{ position: 'absolute', inset: 8, background: '#0a0a0a', borderRadius: '50%' }} />
            </motion.div>

            {/* Clear plastic window representing tape winding */}
            <div style={{ width: 80, height: 20, background: 'rgba(50,50,50,0.1)', border: '1px solid #333', borderRadius: 4 }} />

            {/* Right sprocket */}
            <motion.div
              animate={isPlaying ? { rotate: 360 } : {}}
              transition={{ repeat: Infinity, duration: 2.5, ease: 'linear' }}
              style={{
                width: 32, height: 32,
                borderRadius: '50%',
                border: '4px dashed #666',
                background: '#1a1a1a',
                position: 'relative',
              }}
            >
              <div style={{ position: 'absolute', inset: 8, background: '#0a0a0a', borderRadius: '50%' }} />
            </motion.div>
          </div>

          {/* Cassette bottom details */}
          <div style={{ display: 'flex', justifyContent: 'center', gap: 24, paddingBottom: 4 }}>
            <div style={{ width: 12, height: 8, background: '#0a0a0a', borderRadius: 2 }} />
            <div style={{ width: 12, height: 8, background: '#0a0a0a', borderRadius: 2 }} />
          </div>
        </motion.div>

        {/* Play/Pause Button keys under Cassette */}
        <div style={{ display: 'flex', gap: 12, marginTop: 24 }}>
          <button
            onClick={togglePlay}
            style={{
              width: 64, height: 48,
              background: isPlaying ? '#a13b2b' : '#3c6e4d',
              border: 'none', borderBottom: '5px solid rgba(0,0,0,0.4)',
              borderRadius: 6,
              color: '#fff', fontSize: '1.2rem',
              cursor: 'pointer',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              boxShadow: '0 8px 15px rgba(0,0,0,0.3)',
            }}
          >
            {isPlaying ? '⏸' : '▶'}
          </button>
        </div>
      </div>

      {/* Next Button */}
      <div style={{ width: '100%', maxWidth: 360, zIndex: 10 }}>
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
    </div>
  );
}
