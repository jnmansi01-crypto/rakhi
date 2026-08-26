'use client';
import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useHaptics } from '@/shared/components/useHaptics';
import { audioEngine } from '@/shared/audio/audio';
import confetti from 'canvas-confetti';

interface Props {
  photoUrl: string;
  onComplete: () => void;
}

const QUESTIONS = [
  "Who is Mom's favorite?",
  "Who eats the last slice of pizza?",
  "Who causes the most drama?",
  "Who is the bigger troublemaker?"
];

export function Scene4_Scratch({ photoUrl, onComplete }: Props) {
  const { vibrate } = useHaptics();
  
  // Game state
  const [currentQuestionIdx, setCurrentQuestionIdx] = useState(0);
  const [flippedTiles, setFlippedTiles] = useState<number[]>([]);
  const [isComplete, setIsComplete] = useState(false);

  // Random sequence for flipping tiles (0 to 3)
  const flipSequenceRef = useRef<number[]>([]);
  useEffect(() => {
    const seq = [0, 1, 2, 3];
    for (let i = seq.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [seq[i], seq[j]] = [seq[j], seq[i]];
    }
    flipSequenceRef.current = seq;
  }, []);

  const handleAnswer = () => {
    if (isComplete) return;

    vibrate('MEDIUM');
    audioEngine.playPaper();
    
    // Flip a tile
    setFlippedTiles(prev => [...prev, flipSequenceRef.current[prev.length]]);
    
    if (currentQuestionIdx < QUESTIONS.length - 1) {
      setCurrentQuestionIdx(prev => prev + 1);
    } else {
      setIsComplete(true);
      vibrate('FINAL_REVEAL');
      audioEngine.playMagic();
      confetti({
        particleCount: 100, spread: 70, origin: { y: 0.6 },
        colors: ['#C9A84C', '#E8751A', '#FFF8F0']
      });
    }
  };

  return (
    <div className="scene" style={{
      background: 'radial-gradient(ellipse at 50% 50%, #2A1505 0%, #160C04 45%, #0D1526 100%)',
      display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
      overflow: 'hidden', userSelect: 'none', WebkitUserSelect: 'none', padding: 20,
      position: 'absolute', inset: 0
    }}>
      
      {/* Title */}
      <motion.div 
        initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }}
        style={{ textAlign: 'center', marginBottom: 20, color: '#FFF8F0', zIndex: 10, minHeight: 40 }}
      >
        <h2 style={{ fontFamily: 'var(--font-serif)', fontSize: '1.6rem', margin: 0, color: '#C9A84C' }}>
          {isComplete ? "Memory Unlocked!" : "The Blame Game"}
        </h2>
      </motion.div>

      {/* 2x2 Photo Grid */}
      <div style={{
        position: 'relative',
        width: '100%', maxWidth: 300,
        aspectRatio: '3/4',
        display: 'grid', gridTemplateColumns: '1fr 1fr', gridTemplateRows: '1fr 1fr',
        gap: 2,
        perspective: 1000,
        zIndex: 5,
        marginBottom: 30
      }}>
        {[0, 1, 2, 3].map((index) => {
          const isFlipped = flippedTiles.includes(index);
          const bgPosX = index % 2 === 0 ? '0%' : '100%';
          const bgPosY = index < 2 ? '0%' : '100%';

          return (
            <motion.div
              key={index}
              style={{
                position: 'relative',
                width: '100%', height: '100%',
                transformStyle: 'preserve-3d',
              }}
              animate={{ rotateY: isFlipped ? 180 : 0 }}
              transition={{ duration: 0.8, type: 'spring', stiffness: 100, damping: 15 }}
            >
              {/* Front (Hidden state) */}
              <div style={{
                position: 'absolute', inset: 0,
                background: 'linear-gradient(135deg, #C9A84C, #A07830)',
                backfaceVisibility: 'hidden',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
              }}>
                <div style={{
                  width: '60%', height: '60%', border: '2px dashed rgba(255,255,255,0.4)', borderRadius: 4
                }} />
              </div>

              {/* Back (Revealed photo piece) */}
              <div style={{
                position: 'absolute', inset: 0,
                backfaceVisibility: 'hidden',
                transform: 'rotateY(180deg)',
                backgroundImage: `url(${photoUrl})`,
                backgroundSize: '200% 200%',
                backgroundPosition: `${bgPosX} ${bgPosY}`,
                boxShadow: isComplete ? '0 0 20px rgba(201,168,76,0.5)' : 'none',
                transition: 'box-shadow 1s'
              }} />
            </motion.div>
          );
        })}

        {/* Overlay with Questions */}
        <AnimatePresence>
          {!isComplete && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              style={{
                position: 'absolute',
                inset: 0,
                zIndex: 10,
                backgroundColor: 'rgba(0, 0, 0, 0.75)',
                backdropFilter: 'blur(8px)',
                WebkitBackdropFilter: 'blur(8px)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                padding: 24,
                textAlign: 'center',
                borderRadius: 2
              }}
            >
              <AnimatePresence mode="wait">
                <motion.p 
                  key={currentQuestionIdx}
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 1.1 }}
                  transition={{ duration: 0.3 }}
                  style={{ 
                    fontFamily: 'var(--font-serif)', 
                    fontSize: '1.6rem', 
                    fontWeight: 600, 
                    color: '#FFF8F0', 
                    margin: 0, 
                    lineHeight: 1.4,
                    textShadow: '0 2px 10px rgba(0,0,0,0.8)'
                  }}
                >
                  {QUESTIONS[currentQuestionIdx]}
                </motion.p>
              </AnimatePresence>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Interaction Area */}
      <div style={{ height: 100, display: 'flex', alignItems: 'center', justifyContent: 'center', width: '100%' }}>
        <AnimatePresence mode="wait">
          {!isComplete ? (
            <motion.div 
              key="questions"
              initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, scale: 0.8 }}
              style={{ display: 'flex', gap: 20 }}
            >
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={handleAnswer}
                style={{
                  background: 'rgba(255, 255, 255, 0.1)',
                  border: '1.5px solid #C9A84C',
                  borderRadius: 12, padding: '15px 30px',
                  color: '#FFF', fontSize: '1.1rem', fontWeight: 'bold',
                  cursor: 'pointer', boxShadow: '0 4px 15px rgba(0,0,0,0.3)'
                }}
              >
                ME 🙋‍♀️
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={handleAnswer}
                style={{
                  background: 'linear-gradient(135deg, #e8751a, #a11b1b)',
                  border: 'none',
                  borderRadius: 12, padding: '15px 30px',
                  color: '#FFF', fontSize: '1.1rem', fontWeight: 'bold',
                  cursor: 'pointer', boxShadow: '0 4px 15px rgba(232,117,26,0.4)'
                }}
              >
                YOU 🫵
              </motion.button>
            </motion.div>
          ) : (
            <motion.button
              key="continue"
              initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1 }}
              onClick={onComplete}
              style={{
                background: 'linear-gradient(135deg, #C9A84C 0%, #E5C97A 50%, #C9A84C 100%)',
                border: 'none', borderRadius: 100, padding: '15px 40px',
                color: '#3D1A00', fontFamily: 'var(--font-sans)', fontSize: '1rem',
                fontWeight: 800, letterSpacing: '0.1em', textTransform: 'uppercase',
                boxShadow: '0 8px 25px rgba(201,168,76,0.4)',
                cursor: 'pointer'
              }}
            >
              Continue →
            </motion.button>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
