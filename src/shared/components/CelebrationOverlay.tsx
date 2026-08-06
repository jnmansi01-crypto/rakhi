'use client';
import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface Props { count?: number; colors?: string[] }

const DEFAULT_COLORS = ['#C9A84C','#E8751A','#C0392B','#8B2252','#E5C97A','#FFF8F0'];
const PETALS = ['🌸','🌺','✿','❀','🌼'];

interface Particle {
  id: number; x: number; delay: number; duration: number;
  color: string; size: number; sway: number; isPetal: boolean; emoji: string;
}

export function CelebrationOverlay({ count = 60, colors = DEFAULT_COLORS }: Props) {
  const [particles, setParticles] = useState<Particle[]>([]);

  useEffect(() => {
    const ps: Particle[] = Array.from({ length: count }, (_, i) => ({
      id: i,
      x: Math.random() * 100,
      delay: Math.random() * 2,
      duration: 3 + Math.random() * 3,
      color: colors[Math.floor(Math.random() * colors.length)],
      size: 8 + Math.random() * 12,
      sway: (Math.random() - 0.5) * 80,
      isPetal: Math.random() > 0.5,
      emoji: PETALS[Math.floor(Math.random() * PETALS.length)],
    }));
    setParticles(ps);
  }, [count, colors]);

  return (
    <div className="fixed inset-0 pointer-events-none z-50 overflow-hidden">
      {particles.map(p => (
        <motion.div
          key={p.id}
          initial={{ y: -40, x: `${p.x}vw`, opacity: 0, rotate: 0 }}
          animate={{
            y: '110vh',
            x: [`${p.x}vw`, `${p.x + p.sway / 10}vw`, `${p.x}vw`],
            opacity: [0, 1, 1, 0],
            rotate: [0, 180, 360],
          }}
          transition={{
            duration: p.duration,
            delay: p.delay,
            ease: 'linear',
            x: { duration: p.duration, repeat: 0 },
          }}
          style={{
            position: 'fixed',
            top: 0,
            fontSize: p.isPetal ? `${p.size}px` : undefined,
            width:    p.isPetal ? undefined : p.size,
            height:   p.isPetal ? undefined : p.size,
            borderRadius: p.isPetal ? undefined : '50%',
            background: p.isPetal ? undefined : p.color,
          }}
        >
          {p.isPetal ? p.emoji : null}
        </motion.div>
      ))}
    </div>
  );
}
