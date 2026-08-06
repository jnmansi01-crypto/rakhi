'use client';
// src/templates/rakhi-2025/ExperiencePlayer.tsx
// The Rakhi 2025 presentation layer.
// Contains all scene orchestration logic for this template.
// The shared ExperienceEngine wraps this with the watermark and screen protection.

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Scene1_Arrival }    from './scenes/Scene1_Arrival';
import { Scene2_Envelope }   from './scenes/Scene2_Envelope';
import { Scene3_Photos }     from './scenes/Scene3_Photos';
import { Scene4_Voice }      from './scenes/Scene4_Voice';
import { Scene5_Rakhi }      from './scenes/Scene5_Rakhi';
import { Scene6_GiftReveal } from './scenes/Scene6_GiftReveal';
import { audioEngine } from '@/lib/audio';
import type { ExperiencePlayerProps } from '../types';

const SCENES = ['arrival', 'envelope', 'photos', 'voice', 'rakhi', 'gift'] as const;
type SceneName = typeof SCENES[number];

const sceneVariants = {
  initial: { opacity: 0, scale: 0.95, filter: 'blur(10px)' },
  animate: { opacity: 1, scale: 1,    filter: 'blur(0px)'  },
  exit:    { opacity: 0, scale: 1.05, filter: 'blur(10px)' },
};

export function RakhiExperiencePlayer({ experience }: ExperiencePlayerProps) {
  const [scene, setScene] = useState<SceneName>('arrival');
  const { locale } = experience;

  // Skip scenes that have no content
  const nextSkipping = (current: SceneName) => {
    if (current === 'arrival') {
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

  // Dot indicators (only scenes with content)
  const dotScenes = SCENES.filter(s => {
    if (s === 'photos' && experience.photoUrls.length === 0) return false;
    if (s === 'voice'  && !experience.voiceUrl) return false;
    return true;
  });
  const currentDotIdx = dotScenes.indexOf(scene);

  return (
    <div style={{ position: 'fixed', inset: 0 }}>
      <AnimatePresence mode="wait">
        <motion.div
          key={scene}
          variants={sceneVariants}
          initial="initial"
          animate="animate"
          exit="exit"
          transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
          style={{ position: 'absolute', inset: 0 }}
        >
          {scene === 'arrival' && (
            <Scene1_Arrival
              senderName={experience.senderName}
              recipientName={experience.recipientName}
              locale={locale}
              onComplete={() => nextSkipping('arrival')}
            />
          )}
          {scene === 'envelope' && (
            <Scene2_Envelope
              letterText={experience.letterText}
              senderName={experience.senderName}
              recipientName={experience.recipientName}
              locale={locale}
              onComplete={() => nextSkipping('envelope')}
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
            <Scene6_GiftReveal
              giftType={experience.giftType}
              giftTitle={experience.giftTitle}
              giftValue={experience.giftValue}
              senderName={experience.senderName}
              locale={locale}
              onComplete={() => { window.location.href = `/reply/${experience.id}`; }}
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
          />
        ))}
      </div>

      {/* Back button (only show for scenes after arrival) */}
      <AnimatePresence>
        {currentDotIdx > 0 && (
          <motion.button
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            onClick={() => previousSkipping(scene)}
            style={{
              position: 'fixed', top: 32, left: 24, zIndex: 110,
              background: 'rgba(255,255,255,0.05)',
              border: '1px solid rgba(201,168,76,0.3)',
              borderRadius: '50%', width: 44, height: 44,
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              backdropFilter: 'blur(10px)', WebkitBackdropFilter: 'blur(10px)',
              cursor: 'pointer', color: '#C9A84C', fontSize: '1.2rem',
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
