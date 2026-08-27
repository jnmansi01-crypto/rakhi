// src/templates/rakhi-2025/template.config.ts
// Plugin manifest for Template 01 — Raksha Bandhan 2025.

import type { TemplatePlugin } from '@/template-engine/types';
import { RakhiExperiencePlayer } from '../pages/ExperiencePlayer';

const rakhiTemplate: TemplatePlugin = {
  id: 'rakhi-2025',           // Stable ID — never change, used in Firestore records
  name: 'Template 01',        // Display name in the template registry
  occasion: 'Raksha Bandhan',
  priceInPaise: 15000,        // ₹150


  ExperiencePlayer: RakhiExperiencePlayer,

  theme: {
    primaryColor: '#C9A84C',
    accentColor: '#E8751A',
    backgroundGradient: 'radial-gradient(ellipse at 55% 15%, #2A0D1E 0%, #160818 50%, #080408 100%)',
    fontFamily: 'Georgia, serif',
  },

  createConfig: {
    letterTemplates: [
      {
        emoji: 'rakhi',
        titleEn: 'Heartfelt',
        titleHi: 'दिल से',
        previewEn: 'Thank you for always being there...',
        previewHi: 'हमेशा मेरा साथ देने के लिए...',
        textEn: `Happy Raksha Bandhan! 🌸\n\nThank you for always being my biggest supporter, my partner in crime, and my best friend. Even though we fight over silly things, I know I can always count on you.\n\nI am so lucky to have you in my life. This Rakhi is a small token of the huge love I carry for you.\n\nAlways yours ❤️`,
        textHi: `रक्षाबंधन की बहुत-बहुत शुभकामनाएँ! 🌸\n\nहमेशा मेरा साथ देने के लिए, हर मुश्किल में खड़े रहने के लिए, और मुझे हमेशा हँसाने के लिए — शुक्रिया।\n\nतुम्हारे होने से मेरी ज़िंदगी बहुत खूबसूरत है।\n\nहमेशा तुम्हारा/तुम्हारी ❤️`,
      },
      {
        emoji: 'laddoo',
        titleEn: 'Funny',
        titleHi: 'मज़ेदार',
        previewEn: 'Remember when we blamed each other...',
        previewHi: 'याद है जब हमने मम्मी का...',
        textEn: `Happy Raksha Bandhan! 🎉\n\nRemember when we used to blame each other for eating the last biscuit? Or when we'd fight over the TV remote for hours on end?\n\nYou were my first best friend — and honestly, my most permanent one. This year, I promise to fight with you a little less. Just a little. 😄\n\nYours forever ❤️`,
        textHi: `रक्षाबंधन मुबारक! 🎉\n\nयाद है जब हमने मम्मी का खाना चुराया था और एक-दूसरे पर इल्ज़ाम लगाया था?\n\nसच में, तुम मेरे सबसे पहले दोस्त हो — और सबसे पक्के भी। इस साल थोड़ा कम झगड़ूँगा/झगड़ूँगी। थोड़ा ही! 😄\n\nतुम्हारा/तुम्हारी, हमेशा ❤️`,
      },
      {
        emoji: 'diya',
        titleEn: 'Emotional',
        titleHi: 'भावुक',
        previewEn: 'No matter the distance between us...',
        previewHi: 'दूरी कितनी भी हो...',
        textEn: `On this special day, I want you to know — no matter the miles between us, you are always close to my heart.\n\nYou've cheered on every dream I've chased, held me up through every storm, and made every ordinary day feel special. You are not just my sibling — you are my strength.\n\nThis Rakhi is a symbol of that unbreakable bond. 🌸\n\nForever yours ❤️`,
        textHi: `आज इस खास दिन पर — चाहे दूरी कितनी भी हो, तुम हमेशा मेरे दिल के करीब हो।\n\nहर सपने में तुमने साथ दिया, हर तकलीफ में हिम्मत बँधाई। तुम सिर्फ मेरे भाई/बहन नहीं, मेरी ताकत हो।\n\nयह राखी उस अटूट रिश्ते की निशानी है। 🌸\n\nतुम्हारा/तुम्हारी, सदा ❤️`,
      },
    ],
  },

  ai: {
    letterSuggestionPrompt: `You are helping someone write a heartfelt Raksha Bandhan letter to their sibling. 
The letter should be warm, personal, and evoke shared memories. 
Keep it between 80-150 words. Use a gentle, affectionate tone.
Reference the bond of protection and love that defines Raksha Bandhan.`,
  },
};

export default rakhiTemplate;
