// src/template-engine/types.ts
// The contract every template plugin must satisfy.

import type React from 'react';
import type { RakhiExperience, Locale } from '@/lib/types';

// ─── Props passed to every template's ExperiencePlayer ───────────────────────
export interface ExperiencePlayerProps {
  experience: RakhiExperience;
  onSceneChange?: (scene: string) => void;
  /** True when rendered in the sender's preview — hides reply/thank-you actions */
  isPreview?: boolean;
}

// ─── Props passed to every template's LandingPage ────────────────────────────
export interface LandingPageProps {
  locale?: Locale;
}

// ─── Letter template pre-sets shown in the create flow ───────────────────────
export interface LetterTemplate {
  emoji: string;
  titleEn: string;
  titleHi: string;
  previewEn: string;
  previewHi: string;
  textEn: string;
  textHi: string;
}

// ─── The Plugin contract ──────────────────────────────────────────────────────
export interface TemplatePlugin {
  /** Unique slug. Must match the directory name under src/templates/ */
  id: string;

  /** Human-readable name */
  name: string;

  /** The occasion this template is built for */
  occasion: string;

  /** Price in INR paise — e.g. 29900 = ₹299 */
  priceInPaise: number;

  /** The full-screen experience shown to the recipient */
  ExperiencePlayer: React.ComponentType<ExperiencePlayerProps>;

  /** Optional overrides for the create flow */
  createConfig?: {
    /** Pre-written letter templates shown in the letter step */
    letterTemplates?: LetterTemplate[];
  };

  /** AI prompts (optional) */
  ai?: {
    /** System prompt used for AI-assisted letter writing */
    letterSuggestionPrompt?: string;
    /** System prompt used for photo caption suggestions */
    captionPrompt?: string;
  };

  /** Visual theme tokens */
  theme: {
    primaryColor: string;
    accentColor: string;
    backgroundGradient: string;
    fontFamily?: string;
  };

  /** Additional i18n keys merged with the global i18n store */
  i18n?: Record<string, { en: string; hi: string }>;
}
