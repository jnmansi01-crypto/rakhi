'use client';
import { useEffect, useState, useRef } from 'react';
import { motion } from 'framer-motion';
import { getExperience, saveReply } from '@/lib/storage';
import type { RakhiExperience } from '@/lib/types';

const TEMPLATES = {
  en: [
    "Thank you for the beautiful surprise! Even though we fight like cats and dogs, you’re the best sibling I could ask for. Happy Rakhi! ❤️",
    "This made my day! Distance might keep us apart, but this brought us right back to our childhood. Miss you and Happy Raksha Bandhan! ✨",
    "I can't believe you did this! Thank you for the amazing gift and the trip down memory lane. I'm so lucky to have you. 🌸",
    "You always know how to make me smile! Thank you for this beautiful Rakhi experience. Promise to annoy you forever! 😂❤️",
    "This was the sweetest surprise ever. Thank you for always having my back and being my first best friend. Happy Rakhi! 🌟"
  ],
  hi: [
    "इतने प्यारे सरप्राइज के लिए बहुत-बहुत धन्यवाद! भले ही हम लड़ते हों, लेकिन आप सबसे अच्छे हैं। हैप्पी राखी! ❤️",
    "इससे मेरा दिन बन गया! दूरियां भले ही हमें अलग कर दें, लेकिन इसने हमें फिर से बचपन में पहुंचा दिया। हैप्पी रक्षाबंधन! ✨",
    "मुझे विश्वास नहीं हो रहा कि आपने ऐसा किया! इस शानदार गिफ्ट और पुरानी यादों के लिए धन्यवाद। 🌸",
    "आप हमेशा मुझे हंसाना जानते हैं! इस खूबसूरत राखी के लिए धन्यवाद। मैं आपको हमेशा परेशान करने का वादा करता/करती हूँ! 😂❤️",
    "यह अब तक का सबसे प्यारा सरप्राइज था। हमेशा मेरा साथ देने के लिए धन्यवाद। हैप्पी राखी! 🌟"
  ]
};

function GoldCoin() {
  const depth = 8;
  return (
    <div style={{ width: '100%', height: '100%', position: 'relative', transformStyle: 'preserve-3d' }}>
      {/* 3D Edge Cylinder */}
      {Array.from({ length: depth }).map((_, i) => (
        <div key={i} style={{
          position: 'absolute', inset: 0,
          borderRadius: '50%',
          background: i === 0 || i === depth - 1 ? '#D4AF37' : '#997A00',
          transform: `translateZ(${(i - depth/2)}px)`,
        }} />
      ))}
      
      {/* Front Face */}
      <div style={{
        position: 'absolute', inset: 0,
        borderRadius: '50%',
        background: 'linear-gradient(135deg, #FFDF73 0%, #C9A84C 40%, #8A6E27 100%)',
        transform: `translateZ(${depth/2 + 0.5}px)`,
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        backfaceVisibility: 'hidden',
      }}>
        <div style={{ 
          width: '75%', height: '75%', borderRadius: '50%', 
          border: '1px solid rgba(255,255,255,0.4)', display: 'flex', alignItems: 'center', justifyContent: 'center',
          background: 'linear-gradient(135deg, #E6C158 0%, #B89335 100%)',
          boxShadow: 'inset 0 0 4px rgba(0,0,0,0.3)'
        }}>
          <span style={{ fontSize: '1rem', color: '#5C430A', textShadow: '0 1px 1px rgba(255,255,255,0.5)' }}>₹</span>
        </div>
      </div>

      {/* Back Face */}
      <div style={{
        position: 'absolute', inset: 0,
        borderRadius: '50%',
        background: 'linear-gradient(135deg, #FFDF73 0%, #C9A84C 40%, #8A6E27 100%)',
        transform: `translateZ(${-(depth/2 + 0.5)}px) rotateY(180deg)`,
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        backfaceVisibility: 'hidden',
      }}>
        <div style={{ 
          width: '75%', height: '75%', borderRadius: '50%', 
          border: '1px solid rgba(255,255,255,0.4)', display: 'flex', alignItems: 'center', justifyContent: 'center',
          background: 'linear-gradient(135deg, #E6C158 0%, #B89335 100%)',
          boxShadow: 'inset 0 0 4px rgba(0,0,0,0.3)'
        }}>
          <span style={{ fontSize: '1rem', color: '#5C430A', textShadow: '0 1px 1px rgba(255,255,255,0.5)' }}>₹</span>
        </div>
      </div>
    </div>
  );
}

export default function ReplyPage({ params }: { params: { id: string } }) {
  const [experience, setExperience] = useState<RakhiExperience | null>(null);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState('');
  const [displayedText, setDisplayedText] = useState('');
  const [templateIndex, setTemplateIndex] = useState(0);
  const typeTimer = useRef<NodeJS.Timeout | null>(null);

  const startTypewriter = (text: string) => {
    if (typeTimer.current) clearInterval(typeTimer.current);
    setDisplayedText('');
    setMessage(text);
    let index = 0;
    typeTimer.current = setInterval(() => {
      setDisplayedText((prev) => text.slice(0, prev.length + 1));
      index++;
      if (index >= text.length) {
        if (typeTimer.current) clearInterval(typeTimer.current);
      }
    }, 40);
  };

  useEffect(() => {
    document.body.classList.add('sender-flow');
    
    getExperience(params.id)
      .then(exp => {
        if (exp) {
          setExperience(exp);
          startTypewriter(TEMPLATES[exp.locale || 'en'][0]);
        }
      })
      .catch(() => {})
      .finally(() => setLoading(false));
      
    return () => {
      document.body.classList.remove('sender-flow');
      if (typeTimer.current) clearInterval(typeTimer.current);
    };
  }, [params.id]);

  const handleShuffle = () => {
    const locale = experience?.locale || 'en';
    const nextIdx = (templateIndex + 1) % TEMPLATES[locale].length;
    setTemplateIndex(nextIdx);
    startTypewriter(TEMPLATES[locale][nextIdx]);
  };

  const handleSend = () => {
    if (!experience) return;
    saveReply(params.id, message).catch(console.error);
    
    const base = typeof window !== 'undefined' ? window.location.origin : '';
    const replyLink = `${base}/reply/view/${params.id}`;
    const locale = experience.locale || 'en';
    const shareText = locale === 'hi'
      ? `✨ मैंने आपका राखी गिफ्ट खोल लिया है!\n\n"${message}"\n\nमेरा जादुई जवाब देखने के लिए यहाँ क्लिक करें: ${replyLink}`
      : `✨ I opened your Rakhi Gift!\n\n"${message}"\n\nClick here to see my magical reply: ${replyLink}`;
    
    const isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);

    if (navigator.share && window.isSecureContext) {
      navigator.share({ 
        title: 'My Rakhi Reply 🌸', 
        text: shareText
      }).catch(() => {});
    } else if (isMobile) {
      window.location.href = `whatsapp://send?text=${encodeURIComponent(shareText)}`;
    } else {
      window.open(`https://wa.me/?text=${encodeURIComponent(shareText)}`, '_blank');
    }
  };

  if (loading) {
    return (
      <div style={{
        position: 'fixed', inset: 0,
        background: 'radial-gradient(ellipse at 50% 60%, #2A0D1E 0%, #160818 50%, #080408 100%)',
        display: 'flex', alignItems: 'center', justifyContent: 'center'
      }}>
        <motion.div animate={{ rotate: 360 }} transition={{ duration: 2, repeat: Infinity, ease: 'linear' }}>🌸</motion.div>
      </div>
    );
  }

  if (!experience) {
    return (
      <div style={{
        position: 'fixed', inset: 0,
        background: 'radial-gradient(ellipse at 50% 60%, #2A0D1E 0%, #160818 50%, #080408 100%)',
        display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#FFF8F0'
      }}>
        <p>Gift not found.</p>
      </div>
    );
  }

  return (
    <div style={{
      minHeight: '100dvh',
      background: 'radial-gradient(ellipse at 55% 15%, #2A0D1E 0%, #160818 50%, #080408 100%)',
      padding: '40px 24px',
      display: 'flex', flexDirection: 'column',
      color: '#FFF8F0',
      maxWidth: 500, margin: '0 auto', overflowX: 'hidden'
    }}>
      {/* Background ambient orbs */}
      <motion.div
        animate={{ opacity: [0.3, 0.6, 0.3], scale: [1, 1.2, 1] }}
        transition={{ duration: 6, repeat: Infinity, ease: 'easeInOut' }}
        style={{
          position: 'fixed', top: '10%', right: '-20%', width: 300, height: 300,
          background: 'radial-gradient(circle, rgba(232,117,26,0.15) 0%, transparent 70%)',
          borderRadius: '50%', filter: 'blur(40px)', pointerEvents: 'none'
        }}
      />
      <motion.div
        animate={{ opacity: [0.2, 0.5, 0.2], scale: [1, 1.3, 1] }}
        transition={{ duration: 8, repeat: Infinity, ease: 'easeInOut', delay: 2 }}
        style={{
          position: 'fixed', bottom: '-10%', left: '-10%', width: 250, height: 250,
          background: 'radial-gradient(circle, rgba(201,168,76,0.12) 0%, transparent 70%)',
          borderRadius: '50%', filter: 'blur(40px)', pointerEvents: 'none'
        }}
      />

      {/* Header */}
      <div style={{ textAlign: 'center', marginBottom: 28, zIndex: 10 }}>
        <p style={{
          fontFamily: 'var(--font-sans)', fontSize: '0.8rem',
          letterSpacing: '0.2em', textTransform: 'uppercase',
          color: 'var(--gold)', marginBottom: 12
        }}>
          {experience.locale === 'hi' ? 'एक गिफ्ट प्राप्त हुआ' : 'A Gift Received'}
        </p>
        <h1 style={{
          fontFamily: 'var(--font-serif)', fontSize: '1.8rem', fontStyle: 'italic',
          lineHeight: 1.3, fontWeight: 400
        }}>
          {experience.locale === 'hi' ? 'धन्यवाद कहें' : 'Say Thank You to'}<br />{experience.senderName}
        </h1>
      </div>

      {/* Editor Card */}
      <div style={{
        position: 'relative',
        background: 'rgba(255,255,255,0.03)',
        border: '1px solid rgba(255,255,255,0.08)',
        borderRadius: 24,
        padding: '32px 24px',
        backdropFilter: 'blur(20px)',
        WebkitBackdropFilter: 'blur(20px)',
        boxShadow: '0 24px 60px rgba(0,0,0,0.4)',
        zIndex: 10, flex: 1, display: 'flex', flexDirection: 'column'
      }}>
        {/* Decorative Rotating 3D Coin */}
        <div style={{ position: 'absolute', top: -35, left: '50%', transform: 'translateX(-50%)', perspective: 1000, zIndex: 20 }}>
          {/* Static shadow */}
          <div style={{ position: 'absolute', top: 12, left: -2, right: -2, bottom: -8, background: 'rgba(0,0,0,0.5)', borderRadius: '50%', filter: 'blur(8px)' }} />
          <motion.div 
            animate={{ rotateY: 360 }}
            transition={{ duration: 8, repeat: Infinity, ease: 'linear' }}
            style={{ 
              width: 48, height: 48, transformStyle: 'preserve-3d' 
            }}
          >
            <GoldCoin />
          </motion.div>
        </div>
        
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24, marginTop: 12 }}>
          <span style={{ fontFamily: 'var(--font-sans)', fontSize: '0.8rem', color: 'rgba(255,255,255,0.5)', textTransform: 'uppercase', letterSpacing: '0.1em' }}>
            {experience.locale === 'hi' ? 'आपका संदेश' : 'Your Message'}
          </span>
          <button
            onClick={handleShuffle}
            style={{
              background: 'rgba(201,168,76,0.1)',
              border: '1px solid rgba(201,168,76,0.3)',
              borderRadius: 100, padding: '6px 14px',
              fontFamily: 'var(--font-sans)', fontSize: '0.75rem', color: 'var(--gold)',
              cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 6,
              transition: 'all 0.2s'
            }}
          >
            <span>✨</span> {experience.locale === 'hi' ? 'टेम्पलेट बदलें' : 'Shuffle Template'}
          </button>
        </div>

        <div style={{ position: 'relative', width: '100%', minHeight: '120px' }}>
          {/* Hidden spacer to auto-expand textarea */}
          <div style={{
            visibility: 'hidden', whiteSpace: 'pre-wrap', wordWrap: 'break-word',
            fontFamily: 'var(--font-serif)', fontSize: '1.15rem', lineHeight: 1.6,
            width: '100%', fontStyle: 'italic', paddingBottom: '20px'
          }}>
            {displayedText + ' '}
          </div>
          <textarea
            value={displayedText}
            onChange={(e) => {
              if (typeTimer.current) clearInterval(typeTimer.current);
              setMessage(e.target.value);
              setDisplayedText(e.target.value);
            }}
            style={{
              position: 'absolute', inset: 0,
              width: '100%', height: '100%',
              background: 'transparent',
              border: 'none',
              fontFamily: 'var(--font-serif)',
              fontSize: '1.15rem',
              lineHeight: 1.6,
              color: '#FFF8F0',
              resize: 'none',
              outline: 'none',
              fontStyle: 'italic'
            }}
            placeholder={experience.locale === 'hi' ? 'अपना प्यारा संदेश यहाँ लिखें...' : 'Write your beautiful message here...'}
          />
        </div>
        
        <p style={{
          fontFamily: 'var(--font-script)', fontSize: '1.4rem',
          color: 'var(--gold)', marginTop: 24, alignSelf: 'flex-end'
        }}>
          {experience.locale === 'hi' ? 'प्यार सहित,' : 'with love,'} {experience.recipientName}
        </p>
      </div>

      {/* Action Button */}
      <div style={{ marginTop: 28, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 16, zIndex: 10 }}>
        <button
          onClick={handleSend}
          style={{
            width: '100%',
            padding: '18px',
            borderRadius: 100,
            background: 'rgba(201,168,76,0.15)',
            border: '1px solid rgba(201,168,76,0.6)',
            backdropFilter: 'blur(20px)',
            WebkitBackdropFilter: 'blur(20px)',
            color: '#FFF8F0',
            fontFamily: 'var(--font-sans)', fontSize: '0.95rem',
            textTransform: 'uppercase', letterSpacing: '0.08em',
            display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 10,
            cursor: 'pointer',
            boxShadow: '0 8px 32px rgba(0,0,0,0.5), inset 0 2px 4px rgba(255,255,255,0.1)'
          }}
        >
          <span style={{ fontSize: '1.2rem' }}>💬</span>
          {experience.locale === 'hi' ? 'WhatsApp पर भेजें' : 'Send via WhatsApp'}
        </button>

        <a
          href="/create"
          style={{
            fontFamily: 'var(--font-sans)', fontSize: '0.8rem',
            color: 'rgba(255,255,255,0.5)', textDecoration: 'none',
            letterSpacing: '0.04em', cursor: 'pointer', marginTop: 12
          }}
        >
          {experience.locale === 'hi' ? 'अपने भाई/बहन के लिए राखी बनाएं →' : 'Create a Rakhi for your sibling →'}
        </a>
      </div>
    </div>
  );
}
