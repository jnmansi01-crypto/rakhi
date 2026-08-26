'use client';
import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useHaptics } from '@/shared/components/useHaptics';
import { audioEngine } from '@/shared/audio/audio';
import type { Locale } from '@/lib/types';
import confetti from 'canvas-confetti';

interface Props {
  coupons: string[];
  onComplete: () => void;
  locale: Locale;
}

const COUPON_LABELS: Record<string, string> = {
  pizza: '1 Free Pizza 🍕',
  remote: 'TV Remote Control 📺',
  chore: 'I do 1 Chore 🧹',
  movie: 'Movie Night 🍿'
};

const DUD_LABELS: Record<string, string> = {
  karela: 'Bitter Gourd 🥒',
  empty: 'Empty Box 📦'
};

interface CardData {
  id: string; // unique for the DOM key
  pairId: string; // matches the coupon or dud id
  label: string;
}

export function Scene7_Coupons({ coupons, onComplete, locale }: Props) {
  const [cards, setCards] = useState<CardData[]>([]);
  const [flippedIndices, setFlippedIndices] = useState<number[]>([]);
  const [matchedPairs, setMatchedPairs] = useState<string[]>([]);
  const [isWon, setIsWon] = useState(false);
  const [locked, setLocked] = useState(false);
  const [topCouponIndex, setTopCouponIndex] = useState(0);
  const { vibrate } = useHaptics();

  useEffect(() => {
    // Generate the 8 cards
    const deck: CardData[] = [];
    const targetPairs = [
      ...coupons,
      'karela',
      'empty'
    ];
    
    targetPairs.forEach(pairId => {
      const label = COUPON_LABELS[pairId] || DUD_LABELS[pairId];
      deck.push({ id: `${pairId}-A`, pairId, label });
      deck.push({ id: `${pairId}-B`, pairId, label });
    });

    // Shuffle
    for (let i = deck.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [deck[i], deck[j]] = [deck[j], deck[i]];
    }
    
    setCards(deck);
  }, [coupons]);

  const handleCardClick = (index: number) => {
    if (locked || flippedIndices.includes(index) || matchedPairs.includes(cards[index].pairId)) {
      return;
    }

    vibrate('LIGHT');
    audioEngine.playPaper();

    const newFlipped = [...flippedIndices, index];
    setFlippedIndices(newFlipped);

    if (newFlipped.length === 2) {
      setLocked(true);
      const [firstIdx, secondIdx] = newFlipped;
      
      if (cards[firstIdx].pairId === cards[secondIdx].pairId) {
        // Match!
        setTimeout(() => {
          vibrate('REVEAL');
          audioEngine.playMagic();
          setMatchedPairs(prev => {
            const newMatched = [...prev, cards[firstIdx].pairId];
            
            // Check win condition
            const hasWon = coupons.every(c => newMatched.includes(c));
            if (hasWon) {
              setTimeout(() => {
                setIsWon(true);
                vibrate('FINAL_REVEAL');
                confetti({ particleCount: 150, spread: 80, colors: ['#C9A84C', '#E8751A', '#FFF8F0'] });
              }, 1000);
            }
            
            return newMatched;
          });
          setFlippedIndices([]);
          setLocked(false);
        }, 600);
      } else {
        // No match
        setTimeout(() => {
          vibrate('MEDIUM');
          setFlippedIndices([]);
          setLocked(false);
        }, 1200);
      }
    }
  };

  return (
    <div className="scene" style={{
      background: 'radial-gradient(ellipse at 50% 50%, #4A0E17 0%, #2A050A 50%, #150002 100%)',
      display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
      padding: '20px', overflow: 'hidden'
    }}>
      
      <motion.div 
        initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }}
        style={{ textAlign: 'center', marginBottom: 40, color: '#FFF8F0' }}
      >
        <h2 style={{ fontFamily: 'var(--font-serif)', fontSize: '1.8rem', margin: '0 0 10px 0', color: '#C9A84C' }}>
          {locale === 'hi' ? 'शगुन कार्ड गेम' : 'Shagun Envelope Match'}
        </h2>
        <p style={{ fontFamily: 'var(--font-sans)', fontSize: '0.95rem', opacity: 0.8, margin: 0 }}>
          {locale === 'hi'
            ? 'अपने भाई/बहन द्वारा दिए गए 2 कूपन जीतने के लिए कार्ड मिलाएं!'
            : 'Match the cards to find the 2 winning sibling coupons!'}
        </p>
      </motion.div>

      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(4, 1fr)',
        gap: 12,
        width: '100%',
        maxWidth: 400,
        perspective: 1000
      }}>
        {cards.map((card, i) => {
          const isFlipped = flippedIndices.includes(i) || matchedPairs.includes(card.pairId);
          const isMatched = matchedPairs.includes(card.pairId);

          return (
            <motion.div
              key={card.id}
              onClick={() => handleCardClick(i)}
              style={{
                width: '100%',
                aspectRatio: '3/4',
                position: 'relative',
                transformStyle: 'preserve-3d',
                cursor: 'pointer'
              }}
              animate={{ rotateY: isFlipped ? 180 : 0 }}
              transition={{ duration: 0.6, type: 'spring', stiffness: 260, damping: 20 }}
            >
              {/* Front (Envelope Back) */}
              <div style={{
                position: 'absolute', inset: 0,
                background: 'linear-gradient(135deg, #7A1B29, #4A0B14)',
                border: '1px solid rgba(201,168,76,0.6)',
                borderRadius: 8,
                backfaceVisibility: 'hidden',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                boxShadow: '0 4px 12px rgba(0,0,0,0.4)',
                overflow: 'hidden'
              }}>
                {/* Envelope Flap drawing */}
                <svg width="100%" height="100%" style={{ position: 'absolute' }}>
                  <path d="M 0 0 L 50 50 L 100 0" stroke="rgba(201,168,76,0.4)" strokeWidth="2" fill="none" vectorEffect="non-scaling-stroke" />
                </svg>
                <div style={{
                  width: 30, height: 30, borderRadius: '50%',
                  background: 'radial-gradient(circle, #C9A84C, #A07830)',
                  boxShadow: '0 2px 5px rgba(0,0,0,0.5)', zIndex: 2
                }} />
              </div>

              {/* Back (Revealed Content) */}
              <div style={{
                position: 'absolute', inset: 0,
                background: isMatched ? 'linear-gradient(135deg, #FFF8F0, #E5C97A)' : '#FFF8F0',
                border: `2px solid ${isMatched ? '#C9A84C' : '#CCC'}`,
                borderRadius: 8,
                backfaceVisibility: 'hidden',
                transform: 'rotateY(180deg)',
                display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
                textAlign: 'center', padding: 8,
                boxShadow: isMatched ? '0 0 20px rgba(201,168,76,0.6)' : 'none'
              }}>
                <span style={{ fontSize: '1.8rem', marginBottom: 4 }}>{card.label.slice(-2)}</span>
                <span style={{ fontFamily: 'var(--font-sans)', fontSize: '0.65rem', fontWeight: 700, color: '#3D1A00' }}>
                  {card.label.slice(0, -2)}
                </span>
              </div>
            </motion.div>
          );
        })}
      </div>

      {/* Win Overlay */}
      <AnimatePresence>
        {isWon && (
          <motion.div
            initial={{ opacity: 0 }} animate={{ opacity: 1 }}
            style={{
              position: 'absolute', inset: 0,
              background: 'rgba(0,0,0,0.8)',
              backdropFilter: 'blur(5px)',
              display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
              zIndex: 100, padding: 20, textAlign: 'center'
            }}
          >
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} transition={{ delay: 0.2, type: 'spring', damping: 12 }}
              style={{
                display: 'flex', flexDirection: 'column', alignItems: 'center',
                width: '100%', maxWidth: 400
              }}
            >
              <h2 style={{ fontFamily: 'var(--font-serif)', color: '#E5C97A', fontSize: '2.5rem', margin: '0 0 15px 0', textShadow: '0 4px 10px rgba(0,0,0,0.5)' }}>
                {locale === 'hi' ? 'बधाई हो!' : 'You Won!'}
              </h2>
              <p style={{ fontFamily: 'var(--font-sans)', color: '#FFF8F0', fontSize: '1.1rem', marginBottom: 40, lineHeight: 1.4, textAlign: 'center', textShadow: '0 2px 4px rgba(0,0,0,0.5)' }}>
                {locale === 'hi'
                  ? 'अपने भाई/बहन से इस राखी पर अपने कूपन का दावा करें।'
                  : 'Claim your coupons this rakhi from your sibling.'}
              </p>
              
              <div 
                style={{ display: 'flex', justifyContent: 'center', marginBottom: 50, position: 'relative', width: '100%', height: 120, cursor: 'pointer' }}
                onClick={() => setTopCouponIndex(prev => (prev + 1) % coupons.length)}
              >
                {coupons.map((c, idx) => {
                  const isTop = idx === topCouponIndex;
                  return (
                    <motion.div 
                      key={c} 
                      initial={{ y: 50, opacity: 0, rotate: 0 }}
                      animate={{ 
                        y: isTop ? 0 : 20, 
                        opacity: isTop ? 1 : 0.85, 
                        rotate: isTop ? -2 : 6,
                        scale: isTop ? 1.05 : 0.95
                      }}
                      transition={{ delay: 0.1, type: 'spring', damping: 15 }}
                      style={{
                        position: 'absolute',
                        background: 'radial-gradient(circle at 0 50%, transparent 10px, #FFF8F0 11px) 0 50%, radial-gradient(circle at 100% 50%, transparent 10px, #FFF8F0 11px) 100% 50%',
                        backgroundSize: '51% 100%',
                        backgroundRepeat: 'no-repeat',
                        border: '2px dashed #C9A84C',
                        padding: '20px 30px',
                        fontFamily: 'var(--font-sans)', fontWeight: 700, color: '#9B2247',
                        fontSize: '1.3rem',
                        boxShadow: isTop ? '0 15px 30px rgba(0,0,0,0.5)' : '0 5px 15px rgba(0,0,0,0.3)',
                        zIndex: isTop ? 2 : 1,
                        width: '85%',
                        maxWidth: 300,
                        textAlign: 'center'
                      }}>
                      🎟️ {COUPON_LABELS[c]}
                    </motion.div>
                  )
                })}
              </div>

              <button
                onClick={onComplete}
                style={{
                  background: 'linear-gradient(135deg, #C9A84C, #A07830)',
                  border: 'none', borderRadius: 100,
                  padding: '16px 40px', color: '#FFF',
                  fontFamily: 'var(--font-sans)', fontWeight: 700, fontSize: '1.1rem',
                  cursor: 'pointer', boxShadow: '0 10px 25px rgba(201,168,76,0.4)'
                }}
              >
                {locale === 'hi' ? 'गिफ्ट खोलें 🎁' : 'Open Final Gift 🎁'}
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

    </div>
  );
}
