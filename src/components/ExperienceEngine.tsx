'use client';
// src/components/ExperienceEngine.tsx
// Thin router — loads the correct template plugin and delegates rendering.
// Shared concerns (watermark, screen protection, markOpened) live here.
// All scene logic lives inside the template's ExperiencePlayer.

import { useState, useEffect } from 'react';
import type { RakhiExperience } from '@/lib/types';
import { markOpened } from '@/lib/storage';
import { getTemplate, DEFAULT_TEMPLATE_ID } from '@/templates/index';
import type { TemplatePlugin } from '@/templates/types';

// ── Watermark (shared across all templates) ───────────────────────────────────
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

// ── Screen Capture Warning (shared across all templates) ──────────────────────
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

// ── Loading screen while template bundle is fetched ───────────────────────────
function TemplateLoadingScreen() {
  return (
    <div style={{
      position: 'fixed', inset: 0,
      background: '#080408',
      display: 'flex', alignItems: 'center', justifyContent: 'center',
    }}>
      <div style={{
        width: 40, height: 40, borderRadius: '50%',
        border: '2px solid rgba(201,168,76,0.2)',
        borderTopColor: '#C9A84C',
        animation: 'spin 1s linear infinite',
      }} />
    </div>
  );
}

// ── Main ExperienceEngine ─────────────────────────────────────────────────────
interface Props { experience: RakhiExperience }

export function ExperienceEngine({ experience }: Props) {
  const [plugin, setPlugin] = useState<TemplatePlugin | null>(null);
  const [captureWarningDismissed, setCaptureWarningDismissed] = useState(false);
  const [isCapturing, setIsCapturing] = useState(false);

  // Load the correct template plugin
  useEffect(() => {
    const templateId = experience.templateId ?? DEFAULT_TEMPLATE_ID;
    getTemplate(templateId).then(setPlugin).catch(() => {
      // Fallback: load default if the specified template fails
      getTemplate(DEFAULT_TEMPLATE_ID).then(setPlugin);
    });
  }, [experience.templateId]);

  // Mark the gift as opened
  useEffect(() => {
    markOpened(experience.id).catch(() => {});
  }, [experience.id]);

  // Screen capture detection (Chrome/Edge via MediaStream API)
  useEffect(() => {
    if (typeof window === 'undefined') return;
    const originalGetDisplayMedia = navigator.mediaDevices?.getDisplayMedia?.bind(navigator.mediaDevices);
    if (originalGetDisplayMedia && navigator.mediaDevices) {
      (navigator.mediaDevices as any).getDisplayMedia = async (constraints?: DisplayMediaStreamOptions) => {
        const s: MediaStream = await originalGetDisplayMedia(constraints);
        setIsCapturing(true);
        s.getVideoTracks()[0]?.addEventListener('ended', () => setIsCapturing(false));
        return s;
      };
    }
    return () => {
      if (originalGetDisplayMedia && navigator.mediaDevices) {
        navigator.mediaDevices.getDisplayMedia = originalGetDisplayMedia;
      }
    };
  }, []);

  if (!plugin) return <TemplateLoadingScreen />;

  const { ExperiencePlayer } = plugin;

  return (
    <div style={{ position: 'fixed', inset: 0 }}>
      {/* Delegate all presentation to the template's ExperiencePlayer */}
      <ExperiencePlayer experience={experience} />

      {/* Shared concerns — applied on top of every template */}
      <ExperienceWatermark
        senderName={experience.senderName}
        recipientName={experience.recipientName}
      />
      {isCapturing && !captureWarningDismissed && (
        <ScreenCaptureWarning onDismiss={() => setCaptureWarningDismissed(true)} />
      )}
    </div>
  );
}
