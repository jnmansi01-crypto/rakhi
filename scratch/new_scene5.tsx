'use client';
import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useHaptics } from '@/shared/components/useHaptics';
import { audioEngine } from '@/shared/audio/audio';
import type { Locale } from '@/lib/types';
import confetti from 'canvas-confetti';

interface Props {
  recipientName: string;
  senderName: string;
  locale: Locale;
  onComplete: () => void;
}

// 1. User drags items to thali
// 2. Rakhi centers
// 3. User taps 3 times for knots
// 4. Static Sibling Image shows, then complete.

export function Scene5_Rakhi({ recipientName, senderName, locale, onComplete }: Props) {
  const [placedItems, setPlacedItems] = useState<string[]>([]);
  const [knotsTied, setKnotsTied] = useState(0);
  const [phase, setPhase] = useState<'drag' | 'tie' | 'finished'>('drag');
  const { vibrate } = useHaptics();

  useEffect(() => {
    if (placedItems.length === 4 && phase === 'drag') {
      setTimeout(() => setPhase('tie'), 800);
    }
  }, [placedItems, phase]);

  useEffect(() => {
    if (knotsTied === 3 && phase === 'tie') {
      vibrate('FINAL_REVEAL');
      confetti({
        particleCount: 100, spread: 70, origin: { y: 0.6 },
        colors: ['#C9A84C', '#E8751A', '#9B2247']
      });
      setTimeout(() => setPhase('finished'), 1500);
    }
  }, [knotsTied, phase, vibrate]);

  useEffect(() => {
    if (phase === 'finished') {
      const t = setTimeout(() => onComplete(), 4000);
      return () => clearTimeout(t);
    }
  }, [phase, onComplete]);

  const items = [
    { id: 'kumkum', label: '🔴', hint: 'Kumkum' },
    { id: 'rice', label: '🍚', hint: 'Akshat' },
    { id: 'mithai', label: '🍡', hint: 'Sweets' },
    { id: 'rakhi', label: '📿', hint: 'Rakhi' },
  ];

  const handleDragEnd = (event: any, info: any, id: string) => {
    // Check if dropped near the center thali (rough bounds)
    const yOffset = info.offset.y;
    // Assuming they are dragging from bottom up to center
    if (yOffset < -50) {
      if (!placedItems.includes(id)) {
        setPlacedItems(prev => [...prev, id]);
        vibrate('MEDIUM');
        audioEngine.playSwoosh();
      }
    } else {
      vibrate('LIGHT');
    }
  };

  const handleKnotTap = () => {
    if (knotsTied >= 3) return;
    setKnotsTied(prev => prev + 1);
    vibrate('HEAVY');
    audioEngine.playMagic();
  };

  const knotTexts = ['Love ❤️', 'Support 🤝', 'Protection 🛡️'];

  return (
    <div className="scene" style={{
      background: phase === 'finished' ? '#050102' : 'radial-gradient(ellipse at 50% 50%, #4A0E17 0%, #2A050A 50%, #150002 100%)',
      transition: 'background 2s ease-in-out',
      display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
      overflow: 'hidden', userSelect: 'none', WebkitUserSelect: 'none'
    }}>
      
      {phase !== 'finished' && (
        <>
          {/* Instructions */}
          <motion.div style={{ position: 'absolute', top: '10%', textAlign: 'center', color: '#FFF8F0' }}>
            <h2 style={{ fontFamily: 'var(--font-serif)', fontSize: '1.5rem', marginBottom: 8 }}>
              {phase === 'drag' 
                ? (locale === 'hi' ? 'थाली सजाएं' : 'Prepare the Thali') 
                : (locale === 'hi' ? '3 वचन बांधें' : 'Tap to tie the 3 Knots of Promise')}
            </h2>
            {phase === 'drag' && <p style={{ opacity: 0.7 }}>Drag items onto the Thali</p>}
          </motion.div>

          {/* The Thali */}
          <motion.div 
            animate={{ scale: phase === 'tie' ? 0.8 : 1, opacity: phase === 'tie' ? 0.4 : 1 }}
            style={{
              position: 'absolute', top: '35%',
              width: 200, height: 200, borderRadius: '50%',
              background: 'linear-gradient(135deg, #D4AF37 0%, #997A00 100%)',
              border: '4px solid #F3E5AB',
              boxShadow: '0 20px 40px rgba(0,0,0,0.6)',
              display: 'flex', flexWrap: 'wrap', alignItems: 'center', justifyContent: 'center', gap: 10
            }}
          >
            {placedItems.map((id, i) => (
              <motion.div key={id} initial={{ scale: 0 }} animate={{ scale: 1 }} style={{ fontSize: '2rem' }}>
                {items.find(it => it.id === id)?.label}
              </motion.div>
            ))}
          </motion.div>

          {/* Draggable Items (Bottom) */}
          {phase === 'drag' && (
            <div style={{ position: 'absolute', bottom: '15%', display: 'flex', gap: 20 }}>
              <AnimatePresence>
                {items.map(item => !placedItems.includes(item.id) && (
                  <motion.div
                    key={item.id}
                    drag
                    dragConstraints={{ top: 0, left: 0, right: 0, bottom: 0 }}
                    dragElastic={1}
                    onDragEnd={(e, info) => handleDragEnd(e, info, item.id)}
                    exit={{ scale: 0, opacity: 0 }}
                    style={{
                      width: 60, height: 60, borderRadius: '50%',
                      background: 'rgba(255,255,255,0.1)',
                      border: '1px solid rgba(201,168,76,0.4)',
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                      fontSize: '2rem', cursor: 'grab'
                    }}
                  >
                    {item.label}
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>
          )}

          {/* Tie Phase: Central Rakhi */}
          {phase === 'tie' && (
            <motion.div
              initial={{ scale: 0, y: 100 }}
              animate={{ scale: 1, y: 0 }}
              onClick={handleKnotTap}
              style={{
                position: 'absolute', top: '45%',
                fontSize: '5rem', cursor: 'pointer', zIndex: 10,
                filter: 'drop-shadow(0 10px 20px rgba(0,0,0,0.5))'
              }}
            >
              📿
              
              {/* Knots Feedback */}
              <AnimatePresence>
                {Array.from({ length: knotsTied }).map((_, i) => (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, scale: 0.5, y: 0 }}
                    animate={{ opacity: [0, 1, 0], scale: 1.5, y: -60 - (i * 30) }}
                    transition={{ duration: 1.5 }}
                    style={{
                      position: 'absolute', top: 0, left: '50%', x: '-50%',
                      color: '#C9A84C', fontSize: '1.2rem', fontFamily: 'var(--font-serif)',
                      fontWeight: 'bold', whiteSpace: 'nowrap', pointerEvents: 'none'
                    }}
                  >
                    {knotTexts[i]}
                  </motion.div>
                ))}
              </AnimatePresence>
            </motion.div>
          )}
        </>
      )}

      {/* Finished Phase: Sibling Image */}
      <AnimatePresence>
        {phase === 'finished' && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 1.5 }}
            style={{
              position: 'absolute', inset: 40,
              display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center'
            }}
          >
            {/* Fallback stylized frame for brother/sister */}
            <div style={{
              width: 250, height: 350,
              background: 'linear-gradient(135deg, #FFE082, #FFB300)',
              borderRadius: 20, border: '4px solid #FFF8F0',
              boxShadow: '0 20px 50px rgba(0,0,0,0.8)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              flexDirection: 'column', padding: 20, textAlign: 'center'
            }}>
              <span style={{ fontSize: '4rem', marginBottom: 20 }}>👫</span>
              <h3 style={{ fontFamily: 'var(--font-serif)', color: '#4A0E17', fontSize: '1.8rem', margin: 0 }}>
                {locale === 'hi' ? 'हैप्पी रक्षाबंधन' : 'Happy Rakshabandhan'}
              </h3>
              <p style={{ fontFamily: 'var(--font-script)', color: '#4A0E17', fontSize: '1.4rem', marginTop: 10 }}>
                {recipientName} & {senderName}
              </p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

    </div>
  );
}
