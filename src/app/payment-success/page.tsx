'use client';
import { useSearchParams } from 'next/navigation';
import { motion } from 'framer-motion';
import { Suspense } from 'react';

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

  const shareUrl = typeof window !== 'undefined' ? `${window.location.origin}/gift/${cardId}` : '';

  const share = () => {
    if (!shareUrl) return;
    const shareText = locale === 'hi'
      ? `मैंने आपके लिए एक सुंदर डिजिटल राखी बनाई है! 🌸 इसे यहाँ खोलें और देखें:`
      : `I created a beautiful digital Rakhi for you! 🌸 Open it here:`;

    const isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);

    if (navigator.share && window.isSecureContext) {
      navigator.share({ 
        title: 'Your Digital Rakhi Gift 🌸', 
        text: shareText,
        url: shareUrl
      }).catch(() => {});
    } else if (isMobile) {
      window.location.href = `whatsapp://send?text=${encodeURIComponent(shareText + ' ' + shareUrl)}`;
    } else {
      window.open(`https://web.whatsapp.com/send?text=${encodeURIComponent(shareText + ' ' + shareUrl)}`, '_blank');
    }
  };

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
        {/* Transparent Gift Box Graphic containing Rakhi, Roli, Chawal details */}
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.8, ease: 'easeOut' }}
          style={{
            position: 'relative',
            width: 140,
            height: 140,
            border: '2px solid rgba(212,175,55,0.4)',
            borderRadius: 16,
            background: 'linear-gradient(135deg, rgba(255,255,255,0.12), rgba(255,255,255,0.02))',
            boxShadow: '0 12px 32px rgba(0,0,0,0.35), inset 0 2px 4px rgba(255,255,255,0.15)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            overflow: 'hidden',
          }}
        >
          {/* Light reflection sheen */}
          <div style={{
            position: 'absolute',
            top: 0, left: 0, right: 0, height: '40%',
            background: 'linear-gradient(to bottom, rgba(255,255,255,0.15), transparent)',
            transform: 'skewY(-10deg)',
          }} />

          <svg width="100" height="100" viewBox="0 0 100 100" style={{ zIndex: 2 }}>
            <defs>
              <radialGradient id="goldSplat" cx="50%" cy="50%" r="50%">
                <stop offset="0%" stopColor="#fdfcf0" />
                <stop offset="60%" stopColor="#d4af37" />
                <stop offset="100%" stopColor="#856414" />
              </radialGradient>
              <radialGradient id="rice" cx="30%" cy="30%" r="70%">
                <stop offset="0%" stopColor="#ffffff" />
                <stop offset="100%" stopColor="#dcd9c0" />
              </radialGradient>
              <radialGradient id="roli" cx="30%" cy="30%" r="70%">
                <stop offset="0%" stopColor="#e84a4a" />
                <stop offset="100%" stopColor="#880e0f" />
              </radialGradient>
            </defs>

            {/* Decorative threads representing Rakhi string */}
            <path d="M 10 50 Q 30 40, 50 50 T 90 50" fill="none" stroke="#e84a4a" strokeWidth="2" strokeDasharray="3 2" />
            <path d="M 10 52 Q 30 46, 50 52 T 90 52" fill="none" stroke="#d4af37" strokeWidth="1.5" />

            {/* Central ornate Rakhi dial */}
            <circle cx="50" cy="50" r="16" fill="url(#goldSplat)" stroke="#60460c" strokeWidth="1.5" />
            <circle cx="50" cy="50" r="8" fill="#a11b1b" />
            <circle cx="50" cy="50" r="3" fill="#d4af37" />

            {/* Roli & Chawal Bowls details on bottom sides inside the box */}
            {/* Roli (red powder) */}
            <path d="M 22 75 C 22 68, 38 68, 38 75 Z" fill="url(#roli)" />
            <ellipse cx="30" cy="74" rx="8" ry="3.5" fill="#f07575" opacity="0.8" />
            <circle cx="28" cy="74" r="1.5" fill="#880e0f" />

            {/* Chawal (rice grains scatter) */}
            <ellipse cx="68" cy="75" rx="9" ry="4" fill="rgba(255,255,255,0.15)" stroke="rgba(212,175,55,0.4)" strokeWidth="0.8" />
            <ellipse cx="65" cy="75" rx="3.5" ry="1.4" fill="url(#rice)" transform="rotate(-15 65 75)" />
            <ellipse cx="70" cy="74" rx="3.5" ry="1.4" fill="url(#rice)" transform="rotate(25 70 74)" />
            <ellipse cx="68" cy="77" rx="3.0" ry="1.2" fill="url(#rice)" transform="rotate(-40 68 77)" />
          </svg>

          {/* Tiny label ribbon */}
          <div style={{
            position: 'absolute', bottom: 6,
            background: 'rgba(212,175,55,0.2)', border: '1px solid rgba(212,175,55,0.3)',
            borderRadius: 4, padding: '2px 8px', fontSize: '0.55rem', color: '#ffd700',
            fontWeight: 'bold', textTransform: 'uppercase', letterSpacing: '0.05em'
          }}>
            Premium Box
          </div>
        </motion.div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
          <h2 style={{ fontFamily: 'var(--font-serif)', fontSize: '1.6rem', color: '#FFF8F0', fontStyle: 'italic', margin: 0, lineHeight: 1.3 }}>
            {locale === 'hi' 
              ? 'गिफ्ट सफलतापूर्वक भेजा गया!' 
              : 'Thank you for your purchase!'}
          </h2>
          <p style={{ fontFamily: 'var(--font-sans)', fontSize: '0.92rem', color: 'rgba(255,248,240,0.78)', margin: 0, lineHeight: 1.5, padding: '0 8px' }}>
            {locale === 'hi'
              ? 'आपका सुंदर राखी बॉक्स तैयार है! अपनी भावनाओं को अपने भाई या बहन के साथ तुरंत साझा करें।'
              : 'A beautiful traditional Rakhi, Roli, and Chawal set has been wrapped and packed inside your digital box! Share the magic link below with your sibling.'}
          </p>
        </div>

        <button
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
            transition: 'transform 0.2s',
          }}
        >
          {locale === 'hi' ? 'लिंक साझा करें ↗' : 'Share your link ↗'}
        </button>
      </div>
    </div>
  );
}
