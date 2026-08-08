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
              {/* Rich Gold Gradients for Box Accents */}
              <linearGradient id="goldGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#FFF2B2" />
                <stop offset="30%" stopColor="#D4AF37" />
                <stop offset="70%" stopColor="#AA7C11" />
                <stop offset="100%" stopColor="#5A3F05" />
              </linearGradient>

              {/* Saffron Gradient for Box Exterior */}
              <linearGradient id="boxExterior" x1="0%" y1="0%" x2="0%" y2="100%">
                <stop offset="0%" stopColor="#D45B27" />
                <stop offset="100%" stopColor="#8A2C0D" />
              </linearGradient>

              {/* Royal Saffron/Red interior base gradient */}
              <radialGradient id="boxInterior" cx="50%" cy="50%" r="50%">
                <stop offset="0%" stopColor="#B31919" />
                <stop offset="100%" stopColor="#5E0606" />
              </radialGradient>

              {/* Glass Lid Transparent Gradient */}
              <linearGradient id="glassLid" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="rgba(255, 255, 255, 0.25)" />
                <stop offset="40%" stopColor="rgba(255, 255, 255, 0.05)" />
                <stop offset="100%" stopColor="rgba(255, 255, 255, 0.15)" />
              </linearGradient>

              {/* Roli & Chawal Gradients */}
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

            {/* 1. Ground Drop Shadow under the box base */}
            <ellipse cx="90" cy="148" rx="60" ry="12" fill="rgba(0,0,0,0.5)" filter="url(#shadow)" />

            {/* 2. Open Box Base Container (Interior Bed) */}
            {/* Box base structure */}
            <path d="M 30 115 L 30 135 C 30 142, 150 142, 150 135 L 150 115 Z" fill="url(#boxExterior)" stroke="url(#goldGrad)" strokeWidth="1.5" />
            
            {/* Box Inner Bed (Royal Saffron Velvet Lining) */}
            <ellipse cx="90" cy="115" rx="58" ry="18" fill="url(#boxInterior)" stroke="url(#goldGrad)" strokeWidth="1.5" />

            {/* 3. Items inside the box */}
            
            {/* Thread of the Rakhi laying inside the box */}
            <path d="M 42 118 Q 70 128, 90 120 T 138 114" fill="none" stroke="#E84A4A" strokeWidth="2.5" strokeLinecap="round" />
            <path d="M 42 120 Q 70 130, 90 122 T 138 116" fill="none" stroke="#FFF2B2" strokeWidth="1.2" strokeLinecap="round" strokeDasharray="3 3" />

            {/* Central Ornate Gold Rakhi Dial lying in center */}
            <g transform="translate(90, 118)">
              {/* Outer Golden Petals */}
              <circle cx="0" cy="0" r="16" fill="url(#goldGrad)" filter="url(#shadow)" />
              {/* Inner details */}
              <circle cx="0" cy="0" r="10" fill="#B31919" />
              <circle cx="0" cy="0" r="6" fill="url(#goldGrad)" />
              <circle cx="0" cy="0" r="3" fill="#D4AF37" />
              {/* Tiny surrounding beads */}
              {Array.from({ length: 8 }).map((_, i) => {
                const angle = (i * Math.PI) / 4;
                const x = 12 * Math.cos(angle);
                const y = 12 * Math.sin(angle);
                return <circle key={i} cx={x} cy={y} r="1.5" fill="#FFF" />;
              })}
            </g>

            {/* Traditional Roli (Kumkum) and Chawal (Rice) bowls placed inside the box */}
            {/* Roli Bowl */}
            <g transform="translate(58, 106)" filter="url(#shadow)">
              <ellipse cx="0" cy="10" rx="13" ry="7" fill="url(#goldGrad)" />
              <ellipse cx="0" cy="8" rx="11" ry="5.5" fill="url(#roliPowder)" />
              <ellipse cx="-1" cy="7" rx="6" ry="3" fill="#FF7272" opacity="0.6" />
            </g>

            {/* Chawal Bowl */}
            <g transform="translate(122, 106)" filter="url(#shadow)">
              <ellipse cx="0" cy="10" rx="13" ry="7" fill="url(#goldGrad)" />
              <ellipse cx="0" cy="8" rx="11" ry="5.5" fill="rgba(255, 255, 255, 0.1)" stroke="rgba(255,255,255,0.2)" />
              {/* Scattered rice grains */}
              <ellipse cx="-4" cy="8" rx="3.5" ry="1.2" fill="url(#riceGrain)" transform="rotate(-15 -4 8)" />
              <ellipse cx="2" cy="7" rx="3.5" ry="1.2" fill="url(#riceGrain)" transform="rotate(30 2 7)" />
              <ellipse cx="-1" cy="9" rx="3.5" ry="1.2" fill="url(#riceGrain)" transform="rotate(75 -1 9)" />
              <ellipse cx="4" cy="9" rx="3.0" ry="1.0" fill="url(#riceGrain)" transform="rotate(-40 4 9)" />
            </g>

            {/* 4. Open Glass Lid (Leaning behind/above the box base, showing transparency) */}
            <g transform="translate(90, 70) rotate(-12)" filter="url(#shadow)">
              {/* Transparent glass boundary */}
              <rect x="-60" y="-30" width="120" height="60" rx="12" fill="url(#glassLid)" stroke="url(#goldGrad)" strokeWidth="1.5" />
              {/* Gold ribbon tie on lid */}
              <path d="M -60 0 L 60 0" stroke="url(#goldGrad)" strokeWidth="4" />
              {/* Glass Reflection Highlight */}
              <path d="M -48 -22 L 40 22" stroke="rgba(255, 255, 255, 0.25)" strokeWidth="2" strokeLinecap="round" />
            </g>
          </svg>

          {/* Tiny Ribbon Badge */}
          <div style={{
            position: 'absolute',
            bottom: 22,
            background: 'linear-gradient(135deg, #d4af37, #856414)',
            borderRadius: '4px',
            padding: '2px 8px',
            fontSize: '0.6rem',
            color: '#fff',
            fontWeight: 'bold',
            textTransform: 'uppercase',
            letterSpacing: '0.08em',
            boxShadow: '0 4px 10px rgba(0,0,0,0.3)',
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
