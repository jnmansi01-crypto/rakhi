'use client';
import { useEffect, useState, useRef } from 'react';
import { motion } from 'framer-motion';
import { getExperience } from '@/lib/storage';
import type { RakhiExperience } from '@/lib/types';
import { CelebrationOverlay } from '@/components/shared/CelebrationOverlay';
import { audioEngine } from '@/lib/audio';

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

function StardustBackground() {
  const [particles, setParticles] = useState<Array<{ id: number; size: number; x: number; y: number; dur: number; delay: number; drift: number }>>([]);

  useEffect(() => {
    // Generate particles on client only to avoid SSR hydration mismatch
    const pts = Array.from({ length: 20 }).map((_, i) => ({
      id: i,
      size: Math.random() * 4 + 2,
      x: Math.random() * 100,
      y: Math.random() * 100,
      dur: Math.random() * 15 + 15,
      delay: Math.random() * 10,
      drift: Math.random() * 20 - 10
    }));
    setParticles(pts);
  }, []);

  return (
    <div style={{ position: 'absolute', inset: 0, pointerEvents: 'none', overflow: 'hidden', zIndex: 0 }}>
      {particles.map(p => (
        <motion.div
          key={p.id}
          initial={{ opacity: 0, x: `${p.x}vw`, y: `${p.y}vh`, scale: 0 }}
          animate={{ 
            opacity: [0, 0.6, 0], 
            y: [`${p.y}vh`, `${p.y - 30}vh`],
            x: [`${p.x}vw`, `${p.x + p.drift}vw`],
            scale: [0, 1, 0]
          }}
          transition={{ duration: p.dur, delay: p.delay, repeat: Infinity, ease: 'easeInOut' }}
          style={{
            position: 'absolute',
            width: p.size, height: p.size,
            borderRadius: '50%',
            background: 'rgba(255, 237, 158, 0.8)',
            boxShadow: '0 0 10px rgba(255, 237, 158, 0.6)',
          }}
        />
      ))}
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
    
    // Slowed down to 90ms for a more deliberate, emotional reading pace
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
        background: 'radial-gradient(ellipse at 50% 60%, #2A0D1E 0%, #160818 50%, #080408 100%)',
        display: 'flex', alignItems: 'center', justifyContent: 'center'
      }}>
        <motion.div animate={{ rotate: 360 }} transition={{ duration: 2, repeat: Infinity, ease: 'linear' }}>🌸</motion.div>
      </div>
    );
  }

  if (!experience || !experience.replyMessage) {
    return (
      <div style={{
        position: 'fixed', inset: 0,
        background: 'radial-gradient(ellipse at 50% 60%, #2A0D1E 0%, #160818 50%, #080408 100%)',
        display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#FFF8F0'
      }}>
        <p>{experience?.locale === 'hi' ? 'कोई जवाब नहीं मिला।' : 'No reply found.'}</p>
      </div>
    );
  }

  return (
    <div style={{
      position: 'fixed', inset: 0,
      background: 'radial-gradient(ellipse at 55% 15%, #2A0D1E 0%, #160818 50%, #080408 100%)',
      display: 'flex', flexDirection: 'column',
      color: '#FFF8F0', overflow: 'hidden'
    }}>
      {hasStarted && <CelebrationOverlay count={40} />}
      <StardustBackground />

      {/* Ambient orbs */}
      <motion.div
        animate={{ opacity: [0.3, 0.6, 0.3], scale: [1, 1.2, 1] }}
        transition={{ duration: 6, repeat: Infinity, ease: 'easeInOut' }}
        style={{
          position: 'absolute', top: '10%', right: '-20%', width: 300, height: 300,
          background: 'radial-gradient(circle, rgba(232,117,26,0.15) 0%, transparent 70%)',
          borderRadius: '50%', filter: 'blur(40px)', pointerEvents: 'none'
        }}
      />
      <motion.div
        animate={{ opacity: [0.2, 0.5, 0.2], scale: [1, 1.3, 1] }}
        transition={{ duration: 8, repeat: Infinity, ease: 'easeInOut', delay: 2 }}
        style={{
          position: 'absolute', bottom: '-10%', left: '-10%', width: 250, height: 250,
          background: 'radial-gradient(circle, rgba(201,168,76,0.12) 0%, transparent 70%)',
          borderRadius: '50%', filter: 'blur(40px)', pointerEvents: 'none'
        }}
      />

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
              fontFamily: 'var(--font-sans)', fontSize: '0.85rem',
              letterSpacing: '0.2em', textTransform: 'uppercase',
              color: 'var(--gold)', marginBottom: 24
            }}>
              {experience.locale === 'hi' ? 'आपको एक जवाब मिला है' : 'You received a reply'}
            </p>
            <button
              onClick={startAnimation}
              style={{
                background: 'linear-gradient(135deg, rgba(201,168,76,0.2) 0%, rgba(201,168,76,0.05) 100%)',
                border: '1px solid rgba(201,168,76,0.6)',
                borderRadius: 100, padding: '20px 48px',
                fontFamily: 'var(--font-sans)', fontSize: '1rem',
                textTransform: 'uppercase', letterSpacing: '0.15em',
                color: '#FFF8F0', cursor: 'pointer',
                backdropFilter: 'blur(20px)', WebkitBackdropFilter: 'blur(20px)',
                boxShadow: '0 12px 40px rgba(0,0,0,0.6), inset 0 2px 4px rgba(255,255,255,0.1)',
                transition: 'all 0.3s ease'
              }}
            >
              {experience.locale === 'hi' ? 'संदेश खोलें ✨' : 'Open Message ✨'}
            </button>
          </motion.div>
        ) : (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8 }}
            style={{
              width: '100%',
              background: 'rgba(255,255,255,0.03)',
              border: '1px solid rgba(255,255,255,0.08)',
              borderRadius: 24,
              padding: '48px 32px',
              backdropFilter: 'blur(20px)',
              WebkitBackdropFilter: 'blur(20px)',
              boxShadow: '0 24px 60px rgba(0,0,0,0.4)',
              position: 'relative',
              marginTop: 32
            }}
          >
            {/* Decorative Rotating 3D Coin */}
            <div style={{ position: 'absolute', top: -35, left: '50%', transform: 'translateX(-50%)', perspective: 1000, zIndex: 20 }}>
              {/* Static shadow */}
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
            
            <p style={{
              fontFamily: 'var(--font-serif)',
              fontSize: '1.6rem',
              lineHeight: 1.6,
              color: '#FFF8F0',
              fontStyle: 'italic',
              minHeight: 150
            }}>
              {displayedText}
              <span className="cursor-blink" style={{ opacity: displayedText.length === experience.replyMessage.length ? 0 : 1 }}>|</span>
            </p>
            
            <motion.p 
              initial={{ opacity: 0 }}
              animate={{ opacity: displayedText.length === experience.replyMessage.length ? 1 : 0 }}
              transition={{ duration: 1 }}
              style={{
                fontFamily: 'var(--font-script)', fontSize: '1.6rem',
                color: 'var(--gold)', marginTop: 40, textAlign: 'right'
              }}
            >
              {experience.locale === 'hi' ? 'प्यार सहित,' : 'with love,'} {experience.recipientName}
            </motion.p>
          </motion.div>
        )}
      </div>

      <style dangerouslySetInnerHTML={{__html: `
        @keyframes blink {
          0%, 100% { opacity: 1; }
          50% { opacity: 0; }
        }
        .cursor-blink {
          animation: blink 1s step-end infinite;
          color: var(--gold);
          margin-left: 4px;
        }
      `}} />
    </div>
  );
}
