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
      ? `मैंने आपके लिए एक डिजिटल राखी गिफ्ट बनाया है! 🌸 इसे खोलने के लिए यहाँ क्लिक करें:`
      : `I made a digital Rakhi gift for you! 🌸 Click here to open it:`;

    const isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);

    if (navigator.share && window.isSecureContext) {
      navigator.share({ 
        title: 'Your Rakhi Gift 🌸', 
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
        maxWidth: 420,
        background: 'rgba(255, 255, 255, 0.03)',
        border: '1px solid rgba(201,168,76,0.15)',
        borderRadius: 24,
        padding: '40px 24px',
        textAlign: 'center',
        boxShadow: '0 20px 50px rgba(0,0,0,0.5)',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: 24,
      }}>
        <motion.div
          initial={{ scale: 0.7, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          style={{ fontSize: '5rem' }}
        >
          🌸
        </motion.div>
        <h2 style={{ fontFamily: 'var(--font-serif)', fontSize: '1.4rem', color: '#FFF8F0', fontStyle: 'italic', margin: 0, lineHeight: 1.4 }}>
          {locale === 'hi' 
            ? 'पैक किया गया राखी बॉक्स!' 
            : 'Thank you for your purchase with a rakhi, roli and chawal packed in a transparent box'}
        </h2>
        <p style={{ fontFamily: 'var(--font-sans)', fontSize: '0.9rem', color: 'rgba(255,248,240,0.7)', margin: 0, lineHeight: 1.5 }}>
          {locale === 'hi' 
            ? 'आपका गिफ्ट तैयार है, अब अपने भाई या बहन के साथ साझा करें।'
            : 'Your gift is ready. You can now share the link with your sibling.'}
        </p>

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
