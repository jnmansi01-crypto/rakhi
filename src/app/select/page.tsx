'use client';
// src/app/select/page.tsx
// Premium Template Selector page prompting the sender to select Template 1 or 2.

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { useHaptics } from '@/shared/components/useHaptics';

export default function SelectTemplatePage() {
  const router = useRouter();
  const { vibrate } = useHaptics();
  const [locale, setLocale] = useState<'en' | 'hi'>('en');
  const [hoveredId, setHoveredId] = useState<string | null>(null);
  const [previewTemplateId, setPreviewTemplateId] = useState<string | null>(null);

  const templates = [
    {
      id: 'rakhi-2025',
      name: locale === 'hi' ? 'शाही परंपरा' : 'Royal Classic',
      desc: locale === 'hi' ? 'शाही लाल सिल्क, सुनहरा काम, मधुर संगीत और पारंपरिक राखी बांधने का अनुभव।' : 'Royal crimson silk, gold embroidery, traditional santoor music, and sacred thread tying.',
      visual: 'linear-gradient(135deg, #4a1525 0%, #8a1c14 100%)',
      glowColor: 'rgba(232, 117, 26, 0.45)', // orange-gold glow
      badge: locale === 'hi' ? 'क्लासिक' : 'Sacred & Classic',
      emoji: '🌸',
      price: '499',
      features: locale === 'hi' ? ['पारंपरिक संगीत', '3D रेशमी राखी'] : ['Traditional BGM', '3D Silk Rakhi'],
      previewUrl: '/gift/demo-royal?preview=true&template=rakhi-2025',
    },
    {
      id: 'template-02',
      name: locale === 'hi' ? 'यादों का एल्बम' : 'Nostalgia Scrapbook',
      desc: locale === 'hi' ? 'लकड़ी की मेज, हाथ से लिखी चिट्ठी, पुराने कैसेट प्लेयर में आवाज और सुतली से बंधा गिफ्ट पोटली।' : 'Dark mahogany table, typewriter handwriting, Polaroid photos, retro cassette tape, and jute string parcel.',
      visual: 'linear-gradient(135deg, #2b1f1d 0%, #5c4033 100%)',
      glowColor: 'rgba(199, 151, 116, 0.45)', // cardstock wood glow
      badge: locale === 'hi' ? 'यादें' : 'Warm & Nostalgic',
      emoji: '📼',
      price: '250',
      features: locale === 'hi' ? ['स्क्रैपबुक डायरी', 'रोली चावल अक्षत'] : ['Scrapbook Theme', '3D Roli & Chawal'],
      previewUrl: '/gift/demo-scrapbook?preview=true&template=template-02',
    }
  ];

  const handleSelect = (id: string) => {
    vibrate();
    router.push(`/create?template=${id}`);
  };

  const openPreview = (e: React.MouseEvent, url: string) => {
    e.stopPropagation();
    vibrate();
    setPreviewTemplateId(url);
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
          zIndex: 10,
        }}
      >
        {locale === 'en' ? 'हिन्दी' : 'English'}
      </button>

      {/* Header */}
      <div style={{ textAlign: 'center', marginBottom: 40, maxWidth: 460 }}>
        <motion.p
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          style={{
            fontFamily: 'var(--font-sans)', fontSize: '0.78rem',
            color: '#C9A84C', letterSpacing: '0.15em',
            textTransform: 'uppercase', marginBottom: 10,
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
            fontSize: 'clamp(2rem, 6vw, 2.6rem)',
            fontWeight: 400,
            lineHeight: 1.2,
            marginBottom: 12,
          }}
        >
          {locale === 'hi' ? 'अनुभव का स्वरूप चुनें' : 'Choose Your Experience'}
        </motion.h1>
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
          style={{
            fontFamily: 'var(--font-sans)', fontSize: '0.88rem',
            color: 'rgba(255,248,240,0.6)', lineHeight: 1.6,
          }}
        >
          {locale === 'hi'
            ? 'अपने भाई या बहन के लिए सबसे सुंदर और आकर्षक थीम चुनें।'
            : 'Select the visual storytelling canvas that matches your sibling\'s personality.'}
        </motion.p>
      </div>

      {/* Flex container showing square cards side-by-side on desktop, scaled on mobile */}
      <div 
        className="template-grid-wrapper"
        style={{
          display: 'flex', 
          flexDirection: 'row', 
          flexWrap: 'nowrap', // Force side-by-side row display
          gap: 16,
          width: '100%', 
          maxWidth: 720,
          justifyContent: 'center',
          alignItems: 'stretch',
        }}
      >
        <style dangerouslySetInnerHTML={{ __html: `
          @media (max-width: 600px) {
            .template-grid-wrapper {
              flex-direction: column !important;
              align-items: center !important;
            }
            .template-square-card {
              aspect-ratio: 1.6/1 !important; /* Wider horizontal rectangle */
              padding: 20px !important;
              max-width: 100% !important; /* Full width stack */
              width: 100% !important;
            }
            .template-title {
              font-size: 1.15rem !important;
            }
            .template-desc {
              font-size: 0.76rem !important;
              display: -webkit-box;
              -webkit-line-clamp: 2;
              -webkit-box-orient: vertical;
              overflow: hidden;
            }
            .template-badge {
              font-size: 0.65rem !important;
              padding: 3px 8px !important;
            }
            .template-price {
              font-size: 0.85rem !important;
              padding: 3px 10px !important;
            }
            .template-features {
              display: none !important; /* Hide to save space on mobile */
            }
          }
        ` }} />
        {templates.map((tpl, i) => {
          const isHovered = hoveredId === tpl.id;
          return (
            <motion.div
              key={tpl.id}
              className="template-square-card"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 + i * 0.15, duration: 0.6, ease: [0.25, 1, 0.5, 1] }}
              whileHover={{ y: -6, scale: 1.02 }}
              onMouseEnter={() => setHoveredId(tpl.id)}
              onMouseLeave={() => setHoveredId(null)}
              onClick={() => handleSelect(tpl.id)}
              style={{
                flex: '1 1 0px',
                maxWidth: 340,
                aspectRatio: '1/1',
                background: 'rgba(255,255,255,0.02)',
                border: isHovered 
                  ? `1.5px solid ${tpl.glowColor}` 
                  : '1.5px solid rgba(201,168,76,0.15)',
                borderRadius: 24,
                padding: 28,
                cursor: 'pointer',
                position: 'relative',
                overflow: 'hidden',
                display: 'flex', 
                flexDirection: 'column',
                justifyContent: 'space-between',
                boxShadow: isHovered 
                  ? `0 15px 40px rgba(0,0,0,0.5), 0 0 30px ${tpl.glowColor}` 
                  : '0 10px 30px rgba(0,0,0,0.3)',
                transition: 'border 0.3s ease, box-shadow 0.3s ease',
              }}
            >
              {/* Dynamic theme preview background */}
              <div style={{
                position: 'absolute', inset: 0,
                background: tpl.visual,
                opacity: isHovered ? 0.22 : 0.05,
                transition: 'opacity 0.4s ease',
                pointerEvents: 'none',
                zIndex: 0,
              }} />

              {/* Upper Header Row */}
              <div style={{ zIndex: 2, display: 'flex', justifyContent: 'space-between', alignItems: 'center', width: '100%' }}>
                <span className="template-badge" style={{
                  background: 'rgba(201,168,76,0.1)',
                  border: '1px solid rgba(201,168,76,0.3)',
                  color: '#C9A84C',
                  borderRadius: 20,
                  padding: '4px 10px',
                  fontSize: '0.65rem',
                  fontWeight: 500,
                  letterSpacing: '0.05em',
                  textTransform: 'uppercase',
                }}>
                  {tpl.badge}
                </span>

                {/* Price display tag */}
                <span className="template-price" style={{
                  fontFamily: 'var(--font-sans)',
                  fontSize: '1rem',
                  fontWeight: 600,
                  color: '#FFF8F0',
                  background: 'rgba(255,255,255,0.06)',
                  padding: '4px 12px',
                  borderRadius: 12,
                  border: '1px solid rgba(255,255,255,0.1)',
                }}>
                  ₹{tpl.price}/-
                </span>
              </div>

              {/* Title & Description */}
              <div style={{ zIndex: 2, margin: '16px 0' }}>
                <h2 className="template-title" style={{
                  fontFamily: 'Georgia, serif',
                  fontSize: '1.4rem',
                  fontWeight: 400,
                  marginBottom: 8,
                  display: 'flex', alignItems: 'center', gap: 10,
                }}>
                  <span style={{ fontSize: '1.6rem' }}>{tpl.emoji}</span> {tpl.name}
                </h2>
                <p className="template-desc" style={{
                  fontFamily: 'var(--font-sans)',
                  fontSize: '0.82rem',
                  color: 'rgba(255,248,240,0.65)',
                  lineHeight: 1.45,
                }}>
                  {tpl.desc}
                </p>
              </div>

              {/* Footer row with highlights / interactive select button */}
              <div style={{ zIndex: 2, display: 'flex', justifyContent: 'space-between', alignItems: 'center', width: '100%', gap: 8 }}>
                {/* Feature tags */}
                <div className="template-features" style={{ display: 'flex', gap: 6 }}>
                  {tpl.features.map((f, idx) => (
                    <span key={idx} style={{ fontSize: '0.62rem', color: 'rgba(251, 230, 190, 0.45)', border: '1px solid rgba(255,255,255,0.05)', padding: '2px 6px', borderRadius: 4 }}>
                      {f}
                    </span>
                  ))}
                </div>

                {/* CTAs */}
                <div style={{ display: 'flex', gap: 8 }}>
                  <motion.button
                    onClick={(e) => openPreview(e, tpl.previewUrl)}
                    whileHover={{ scale: 1.05 }}
                    style={{
                      padding: '8px 14px',
                      borderRadius: 100,
                      background: isHovered ? 'rgba(255, 255, 255, 0.08)' : 'transparent',
                      color: isHovered ? '#C9A84C' : 'rgba(255, 248, 240, 0.8)',
                      fontSize: '0.72rem',
                      fontWeight: 500,
                      cursor: 'pointer',
                      border: isHovered ? `1px solid ${tpl.glowColor}` : '1px solid rgba(255,255,255,0.15)',
                      boxShadow: isHovered ? `0 0 10px ${tpl.glowColor}` : 'none',
                      transition: 'all 0.2s',
                    }}
                  >
                    {locale === 'hi' ? 'डेमो' : 'Preview'}
                  </motion.button>

                  <motion.div
                    animate={isHovered ? { scale: 1.05 } : { scale: 1 }}
                    style={{
                      padding: '8px 16px',
                      borderRadius: 100,
                      background: isHovered ? '#C9A84C' : 'rgba(255,255,255,0.05)',
                      color: isHovered ? '#080408' : '#FFF8F0',
                      fontSize: '0.72rem',
                      fontWeight: 600,
                      textTransform: 'uppercase',
                      letterSpacing: '0.05em',
                      border: isHovered ? '1px solid #C9A84C' : '1px solid rgba(255,255,255,0.1)',
                      boxShadow: isHovered ? `0 0 15px ${tpl.glowColor}` : 'none',
                      transition: 'all 0.3s ease',
                    }}
                  >
                    {locale === 'hi' ? 'चुनें' : 'Select'}
                  </motion.div>
                </div>
              </div>
            </motion.div>
          );
        })}
      </div>

      {/* Interactive Modal showing template live demo preview */}
      <AnimatePresence>
        {previewTemplateId && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            style={{
              position: 'fixed', inset: 0,
              background: 'rgba(8, 4, 8, 0.88)',
              backdropFilter: 'blur(12px)',
              WebkitBackdropFilter: 'blur(12px)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              zIndex: 999,
              padding: 16
            }}
          >
            {/* Modal Box */}
            <motion.div
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.9, y: 20 }}
              style={{
                width: '100%',
                maxWidth: 380,
                display: 'flex', flexDirection: 'column',
                alignItems: 'center',
              }}
            >
              {/* Close Button Header */}
              <div style={{ width: '100%', display: 'flex', justifyContent: 'flex-end', marginBottom: 12 }}>
                <button
                  onClick={() => setPreviewTemplateId(null)}
                  style={{
                    background: 'rgba(255,255,255,0.08)',
                    border: '1px solid rgba(255,255,255,0.15)',
                    color: '#fff',
                    borderRadius: '50%',
                    width: 38, height: 38,
                    fontSize: '1.2rem',
                    cursor: 'pointer',
                    display: 'flex', alignItems: 'center', justifyContent: 'center'
                  }}
                >
                  ✕
                </button>
              </div>

              {/* Mobile device frame casing */}
              <div style={{
                width: '100%',
                aspectRatio: '9/19',
                maxHeight: '74vh',
                border: '10px solid #1a1a1a',
                borderRadius: 36,
                boxShadow: '0 25px 50px rgba(0,0,0,0.8), 0 0 40px rgba(201,168,76,0.15)',
                background: '#000',
                overflow: 'hidden',
                position: 'relative'
              }}>
                {/* Notch */}
                <div style={{
                  position: 'absolute', top: 0, left: '50%', transform: 'translateX(-50%)',
                  width: 100, height: 18, background: '#1a1a1a', borderRadius: '0 0 12px 12px',
                  zIndex: 1000
                }} />
                
                <iframe
                  src={previewTemplateId}
                  style={{ width: '100%', height: '100%', border: 'none', background: '#000' }}
                  title="Live Template Preview"
                />
              </div>
              <p style={{ marginTop: 12, fontSize: '0.78rem', color: 'rgba(201,168,76,0.6)', textTransform: 'uppercase', letterSpacing: '0.1em' }}>
                {locale === 'hi' ? 'लाइव प्रीव्यू · टैप करके अनुभव करें' : 'LIVE TRIAL · TAP TO INTERACT'}
              </p>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
