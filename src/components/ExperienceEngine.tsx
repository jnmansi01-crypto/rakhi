'use client';
import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Scene1_Arrival }    from '@/components/scenes/Scene1_Arrival';
import { Scene2_Envelope }   from '@/components/scenes/Scene2_Envelope';
import { Scene3_Photos }     from '@/components/scenes/Scene3_Photos';
import { Scene4_Voice }      from '@/components/scenes/Scene4_Voice';
import { Scene5_Rakhi }      from '@/components/scenes/Scene5_Rakhi';
import { Scene6_GiftReveal } from '@/components/scenes/Scene6_GiftReveal';
import type { RakhiExperience } from '@/lib/types';
import { markOpened } from '@/lib/storage';
import { audioEngine } from '@/lib/audio';

interface Props { experience: RakhiExperience }

const SCENES = ['arrival','envelope','photos','voice','rakhi','gift'] as const;
type SceneName = typeof SCENES[number];

const sceneVariants = {
  initial: { opacity: 0, scale: 0.95, filter: 'blur(10px)' },
  animate: { opacity: 1, scale: 1, filter: 'blur(0px)' },
  exit:    { opacity: 0, scale: 1.05, filter: 'blur(10px)' },
};

export function ExperienceEngine({ experience }: Props) {
  const [scene, setScene] = useState<SceneName>('arrival');
  const { locale } = experience;

  useEffect(() => {
    markOpened(experience.id).catch(() => {});
  }, [experience.id]);

  const next = () => {
    audioEngine.playSwoosh();
    const idx = SCENES.indexOf(scene);
    if (idx < SCENES.length - 1) setScene(SCENES[idx + 1]);
  };

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

  // Dot indicators
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
              onComplete={() => {}}
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
    </div>
  );
}
