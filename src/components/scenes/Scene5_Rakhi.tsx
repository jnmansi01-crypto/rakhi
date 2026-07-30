'use client';
import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence, useMotionValue } from 'framer-motion';
import Image from 'next/image';
import { useHaptics } from '@/hooks/useHaptics';
import { audioEngine } from '@/lib/audio';
import type { Locale } from '@/lib/types';
import confetti from 'canvas-confetti';

interface Props {
  recipientName: string;
  senderName: string;
  locale: Locale;
  onComplete: () => void;
}

const HINTS = [
  { hi: 'तिलक के लिए थाली पर टैप करें', en: 'Tap the Thali for Tilak' },
  { hi: 'अक्षत के लिए टैप करें', en: 'Tap for Akshat (Rice)' },
  { hi: 'राखी के लिए टैप करें', en: 'Tap to reveal Rakhi' },
  { hi: 'राखी को केंद्र में खींचें', en: 'Drag the Rakhi to the center to tie the bond' },
];

function MithaiBoxCSS() {
  return (
    <div style={{
      width: 220, height: 160,
      position: 'relative',
      filter: 'drop-shadow(0 20px 40px rgba(0,0,0,0.8))'
    }}>
      {/* Box Lid - offset to look open */}
      <div style={{
        position: 'absolute', top: -30, left: -20, width: 220, height: 160,
        background: 'linear-gradient(135deg, #9B2247 0%, #7A1B29 100%)',
        borderRadius: 12,
        boxShadow: '0 10px 20px rgba(0,0,0,0.5)',
        border: '1px solid rgba(201,168,76,0.3)',
        transform: 'rotate(-10deg)',
        zIndex: -1
      }}>
        {/* Subtle pattern on lid */}
        <div style={{ position: 'absolute', inset: 6, border: '1px dashed rgba(201,168,76,0.4)', borderRadius: 8 }} />
      </div>
      
      {/* Box Base */}
      <div style={{
        position: 'absolute', inset: 0,
        background: 'linear-gradient(135deg, #7A1B29 0%, #4A0B14 100%)',
        borderRadius: 12,
        border: '2px solid rgba(201,168,76,0.5)',
        overflow: 'hidden'
      }}>
        {/* Inner gold tray */ }
        <div style={{
           position: 'absolute', inset: 12, background: 'linear-gradient(135deg, #D4AF37 0%, #997A00 100%)', borderRadius: 8,
           boxShadow: 'inset 0 10px 20px rgba(0,0,0,0.6)',
           display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gridTemplateRows: 'repeat(2, 1fr)', gap: 8, padding: 8
        }}>
            {/* Ladoos with texture */}
            <div style={{ position: 'relative', background: 'radial-gradient(circle at 30% 30%, #FFD54F, #E65100)', borderRadius: '50%', boxShadow: '2px 4px 8px rgba(0,0,0,0.6)', overflow: 'hidden' }}>
               <div style={{ position: 'absolute', inset: 0, opacity: 0.3, backgroundImage: 'radial-gradient(#000 1px, transparent 1px)', backgroundSize: '4px 4px' }} />
            </div>
            <div style={{ position: 'relative', background: 'radial-gradient(circle at 30% 30%, #FFD54F, #E65100)', borderRadius: '50%', boxShadow: '2px 4px 8px rgba(0,0,0,0.6)', overflow: 'hidden' }}>
               <div style={{ position: 'absolute', inset: 0, opacity: 0.3, backgroundImage: 'radial-gradient(#000 1px, transparent 1px)', backgroundSize: '4px 4px' }} />
            </div>
            
            {/* Kaju Katli (diamond) with silver foil */}
            <div style={{ position: 'relative', background: 'linear-gradient(135deg, #FFF, #E0E0E0)', transform: 'rotate(45deg) scale(0.75)', boxShadow: '2px 2px 8px rgba(0,0,0,0.6)', overflow: 'hidden' }}>
               <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(45deg, transparent 40%, rgba(255,255,255,0.8) 50%, transparent 60%)' }} />
               <div style={{ position: 'absolute', inset: 0, opacity: 0.1, backgroundImage: 'radial-gradient(#000 0.5px, transparent 0.5px)', backgroundSize: '2px 2px' }} />
            </div>
            
            {/* Barfi with pistachios */}
            <div style={{ position: 'relative', background: 'linear-gradient(135deg, #FFF 0%, #F5F5DC 100%)', borderRadius: 4, boxShadow: '2px 4px 8px rgba(0,0,0,0.6)' }}>
               <div style={{ position: 'absolute', top: 4, left: 4, width: 4, height: 4, borderRadius: '50%', background: '#9CCC65' }} />
               <div style={{ position: 'absolute', bottom: 6, right: 6, width: 3, height: 3, borderRadius: '50%', background: '#7CB342' }} />
            </div>
            <div style={{ position: 'relative', background: 'linear-gradient(135deg, #FFF 0%, #F5F5DC 100%)', borderRadius: 4, boxShadow: '2px 4px 8px rgba(0,0,0,0.6)' }}>
               <div style={{ position: 'absolute', top: 6, right: 4, width: 5, height: 3, borderRadius: '50%', background: '#9CCC65', transform: 'rotate(45deg)' }} />
               <div style={{ position: 'absolute', bottom: 4, left: 6, width: 3, height: 4, borderRadius: '50%', background: '#7CB342', transform: 'rotate(-20deg)' }} />
            </div>
            
            {/* Peda with saffron dot */}
            <div style={{ position: 'relative', background: 'radial-gradient(circle at 30% 30%, #FFE082, #FFB300)', borderRadius: '50%', boxShadow: '2px 4px 8px rgba(0,0,0,0.6)' }}>
               <div style={{ position: 'absolute', top: '45%', left: '45%', width: 6, height: 6, borderRadius: '50%', background: '#D84315', filter: 'blur(0.5px)' }} />
            </div>
        </div>
      </div>
    </div>
  );
}

function PaintedSiblingImage({ step }: { step: number }) {
  return (
    <AnimatePresence>
      {(step === 6 || step === 7) && (
        <div style={{
          position: 'absolute', top: '10%', width: '100%', height: '50%',
          display: 'flex', justifyContent: 'center', alignItems: 'center',
          pointerEvents: 'none', zIndex: 25
        }}>
          {/* Watercolor Bloom Animation */}
          <motion.div
            initial={{ opacity: 0, filter: 'grayscale(100%) blur(15px)', scale: 0.85 }}
            animate={step === 6 ? { opacity: 1, filter: 'grayscale(0%) blur(0px)', scale: 1 } : { opacity: 0, scale: 1.15, filter: 'blur(20px)' }}
            transition={{ duration: step === 6 ? 3.0 : 1.5, ease: 'easeOut' }}
            style={{ position: 'relative', width: '100%', height: '100%' }}
          >
            <Image 
              src="/images/siblings.png"
              alt="Siblings Celebrating"
              fill
              style={{ objectFit: 'contain', filter: 'drop-shadow(0 20px 40px rgba(0,0,0,0.5))' }}
              priority
            />
          </motion.div>
          
          {/* Happy Raksha Bandhan Text */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={step === 6 ? { opacity: 1, y: 0 } : { opacity: 0, y: -30 }}
            transition={{ duration: 1.5, delay: 1, ease: 'easeOut' }}
            style={{
              position: 'absolute',
              bottom: '-25%',
              width: '100%',
              textAlign: 'center',
            }}
          >
            <h1 style={{
              fontFamily: 'var(--font-serif)',
              fontSize: '2.5rem',
              color: 'var(--gold)',
              textShadow: '0 4px 12px rgba(0,0,0,0.8)',
              margin: 0
            }}>
              Happy Raksha Bandhan
            </h1>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}

export function Scene5_Rakhi({ recipientName, senderName, locale, onComplete }: Props) {
  const [step, setStep] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const { vibrate } = useHaptics();
  const [particles, setParticles] = useState<{ id: number, type: 'dust' | 'rice', x: number, y: number }[]>([]);
  
  const hapticIntervalRef = useRef<NodeJS.Timeout | null>(null);
  const y = useMotionValue(0);

  const triggerConfetti = () => {
    confetti({
      particleCount: 400,
      spread: 160,
      origin: { y: 0.5 },
      colors: ['#D4AF37', '#FFD700', '#8B2252', '#FF4500']
    });
  };

  useEffect(() => {
    if (step === 5) {
      // Threads drawing (1.5s duration)
      const t = setTimeout(() => setStep(6), 1500);
      return () => clearTimeout(t);
    }
    if (step === 6) {
      // Sibling Animation starts (Walking)
      const t = setTimeout(() => setStep(7), 2500);
      return () => clearTimeout(t);
    }
    if (step === 7) {
      // Siblings meet, Confetti pops, Dissolve begins
      triggerConfetti();
      vibrate('FINAL_REVEAL');
      const t = setTimeout(() => setStep(8), 2000);
      return () => clearTimeout(t);
    }
    if (step === 8) {
      // Cinematic Rakhi Image & Bokeh appears
      const t = setTimeout(() => setStep(9), 1500);
      return () => clearTimeout(t);
    }
    if (step === 9) {
      // Mithai Box appears
      const t = setTimeout(() => setStep(10), 2000);
      return () => clearTimeout(t);
    }
    if (step === 10) {
      // Final message appears -> auto complete
      const t = setTimeout(() => onComplete(), 5000); // Wait 5 seconds so they can read and enjoy
      return () => clearTimeout(t);
    }
  }, [step, onComplete, vibrate]);

  const handleThaliTap = () => {
    if (step >= 3) return;
    
    if (step === 0) {
      vibrate('MEDIUM');
      const newParticles = Array.from({ length: 60 }).map((_, i) => {
        const angle = Math.random() * Math.PI * 2;
        const distance = Math.random() * (typeof window !== 'undefined' ? window.innerWidth * 0.6 : 300);
        return {
          id: Date.now() + i, type: 'dust' as const,
          x: Math.cos(angle) * distance, y: Math.sin(angle) * distance,
        };
      });
      setParticles(newParticles);
      setStep(1);
    } else if (step === 1) {
      vibrate('MEDIUM');
      const newParticles = Array.from({ length: 40 }).map((_, i) => ({
        id: Date.now() + i, type: 'rice' as const,
        x: (Math.random() - 0.5) * (typeof window !== 'undefined' ? window.innerWidth * 1.2 : 400),
        y: 0,
      }));
      setParticles(newParticles);
      setStep(2);
    } else if (step === 2) {
      vibrate('HEAVY');
      setStep(3); // Show Rakhi drag button
      audioEngine.playMagic();
    }
  };

  useEffect(() => {
    return () => {
      if (hapticIntervalRef.current) clearInterval(hapticIntervalRef.current);
    };
  }, []);

  const handleDragStart = () => {
    setIsDragging(true);
    vibrate('LIGHT');
    hapticIntervalRef.current = setInterval(() => vibrate('LIGHT'), 100);
  };

  const handleDragEnd = (event: any, info: any) => {
    setIsDragging(false);
    if (hapticIntervalRef.current) clearInterval(hapticIntervalRef.current);
    
    // If dragged up sufficiently
    if (info.offset.y < -150) {
      vibrate('FINAL_REVEAL');
      setStep(5); // Snap to center, draw threads
      audioEngine.playSwoosh();
    } else {
      vibrate('MEDIUM');
    }
  };

  return (
    <div className="scene" style={{
      background: step >= 5 ? '#050102' : 'radial-gradient(ellipse at 50% 50%, #4A0E17 0%, #2A050A 50%, #150002 100%)',
      transition: 'background 3s ease-in-out',
      display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
      overflow: 'hidden', userSelect: 'none', WebkitUserSelect: 'none'
    }}
      onContextMenu={(e) => e.preventDefault()}
    >
      
      {/* Dynamic Title (Disappears after Thali sequence) */}
      <AnimatePresence>
        {step < 3 && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -40 }}
            transition={{ duration: 1.5 }}
            style={{ position: 'absolute', top: '10%', textAlign: 'center', zIndex: 20, width: '100%', pointerEvents: 'none' }}
          >
            <p style={{ fontFamily: 'var(--font-serif)', fontSize: '1.4rem', color: '#FFF0DC', fontStyle: 'italic', opacity: 0.9 }}>
              {locale === 'hi' ? 'रस्में पूरी करें' : 'Perform the Ritual'}
            </p>
            <p style={{ fontFamily: 'var(--font-script)', fontSize: '2.5rem', color: 'var(--gold)', marginTop: 8 }}>
              {recipientName} ✨
            </p>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Floating Hint Text */}
      <AnimatePresence mode="wait">
        {step <= 3 && !isDragging && (
          <motion.p
            key={step}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.5 }}
            className="hint-text"
            style={{ 
              position: 'absolute', top: step >= 3 ? '15%' : '25%', 
              color: '#FFF0DC', opacity: 0.8, letterSpacing: '0.1em', zIndex: 30, pointerEvents: 'none',
              textAlign: 'center', width: '100%', textShadow: '0 2px 10px rgba(0,0,0,0.8)'
            }}
          >
            {locale === 'hi' ? HINTS[step].hi : HINTS[step].en}
          </motion.p>
        )}
      </AnimatePresence>

      {/* Tilak / Akshat Particles */}
      <AnimatePresence>
        {step < 3 && particles.map(p => (
          <motion.div
            key={p.id}
            initial={p.type === 'dust' ? { opacity: 1, scale: 0, x: 0, y: 0 } : { opacity: 0, y: typeof window !== 'undefined' ? -window.innerHeight / 2 : -400, x: p.x, rotate: Math.random() * 360 }}
            animate={p.type === 'dust'
              ? { opacity: 0, scale: Math.random() * 3 + 1.5, x: p.x, y: p.y, filter: 'blur(1px)' }
              : { opacity: [0, 1, 0], y: typeof window !== 'undefined' ? window.innerHeight / 2 : 400, rotate: Math.random() * 720 }
            }
            transition={{ duration: p.type === 'dust' ? 1.5 + Math.random() : 2.5 + Math.random() * 2, ease: p.type === 'dust' ? 'easeOut' : 'linear' }}
            style={{
              position: 'absolute', zIndex: 5, pointerEvents: 'none',
              width: p.type === 'dust' ? Math.random() * 25 + 15 : 6,
              height: p.type === 'dust' ? Math.random() * 25 + 15 : 12,
              borderRadius: p.type === 'dust' ? '50%' : '2px',
              background: p.type === 'dust' ? 'rgba(211, 47, 47, 0.85)' : '#FFF8E7',
              boxShadow: p.type === 'dust' ? '0 0 25px rgba(211,47,47,0.9)' : '0 2px 5px rgba(212,175,55,0.8)',
            }}
          />
        ))}
      </AnimatePresence>

      {/* The Divine Thali (Steps 0-2) */}
      <AnimatePresence>
        {step < 3 && (
          <motion.div
            onClick={handleThaliTap}
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1, y: [0, -10, 0], filter: 'drop-shadow(0 20px 40px rgba(0,0,0,0.8))' }}
            exit={{ opacity: 0, scale: 0.8, filter: 'blur(10px)' }}
            transition={{ opacity: { duration: 1.5 }, scale: { duration: 1, ease: 'easeOut' }, y: { duration: 6, repeat: Infinity, ease: 'easeInOut' }, exit: { duration: 1.5, ease: 'easeInOut' } }}
            whileTap={{ scale: 0.97 }}
            style={{ position: 'relative', width: '90%', maxWidth: 400, aspectRatio: '1/1', cursor: 'pointer', zIndex: 10, borderRadius: '50%' }}
          >
            <Image src="/images/rakhi_thali.png" alt="Rakhi Thali" fill sizes="(max-width: 768px) 100vw, 33vw" style={{ objectFit: 'cover', borderRadius: '50%' }} />
          </motion.div>
        )}
      </AnimatePresence>

      {/* Target Area for Drag */}
      <AnimatePresence>
        {step === 3 && !isDragging && (
          <motion.div
            initial={{ opacity: 0, scale: 0.5 }}
            animate={{ opacity: 0.3, scale: 1 }}
            exit={{ opacity: 0, scale: 1.5 }}
            transition={{ duration: 0.5 }}
            style={{
              position: 'absolute', top: '35%', width: 150, height: 150,
              border: '2px dashed rgba(255,215,0,0.5)', borderRadius: '50%',
              zIndex: 2, pointerEvents: 'none', display: 'flex', alignItems: 'center', justifyContent: 'center'
            }}
          >
            <motion.div
              animate={{ scale: [1, 1.2, 1], opacity: [0.3, 0.6, 0.3] }}
              transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
              style={{ width: 100, height: 100, borderRadius: '50%', background: 'radial-gradient(circle, rgba(255,215,0,0.2) 0%, transparent 70%)' }}
            />
          </motion.div>
        )}
      </AnimatePresence>

      {/* Cinematic Ambient Glow */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: step >= 6 ? 1 : (step >= 5 ? 0.6 : 0) }}
        transition={{ duration: 1.5 }}
        style={{
          position: 'absolute', width: '150%', height: '150%',
          background: `radial-gradient(ellipse at 50% 50%, rgba(212,175,55,0.15) 0%, rgba(139,34,82,0.1) 40%, transparent 70%)`,
          zIndex: 1, mixBlendMode: 'screen', pointerEvents: 'none'
        }}
      />

      {/* Subtle Ambient Dust (Like Scene 6) */}
      <AnimatePresence>
        {step >= 5 && [...Array(30)].map((_, i) => {
          const left = (i * 13) % 100;
          const top = (i * 29) % 100;
          const duration = 5 + (i % 4) * 2;
          const delay = (i % 5) * 0.5;
          return (
            <motion.div
              key={`dust-bg-${i}`}
              initial={{ opacity: 0, y: 0, x: 0 }}
              animate={{ 
                opacity: [0, 0.5, 0.5, 0], 
                y: [-10, 40],
                x: [(i % 2 === 0 ? -15 : 15), (i % 2 === 0 ? 15 : -15)],
              }}
              transition={{ 
                duration: duration, 
                repeat: Infinity, 
                delay: delay,
                ease: "easeInOut"
              }}
              style={{
                position: 'absolute',
                width: 2.5, height: 2.5, borderRadius: '50%',
                background: 'var(--gold)',
                left: `${left}%`,
                top: `${top}%`,
                filter: 'blur(1px)',
                zIndex: 1, pointerEvents: 'none'
              }}
            />
          );
        })}
      </AnimatePresence>

      {/* Elegant Bokeh Fireflies */}
      <AnimatePresence>
        {step >= 8 && Array.from({ length: 30 }).map((_, i) => {
          const startX = typeof window !== 'undefined' ? (Math.random() * window.innerWidth) : 250;
          return (
            <motion.div
              key={`bokeh-${i}`}
              initial={{ y: typeof window !== 'undefined' ? (window.innerHeight / 2) + 100 : 400, x: typeof window !== 'undefined' ? window.innerWidth / 2 : 200, opacity: 0, scale: 0 }}
              animate={{ y: -100, x: startX, opacity: [0, 0.8, Math.random() * 0.5 + 0.2, 0], scale: Math.random() * 1.5 + 0.5 }}
              transition={{ 
                duration: 8 + Math.random() * 7, 
                repeat: Infinity, 
                ease: 'easeOut',
                opacity: { duration: 8, times: [0, 0.05, 0.3, 1], repeat: Infinity }
              }}
              style={{
                position: 'fixed', width: Math.random() * 10 + 5, height: Math.random() * 10 + 5, borderRadius: '50%',
                background: i % 3 === 0 ? '#FFFFFF' : '#FFD700',
                boxShadow: i % 3 === 0 ? '0 0 15px 5px rgba(255,255,255,0.4)' : '0 0 20px 8px rgba(255,215,0,0.3)',
                zIndex: 1, pointerEvents: 'none', filter: `blur(${Math.random() * 3 + 1}px)`
              }}
            />
          );
        })}
      </AnimatePresence>
      {/* Sibling Animation Sequence */}
      <PaintedSiblingImage step={step} />

      {/* The Cinematic Reveal (Premium Transparent Image) */}
      <motion.div
        initial={{ opacity: 0, scale: 0.8, y: 50 }}
        animate={{ 
          opacity: step >= 8 ? 1 : 0, 
          scale: step >= 8 ? 1 : 0.8, 
          y: step >= 8 ? 0 : 50 
        }}
        transition={{ duration: 3, ease: 'easeOut' }}
        style={{
          position: 'absolute', zIndex: 4, pointerEvents: 'none',
          width: '100%', top: '8%', height: '38%',
          display: 'flex', alignItems: 'center', justifyContent: 'center'
        }}
      >
        <Image 
          src="/images/rakhi_transparent.png" 
          alt="Rakhi" 
          fill
          style={{ objectFit: 'contain', filter: 'drop-shadow(0 20px 40px rgba(0,0,0,0.8))' }}
        />
      </motion.div>

      {/* Removed Mithai Box per user request, just keeping the Rakhi graphic */}

      {/* Final Message */}
      <AnimatePresence>
        {step >= 10 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 2, ease: 'easeOut' }}
            style={{
              position: 'absolute', bottom: '10%', width: '100%', textAlign: 'center', zIndex: 20
            }}
          >
             <p style={{ fontFamily: 'var(--font-sans)', fontSize: '0.9rem', letterSpacing: '0.1em', color: '#C9A84C', textTransform: 'uppercase' }}>
                {locale === 'hi' ? 'आपका उपहार आपका इंतज़ार कर रहा है...' : 'Your gift is waiting for you...'}
             </p>
          </motion.div>
        )}
      </AnimatePresence>

      {/* The Rakhi Medallion BUTTON - Draggable & Tying */}
      <AnimatePresence>
        {step >= 3 && (
          <motion.div
            drag={step === 3 ? "y" : false}
            dragConstraints={{ top: -200, bottom: 0 }}
            dragElastic={0.2}
            onDragStart={handleDragStart}
            onDragEnd={handleDragEnd}
            style={step === 3 ? { 
              y, position: 'absolute', bottom: '15%', zIndex: 30, cursor: 'grab', touchAction: 'none'
            } : { 
              position: 'absolute', bottom: '15%', zIndex: 30, cursor: 'default'
            }}
            initial={{ opacity: 0, y: 100, scale: 0.5 }}
            animate={{ 
              opacity: step >= 6 ? 0 : 1, 
              y: step >= 8 ? -420 : (step >= 5 ? -220 : 0), 
              scale: isDragging ? 1.1 : (step >= 8 ? 0.6 : (step >= 5 ? 1.2 : 1)) 
            }}
            transition={{ 
              opacity: { duration: 1.0, delay: 0.5 }, 
              y: { duration: 1.5, type: 'spring', bounce: 0.3 }, 
              scale: { duration: 1.5, ease: 'easeInOut' }
            }}
            className="rakhi-drag-button"
            whileDrag={{ cursor: 'grabbing' }}
          >
            <div style={{ position: 'relative', width: 140, height: 140, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              {/* Glowing Aura when tied (Step 6+) */}
              <motion.div
                animate={{ opacity: step >= 6 ? 0.8 : (isDragging ? 0.5 : 0), scale: step >= 6 ? [1, 1.3, 1] : 1 }}
                transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
                style={{ position: 'absolute', width: 220, height: 220, borderRadius: '50%', background: 'radial-gradient(circle, rgba(255,215,0,0.5) 0%, transparent 70%)', zIndex: -1 }}
              />
              
              {/* The Threads (Draw when step >= 5) */}
              <svg style={{ position: 'absolute', width: 1000, height: 400, left: '50%', top: '50%', transform: 'translate(-50%, -50%)', pointerEvents: 'none', zIndex: -2 }} viewBox="0 0 1000 400">
                <motion.path d="M 0 300 Q 250 300 440 200" fill="none" stroke="#FFD700" strokeWidth="6"
                  initial={{ pathLength: 0, opacity: 0 }} animate={{ pathLength: step >= 5 ? 1 : 0, opacity: step >= 5 ? 1 : 0 }}
                  transition={{ duration: 1.5, ease: 'easeOut' }} />
                <motion.path d="M 1000 100 Q 750 100 560 200" fill="none" stroke="#FFD700" strokeWidth="6"
                  initial={{ pathLength: 0, opacity: 0 }} animate={{ pathLength: step >= 5 ? 1 : 0, opacity: step >= 5 ? 1 : 0 }}
                  transition={{ duration: 1.5, ease: 'easeOut' }} />
                <motion.path d="M 0 320 Q 250 320 440 210" fill="none" stroke="#8B2252" strokeWidth="3"
                  initial={{ pathLength: 0, opacity: 0 }} animate={{ pathLength: step >= 5 ? 1 : 0, opacity: step >= 5 ? 1 : 0 }}
                  transition={{ duration: 1.5, delay: 0.2, ease: 'easeOut' }} />
                <motion.path d="M 1000 80 Q 750 80 560 190" fill="none" stroke="#8B2252" strokeWidth="3"
                  initial={{ pathLength: 0, opacity: 0 }} animate={{ pathLength: step >= 5 ? 1 : 0, opacity: step >= 5 ? 1 : 0 }}
                  transition={{ duration: 1.5, delay: 0.2, ease: 'easeOut' }} />
              </svg>

              {/* SVG Rakhi Button */}
              <svg viewBox="0 0 100 100" style={{ 
                width: '100%', height: '100%', 
                filter: step >= 6 ? 'drop-shadow(0 0 25px rgba(255,215,0,0.9))' : 'drop-shadow(0 10px 15px rgba(0,0,0,0.8))',
                transition: 'filter 1.5s ease-in-out'
              }}>
                <path d="M0,50 Q25,30 50,50 T100,50" fill="none" stroke="#FFD700" strokeWidth="3" />
                <path d="M0,50 Q25,70 50,50 T100,50" fill="none" stroke="#8B2252" strokeWidth="2" />
                <circle cx="50" cy="50" r="40" fill="#FFD700" />
                <circle cx="50" cy="50" r="36" fill="#8B2252" />
                {Array.from({ length: 12 }).map((_, i) => (
                  <path key={`rp-${i}`} d="M50,14 Q55,25 50,30 Q45,25 50,14 Z" fill="#FFD700" transform={`rotate(${i * 30} 50 50)`} />
                ))}
                <circle cx="50" cy="50" r="15" fill="#FFD700" />
                <circle cx="50" cy="50" r="10" fill="#FFF0DC" />
                <circle cx="50" cy="50" r="5" fill="#FF4500" />
              </svg>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

    </div>
  );
}
