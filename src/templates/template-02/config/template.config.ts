// src/templates/template-02/config/template.config.ts
// Plugin manifest for Template 02 — Cosmic/Starfield.

import type { TemplatePlugin } from '@/template-engine/types';
import { CosmicExperiencePlayer } from '../pages/ExperiencePlayer';

const cosmicTemplate: TemplatePlugin = {
  id: 'template-02',
  name: 'Template 02',
  occasion: 'Cosmic / Starfield',
  priceInPaise: 29900, // ₹299

  ExperiencePlayer: CosmicExperiencePlayer,

  theme: {
    primaryColor: '#a8aeff',
    accentColor: '#7c83fd',
    backgroundGradient: 'radial-gradient(ellipse at 30% 20%, #1a1f3a 0%, #0a0e1a 60%, #050810 100%)',
    fontFamily: 'system-ui, sans-serif',
  },

  createConfig: {
    letterTemplates: [
      {
        emoji: '🌌',
        titleEn: 'Cosmic Love',
        titleHi: 'ब्रह्मांडीय प्रेम',
        previewEn: 'Across the stars and galaxies...',
        previewHi: 'तारों और आकाशगंगाओं के पार...',
        textEn: `To my favorite human,\n\nHappy Raksha Bandhan! 🌌\n\nNo matter where in the universe life takes us, or how many light-years away we are, you will always be my anchor. Thank you for being my constant star in a changing sky.\n\nLove you to the edge of the galaxy and back! ❤️`,
        textHi: `मेरे पसंदीदा इंसान,\n\nरक्षाबंधन की बहुत-बहुत शुभकामनाएँ! 🌌\n\nचाहे जीवन हमें इस ब्रह्मांड में कहीं भी ले जाए, तुम हमेशा मेरे ध्रुव तारे रहोगे। हमेशा मेरा साथ देने के लिए शुक्रिया।\n\nअंतरिक्ष के अंतिम छोर तक तुमसे प्यार है! ❤️`,
      },
    ],
  },

  ai: {
    letterSuggestionPrompt: `You are helping someone write a cosmic-themed, star-filled Raksha Bandhan letter to their sibling.
Use space, constellations, stars, and eternal themes in a warm, poetic way. 
Keep it between 80-150 words. Affectionate tone.`,
  },
};

export default cosmicTemplate;
