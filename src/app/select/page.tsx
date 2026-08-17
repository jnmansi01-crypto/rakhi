'use client';
// src/app/select/page.tsx
// Premium Template Selector page prompting the sender to select Template 1 or 2.

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { useHaptics } from '@/shared/components/useHaptics';
import { trackSelectItem } from '@/core/payments/analytics';

export default function SelectTemplatePage() {
  const router = useRouter();
  const { vibrate } = useHaptics();
  const [locale, setLocale] = useState<'en' | 'hi'>('en');
  const [hoveredId, setHoveredId] = useState<string | null>(null);
  const [previewTemplateId, setPreviewTemplateId] = useState<string | null>(null);

  const [previewTab, setPreviewTab] = useState<'sibling' | 'creation'>('sibling');

  useEffect(() => {
    document.body.classList.add('sender-flow');
    return () => {
      document.body.classList.remove('sender-flow');
    };
  }, []);

  const templates = [
    {
      id: 'rakhi-2025',
      name: locale === 'hi' ? 'शाही परंपरा' : 'Royal Classic',
      desc: locale === 'hi' ? 'पारंपरिक सिल्क राखी, शुभ रोली-अक्षत और मधुर संगीत का अनुभव।' : 'Sacred thread tying, royal crimson silk, and traditional Santoor BGM.',
      visual: 'linear-gradient(135deg, #4a1525 0%, #8a1c14 100%)',
      glowColor: 'rgba(232, 117, 26, 0.45)', // orange-gold glow
      badge: locale === 'hi' ? 'क्लासिक' : 'Sacred & Classic',
      price: '299',
      features: locale === 'hi' ? ['पारंपरिक संगीत', '3D रेशमी राखी'] : ['Traditional BGM', '3D Silk Rakhi'],
      previewUrl: '/gift/demo-royal?preview=true&template=rakhi-2025',
    },
    {
      id: 'template-02',
      name: locale === 'hi' ? 'यादों का एल्बम' : 'Nostalgia Scrapbook',
      desc: locale === 'hi' ? 'सुतली से बंधा पार्सल, पुरानी कैसेट धुन और यादों का पर्सनल स्क्रैपबुक।' : 'Handwritten letter, retro music tape, polaroids, and surprise gift parcel.',
      visual: 'linear-gradient(135deg, #2b1f1d 0%, #5c4033 100%)',
      glowColor: 'rgba(199, 151, 116, 0.45)', // cardstock wood glow
      badge: locale === 'hi' ? 'यादें' : 'Warm & Nostalgic',
      price: '250',
      features: locale === 'hi' ? ['स्क्रैपबुक डायरी', 'रोली चावल अक्षत'] : ['Scrapbook Theme', '3D Roli & Chawal'],
      previewUrl: '/gift/demo-scrapbook?preview=true&template=template-02',
    }
  ];

  const handleSelect = (id: string) => {
    vibrate();
    trackSelectItem(id);
    router.push(`/create?template=${id}`);
  };

  const openPreview = (e: React.MouseEvent, url: string) => {
    e.stopPropagation();
    vibrate();
    setPreviewTab('sibling');
    setPreviewTemplateId(url);
  };

  return (
    <div className="select-page-container" style={{
      minHeight: '100vh',
      background: '#080408',
      backgroundImage: 'radial-gradient(circle at center, #160a16 0%, #070307 100%)',
      color: '#FFF8F0',
      display: 'flex', flexDirection: 'column',
      alignItems: 'center', justifyContent: 'center',
      padding: '40px 24px',
      overflowX: 'hidden',
    }}>
      {/* Brand Header */}
      <div style={{
        position: 'absolute', top: 24, left: 24,
        display: 'flex', alignItems: 'center', gap: 8,
        zIndex: 10,
      }}>
        <img src="/images/loment-logo.svg" alt="Loment Logo" style={{ width: 24, height: 24, objectFit: 'contain' }} />
        <span style={{ fontFamily: 'var(--font-sans)', fontWeight: 600, fontSize: '0.95rem', color: '#FFF8F0', letterSpacing: '0.08em', textTransform: 'uppercase' }}>
          Loment
        </span>
      </div>

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
            ? 'चुनें कि इस राखी आप अपने भाई या बहन को कैसे सरप्राइज देना चाहते हैं।'
            : 'Choose how you want to surprise your sibling this Rakhi.'}
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
            .select-page-container {
              justify-content: flex-start !important;
              padding-top: 110px !important;
              padding-bottom: 60px !important;
              overflow-y: auto !important;
              height: auto !important;
              min-height: 100dvh !important;
            }
            /* Make header elements sticky or appropriately padded on mobile */
            .select-page-container > div:first-of-type {
              position: fixed !important;
              top: 0 !important;
              left: 0 !important;
              right: 0 !important;
              background: rgba(8,4,8,0.92) !important;
              backdrop-filter: blur(12px) !important;
              WebkitBackdropFilter: blur(12px) !important;
              padding: 20px 24px !important;
              border-bottom: 1px solid rgba(251, 230, 190, 0.08) !important;
              width: 100% !important;
              box-sizing: border-box !important;
              z-index: 100 !important;
            }
            .select-page-container > button {
              position: fixed !important;
              top: 18px !important;
              right: 24px !important;
              margin: 0 !important;
              z-index: 110 !important;
            }
            .template-grid-wrapper {
              flex-direction: column !important;
              align-items: center !important;
              gap: 24px !important;
              margin-top: 10px !important;
            }
            .template-square-card {
              aspect-ratio: auto !important;
              min-height: 160px !important;
              padding: 24px 20px !important;
              max-width: 100% !important;
              width: 100% !important;
            }
            .template-title {
              font-size: 1.25rem !important;
            }
            .template-desc {
              font-size: 0.82rem !important;
              display: block !important;
              line-height: 1.5 !important;
              margin: 12px 0 20px !important;
            }
            .template-badge {
              font-size: 0.65rem !important;
              padding: 4px 10px !important;
            }
            .template-price {
              font-size: 0.85rem !important;
              padding: 4px 12px !important;
            }
            .template-features {
              display: none !important;
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
                  : '1.5px solid rgba(201,168,76,0.25)',
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
                opacity: isHovered ? 0.22 : 0.08,
                transition: 'opacity 0.4s ease',
                pointerEvents: 'none',
                zIndex: 0,
              }} />

              {/* Upper Header Row */}
              <div style={{ zIndex: 2, display: 'flex', justifyContent: 'space-between', alignItems: 'center', width: '100%' }}>
                <span className="template-badge" style={{
                  background: 'rgba(201,168,76,0.12)',
                  border: '1px solid rgba(201,168,76,0.35)',
                  color: '#C9A84C',
                  borderRadius: 20,
                  padding: '4px 10px',
                  fontSize: '0.65rem',
                  fontWeight: 600,
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
                  {getSelectPageIcon(tpl.id)} {tpl.name}
                </h2>
                <p className="template-desc" style={{
                  fontFamily: 'var(--font-sans)',
                  fontSize: '0.82rem',
                  color: 'rgba(255,248,240,0.7)',
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
                    <span key={idx} style={{ fontSize: '0.62rem', color: 'rgba(251, 230, 190, 0.55)', border: '1px solid rgba(255,255,255,0.08)', padding: '2px 6px', borderRadius: 4 }}>
                      {f}
                    </span>
                  ))}
                </div>

                {/* CTAs - Prominent & Touch-Friendly for Mobile */}
                <div style={{ display: 'flex', gap: 8, zIndex: 3 }}>
                  <motion.button
                    onClick={(e) => openPreview(e, tpl.previewUrl)}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    style={{
                      padding: '8px 16px',
                      borderRadius: 100,
                      background: 'rgba(201,168,76,0.12)',
                      color: '#C9A84C',
                      fontSize: '0.78rem',
                      fontWeight: 600,
                      cursor: 'pointer',
                      border: '1px solid rgba(201,168,76,0.4)',
                      boxShadow: '0 2px 10px rgba(0,0,0,0.3)',
                      transition: 'all 0.2s',
                    }}
                  >
                    {locale === 'hi' ? 'डेमो' : 'Preview'}
                  </motion.button>

                  <motion.button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleSelect(tpl.id);
                    }}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    style={{
                      padding: '8px 18px',
                      borderRadius: 100,
                      background: 'linear-gradient(135deg, #C9A84C 0%, #A37C1E 100%)',
                      color: '#080408',
                      fontSize: '0.78rem',
                      fontWeight: 700,
                      textTransform: 'uppercase',
                      letterSpacing: '0.05em',
                      border: '1px solid #E5C97A',
                      boxShadow: '0 4px 15px rgba(201,168,76,0.35)',
                      cursor: 'pointer',
                      transition: 'all 0.2s ease',
                    }}
                  >
                    {locale === 'hi' ? 'चुनें' : 'Select'}
                  </motion.button>
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
              background: 'rgba(8, 4, 8, 0.92)',
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
                maxWidth: 390,
                display: 'flex', flexDirection: 'column',
                alignItems: 'center',
              }}
            >
              {/* Header with Segmented Tabs & Close button */}
              <div style={{
                width: '100%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                marginBottom: 12,
                gap: 8,
              }}>
                {/* Segmented Tab Bar */}
                <div style={{
                  display: 'flex',
                  background: 'rgba(255,255,255,0.06)',
                  borderRadius: 100,
                  padding: 3,
                  border: '1px solid rgba(201,168,76,0.3)',
                }}>
                  <button
                    onClick={() => setPreviewTab('sibling')}
                    style={{
                      padding: '6px 14px',
                      borderRadius: 100,
                      border: 'none',
                      background: previewTab === 'sibling' ? 'linear-gradient(135deg, #C9A84C, #A37C1E)' : 'transparent',
                      color: previewTab === 'sibling' ? '#080408' : 'rgba(255,248,240,0.85)',
                      fontWeight: 600,
                      fontSize: '0.74rem',
                      cursor: 'pointer',
                      transition: 'all 0.2s',
                    }}
                  >
                    {locale === 'hi' ? 'भाई/बहन दृश्य 🌸' : 'Sibling View 🌸'}
                  </button>
                  <button
                    onClick={() => setPreviewTab('creation')}
                    style={{
                      padding: '6px 14px',
                      borderRadius: 100,
                      border: 'none',
                      background: previewTab === 'creation' ? 'linear-gradient(135deg, #C9A84C, #A37C1E)' : 'transparent',
                      color: previewTab === 'creation' ? '#080408' : 'rgba(255,248,240,0.85)',
                      fontWeight: 600,
                      fontSize: '0.74rem',
                      cursor: 'pointer',
                      transition: 'all 0.2s',
                    }}
                  >
                    {locale === 'hi' ? 'बनाने के चरण ✏️' : 'Creation Steps ✏️'}
                  </button>
                </div>

                {/* Close Button */}
                <button
                  onClick={() => setPreviewTemplateId(null)}
                  style={{
                    background: 'rgba(255,255,255,0.08)',
                    border: '1px solid rgba(255,255,255,0.15)',
                    color: '#fff',
                    borderRadius: '50%',
                    width: 36, height: 36,
                    fontSize: '1.1rem',
                    cursor: 'pointer',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    flexShrink: 0,
                  }}
                >
                  ✕
                </button>
              </div>

              {/* Mobile device frame casing */}
              <div style={{
                width: '100%',
                aspectRatio: '9/19',
                maxHeight: '72vh',
                border: '10px solid #1a1a1a',
                borderRadius: 36,
                boxShadow: '0 25px 50px rgba(0,0,0,0.8), 0 0 40px rgba(201,168,76,0.15)',
                background: '#080408',
                overflow: 'hidden',
                position: 'relative'
              }}>
                {/* Notch */}
                <div style={{
                  position: 'absolute', top: 0, left: '50%', transform: 'translateX(-50%)',
                  width: 100, height: 18, background: '#1a1a1a', borderRadius: '0 0 12px 12px',
                  zIndex: 1000
                }} />

                {previewTab === 'sibling' ? (
                  <iframe
                    src={previewTemplateId}
                    style={{ width: '100%', height: '100%', border: 'none', background: '#000' }}
                    title="Live Template Preview"
                  />
                ) : (
                  /* Creation Flow Steps Walkthrough */
                  <div style={{
                    width: '100%', height: '100%',
                    padding: '36px 18px 20px',
                    overflowY: 'auto',
                    display: 'flex', flexDirection: 'column', gap: 14,
                    color: '#FFF8F0',
                    fontFamily: 'var(--font-sans)',
                  }}>
                    <div style={{ textAlign: 'center', marginBottom: 2 }}>
                      <span style={{ fontSize: '0.68rem', color: '#C9A84C', letterSpacing: '0.12em', textTransform: 'uppercase', fontWeight: 600 }}>
                        {locale === 'hi' ? '6 आसान चरण' : '6 SIMPLE CREATION STEPS'}
                      </span>
                      <h3 style={{ fontFamily: 'Georgia, serif', fontSize: '1.2rem', margin: '4px 0 2px', fontWeight: 400 }}>
                        {locale === 'hi' ? 'अपना गिफ्ट कैसे बनाएं' : 'How You Create This Gift'}
                      </h3>
                      <p style={{ fontSize: '0.75rem', color: 'rgba(255,248,240,0.6)', margin: 0 }}>
                        {locale === 'hi' ? 'केवल 2 मिनट में पूरा करें' : 'Takes less than 2 minutes'}
                      </p>
                    </div>

                    {/* Step Cards List */}
                    {[
                      {
                        num: '1',
                        icon: '🏷️',
                        title: locale === 'hi' ? 'नाम दर्ज करें' : 'Names & Language',
                        desc: locale === 'hi' ? 'अपना और अपने भाई/बहन का नाम लिखें (अंग्रेजी या हिन्दी)।' : 'Add your name & sibling’s name in English or Devanagari.',
                      },
                      {
                        num: '2',
                        icon: '💌',
                        title: locale === 'hi' ? 'प्यार भरा पत्र' : 'Personal Letter',
                        desc: locale === 'hi' ? '3 भावुक टेम्पलेट्स में से चुनें या अपना संदेश लिखें।' : 'Pick from 3 pre-written emotional templates or write custom.',
                      },
                      {
                        num: '3',
                        icon: '📷',
                        title: locale === 'hi' ? 'यादों की फ़ोटो' : 'Memories & Photos',
                        desc: locale === 'hi' ? '5 फ़ोटो तक अपलोड करें जो 3D पोलरॉइड एल्बम बनती हैं।' : 'Upload up to 5 photos transformed into 3D scrapbook polaroids.',
                      },
                      {
                        num: '4',
                        icon: '🎙️',
                        title: locale === 'hi' ? 'आवाज़ रिकॉर्ड करें' : 'Voice Message',
                        desc: locale === 'hi' ? 'अपनी आवाज में बधाई संदेश रिकॉर्ड करें (वैकल्पिक)।' : 'Record a personal audio note in your voice (optional).',
                      },
                      {
                        num: '5',
                        icon: '🎁',
                        title: locale === 'hi' ? 'डिजिटल शगुन' : 'Digital Shagun / Gift',
                        desc: locale === 'hi' ? 'अमेज़न वाउचर, पैसे, कूपन या सीक्रेट मैसेज जोड़ें।' : 'Attach Amazon Vouchers, UPI money, Coupons, or Secret Messages.',
                      },
                      {
                        num: '6',
                        icon: '🚀',
                        title: locale === 'hi' ? 'पूर्वावलोकन और साझा करें' : 'Instant Link & Share',
                        desc: locale === 'hi' ? 'व्हाट्सएप पर तुरंत एक क्लिक में लिंक भेजें।' : 'Generate an interactive keepsake link & share on WhatsApp.',
                      },
                    ].map((st) => (
                      <div key={st.num} style={{
                        background: 'rgba(255,255,255,0.03)',
                        border: '1px solid rgba(201,168,76,0.18)',
                        borderRadius: 14,
                        padding: '12px 14px',
                        display: 'flex',
                        gap: 12,
                        alignItems: 'flex-start',
                      }}>
                        <div style={{
                          width: 32, height: 32, borderRadius: 10,
                          background: 'rgba(201,168,76,0.12)',
                          border: '1px solid rgba(201,168,76,0.3)',
                          display: 'flex', alignItems: 'center', justifyContent: 'center',
                          fontSize: '1rem', flexShrink: 0,
                        }}>
                          {st.icon}
                        </div>
                        <div style={{ flex: 1 }}>
                          <h4 style={{ fontSize: '0.82rem', margin: 0, color: '#FFF8F0', fontWeight: 600 }}>
                            {st.num}. {st.title}
                          </h4>
                          <p style={{ fontSize: '0.72rem', margin: '4px 0 0', color: 'rgba(255,248,240,0.65)', lineHeight: 1.4 }}>
                            {st.desc}
                          </p>
                        </div>
                      </div>
                    ))}

                    {/* Action Button inside modal */}
                    <button
                      onClick={() => {
                        const targetId = previewTemplateId.includes('template-02') ? 'template-02' : 'rakhi-2025';
                        setPreviewTemplateId(null);
                        handleSelect(targetId);
                      }}
                      style={{
                        marginTop: 6,
                        marginBottom: 10,
                        padding: '14px',
                        borderRadius: 12,
                        background: 'linear-gradient(135deg, #C9A84C 0%, #A37C1E 100%)',
                        color: '#080408',
                        fontWeight: 700,
                        fontSize: '0.85rem',
                        border: 'none',
                        cursor: 'pointer',
                        boxShadow: '0 4px 15px rgba(201,168,76,0.35)',
                        textAlign: 'center',
                      }}
                    >
                      {locale === 'hi' ? 'यह उपहार बनाना शुरू करें →' : 'Start Creating This Card →'}
                    </button>
                  </div>
                )}
              </div>

              <p style={{ marginTop: 10, fontSize: '0.75rem', color: 'rgba(201,168,76,0.6)', textTransform: 'uppercase', letterSpacing: '0.08em' }}>
                {previewTab === 'sibling'
                  ? (locale === 'hi' ? 'लाइव अनुभव · टैप करके देखें' : 'LIVE EXPERIENCE · INTERACT BELOW')
                  : (locale === 'hi' ? 'बनाने के आसान चरण' : 'STEP-BY-STEP BUILDER PREVIEW')}
              </p>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

function getSelectPageIcon(tplId: string) {
  if (tplId === 'rakhi-2025') {
    return (
      <svg width="24" height="24" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
        <line x1="2" y1="16" x2="30" y2="16" stroke="#c84040" strokeWidth="2.5" strokeDasharray="3 3" />
        <line x1="2" y1="16" x2="30" y2="16" stroke="#d4af37" strokeWidth="1.2" strokeDasharray="1.5 4.5" />
        <circle cx="16" cy="16" r="7" fill="#d4af37" stroke="#a37c1e" strokeWidth="1.2" />
        <circle cx="16" cy="16" r="4" fill="#a12c2c" />
        <circle cx="16" cy="16" r="1.8" fill="#fdf0a0" />
      </svg>
    );
  } else if (tplId === 'template-02') {
    return (
      <svg width="24" height="24" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
        <rect x="6" y="5" width="20" height="22" rx="2" fill="#faf8f5" stroke="#d1c4b2" strokeWidth="1.5" />
        <rect x="9" y="8" width="14" height="13" fill="#3a312d" />
        <path d="M 11 20 A 3 3 0 0 1 17 20" fill="#c79774" opacity="0.8" />
        <circle cx="14" cy="14" r="2" fill="#c79774" />
      </svg>
    );
  }
  return null;
}
