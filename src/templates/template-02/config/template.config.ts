// src/templates/template-02/config/template.config.ts
// Plugin manifest for Template 02 — Cosmic/Starfield.

import type { TemplatePlugin } from '@/template-engine/types';
import { CosmicExperiencePlayer } from '../pages/ExperiencePlayer';

const cosmicTemplate: TemplatePlugin = {
  id: 'template-02',
  name: 'Nostalgia Scrapbook',
  occasion: 'Raksha Bandhan',
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
        emoji: 'rakhi',
        titleEn: 'Threads of Love',
        titleHi: 'स्नेह का धागा',
        previewEn: 'Every year this day reminds me...',
        previewHi: 'यह दिन हर साल याद दिलाता है...',
        textEn: `Every year this day reminds me how lucky I am to have you as my sibling. You have been my protector, my confidant, and my biggest supporter through every chapter of life.\n\nThis Raksha Bandhan I want you to know — no distance, no time, no change can ever loosen the thread that ties us together.\n\nWith all my love,`,
        textHi: `हर साल यह दिन मुझे याद दिलाता है कि मैं कितना भाग्यशाली हूँ कि तुम मेरे भाई-बहन हो। तुमने हर मोड़ पर मेरा साथ दिया है।\n\nइस रक्षाबंधन पर मैं बस इतना कहना चाहता हूँ — कोई दूरी, कोई वक्त, कोई बदलाव हमारे रिश्ते के धागे को कमज़ोर नहीं कर सकता।\n\nसस्नेह,`,
      },
      {
        emoji: 'laddoo',
        titleEn: 'Sweet Nostalgia',
        titleHi: 'खट्टी-मीठी यादें',
        previewEn: 'From childhood fights to growing up...',
        previewHi: 'बचपन की लड़ाई से लेकर बड़े होने तक...',
        textEn: `From childhood fights over the remote to growing up and sharing our biggest secrets, our bond has only grown stronger. Thank you for making my childhood magical and for always believing in me.\n\nHappy Raksha Bandhan to my partner in crime!`,
        textHi: `बचपन में रिमोट के लिए लड़ने से लेकर बड़े होने पर अपने सबसे बड़े राज साझा करने तक, हमारा बंधन केवल मजबूत ही हुआ है। मेरे बचपन को जादुई बनाने और हमेशा मुझ पर विश्वास करने के लिए धन्यवाद।\n\nमेरे सबसे प्यारे भाई-बहन को रक्षाबंधन की शुभकामनाएं!`,
      },
      {
        emoji: 'diya',
        titleEn: 'My Constant Support',
        titleHi: 'मेरा संबल',
        previewEn: 'Through all of lifes highs and lows...',
        previewHi: 'जीवन के सभी उतार-चढ़ाव में...',
        textEn: `Through all of life's highs and lows, you have been my constant support. Having you in my corner makes me feel like I can take on the world.\n\nOn this beautiful day of Rakhi, I wish you endless happiness, peace, and success. Thank you for just being you.`,
        textHi: `जीवन के सभी उतार-चढ़ाव के दौरान, आप मेरी निरंतर ताकत रहे हैं। आपका साथ होना मुझे ऐसा महसूस कराता है कि मैं पूरी दुनिया से मुकाबला कर सकता हूँ।\n\nराखी के इस खूबसूरत दिन पर, मैं आपके लिए अनंत खुशी, शांति और सफलता की कामना करता हूँ। हमेशा मेरा संबल बने रहने के लिए धन्यवाद।`,
      }
    ],
  },

  ai: {
    letterSuggestionPrompt: `You are helping someone write a warm, nostalgic Raksha Bandhan letter to their sibling.
Use themes of shared childhood memories, protection, love, and an unbreakable bond.
Keep it between 80-150 words. Affectionate, heartfelt tone. Do NOT use emojis.`,
  },
};

export default cosmicTemplate;
