'use client';
// src/templates/template-02/pages/ExperiencePlayer.tsx
// Self-contained ExperiencePlayer for Template 02 (Nostalgia Scrapbook theme).

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Scene1_Welcome } from './Scene1_Welcome';
import { Scene2_Letter }  from './Scene2_Letter';
import { Scene3_Photos }  from './Scene3_Photos';
import { Scene4_Voice }   from './Scene4_Voice';
import { Scene5_Rakhi }   from './Scene5_Rakhi';
import { Scene6_Gift }    from './Scene6_Gift';
import { audioEngine } from '@/shared/audio/audio';
import { useHaptics } from '@/shared/components/useHaptics';
import type { ExperiencePlayerProps } from '@/template-engine/types';

const SCENES = ['welcome', 'letter', 'photos', 'voice', 'rakhi', 'gift'] as const;
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
      background: '#1d1412',
      backgroundImage: 'radial-gradient(circle at center, #2c1b18 0%, #110908 100%)',
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
          {scene === 'welcome' && (
            <Scene1_Welcome
              senderName={experience.senderName}
              recipientName={experience.recipientName}
              locale={locale}
              onComplete={() => nextSkipping('welcome')}
            />
          )}

          {scene === 'letter' && (
            <Scene2_Letter
              letterText={experience.letterText}
              senderName={experience.senderName}
              recipientName={experience.recipientName}
              locale={locale}
              onComplete={() => nextSkipping('letter')}
            />
          )}

          {scene === 'photos' && (
            <Scene3_Photos
              photoUrls={experience.photoUrls}
              senderName={experience.senderName}
              recipientName={experience.recipientName}
              locale={locale}
              onComplete={() => nextSkipping('photos')}
            />
          )}

          {scene === 'voice' && (
            <Scene4_Voice
              voiceUrl={experience.voiceUrl}
              senderName={experience.senderName}
              locale={locale}
              onComplete={() => nextSkipping('voice')}
            />
          )}

          {scene === 'rakhi' && (
            <Scene5_Rakhi
              recipientName={experience.recipientName}
              senderName={experience.senderName}
              locale={locale}
              onComplete={() => nextSkipping('rakhi')}
            />
          )}

          {scene === 'gift' && (
            <Scene6_Gift
              giftType={experience.giftType}
              giftTitle={experience.giftTitle}
              giftValue={experience.giftValue}
              senderName={experience.senderName}
              locale={locale}
              onComplete={() => {
                vibrate();
                window.location.href = `/reply/${experience.id}`;
              }}
            />
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
              background: i === currentDotIdx ? '#c79774' : 'rgba(199, 151, 116, 0.3)',
              boxShadow: i === currentDotIdx ? '0 0 8px #c79774' : 'none',
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
              border: '1px solid rgba(199,151,116,0.2)',
              borderRadius: '50%', width: 44, height: 44,
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              backdropFilter: 'blur(10px)', WebkitBackdropFilter: 'blur(10px)',
              cursor: 'pointer', color: '#c79774', fontSize: '1.2rem',
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
