'use client';
// src/templates/template-02/pages/ExperiencePlayer.tsx
// Self-contained ExperiencePlayer for Template 02 (Nostalgia Scrapbook theme)
// Featuring 3D Book Page Flip transitions, touch/drag swipe gesture handlers, and animated back navigation.

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Scene1_Welcome } from './Scene1_Welcome';
import { Scene2_Letter }  from './Scene2_Letter';
import { Scene_Trivia }   from './Scene_Trivia';
import { Scene3_Photos }  from './Scene3_Photos';
import { Scene4_Voice }   from './Scene4_Voice';
import { Scene_PuzzlePage } from './Scene_PuzzlePage';
import { Scene5_Rakhi }   from './Scene5_Rakhi';
import { Scene6_Gift }    from './Scene6_Gift';
import { audioEngine } from '@/shared/audio/audio';
import { useHaptics } from '@/shared/components/useHaptics';
import { trackExperienceCompleted } from '@/core/payments/analytics';
import type { ExperiencePlayerProps } from '@/template-engine/types';

const SCENES = ['welcome', 'letter', 'trivia', 'photos', 'voice', 'puzzle', 'rakhi', 'gift'] as const;
type SceneName = typeof SCENES[number];

export function CosmicExperiencePlayer({ experience, isPreview }: ExperiencePlayerProps) {
  const [scene, setScene] = useState<SceneName>('welcome');
  const [flipDirection, setFlipDirection] = useState<'next' | 'prev'>('next');
  const { locale } = experience;
  const { vibrate } = useHaptics();

  // Trigger experience_completed once when user reaches the final 'gift' scene
  useEffect(() => {
    if (scene === 'gift') {
      const completedKey = `loment_exp_completed_tracked_${experience.id}`;
      if (typeof window !== 'undefined' && !sessionStorage.getItem(completedKey)) {
        sessionStorage.setItem(completedKey, 'true');
        trackExperienceCompleted(experience.id, experience.templateId || 'template-02');
      }
    }
  }, [scene, experience.id, experience.templateId]);

  const nextSkipping = (current: SceneName) => {
    if (current === 'welcome') {
      audioEngine.playBGM();
    }
    audioEngine.playSwoosh();
    setFlipDirection('next');
    const idx = SCENES.indexOf(current);
    let nextIdx = idx + 1;
    while (nextIdx < SCENES.length) {
      const s = SCENES[nextIdx];
      if (s === 'photos' && experience.photoUrls.length === 0) { nextIdx++; continue; }
      break;
    }
    if (nextIdx < SCENES.length) setScene(SCENES[nextIdx]);
  };

  const previousSkipping = (current: SceneName) => {
    audioEngine.playSwoosh();
    setFlipDirection('prev');
    const idx = SCENES.indexOf(current);
    let prevIdx = idx - 1;
    while (prevIdx >= 0) {
      const s = SCENES[prevIdx];
      if (s === 'photos' && experience.photoUrls.length === 0) { prevIdx--; continue; }
      break;
    }
    if (prevIdx >= 0) setScene(SCENES[prevIdx]);
  };

  const dotScenes = SCENES.filter(s => {
    if (s === 'photos' && experience.photoUrls.length === 0) return false;
    return true;
  });
  const currentDotIdx = dotScenes.indexOf(scene);

  // 3D Scrapbook Page Flip Animation Variants
  const pageVariants = {
    initial: (direction: 'next' | 'prev') => ({
      rotateY: direction === 'next' ? 90 : -90,
      opacity: 0,
      scale: 0.94,
      boxShadow: direction === 'next' ? '-30px 0 60px rgba(0,0,0,0.85)' : '30px 0 60px rgba(0,0,0,0.85)',
    }),
    animate: {
      rotateY: 0,
      opacity: 1,
      scale: 1,
      boxShadow: '0 20px 50px rgba(0,0,0,0.65)',
      transition: {
        duration: 0.7,
        ease: [0.25, 1, 0.5, 1],
      },
    },
    exit: (direction: 'next' | 'prev') => ({
      rotateY: direction === 'next' ? -90 : 90,
      opacity: 0,
      scale: 0.94,
      boxShadow: direction === 'next' ? '30px 0 60px rgba(0,0,0,0.85)' : '-30px 0 60px rgba(0,0,0,0.85)',
      transition: {
        duration: 0.6,
        ease: [0.25, 1, 0.5, 1],
      },
    }),
  };

  return (
    <div style={{
      position: 'fixed', inset: 0,
      background: '#1d1412',
      backgroundImage: 'radial-gradient(circle at center, #2c1b18 0%, #110908 100%)',
      color: '#FFF8F0',
      overflow: 'hidden',
      perspective: 1400,
    }}>
      <AnimatePresence mode="wait" custom={flipDirection}>
        <motion.div
          key={scene}
          custom={flipDirection}
          variants={pageVariants}
          initial="initial"
          animate="animate"
          exit="exit"
          onPanEnd={(e, info) => {
            // Disable swipe navigation on scenes with internal drag interactions
            if (scene === 'rakhi' || scene === 'photos') return;
            if (info.offset.x < -40) {
              nextSkipping(scene);
            } else if (info.offset.x > 40 && scene !== 'welcome') {
              previousSkipping(scene);
            }
          }}
          style={{ 
            position: 'absolute', 
            inset: 0,
            transformStyle: 'preserve-3d',
            transformOrigin: flipDirection === 'next' ? 'left center' : 'right center',
            backfaceVisibility: 'hidden',
            touchAction: 'none',
          }}
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
              onBack={() => previousSkipping('letter')}
            />
          )}

          {scene === 'trivia' && (
            <Scene_Trivia
              senderName={experience.senderName}
              recipientName={experience.recipientName}
              locale={locale}
              onComplete={() => nextSkipping('trivia')}
              onBack={() => previousSkipping('trivia')}
            />
          )}

          {scene === 'photos' && (
            <Scene3_Photos
              photoUrls={experience.photoUrls}
              senderName={experience.senderName}
              recipientName={experience.recipientName}
              locale={locale}
              onComplete={() => nextSkipping('photos')}
              onBack={() => previousSkipping('photos')}
            />
          )}

          {scene === 'voice' && (
            <Scene4_Voice
              voiceUrl={experience.voiceUrl}
              senderName={experience.senderName}
              locale={locale}
              onComplete={() => nextSkipping('voice')}
              onBack={() => previousSkipping('voice')}
            />
          )}

          {scene === 'puzzle' && (
            <Scene_PuzzlePage
              photoUrls={experience.photoUrls}
              puzzlePhotoUrl={experience.puzzlePhotoUrl}
              senderName={experience.senderName}
              recipientName={experience.recipientName}
              locale={locale}
              onComplete={() => nextSkipping('puzzle')}
              onBack={() => previousSkipping('puzzle')}
            />
          )}

          {scene === 'rakhi' && (
            <Scene5_Rakhi
              recipientName={experience.recipientName}
              senderName={experience.senderName}
              locale={locale}
              onComplete={() => nextSkipping('rakhi')}
              onBack={() => previousSkipping('rakhi')}
            />
          )}

          {scene === 'gift' && (
            <Scene6_Gift
              giftType={experience.giftType}
              giftTitle={experience.giftTitle}
              giftValue={experience.giftValue}
              senderName={experience.senderName}
              recipientName={experience.recipientName}
              letterText={experience.letterText}
              photoUrls={experience.photoUrls}
              experienceId={experience.id}
              locale={locale}
              isPreview={isPreview}
              onComplete={() => nextSkipping('gift')}
              onBack={() => previousSkipping('gift')}
            />
          )}
        </motion.div>
      </AnimatePresence>

      {/* Persistent Scene Indicator Dots */}
      <div style={{
        position: 'absolute',
        bottom: 24,
        left: '50%',
        transform: 'translateX(-50%)',
        display: 'flex',
        alignItems: 'center',
        gap: 8,
        zIndex: 50,
      }}>
        {dotScenes.map((s, idx) => (
          <button
            key={s}
            onClick={() => {
              vibrate();
              audioEngine.playSwoosh();
              setFlipDirection(idx > currentDotIdx ? 'next' : 'prev');
              setScene(s);
            }}
            style={{
              width: idx === currentDotIdx ? 20 : 6,
              height: 6,
              borderRadius: 3,
              background: idx === currentDotIdx 
                ? 'linear-gradient(90deg, #ffd700, #ffaa00)'
                : 'rgba(255,255,255,0.25)',
              border: 'none',
              cursor: 'pointer',
              transition: 'all 0.3s ease',
              padding: 0,
            }}
            title={s}
          />
        ))}
      </div>
    </div>
  );
}
