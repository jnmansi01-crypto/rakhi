'use client';
import { useEffect, useState, useRef } from 'react';
import { motion } from 'framer-motion';
import { getExperience } from '@/core/database/storage';
import { audioEngine } from '@/shared/audio/audio';
import type { RakhiExperience } from '@/lib/types';

function GoldCoin() {
  const depth = 8;
  return (
    <div style={{ width: '100%', height: '100%', position: 'relative', transformStyle: 'preserve-3d' }}>
      {Array.from({ length: depth }).map((_, i) => (
        <div key={i} style={{
          position: 'absolute', inset: 0,
          borderRadius: '50%',
          background: i === 0 || i === depth - 1 ? '#D4AF37' : '#997A00',
          transform: `translateZ(${(i - depth/2)}px)`,
        }} />
      ))}
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
    </div>
  );
}

export default function ReplyViewerPage({ params }: { params: { id: string } }) {
  const [experience, setExperience] = useState<RakhiExperience | null>(null);
  const [loading, setLoading] = useState(true);
  const [displayedText, setDisplayedText] = useState('');
  const [hasStarted, setHasStarted] = useState(false);
  const typeTimer = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    getExperience(params.id)
      .then(exp => {
        if (exp) {
          setExperience(exp);
        }
      })
      .catch(() => {})
      .finally(() => setLoading(false));
      
    return () => {
      if (typeTimer.current) clearInterval(typeTimer.current);
    };
  }, [params.id]);

  const startAnimation = () => {
    if (!experience || !experience.replyMessage) return;
    setHasStarted(true);
    audioEngine.playMagic();
    
    let index = 0;
    const text = experience.replyMessage;
    
    typeTimer.current = setInterval(() => {
      setDisplayedText((prev) => text.slice(0, prev.length + 1));
      index++;
      if (index >= text.length) {
        if (typeTimer.current) clearInterval(typeTimer.current);
      }
    }, 90);
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

  if (!experience || !experience.replyMessage) {
    return (
      <div style={{
        position: 'fixed', inset: 0,
        background: '#120e0d',
        display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#FFF8F0'
      }}>
        <p>{experience?.locale === 'hi' ? 'कोई जवाब नहीं मिला।' : 'No reply found.'}</p>
      </div>
    );
  }

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

  const labelColor = isTemplate02 
    ? '#8c7662' 
    : '#c79774';

  const shadow = isTemplate02
    ? '0 15px 35px rgba(0,0,0,0.15)'
    : '0 24px 60px rgba(0,0,0,0.4)';

  return (
    <div style={{
      position: 'fixed', inset: 0,
      background: pageBg,
      display: 'flex', flexDirection: 'column',
      color: isTemplate02 ? '#3d2b1f' : '#FFF8F0', overflow: 'hidden'
    }}>
      <style dangerouslySetInnerHTML={{__html: `
        @keyframes blink {
          0%, 100% { opacity: 1; }
          50% { opacity: 0; }
        }
        .cursor-blink {
          animation: blink 1s step-end infinite;
          color: ${isTemplate02 ? '#a36f4d' : '#C9A84C'};
          margin-left: 4px;
        }
        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
      `}} />

      <div style={{ 
        flex: 1, display: 'flex', flexDirection: 'column', 
        alignItems: 'center', justifyContent: 'center',
        padding: '0 24px', maxWidth: 500, margin: '0 auto', width: '100%'
      }}>
        {!hasStarted ? (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            style={{ textAlign: 'center' }}
          >
            <p style={{
              fontFamily: 'monospace', fontSize: '0.85rem',
              letterSpacing: '0.2em', textTransform: 'uppercase',
              color: labelColor, marginBottom: 24
            }}>
              {experience.locale === 'hi' ? 'आपको एक जवाब मिला है' : 'You received a reply'}
            </p>
            <button
              onClick={startAnimation}
              style={{
                background: isTemplate02 ? 'linear-gradient(135deg, #c79774, #a36f4d)' : 'rgba(201,168,76,0.15)',
                border: isTemplate02 ? 'none' : '1px solid rgba(201,168,76,0.6)',
                borderRadius: 100, padding: '20px 48px',
                fontFamily: 'sans-serif', fontSize: '1rem',
                textTransform: 'uppercase', letterSpacing: '0.15em',
                color: '#FFF8F0', cursor: 'pointer',
                boxShadow: shadow,
                transition: 'all 0.3s ease'
              }}
            >
              {experience.locale === 'hi' ? 'संदेश खोलें' : 'Open Message'}
            </button>
          </motion.div>
        ) : (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8 }}
            style={{
              width: '100%',
              background: cardBg,
              border: cardBorder,
              borderRadius: 24,
              padding: '48px 32px',
              boxShadow: shadow,
              position: 'relative',
              marginTop: 32
            }}
          >
            {isTemplate02 && (
              <div style={{
                position: 'absolute', inset: 12,
                border: '1px solid rgba(199,151,116,0.3)',
                borderRadius: 16,
                pointerEvents: 'none'
              }} />
            )}

            {!isTemplate02 && (
              <div style={{ position: 'absolute', top: -35, left: '50%', transform: 'translateX(-50%)', perspective: 1000, zIndex: 20 }}>
                <div style={{ position: 'absolute', top: 12, left: -2, right: -2, bottom: -8, background: 'rgba(0,0,0,0.5)', borderRadius: '50%', filter: 'blur(8px)' }} />
                <motion.div 
                  initial={{ rotateY: 0 }}
                  animate={{ rotateY: 360 }}
                  transition={{ duration: 8, repeat: Infinity, ease: 'linear' }}
                  style={{ 
                    width: 48, height: 48, transformStyle: 'preserve-3d' 
                  }}
                >
                  <GoldCoin />
                </motion.div>
              </div>
            )}
            
            <p className="handwritten-text" style={{
              fontSize: '1.5rem',
              lineHeight: 1.5,
              color: textColor,
              minHeight: 150
            }}>
              {displayedText}
              <span className="cursor-blink" style={{ opacity: displayedText.length === experience.replyMessage.length ? 0 : 1 }}>|</span>
            </p>
            
            <motion.p 
              initial={{ opacity: 0 }}
              animate={{ opacity: displayedText.length === experience.replyMessage.length ? 1 : 0 }}
              transition={{ duration: 1 }}
              className="handwritten-text"
              style={{
                fontSize: '1.6rem',
                color: isTemplate02 ? '#a36f4d' : '#C9A84C', marginTop: 40, textAlign: 'right'
              }}
            >
              {experience.locale === 'hi' ? 'प्यार सहित,' : 'with love,'} {experience.recipientName}
            </motion.p>
          </motion.div>
        )}
      </div>
    </div>
  );
}
