'use client';
import { useState } from 'react';
import { useSearchParams } from 'next/navigation';
import { motion } from 'framer-motion';
import { Suspense } from 'react';
import { trackShare } from '@/core/payments/analytics';

export default function SuccessPage() {
  return (
    <Suspense fallback={
      <div style={{
        minHeight: '100vh', background: '#080408', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#FFF8F0', fontFamily: 'var(--font-sans)'
      }}>
        Loading...
      </div>
    }>
      <SuccessPageContent />
    </Suspense>
  );
}

function SuccessPageContent() {
  const searchParams = useSearchParams();
  const cardId = searchParams.get('cardId') || '';
  const locale = searchParams.get('locale') || 'en';
  const templateId = searchParams.get('template') || 'template-01';
  const [copied, setCopied] = useState(false);

  const shareUrl = typeof window !== 'undefined' ? `${window.location.origin}/gift/${cardId}` : '';

  const fullMessage = locale === 'hi'
    ? `थोड़ी नोक-झोंक, ढेर सारा प्यार! 🤫✨ आपके लिए एक खास डिजिटल राखी सरप्राइज बनाया है।\n\nअपना सरप्राइज खोलने के लिए यहाँ टैप करें:\n${shareUrl}`
    : `No siblings were harmed making this, but core memories were unlocked! 🤫✨ I created a custom digital Rakhi experience just for you.\n\nTap to open your surprise:\n${shareUrl}`;

  const share = () => {
    if (!shareUrl) return;
    const isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);

    if (navigator.share && window.isSecureContext) {
      navigator.share({ 
        title: 'Your Digital Rakhi Surprise 🌸', 
        text: fullMessage,
      })
      .then(() => {
        trackShare(templateId);
      })
      .catch(() => {});
    } else {
      trackShare(templateId);
      if (isMobile) {
        window.location.href = `whatsapp://send?text=${encodeURIComponent(fullMessage)}`;
      } else {
        window.open(`https://web.whatsapp.com/send?text=${encodeURIComponent(fullMessage)}`, '_blank');
      }
    }
  };

  const copyLink = () => {
    if (!shareUrl) return;
    navigator.clipboard.writeText(shareUrl).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2400);
    }).catch(() => {});
  };

  // ── Template 02 (Nostalgia Scrapbook) Success & Share View ──
  if (templateId === 'template-02') {
    return (
      <div style={{
        minHeight: '100vh',
        background: '#18110f',
        backgroundImage: 'radial-gradient(circle at center, #2b1b18 0%, #100a09 100%)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: 24,
        fontFamily: 'system-ui, -apple-system, sans-serif',
        color: '#2c221e',
      }}>
        <motion.div
          initial={{ scale: 0.92, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.6, ease: [0.25, 1, 0.5, 1] }}
          style={{
            width: '100%',
            maxWidth: 440,
            background: '#faf6ee',
            borderRadius: 24,
            padding: '32px 24px',
            textAlign: 'center',
            boxShadow: '0 25px 60px rgba(0,0,0,0.65), inset 0 0 30px rgba(199,151,116,0.15)',
            border: '1px solid rgba(199,151,116,0.4)',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: 24,
            position: 'relative',
          }}
        >
          {/* Inner cardstock border */}
          <div style={{
            position: 'absolute', inset: 12,
            border: '1px solid rgba(199,151,116,0.3)',
            borderRadius: 16,
            pointerEvents: 'none',
          }} />

          {/* Top Washi Tape Decorator */}
          <div style={{
            position: 'absolute',
            top: -10,
            left: '50%',
            transform: 'translateX(-50%) rotate(-1deg)',
            width: 110,
            height: 22,
            background: 'rgba(212, 175, 55, 0.45)',
            border: '1px dashed rgba(166, 99, 59, 0.5)',
            borderRadius: 2,
            boxShadow: '0 2px 6px rgba(0,0,0,0.15)',
            zIndex: 10,
          }} />

          {/* 3D Tactile Scrapbook Album Illustration */}
          <motion.div
            initial={{ y: 15, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.7, delay: 0.2 }}
            style={{
              position: 'relative',
              width: 140,
              height: 140,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              marginTop: 8,
            }}
          >
            {/* 3D Scrapbook Cover Graphic */}
            <div style={{
              width: 110,
              height: 128,
              background: 'linear-gradient(135deg, #a6633b 0%, #6e3d23 100%)',
              borderRadius: '6px 14px 14px 6px',
              boxShadow: '0 12px 30px rgba(0,0,0,0.35)',
              position: 'relative',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              borderLeft: '5px solid #4a2714',
            }}>
              {/* Gold Spine Rings */}
              <div style={{
                position: 'absolute', left: 4, top: 12, bottom: 12, width: 4,
                display: 'flex', flexDirection: 'column', justifyContent: 'space-around',
              }}>
                {Array.from({ length: 5 }).map((_, i) => (
                  <div key={i} style={{ width: 8, height: 4, background: '#ffd700', borderRadius: 2, transform: 'translateX(-4px)' }} />
                ))}
              </div>

              {/* Photo Frame Peek */}
              <div style={{
                width: 68, height: 54, background: '#fff', padding: 4,
                borderRadius: 4, boxShadow: '0 4px 10px rgba(0,0,0,0.2)',
                transform: 'rotate(-4deg)', marginBottom: 8,
              }}>
                <div style={{ width: '100%', height: '100%', background: '#e5d9c5', borderRadius: 2, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 18 }}>
                  📸
                </div>
              </div>

              {/* Gold Wax Seal Stamp */}
              <div style={{
                width: 32, height: 32, borderRadius: '50%',
                background: 'linear-gradient(135deg, #d4af37, #997515)',
                boxShadow: '0 3px 8px rgba(0,0,0,0.4)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                color: '#fff', fontSize: 14, fontWeight: 'bold',
              }}>
                🧵
              </div>
            </div>

            {/* Floating Sparkles Badge */}
            <div style={{
              position: 'absolute',
              bottom: 0, right: 12,
              background: '#ffffff',
              border: '1px solid #d4af37',
              borderRadius: 20,
              padding: '3px 10px',
              fontSize: '0.65rem',
              color: '#8a5330',
              fontWeight: 700,
              letterSpacing: '0.05em',
              boxShadow: '0 4px 10px rgba(0,0,0,0.15)',
              transform: 'rotate(4deg)',
            }}>
              SCRAPBOOK SEALED ✨
            </div>
          </motion.div>

          {/* Header Typography */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 6, zIndex: 5 }}>
            <h2 style={{
              fontFamily: "'Playfair Display', Georgia, serif",
              fontSize: '1.45rem',
              color: '#2b231d',
              fontWeight: 700,
              margin: 0,
              lineHeight: 1.25,
            }}>
              {locale === 'hi'
                ? 'आपकी यादों की स्क्रैपबुक तैयार है! ✨'
                : 'Your Memories Are Wrapped & Sealed! ✨'}
            </h2>
            <p style={{
              fontFamily: 'system-ui, sans-serif',
              fontSize: '0.86rem',
              color: '#7a5a40',
              margin: 0,
              lineHeight: 1.45,
            }}>
              {locale === 'hi'
                ? 'नोक-झोंक और प्यार से सजा यह सरप्राइज आपके सिबलिंग के लिए तैयार है।'
                : 'No siblings were harmed, but core memories are unlocked and ready to be shared! 🤫'}
            </p>
          </div>

          {/* Action Buttons */}
          <div style={{ width: '100%', display: 'flex', flexDirection: 'column', gap: 10, zIndex: 5 }}>
            {/* Primary Share WhatsApp / Web Share Button */}
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.97 }}
              onClick={share}
              style={{
                width: '100%',
                background: 'linear-gradient(135deg, #a6633b 0%, #6e3d23 100%)',
                border: 'none',
                color: '#ffffff',
                fontWeight: 700,
                fontSize: '0.96rem',
                padding: '15px 20px',
                borderRadius: 30,
                cursor: 'pointer',
                boxShadow: '0 8px 20px rgba(110,61,35,0.4)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: 8,
                letterSpacing: '0.02em',
              }}
            >
              <span>{locale === 'hi' ? 'व्हाट्सएप पर शेयर करें 🚀' : 'Share Surprise on WhatsApp 🚀'}</span>
            </motion.button>

            {/* Secondary Copy Link Button */}
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.97 }}
              onClick={copyLink}
              style={{
                width: '100%',
                background: copied ? 'rgba(46, 125, 50, 0.1)' : 'rgba(166, 99, 59, 0.08)',
                border: copied ? '1.5px solid #2e7d32' : '1.5px solid rgba(166, 99, 59, 0.3)',
                color: copied ? '#2e7d32' : '#6e3d23',
                fontWeight: 700,
                fontSize: '0.88rem',
                padding: '12px 18px',
                borderRadius: 30,
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: 6,
                transition: 'all 0.2s ease',
              }}
            >
              <span>{copied ? (locale === 'hi' ? 'लिंक कॉपी हो गया! ✅' : 'Link Copied to Clipboard! ✅') : (locale === 'hi' ? 'कॉपी लिंक 📋' : 'Copy Share Link 📋')}</span>
            </motion.button>

            {/* Preview Gift Link */}
            {cardId && (
              <a
                href={shareUrl}
                target="_blank"
                rel="noopener noreferrer"
                style={{
                  fontSize: '0.78rem',
                  color: '#9e7354',
                  fontWeight: 600,
                  textDecoration: 'underline',
                  marginTop: 4,
                  display: 'inline-block',
                }}
              >
                {locale === 'hi' ? 'अपनी बनाई स्क्रैपबुक देखें 👁️' : 'Preview your created scrapbook 👁️'}
              </a>
            )}
          </div>
        </motion.div>
      </div>
    );
  }

  // ── Template 01 (Traditional Royal Gift Box) View — Kept Intact ──
  return (
    <div style={{
      minHeight: '100vh',
      background: 'radial-gradient(ellipse at 55% 15%, #2A0D1E 0%, #160818 50%, #080408 100%)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: 24,
      fontFamily: 'var(--font-sans)',
      color: '#FFF8F0',
    }}>
      <div style={{
        width: '100%',
        maxWidth: 440,
        background: 'rgba(255, 255, 255, 0.03)',
        border: '1px solid rgba(201,168,76,0.15)',
        borderRadius: 28,
        padding: '36px 24px',
        textAlign: 'center',
        boxShadow: '0 20px 50px rgba(0,0,0,0.55)',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: 28,
      }}>
        {/* Ornate Open Premium Gift Box Illustration */}
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.8, ease: 'easeOut' }}
          style={{
            position: 'relative',
            width: 180,
            height: 180,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <svg width="180" height="180" viewBox="0 0 180 180">
            <defs>
              <linearGradient id="goldGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#FFF2B2" />
                <stop offset="30%" stopColor="#D4AF37" />
                <stop offset="70%" stopColor="#AA7C11" />
                <stop offset="100%" stopColor="#5A3F05" />
              </linearGradient>

              <linearGradient id="boxExterior" x1="0%" y1="0%" x2="0%" y2="100%">
                <stop offset="0%" stopColor="#D45B27" />
                <stop offset="100%" stopColor="#8A2C0D" />
              </linearGradient>

              <radialGradient id="boxInterior" cx="50%" cy="50%" r="50%">
                <stop offset="0%" stopColor="#B31919" />
                <stop offset="100%" stopColor="#5E0606" />
              </radialGradient>

              <linearGradient id="glassLid" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="rgba(255, 255, 255, 0.25)" />
                <stop offset="40%" stopColor="rgba(255, 255, 255, 0.05)" />
                <stop offset="100%" stopColor="rgba(255, 255, 255, 0.15)" />
              </linearGradient>

              <radialGradient id="roliPowder" cx="35%" cy="30%" r="70%">
                <stop offset="0%" stopColor="#FF4136" />
                <stop offset="70%" stopColor="#B30000" />
                <stop offset="100%" stopColor="#5E0000" />
              </radialGradient>
              <radialGradient id="riceGrain" cx="30%" cy="30%" r="70%">
                <stop offset="0%" stopColor="#FFFFFF" />
                <stop offset="70%" stopColor="#F9F8F0" />
                <stop offset="100%" stopColor="#DCD9C0" />
              </radialGradient>

              <filter id="shadow" x="-10%" y="-10%" width="120%" height="120%">
                <feDropShadow dx="0" dy="8" stdDeviation="6" floodOpacity="0.4" />
              </filter>
            </defs>

            <ellipse cx="90" cy="148" rx="60" ry="12" fill="rgba(0,0,0,0.5)" filter="url(#shadow)" />
            <path d="M 30 115 L 30 135 C 30 142, 150 142, 150 135 L 150 115 Z" fill="url(#boxExterior)" stroke="url(#goldGrad)" strokeWidth="1.5" />
            <ellipse cx="90" cy="115" rx="58" ry="18" fill="url(#boxInterior)" stroke="url(#goldGrad)" strokeWidth="1.5" />

            <path d="M 42 118 Q 70 128, 90 120 T 138 114" fill="none" stroke="#E84A4A" strokeWidth="2.5" strokeLinecap="round" />
            <path d="M 42 120 Q 70 130, 90 122 T 138 116" fill="none" stroke="#FFF2B2" strokeWidth="1.2" strokeLinecap="round" strokeDasharray="3 3" />

            <g transform="translate(90, 118)">
              <circle cx="0" cy="0" r="16" fill="url(#goldGrad)" filter="url(#shadow)" />
              <circle cx="0" cy="0" r="10" fill="#B31919" />
              <circle cx="0" cy="0" r="6" fill="url(#goldGrad)" />
              <circle cx="0" cy="0" r="3" fill="#D4AF37" />
              {Array.from({ length: 8 }).map((_, i) => {
                const angle = (i * Math.PI) / 4;
                const x = 12 * Math.cos(angle);
                const y = 12 * Math.sin(angle);
                return <circle key={i} cx={x} cy={y} r="1.5" fill="#FFF" />;
              })}
            </g>

            <g transform="translate(58, 106)" filter="url(#shadow)">
              <ellipse cx="0" cy="10" rx="13" ry="7" fill="url(#goldGrad)" />
              <ellipse cx="0" cy="8" rx="11" ry="5.5" fill="url(#roliPowder)" />
              <ellipse cx="-1" cy="7" rx="6" ry="3" fill="#FF7272" opacity="0.6" />
            </g>

            <g transform="translate(122, 106)" filter="url(#shadow)">
              <ellipse cx="0" cy="10" rx="13" ry="7" fill="url(#goldGrad)" />
              <ellipse cx="0" cy="8" rx="11" ry="5.5" fill="rgba(255, 255, 255, 0.1)" stroke="rgba(255,255,255,0.2)" />
              <ellipse cx="-4" cy="8" rx="3.5" ry="1.2" fill="url(#riceGrain)" transform="rotate(-15 -4 8)" />
              <ellipse cx="2" cy="7" rx="3.5" ry="1.2" fill="url(#riceGrain)" transform="rotate(30 2 7)" />
              <ellipse cx="-1" cy="9" rx="3.5" ry="1.2" fill="url(#riceGrain)" transform="rotate(75 -1 9)" />
              <ellipse cx="4" cy="9" rx="3.0" ry="1.0" fill="url(#riceGrain)" transform="rotate(-40 4 9)" />
            </g>

            <g transform="translate(90, 70) rotate(-12)" filter="url(#shadow)">
              <rect x="-60" y="-30" width="120" height="60" rx="12" fill="url(#glassLid)" stroke="url(#goldGrad)" strokeWidth="1.5" />
              <path d="M -60 0 L 60 0" stroke="url(#goldGrad)" strokeWidth="4" />
              <path d="M -48 -22 L 40 22" stroke="rgba(255, 255, 255, 0.25)" strokeWidth="2" strokeLinecap="round" />
            </g>
          </svg>

          <div style={{
            position: 'absolute', bottom: 22,
            background: 'linear-gradient(135deg, #d4af37, #856414)',
            borderRadius: '4px', padding: '2px 8px', fontSize: '0.6rem',
            color: '#fff', fontWeight: 'bold', textTransform: 'uppercase',
            letterSpacing: '0.08em', boxShadow: '0 4px 10px rgba(0,0,0,0.3)',
          }}>
            Premium Box
          </div>
        </motion.div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
          <h2 style={{ fontFamily: 'var(--font-serif)', fontSize: '1.6rem', color: '#FFF8F0', fontStyle: 'italic', margin: 0, lineHeight: 1.3 }}>
            {locale === 'hi' ? 'गिफ्ट सफलतापूर्वक भेजा गया!' : 'Thank you for your purchase!'}
          </h2>
          <p style={{ fontFamily: 'var(--font-sans)', fontSize: '0.92rem', color: 'rgba(255,248,240,0.78)', margin: 0, lineHeight: 1.5, padding: '0 8px' }}>
            {locale === 'hi'
              ? 'आपका सुंदर राखी बॉक्स तैयार है! अपनी भावनाओं को अपने भाई या बहन के साथ तुरंत साझा करें।'
              : 'A beautiful traditional Rakhi, Roli, and Chawal set has been wrapped and packed inside your digital box! Share the magic link below with your sibling.'}
          </p>
        </div>

        {/* Action Buttons */}
        <div style={{ width: '100%', display: 'flex', flexDirection: 'column', gap: 12, marginTop: 10 }}>
          {/* Primary Share WhatsApp / Web Share Button */}
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.97 }}
            onClick={share}
            style={{
              width: '100%',
              background: 'linear-gradient(135deg, #e8751a, #a11b1b)',
              border: 'none',
              color: '#fff',
              fontWeight: 600,
              fontSize: '1rem',
              padding: '16px',
              borderRadius: 12,
              cursor: 'pointer',
              boxShadow: '0 8px 24px rgba(232,117,26,0.3)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: 8,
            }}
          >
            <span>{locale === 'hi' ? 'व्हाट्सएप पर शेयर करें 🚀' : 'Share Surprise on WhatsApp 🚀'}</span>
          </motion.button>

          {/* Secondary Copy Link Button */}
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.97 }}
            onClick={copyLink}
            style={{
              width: '100%',
              background: copied ? 'rgba(46, 125, 50, 0.2)' : 'rgba(201,168,76,0.08)',
              border: copied ? '1.5px solid #4caf50' : '1.5px solid rgba(201,168,76,0.3)',
              color: copied ? '#4caf50' : '#E5C97A',
              fontWeight: 600,
              fontSize: '0.95rem',
              padding: '14px',
              borderRadius: 12,
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: 6,
              transition: 'all 0.2s ease',
            }}
          >
            <span>{copied ? (locale === 'hi' ? 'लिंक कॉपी हो गया! ✅' : 'Link Copied to Clipboard! ✅') : (locale === 'hi' ? 'कॉपी लिंक 📋' : 'Copy Share Link 📋')}</span>
          </motion.button>

          {/* Preview Gift Link */}
          {cardId && (
            <a
              href={shareUrl}
              target="_blank"
              rel="noopener noreferrer"
              style={{
                fontSize: '0.85rem',
                color: 'rgba(255,248,240,0.6)',
                fontWeight: 500,
                textDecoration: 'underline',
                marginTop: 8,
                display: 'inline-block',
                textAlign: 'center'
              }}
            >
              {locale === 'hi' ? 'अपना बनाया राखी गिफ्ट देखें 👁️' : 'Preview your created Rakhi gift 👁️'}
            </a>
          )}
        </div>
      </div>
    </div>
  );
}
