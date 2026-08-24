'use client';
// Template 02 — Scene 4: Voice (Retro Cassette Tape Player)
// Interactive vintage cassette deck featuring exact audio duration,
// 360-degree gear spools, scrubber bar, and a realistic mechanical deck key row
// where the Play/Pause button actively works, highlights, and illuminates!

import { useState, useRef, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useHaptics } from '@/shared/components/useHaptics';
import { audioEngine } from '@/shared/audio/audio';
import type { Locale } from '@/lib/types';

interface Props {
  voiceUrl: string | null;
  senderName: string;
  locale: Locale;
  onComplete: () => void;
}

export function Scene4_Voice({ voiceUrl, senderName, locale, onComplete }: Props) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const { vibrate } = useHaptics();

  useEffect(() => {
    if (audioRef.current) {
      const audio = audioRef.current;
      const updateDuration = () => setDuration(audio.duration || 0);
      const updateTime = () => setCurrentTime(audio.currentTime || 0);
      const handleEnded = () => {
        setIsPlaying(false);
        setCurrentTime(0);
        audioEngine.restoreBGM();
      };

      audio.addEventListener('loadedmetadata', updateDuration);
      audio.addEventListener('timeupdate', updateTime);
      audio.addEventListener('ended', handleEnded);

      return () => {
        audio.removeEventListener('loadedmetadata', updateDuration);
        audio.removeEventListener('timeupdate', updateTime);
        audio.removeEventListener('ended', handleEnded);
      };
    }
  }, [voiceUrl]);

  const formatTime = (secs: number) => {
    if (!secs || isNaN(secs)) return '0:00';
    const m = Math.floor(secs / 60);
    const s = Math.floor(secs % 60);
    return `${m}:${s < 10 ? '0' : ''}${s}`;
  };

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

  const handleStop = () => {
    vibrate();
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.currentTime = 0;
    }
    setIsPlaying(false);
    setCurrentTime(0);
    audioEngine.restoreBGM();
  };

  const handleSeek = (e: React.ChangeEvent<HTMLInputElement>) => {
    const seekTime = parseFloat(e.target.value);
    if (audioRef.current) {
      audioRef.current.currentTime = seekTime;
      setCurrentTime(seekTime);
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

  const progressPercent = duration > 0 ? (currentTime / duration) * 100 : 0;

  return (
    <div style={{
      position: 'absolute', inset: 0,
      background: '#120e0d',
      backgroundImage: 'radial-gradient(circle at center, #1f1412 0%, #080606 100%)',
      display: 'flex', flexDirection: 'column',
      alignItems: 'center', justifyContent: 'center',
      padding: '24px 16px',
      overflowY: 'auto',
      color: '#FFF8F0',
    }}>
      {voiceUrl && <audio ref={audioRef} src={voiceUrl} preload="metadata" />}

      {/* Retro Cassette Container */}
      <motion.div
        initial={{ opacity: 0, y: 20, scale: 0.95 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.5 }}
        style={{
          width: '95%',
          maxWidth: 440,
          background: '#f2e6cf',
          backgroundImage: 'radial-gradient(circle at center, #f7eee0 0%, #ebe0c6 100%)',
          borderRadius: 20,
          padding: '28px 24px',
          display: 'flex', flexDirection: 'column',
          alignItems: 'center', justifyContent: 'center',
          boxShadow: '0 25px 60px rgba(0,0,0,0.65)',
          position: 'relative',
          border: '1px solid rgba(199,151,116,0.4)',
        }}
      >
        {/* Top Header Badge */}
        <div style={{
          display: 'inline-flex', alignItems: 'center', gap: 6,
          background: 'rgba(163, 111, 77, 0.15)',
          border: '1px solid rgba(163, 111, 77, 0.3)',
          borderRadius: 20, padding: '4px 14px', marginBottom: 16,
        }}>
          <span style={{ fontSize: 13 }}>🎙️</span>
          <span style={{
            fontFamily: 'var(--font-sans), system-ui, sans-serif',
            fontSize: 13, fontWeight: 600, letterSpacing: '0.04em',
            fontStyle: 'normal', color: '#8a5330',
          }}>
            {locale === 'hi' ? 'आवाज़ का पैगाम' : 'Voice Message'}
          </span>
        </div>

        <h3 style={{ margin: '0 0 18px 0', fontSize: '1.2rem', fontWeight: 700, color: '#3d2b1f', textAlign: 'center', fontStyle: 'normal' }}>
          {locale === 'hi' ? `${senderName} का वॉयस मैसेज` : `Listen to ${senderName}'s Voice Note`}
        </h3>

        {/* Vintage Cassette Tape Graphic */}
        <div 
          onClick={togglePlay}
          style={{
            width: '100%', maxWidth: 330, height: 185,
            background: '#2b2724', borderRadius: 14,
            padding: 14, boxShadow: '0 12px 28px rgba(0,0,0,0.45), inset 0 2px 4px rgba(255,255,255,0.12)',
            display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'space-between',
            border: '2.5px solid #423c38', marginBottom: 18,
            cursor: 'pointer',
            position: 'relative',
          }}
        >
          {/* Cassette Header Label */}
          <div style={{
            width: '94%', height: 38, background: '#f5e8d0', borderRadius: 6,
            display: 'flex', alignItems: 'center', justifyContent: 'space-between',
            border: '1px solid #d4c4a8', padding: '0 12px',
          }}>
            <span style={{ fontSize: 10, fontWeight: 800, color: '#8c423b', letterSpacing: '0.08em' }}>SIDE A</span>
            <span style={{ fontSize: 11, fontWeight: 700, color: '#3d2b1f' }}>{senderName}&apos;s Voice Note</span>
            {/* Exact Dynamic Duration Display */}
            <span style={{ fontSize: 10, fontWeight: 800, color: '#8c423b', letterSpacing: '0.04em' }}>
              {duration ? formatTime(duration) : 'VOICE'}
            </span>
          </div>

          {/* Cassette Spools Window with Rotating Inner Gear Circles */}
          <div style={{
            width: '85%', height: 68, background: '#141211', borderRadius: 10,
            display: 'flex', alignItems: 'center', justifyContent: 'space-around',
            border: '1.5px solid #38332f', padding: '0 18px',
            position: 'relative',
          }}>
            {/* Left Spool Gear */}
            <motion.div
              animate={isPlaying ? { rotate: 360 } : { rotate: 0 }}
              transition={isPlaying ? { repeat: Infinity, duration: 2.2, ease: 'linear' } : { duration: 0.3 }}
              style={{
                width: 44, height: 44, borderRadius: '50%', background: '#f5e8d0',
                border: '3px solid #3d2b1f', display: 'flex', alignItems: 'center', justifyContent: 'center',
                position: 'relative', boxShadow: 'inset 0 1px 3px rgba(0,0,0,0.5)',
              }}
            >
              {[0, 60, 120, 180, 240, 300].map((deg) => (
                <div
                  key={deg}
                  style={{
                    position: 'absolute', width: 4, height: 10, background: '#3d2b1f', borderRadius: 1,
                    transform: `rotate(${deg}deg) translateY(-14px)`,
                  }}
                />
              ))}
              <div style={{ width: 14, height: 14, borderRadius: '50%', background: '#141211', zIndex: 2 }} />
            </motion.div>

            {/* Central Tape Window View */}
            <div style={{
              width: 64, height: 22, background: '#0a0909', borderRadius: 4,
              border: '1px solid #4a433d', display: 'flex', alignItems: 'center', justifyContent: 'center',
              boxShadow: 'inset 0 2px 4px rgba(0,0,0,0.8)',
            }}>
              <div style={{
                width: `${Math.max(15, 100 - progressPercent)}%`, height: 8,
                background: '#4a2e1b', borderRadius: 2, transition: 'width 0.3s ease',
              }} />
            </div>

            {/* Right Spool Gear */}
            <motion.div
              animate={isPlaying ? { rotate: 360 } : { rotate: 0 }}
              transition={isPlaying ? { repeat: Infinity, duration: 2.2, ease: 'linear' } : { duration: 0.3 }}
              style={{
                width: 44, height: 44, borderRadius: '50%', background: '#f5e8d0',
                border: '3px solid #3d2b1f', display: 'flex', alignItems: 'center', justifyContent: 'center',
                position: 'relative', boxShadow: 'inset 0 1px 3px rgba(0,0,0,0.5)',
              }}
            >
              {[0, 60, 120, 180, 240, 300].map((deg) => (
                <div
                  key={deg}
                  style={{
                    position: 'absolute', width: 4, height: 10, background: '#3d2b1f', borderRadius: 1,
                    transform: `rotate(${deg}deg) translateY(-14px)`,
                  }}
                />
              ))}
              <div style={{ width: 14, height: 14, borderRadius: '50%', background: '#141211', zIndex: 2 }} />
            </motion.div>
          </div>

          {/* Screws Accent */}
          <div style={{ width: '92%', display: 'flex', justifyContent: 'space-between', padding: '0 8px' }}>
            <span style={{ fontSize: 9, color: '#665d56' }}>⊕</span>
            <span style={{ fontSize: 9, color: '#665d56' }}>⊕</span>
          </div>
        </div>

        {/* Real Audio Player Deck Controls Container */}
        <div style={{
          width: '100%', maxWidth: 330,
          background: '#e6d8be', borderRadius: 16,
          padding: '16px 18px', border: '1px solid rgba(138,83,48,0.25)',
          display: 'flex', flexDirection: 'column', gap: 14, marginBottom: 20,
          boxShadow: '0 4px 12px rgba(0,0,0,0.06)',
        }}>
          {/* Progress Bar Scrubber with Live Timestamps */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <span style={{ fontSize: '0.78rem', color: '#6e5645', fontWeight: 600, minWidth: 32 }}>
              {formatTime(currentTime)}
            </span>
            <div style={{ position: 'relative', flex: 1, height: 6, background: 'rgba(138,83,48,0.2)', borderRadius: 3 }}>
              <div style={{
                position: 'absolute', left: 0, top: 0, bottom: 0,
                width: `${progressPercent}%`, background: 'linear-gradient(90deg, #d4af37, #8a5330)',
                borderRadius: 3, transition: 'width 0.15s linear',
              }} />
              <input
                type="range" min="0" max={duration || 100} value={currentTime}
                onChange={handleSeek}
                style={{
                  position: 'absolute', inset: 0, width: '100%', height: '100%',
                  opacity: 0, cursor: 'pointer',
                }}
              />
            </div>
            <span style={{ fontSize: '0.78rem', color: '#6e5645', fontWeight: 600, minWidth: 32, textAlign: 'right' }}>
              {formatTime(duration)}
            </span>
          </div>

          {/* Physical Mechanical Cassette Deck Push Buttons Row */}
          <div style={{
            display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 8,
            alignItems: 'center', width: '100%',
          }}>
            {/* 1. REWIND Key (Mechanical Metallic - Decorative) */}
            <button
              disabled
              title="Rewind"
              style={{
                height: 44, borderRadius: 8,
                background: 'linear-gradient(180deg, #4d433d 0%, #2e2824 100%)',
                border: '1.5px solid #635850',
                color: '#a89d94',
                opacity: 0.5,
                cursor: 'not-allowed',
                display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 2,
                boxShadow: 'inset 0 1px 2px rgba(255,255,255,0.15), 0 3px 6px rgba(0,0,0,0.3)',
              }}
            >
              <svg width="14" height="12" viewBox="0 0 14 12" fill="currentColor">
                <path d="M6 1 L1 6 L6 11 Z M13 1 L8 6 L13 11 Z" />
              </svg>
              <span style={{ fontSize: 8, fontWeight: 700, letterSpacing: '0.05em' }}>REW</span>
            </button>

            {/* 2. PLAY / PAUSE Key (HIGHLIGHTED ACTIVE WORKING BUTTON) */}
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.94 }}
              onClick={togglePlay}
              disabled={!voiceUrl}
              title={isPlaying ? 'Pause' : 'Play'}
              style={{
                height: 44, borderRadius: 8,
                background: isPlaying 
                  ? 'linear-gradient(180deg, #d4af37 0%, #aa820a 100%)' 
                  : 'linear-gradient(180deg, #8a5330 0%, #5c351e 100%)',
                border: isPlaying ? '2px solid #fff' : '2px solid #d4af37',
                color: isPlaying ? '#2b1c05' : '#ffeaa7',
                cursor: 'pointer',
                display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 2,
                boxShadow: isPlaying
                  ? 'inset 0 3px 6px rgba(0,0,0,0.5), 0 0 18px rgba(212, 175, 55, 0.7)'
                  : '0 6px 14px rgba(92, 53, 30, 0.45)',
                position: 'relative',
              }}
            >
              {isPlaying ? (
                <svg width="12" height="12" viewBox="0 0 12 12" fill="currentColor">
                  <rect x="1.5" y="1" width="3.5" height="10" rx="1" />
                  <rect x="7" y="1" width="3.5" height="10" rx="1" />
                </svg>
              ) : (
                <svg width="12" height="12" viewBox="0 0 12 12" fill="currentColor">
                  <path d="M2 1 L11 6 L2 11 Z" />
                </svg>
              )}
              <span style={{ fontSize: 9, fontWeight: 800, letterSpacing: '0.05em' }}>
                {isPlaying ? 'PAUSE' : 'PLAY'}
              </span>
            </motion.button>

            {/* 3. FAST FORWARD Key (Mechanical Metallic - Decorative) */}
            <button
              disabled
              title="Fast Forward"
              style={{
                height: 44, borderRadius: 8,
                background: 'linear-gradient(180deg, #4d433d 0%, #2e2824 100%)',
                border: '1.5px solid #635850',
                color: '#a89d94',
                opacity: 0.5,
                cursor: 'not-allowed',
                display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 2,
                boxShadow: 'inset 0 1px 2px rgba(255,255,255,0.15), 0 3px 6px rgba(0,0,0,0.3)',
              }}
            >
              <svg width="14" height="12" viewBox="0 0 14 12" fill="currentColor">
                <path d="M1 1 L6 6 L1 11 Z M8 1 L13 6 L8 11 Z" />
              </svg>
              <span style={{ fontSize: 8, fontWeight: 700, letterSpacing: '0.05em' }}>FF</span>
            </button>

            {/* 4. STOP Key (Active Mechanical Stop Button) */}
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.94 }}
              onClick={handleStop}
              title="Stop"
              style={{
                height: 44, borderRadius: 8,
                background: 'linear-gradient(180deg, #5c423d 0%, #382522 100%)',
                border: '1.5px solid #8c5b52',
                color: '#ffcdd2',
                cursor: 'pointer',
                display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 2,
                boxShadow: '0 3px 8px rgba(0,0,0,0.3)',
              }}
            >
              <svg width="10" height="10" viewBox="0 0 10 10" fill="currentColor">
                <rect width="10" height="10" rx="1.5" />
              </svg>
              <span style={{ fontSize: 8, fontWeight: 700, letterSpacing: '0.05em' }}>STOP</span>
            </motion.button>
          </div>
        </div>

        {/* Continue Button */}
        <motion.button
          whileHover={{ scale: 1.04 }}
          whileTap={{ scale: 0.96 }}
          onClick={handleNext}
          style={{
            background: 'none', border: 'none', color: '#8a5330',
            fontSize: '0.9rem', fontWeight: 700, cursor: 'pointer',
            letterSpacing: '0.04em', fontStyle: 'normal',
          }}
        >
          {locale === 'hi' ? 'आगे बढ़ें →' : 'Continue →'}
        </motion.button>
      </motion.div>
    </div>
  );
}
