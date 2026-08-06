'use client';
// src/app/select/page.tsx
// Premium Template Selector page prompting the sender to select Template 1 or 2.

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { useHaptics } from '@/shared/components/useHaptics';

export default function SelectTemplatePage() {
  const router = useRouter();
  const { vibrate } = useHaptics();
  const [locale, setLocale] = useState<'en' | 'hi'>('en');

  const templates = [
    {
      id: 'rakhi-2025',
      name: locale === 'hi' ? 'टेम्पलेट ०१: शाही परंपरा' : 'Template 01: Royal Classic',
      desc: locale === 'hi' ? 'शाही लाल सिल्क, सुनहरा काम, मधुर बांसुरी संगीत और पारंपरिक राखी बांधने का अनुभव।' : 'Royal crimson silk, gold embroidery, traditional santoor music, and sacred thread tying.',
      visual: 'linear-gradient(135deg, #4a1525, #8a1c14)', // Crimson/Gold theme representation
      badge: locale === 'hi' ? 'क्लासिक' : 'Sacred & Classic',
      emoji: '🌸',
    },
    {
      id: 'template-02',
      name: locale === 'hi' ? 'टेम्पलेट ०२: यादों का एल्बम' : 'Template 02: Nostalgia Scrapbook',
      desc: locale === 'hi' ? 'लकड़ी की मेज, हाथ से लिखी चिट्ठी, पुराने कैसेट प्लेयर में आवाज और सुतली से बंधा गिफ्ट बॉक्स।' : 'Dark mahogany table, typewriter handwriting, Polaroid photos, retro cassette tape, and jute string parcel.',
      visual: 'linear-gradient(135deg, #2b1f1d, #422f29)', // Warm wood theme representation
      badge: locale === 'hi' ? 'यादें' : 'Warm & Nostalgic',
      emoji: '📼',
    }
  ];

  const handleSelect = (id: string) => {
    vibrate();
    router.push(`/create?template=${id}`);
  };

  return (
    <div style={{
      minHeight: '100vh',
      background: '#080408',
      backgroundImage: 'radial-gradient(circle at center, #160a16 0%, #070307 100%)',
      color: '#FFF8F0',
      display: 'flex', flexDirection: 'column',
      alignItems: 'center', justifyContent: 'center',
      padding: '40px 24px',
      overflowX: 'hidden',
    }}>
      {/* Locale Toggle */}
      <button
        onClick={() => { vibrate(); setLocale(l => l === 'en' ? 'hi' : 'en'); }}
        style={{
          position: 'absolute', top: 24, right: 24,
          background: 'rgba(255,255,255,0.05)',
          border: '1px solid rgba(201,168,76,0.3)',
          color: '#C9A84C',
          borderRadius: 20, padding: '6px 14px',
          fontSize: '0.8rem', cursor: 'pointer',
          fontFamily: 'var(--font-sans)',
        }}
      >
        {locale === 'en' ? 'हिन्दी' : 'English'}
      </button>

      {/* Header */}
      <div style={{ textAlign: 'center', marginBottom: 48, maxWidth: 420 }}>
        <motion.p
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          style={{
            fontFamily: 'var(--font-sans)', fontSize: '0.78rem',
            color: '#C9A84C', letterSpacing: '0.15em',
            textTransform: 'uppercase', marginBottom: 12,
          }}
        >
          {locale === 'hi' ? 'राखी अनुभव' : 'DIGITAL RITUAL'}
        </motion.p>
        <motion.h1
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          style={{
            fontFamily: 'Georgia, serif',
            fontSize: 'clamp(1.8rem, 6vw, 2.5rem)',
            fontWeight: 400,
            lineHeight: 1.2,
            marginBottom: 16,
          }}
        >
          {locale === 'hi' ? 'अनुभव का स्वरूप चुनें' : 'Choose Your Experience'}
        </motion.h1>
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
          style={{
            fontFamily: 'var(--font-sans)', fontSize: '0.9rem',
            color: 'rgba(255,248,240,0.6)', lineHeight: 1.6,
          }}
        >
          {locale === 'hi'
            ? 'अपने भाई या बहन के लिए सबसे सुंदर और आकर्षक थीम चुनें।'
            : 'Select the visual storytelling canvas that matches your sibling\'s personality.'}
        </motion.p>
      </div>

      {/* Grid of Templates */}
      <div style={{
        display: 'flex', flexDirection: 'column', gap: 24,
        width: '100%', maxWidth: 400,
      }}>
        {templates.map((tpl, i) => (
          <motion.div
            key={tpl.id}
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 + i * 0.15, duration: 0.6, ease: [0.25, 1, 0.5, 1] }}
            whileHover={{ y: -4, scale: 1.01 }}
            onClick={() => handleSelect(tpl.id)}
            style={{
              background: 'rgba(255,255,255,0.02)',
              border: '1.5px solid rgba(201,168,76,0.15)',
              borderRadius: 20,
              padding: 24,
              cursor: 'pointer',
              position: 'relative',
              overflow: 'hidden',
              display: 'flex', flexDirection: 'column',
              boxShadow: '0 10px 30px rgba(0,0,0,0.3)',
            }}
          >
            {/* Visual background gradient representation on hover */}
            <div style={{
              position: 'absolute', inset: 0,
              background: tpl.visual,
              opacity: 0.05,
              pointerEvents: 'none',
              zIndex: 0,
            }} />

            {/* Badge */}
            <span style={{
              alignSelf: 'flex-start',
              background: 'rgba(201,168,76,0.1)',
              border: '1px solid rgba(201,168,76,0.3)',
              color: '#C9A84C',
              borderRadius: 20,
              padding: '4px 10px',
              fontSize: '0.68rem',
              fontWeight: 500,
              letterSpacing: '0.05em',
              textTransform: 'uppercase',
              marginBottom: 16,
              zIndex: 1,
            }}>
              {tpl.badge}
            </span>

            {/* Title */}
            <h2 style={{
              fontFamily: 'Georgia, serif',
              fontSize: '1.3rem',
              fontWeight: 400,
              marginBottom: 8,
              display: 'flex', alignItems: 'center', gap: 8,
              zIndex: 1,
            }}>
              <span>{tpl.emoji}</span> {tpl.name}
            </h2>

            {/* Description */}
            <p style={{
              fontFamily: 'var(--font-sans)',
              fontSize: '0.85rem',
              color: 'rgba(255,248,240,0.6)',
              lineHeight: 1.5,
              margin: 0,
              zIndex: 1,
            }}>
              {tpl.desc}
            </p>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
