'use client';
// src/templates/template-02/pages/ExperiencePlayer.tsx
// Self-contained ExperiencePlayer for Template 02 (Cosmic theme).

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Scene1_Welcome } from './Scene1_Welcome';
import { audioEngine } from '@/shared/audio/audio';
import { useHaptics } from '@/shared/components/useHaptics';
import type { ExperiencePlayerProps } from '@/template-engine/types';

const SCENES = ['welcome', 'letter', 'photos', 'voice', 'celebration', 'gift'] as const;
type SceneName = typeof SCENES[number];

export function CosmicExperiencePlayer({ experience }: ExperiencePlayerProps) {
  const [scene, setScene] = useState<SceneName>('welcome');
  const { locale } = experience;
  const { vibrate } = useHaptics();

  const nextSkipping = (current: SceneName) => {
    if (current === 'welcome') {
      audioEngine.playBGM();
    }
    audioEngine.playSwoosh();
    const idx = SCENES.indexOf(current);
    let nextIdx = idx + 1;
    while (nextIdx < SCENES.length) {
      const s = SCENES[nextIdx];
      if (s === 'photos' && experience.photoUrls.length === 0) { nextIdx++; continue; }
      if (s === 'voice'  && !experience.voiceUrl)             { nextIdx++; continue; }
      break;
    }
    if (nextIdx < SCENES.length) setScene(SCENES[nextIdx]);
  };

  const previousSkipping = (current: SceneName) => {
    audioEngine.playSwoosh();
    const idx = SCENES.indexOf(current);
    let prevIdx = idx - 1;
    while (prevIdx >= 0) {
      const s = SCENES[prevIdx];
      if (s === 'photos' && experience.photoUrls.length === 0) { prevIdx--; continue; }
      if (s === 'voice'  && !experience.voiceUrl)             { prevIdx--; continue; }
      break;
    }
    if (prevIdx >= 0) setScene(SCENES[prevIdx]);
  };

  const dotScenes = SCENES.filter(s => {
    if (s === 'photos' && experience.photoUrls.length === 0) return false;
    if (s === 'voice'  && !experience.voiceUrl) return false;
    return true;
  });
  const currentDotIdx = dotScenes.indexOf(scene);

  return (
    <div style={{
      position: 'fixed', inset: 0,
      background: 'radial-gradient(ellipse at 30% 20%, #1a1f3a 0%, #0a0e1a 60%, #050810 100%)',
      color: '#FFF8F0',
      overflow: 'hidden',
    }}>
      <AnimatePresence mode="wait">
        <motion.div
          key={scene}
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 1.05 }}
          transition={{ duration: 0.8 }}
          style={{ position: 'absolute', inset: 0 }}
        >
          {/* Scene 1: Welcome */}
          {scene === 'welcome' && (
            <Scene1_Welcome
              senderName={experience.senderName}
              recipientName={experience.recipientName}
              locale={locale}
              onComplete={() => nextSkipping('welcome')}
            />
          )}

          {/* Scene 2: Cosmic Letter */}
          {scene === 'letter' && (
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '100%', padding: 24, textAlign: 'center' }}>
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                style={{
                  background: 'rgba(255, 255, 255, 0.03)',
                  border: '1px solid rgba(168, 174, 255, 0.2)',
                  borderRadius: 24,
                  padding: 32,
                  maxWidth: 400,
                  boxShadow: '0 8px 32px rgba(0, 0, 0, 0.4)',
                }}
              >
                <p style={{ fontSize: '0.8rem', textTransform: 'uppercase', letterSpacing: '0.15em', color: '#a8aeff', marginBottom: 16 }}>
                  {locale === 'hi' ? 'आपके लिए एक संदेश' : 'A Message For You'}
                </p>
                <p style={{ fontSize: '1.1rem', lineHeight: 1.8, fontWeight: 300, fontStyle: 'italic', whiteSpace: 'pre-wrap' }}>
                  {experience.letterText}
                </p>
                <p style={{ marginTop: 24, fontSize: '0.9rem', color: 'rgba(255, 255, 255, 0.5)' }}>
                  — {experience.senderName}
                </p>
                <button
                  onClick={() => nextSkipping('letter')}
                  style={{
                    marginTop: 28,
                    background: 'transparent',
                    border: '1px solid #a8aeff',
                    color: '#a8aeff',
                    padding: '10px 24px',
                    borderRadius: 100,
                    cursor: 'pointer',
                    fontSize: '0.85rem',
                  }}
                >
                  {locale === 'hi' ? 'आगे बढ़ें →' : 'Continue →'}
                </button>
              </motion.div>
            </div>
          )}

          {/* Scene 3: Cosmic Photos */}
          {scene === 'photos' && (
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '100%', padding: 24 }}>
              <p style={{ fontSize: '0.8rem', textTransform: 'uppercase', letterSpacing: '0.15em', color: '#a8aeff', marginBottom: 24 }}>
                {locale === 'hi' ? 'साझा यादें' : 'Shared Memories'}
              </p>
              <div style={{ display: 'flex', gap: 16, overflowX: 'auto', maxWidth: '100%', paddingBottom: 16 }}>
                {experience.photoUrls.map((url, i) => (
                  <motion.div
                    key={i}
                    whileHover={{ scale: 1.05 }}
                    style={{
                      flex: '0 0 auto',
                      width: 260,
                      height: 340,
                      borderRadius: 20,
                      border: '1px solid rgba(168, 174, 255, 0.2)',
                      overflow: 'hidden',
                      position: 'relative',
                    }}
                  >
                    <img src={url} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                  </motion.div>
                ))}
              </div>
              <button
                onClick={() => nextSkipping('photos')}
                style={{
                  marginTop: 28,
                  background: 'transparent',
                  border: '1px solid #a8aeff',
                  color: '#a8aeff',
                  padding: '10px 24px',
                  borderRadius: 100,
                  cursor: 'pointer',
                  fontSize: '0.85rem',
                }}
              >
                {locale === 'hi' ? 'आगे बढ़ें →' : 'Continue →'}
              </button>
            </div>
          )}

          {/* Scene 4: Cosmic Voice */}
          {scene === 'voice' && (
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '100%', padding: 24 }}>
              <p style={{ fontSize: '0.8rem', textTransform: 'uppercase', letterSpacing: '0.15em', color: '#a8aeff', marginBottom: 32 }}>
                {locale === 'hi' ? 'आवाज़ का संदेश' : 'Voice Message'}
              </p>
              <motion.div
                animate={{ scale: [1, 1.1, 1], opacity: [0.7, 1, 0.7] }}
                transition={{ duration: 2, repeat: Infinity }}
                style={{
                  width: 120,
                  height: 120,
                  borderRadius: '50%',
                  background: 'radial-gradient(circle, rgba(168, 174, 255, 0.4) 0%, transparent 70%)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  marginBottom: 32,
                }}
              >
                🎙️
              </motion.div>
              {experience.voiceUrl && (
                <audio src={experience.voiceUrl} controls style={{ marginBottom: 32 }} />
              )}
              <button
                onClick={() => nextSkipping('voice')}
                style={{
                  background: 'transparent',
                  border: '1px solid #a8aeff',
                  color: '#a8aeff',
                  padding: '10px 24px',
                  borderRadius: 100,
                  cursor: 'pointer',
                  fontSize: '0.85rem',
                }}
              >
                {locale === 'hi' ? 'आगे बढ़ें →' : 'Continue →'}
              </button>
            </div>
          )}

          {/* Scene 5: Celebration / Star connection */}
          {scene === 'celebration' && (
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '100%', padding: 24, textAlign: 'center' }}>
              <h2 style={{ fontFamily: 'Georgia, serif', fontSize: '2rem', marginBottom: 16 }}>✨</h2>
              <p style={{ fontSize: '1.2rem', fontWeight: 300, color: 'rgba(255,255,255,0.85)', marginBottom: 28, maxWidth: 320 }}>
                {locale === 'hi'
                  ? 'सितारे गवाह हैं हमारे अटूट रिश्ते के।'
                  : 'The stars shine bright for our unbreakable bond.'}
              </p>
              <button
                onClick={() => nextSkipping('celebration')}
                style={{
                  background: 'linear-gradient(135deg, #7c83fd, #b156ff)',
                  border: 'none',
                  color: '#fff',
                  padding: '12px 32px',
                  borderRadius: 100,
                  cursor: 'pointer',
                  fontSize: '1rem',
                  fontWeight: 500,
                  boxShadow: '0 8px 24px rgba(124, 131, 253, 0.4)',
                }}
              >
                {locale === 'hi' ? 'उपहार खोलें 🎁' : 'Open Gift 🎁'}
              </button>
            </div>
          )}

          {/* Scene 6: Gift Reveal */}
          {scene === 'gift' && (
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '100%', padding: 24, textAlign: 'center' }}>
              <p style={{ fontSize: '0.8rem', textTransform: 'uppercase', letterSpacing: '0.15em', color: '#a8aeff', marginBottom: 16 }}>
                {locale === 'hi' ? 'आपका उपहार' : 'Your Gift'}
              </p>
              <h3 style={{ fontFamily: 'Georgia, serif', fontSize: '2rem', color: '#FFF8F0', marginBottom: 8 }}>
                {experience.giftTitle}
              </h3>
              <p style={{ fontSize: '1rem', color: 'rgba(255,255,255,0.6)', marginBottom: 32 }}>
                {experience.giftType === 'surprise_message' ? 'A secret note for you' : 'Reveal code or link below'}
              </p>
              <div style={{
                background: 'rgba(255,255,255,0.05)',
                border: '1.5px solid rgba(168, 174, 255, 0.2)',
                borderRadius: 16,
                padding: '24px',
                width: '100%',
                maxWidth: 320,
                marginBottom: 32,
              }}>
                <span style={{ fontSize: '1.2rem', fontWeight: 600, color: '#a8aeff', wordBreak: 'break-all' }}>
                  {experience.giftValue}
                </span>
              </div>
              <button
                onClick={() => {
                  vibrate();
                  window.location.href = `/reply/${experience.id}`;
                }}
                style={{
                  background: 'linear-gradient(135deg, #7c83fd, #b156ff)',
                  border: 'none',
                  color: '#fff',
                  padding: '12px 32px',
                  borderRadius: 100,
                  cursor: 'pointer',
                  fontSize: '1rem',
                  fontWeight: 500,
                  boxShadow: '0 8px 24px rgba(124, 131, 253, 0.4)',
                }}
              >
                {locale === 'hi' ? 'उत्तर भेजें 🌸' : 'Send Reply 🌸'}
              </button>
            </div>
          )}
        </motion.div>
      </AnimatePresence>

      {/* Progress dots */}
      <div style={{
        position: 'fixed', bottom: 28, left: 0, right: 0,
        display: 'flex', justifyContent: 'center', gap: 8,
        pointerEvents: 'none', zIndex: 100,
      }}>
        {dotScenes.map((s, i) => (
          <div
            key={s}
            className={`dot-indicator ${i === currentDotIdx ? 'active' : ''}`}
            style={{
              background: i === currentDotIdx ? '#a8aeff' : 'rgba(168, 174, 255, 0.3)',
              boxShadow: i === currentDotIdx ? '0 0 8px #a8aeff' : 'none',
            }}
          />
        ))}
      </div>

      {/* Back button */}
      <AnimatePresence>
        {currentDotIdx > 0 && (
          <motion.button
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            onClick={() => previousSkipping(scene)}
            style={{
              position: 'fixed', top: 32, left: 24, zIndex: 110,
              background: 'rgba(255,255,255,0.03)',
              border: '1px solid rgba(168,174,255,0.2)',
              borderRadius: '50%', width: 44, height: 44,
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              backdropFilter: 'blur(10px)', WebkitBackdropFilter: 'blur(10px)',
              cursor: 'pointer', color: '#a8aeff', fontSize: '1.2rem',
              boxShadow: '0 4px 12px rgba(0,0,0,0.3)',
            }}
          >
            ←
          </motion.button>
        )}
      </AnimatePresence>
    </div>
  );
}
