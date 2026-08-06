'use client';
import { useEffect, useState, useRef } from 'react';
import { motion } from 'framer-motion';
import { getExperience, saveReply } from '@/core/database/storage';
import type { RakhiExperience } from '@/lib/types';

const TEMPLATES = {
  en: [
    "Thank you for the beautiful surprise! Even though we fight like cats and dogs, you’re the best sibling I could ask for. Happy Rakhi!",
    "This made my day! Distance might keep us apart, but this brought us right back to our childhood. Miss you and Happy Raksha Bandhan!",
    "I can't believe you did this! Thank you for the amazing gift and the trip down memory lane. I'm so lucky to have you.",
    "You always know how to make me smile! Thank you for this beautiful Rakhi experience. Promise to annoy you forever!",
    "This was the sweetest surprise ever. Thank you for always having my back and being my first best friend. Happy Rakhi!"
  ],
  hi: [
    "इतने प्यारे सरप्राइज के लिए बहुत-बहुत धन्यवाद! भले ही हम लड़ते हों, लेकिन आप सबसे अच्छे हैं। हैप्पी राखी!",
    "इससे मेरा दिन बन गया! दूरियां भले ही हमें अलग कर दें, लेकिन इसने हमें फिर से बचपन में पहुंचा दिया। हैप्पी रक्षाबंधन!",
    "मुझे विश्वास नहीं हो रहा कि आपने ऐसा किया! इस शानदार गिफ्ट और पुरानी यादों के लिए धन्यवाद।",
    "आप हमेशा मुझे हंसाना जानते हैं! इस खूबसूरत राखी के लिए धन्यवाद। मैं आपको हमेशा परेशान करने का वादा करता/करती हूँ!",
    "यह अब तक का सबसे प्यारा सरप्राइज था। हमेशा मेरा साथ देने के लिए धन्यवाद। हैप्पी राखी!"
  ]
};

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
      ? `मैंने आपका राखी गिफ्ट खोल लिया है!\n\n"${message}"\n\nमेरा प्यारा जवाब देखने के लिए यहाँ क्लिक करें: ${replyLink}`
      : `I opened your Rakhi Gift!\n\n"${message}"\n\nClick here to see my reply: ${replyLink}`;
    
    const isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);

    if (navigator.share && window.isSecureContext) {
      navigator.share({ 
        title: 'My Rakhi Reply', 
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
        background: '#120e0d',
        display: 'flex', alignItems: 'center', justifyContent: 'center'
      }}>
        <div style={{ width: 30, height: 30, border: '2px solid #c79774', borderTopColor: 'transparent', borderRadius: '50%', animation: 'spin 1s linear infinite' }} />
      </div>
    );
  }

  if (!experience) {
    return (
      <div style={{
        position: 'fixed', inset: 0,
        background: '#120e0d',
        display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#FFF8F0'
      }}>
        <p>Gift not found.</p>
      </div>
    );
  }

  // Choose the visual theme depending on templateId
  const isTemplate02 = experience.templateId === 'template-02';

  const pageBg = isTemplate02 
    ? 'radial-gradient(circle at center, #1f1412 0%, #080606 100%)' 
    : 'radial-gradient(ellipse at 55% 15%, #2A0D1E 0%, #160818 50%, #080408 100%)';

  const cardBg = isTemplate02 
    ? '#faf6ee' 
    : 'rgba(255,255,255,0.03)';

  const cardBorder = isTemplate02 
    ? '1px solid #e0dcd3' 
    : '1px solid rgba(255,255,255,0.08)';

  const textColor = isTemplate02 
    ? '#2b4f74' 
    : '#FFF8F0';

  const titleColor = isTemplate02 
    ? '#1a3b5c' 
    : '#FFF8F0';

  const labelColor = isTemplate02 
    ? '#8c7662' 
    : '#c79774';

  const buttonBg = isTemplate02
    ? 'linear-gradient(135deg, #c79774, #a36f4d)'
    : 'rgba(201,168,76,0.15)';

  const buttonBorder = isTemplate02
    ? 'none'
    : '1px solid rgba(201,168,76,0.6)';

  const shadow = isTemplate02
    ? '0 15px 35px rgba(0,0,0,0.15)'
    : '0 24px 60px rgba(0,0,0,0.4)';

  return (
    <div style={{
      minHeight: '100dvh',
      background: pageBg,
      padding: '40px 24px',
      display: 'flex', flexDirection: 'column',
      color: isTemplate02 ? '#3d2b1f' : '#FFF8F0',
      maxWidth: 500, margin: '0 auto', overflowX: 'hidden'
    }}>
      <style dangerouslySetInnerHTML={{ __html: `
        @import url('https://fonts.googleapis.com/css2?family=Caveat:wght@500;700&display=swap');
        .handwritten-text {
          font-family: 'Caveat', cursive;
        }
        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
      ` }} />

      {/* Header */}
      <div style={{ textAlign: 'center', marginBottom: 28, zIndex: 10 }}>
        <p style={{
          fontFamily: 'monospace', fontSize: '0.8rem',
          letterSpacing: '0.2em', textTransform: 'uppercase',
          color: labelColor, marginBottom: 12
        }}>
          {experience.locale === 'hi' ? 'एक गिफ्ट प्राप्त हुआ' : 'A Gift Received'}
        </p>
        <h1 style={{
          fontFamily: 'Georgia, serif', fontSize: '1.8rem', fontStyle: 'italic',
          lineHeight: 1.3, fontWeight: 400, color: isTemplate02 ? '#faf6ee' : 'inherit'
        }}>
          {experience.locale === 'hi' ? 'धन्यवाद कहें' : 'Say Thank You to'}<br />{experience.senderName}
        </h1>
      </div>

      {/* Editor Card */}
      <div style={{
        position: 'relative',
        background: cardBg,
        border: cardBorder,
        borderRadius: 24,
        padding: '32px 24px',
        boxShadow: shadow,
        zIndex: 10, flex: 1, display: 'flex', flexDirection: 'column'
      }}>
        {isTemplate02 && (
          <div style={{
            position: 'absolute', inset: 12,
            border: '1px solid rgba(199,151,116,0.3)',
            borderRadius: 16,
            pointerEvents: 'none'
          }} />
        )}
        
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24, marginTop: 12, zIndex: 2 }}>
          <span style={{ fontFamily: 'sans-serif', fontSize: '0.8rem', color: isTemplate02 ? '#8c7662' : 'rgba(255,255,255,0.5)', textTransform: 'uppercase', letterSpacing: '0.1em' }}>
            {experience.locale === 'hi' ? 'आपका संदेश' : 'Your Message'}
          </span>
          <button
            onClick={handleShuffle}
            style={{
              background: isTemplate02 ? 'rgba(199,151,116,0.1)' : 'rgba(201,168,76,0.1)',
              border: isTemplate02 ? '1px solid rgba(199,151,116,0.3)' : '1px solid rgba(201,168,76,0.3)',
              borderRadius: 100, padding: '6px 14px',
              fontFamily: 'sans-serif', fontSize: '0.75rem', color: isTemplate02 ? '#a36f4d' : '#C9A84C',
              cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 6,
              transition: 'all 0.2s'
            }}
          >
            <span>✦</span> {experience.locale === 'hi' ? 'टेम्पलेट बदलें' : 'Shuffle Template'}
          </button>
        </div>

        <div style={{ position: 'relative', width: '100%', minHeight: '120px', zIndex: 2 }}>
          {/* Hidden spacer to auto-expand textarea */}
          <div className="handwritten-text" style={{
            visibility: 'hidden', whiteSpace: 'pre-wrap', wordWrap: 'break-word',
            fontSize: '1.4rem', lineHeight: 1.5,
            width: '100%', paddingBottom: '20px'
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
              fontFamily: 'Caveat, cursive',
              fontSize: '1.4rem',
              lineHeight: 1.5,
              color: textColor,
              resize: 'none',
              outline: 'none',
            }}
            placeholder={experience.locale === 'hi' ? 'अपना प्यारा संदेश यहाँ लिखें...' : 'Write your beautiful message here...'}
          />
        </div>
        
        <p className="handwritten-text" style={{
          fontSize: '1.5rem',
          color: isTemplate02 ? '#a36f4d' : '#C9A84C', marginTop: 24, alignSelf: 'flex-end', zIndex: 2
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
            background: buttonBg,
            border: buttonBorder,
            color: '#FFF8F0',
            fontFamily: 'sans-serif', fontSize: '0.95rem',
            textTransform: 'uppercase', letterSpacing: '0.08em',
            display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 10,
            cursor: 'pointer',
            boxShadow: isTemplate02 ? '0 8px 24px rgba(163,111,77,0.25)' : '0 8px 32px rgba(0,0,0,0.5)'
          }}
        >
          ✦ {experience.locale === 'hi' ? 'जवाब भेजें' : 'Send Reply'}
        </button>

        <a
          href="/create"
          style={{
            fontFamily: 'sans-serif', fontSize: '0.8rem',
            color: isTemplate02 ? '#c79774' : 'rgba(255,255,255,0.5)', textDecoration: 'none',
            letterSpacing: '0.04em', cursor: 'pointer', marginTop: 12
          }}
        >
          {experience.locale === 'hi' ? 'अपने भाई/बहन के लिए राखी बनाएं →' : 'Create a Rakhi for your sibling →'}
        </a>
      </div>
    </div>
  );
}
