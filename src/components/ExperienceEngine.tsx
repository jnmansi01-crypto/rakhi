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

// ── Watermark component ───────────────────────────────────────────────────────
function ExperienceWatermark({ senderName, recipientName }: { senderName: string; recipientName: string }) {
  return (
    <div
      aria-hidden
      style={{
        position: 'fixed', inset: 0, zIndex: 9998,
        pointerEvents: 'none',
        overflow: 'hidden',
        userSelect: 'none',
      }}
    >
      {/* Diagonal tiled watermark text */}
      {Array.from({ length: 30 }, (_, i) => (
        <div
          key={i}
          style={{
            position: 'absolute',
            left: `${(i % 4) * 28 - 10}%`,
            top: `${Math.floor(i / 4) * 18 - 5}%`,
            transform: 'rotate(-30deg)',
            whiteSpace: 'nowrap',
            fontFamily: 'system-ui, sans-serif',
            fontSize: '0.65rem',
            letterSpacing: '0.12em',
            color: 'rgba(255,255,255,0.045)',
            fontWeight: 600,
          }}
        >
          {senderName} → {recipientName} · rakhi.gift
        </div>
      ))}
    </div>
  );
}

// ── Screen Capture Warning Overlay ───────────────────────────────────────────
function ScreenCaptureWarning({ onDismiss }: { onDismiss: () => void }) {
  return (
    <div style={{
      position: 'fixed', inset: 0, zIndex: 10000,
      background: 'rgba(8, 4, 8, 0.97)',
      display: 'flex', flexDirection: 'column',
      alignItems: 'center', justifyContent: 'center',
      backdropFilter: 'blur(20px)',
    }}>
      <div style={{ textAlign: 'center', maxWidth: 320, padding: 32 }}>
        <div style={{ fontSize: '3rem', marginBottom: 20 }}>🛋️</div>
        <h2 style={{
          fontFamily: 'Georgia, serif',
          color: '#FFF8F0',
          fontSize: '1.4rem',
          fontWeight: 400,
          marginBottom: 12,
        }}>
          This Experience is Private
        </h2>
        <p style={{
          fontFamily: 'system-ui, sans-serif',
          fontSize: '0.9rem',
          color: 'rgba(255,248,240,0.6)',
          lineHeight: 1.6,
          marginBottom: 28,
        }}>
          Screen sharing has been detected. This gift experience is personal and private — crafted just for you.
          Please stop sharing your screen to continue.
        </p>
        <button
          onClick={onDismiss}
          style={{
            background: 'rgba(201,168,76,0.15)',
            border: '1px solid rgba(201,168,76,0.5)',
            color: '#C9A84C',
            padding: '12px 28px',
            borderRadius: 100,
            cursor: 'pointer',
            fontFamily: 'system-ui, sans-serif',
            fontSize: '0.85rem',
            letterSpacing: '0.06em',
          }}
        >
          I understand, continue anyway
        </button>
      </div>
    </div>
  );
}

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
  const [captureWarningDismissed, setCaptureWarningDismissed] = useState(false);
  const [isCapturing, setIsCapturing] = useState(false);
  const { locale } = experience;

  // ── Screen Capture Detection (Chrome/Edge via MediaStream API) ────────────
  useEffect(() => {
    if (typeof window === 'undefined') return;
    let stream: MediaStream | null = null;

    // Hook into the browser's getDisplayMedia to detect when a screen share starts.
    // We monkey-patch it once so we can intercept calls from *any* extension/tool.
    const originalGetDisplayMedia = navigator.mediaDevices?.getDisplayMedia?.bind(navigator.mediaDevices);
    if (originalGetDisplayMedia && navigator.mediaDevices) {
      (navigator.mediaDevices as any).getDisplayMedia = async (constraints?: DisplayMediaStreamOptions) => {
        const s: MediaStream = await originalGetDisplayMedia(constraints);
        stream = s;
        setIsCapturing(true);
        s.getVideoTracks()[0]?.addEventListener('ended', () => {
          setIsCapturing(false);
          stream = null;
        });
        return s;
      };
    }

    return () => {
      // Restore original
      if (originalGetDisplayMedia && navigator.mediaDevices) {
        navigator.mediaDevices.getDisplayMedia = originalGetDisplayMedia;
      }
    };
  }, []);

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

      {/* Back button (Only show for scenes after arrival) */}
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
      {/* Diagonal watermark (always visible, transparent) */}
      <ExperienceWatermark
        senderName={experience.senderName}
        recipientName={experience.recipientName}
      />

      {/* Screen capture warning overlay */}
      {isCapturing && !captureWarningDismissed && (
        <ScreenCaptureWarning onDismiss={() => setCaptureWarningDismissed(true)} />
      )}
    </div>
  );
}
