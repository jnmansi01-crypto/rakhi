'use client';
// Template 02 — SwipeIndicator Component
// Dribbble-inspired (shots/5711008) clean swipe animation indicator.
// A minimal touch-point circle that glides horizontally with a trailing motion line,
// mimicking how a finger swipes across a mobile screen.

import { motion } from 'framer-motion';

interface SwipeIndicatorProps {
  label?: string;
  onClick?: () => void;
  disabled?: boolean;
}

export function SwipeIndicator({ label = 'Swipe', onClick, disabled = false }: SwipeIndicatorProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 6 }}
      animate={{ opacity: disabled ? 0.25 : 0.85, y: 0 }}
      transition={{ delay: 0.3, duration: 0.5 }}
      onClick={!disabled ? onClick : undefined}
      style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: 6,
        cursor: disabled ? 'not-allowed' : 'pointer',
        userSelect: 'none',
      }}
    >
      {/* Animated Touch-Point + Trail Container */}
      <div style={{
        position: 'relative',
        width: 72,
        height: 28,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
      }}>
        {/* Motion trail line that fades behind the touch point */}
        <motion.div
          animate={{ 
            opacity: [0, 0.5, 0.5, 0],
            scaleX: [0, 1, 1, 0],
          }}
          transition={{ 
            repeat: Infinity, 
            duration: 2, 
            ease: 'easeInOut',
            times: [0, 0.25, 0.55, 1],
          }}
          style={{
            position: 'absolute',
            top: '50%',
            left: 8,
            right: 8,
            height: 2,
            borderRadius: 1,
            background: 'linear-gradient(90deg, rgba(212,175,55,0.5), rgba(212,175,55,0.15))',
            transformOrigin: 'right center',
            transform: 'translateY(-50%)',
          }}
        />

        {/* Touch-point circle gliding right-to-left */}
        <motion.div
          animate={{ 
            x: [22, -22],
            opacity: [0, 1, 1, 0],
          }}
          transition={{ 
            repeat: Infinity, 
            duration: 2, 
            ease: [0.4, 0, 0.2, 1],
            times: [0, 0.15, 0.75, 1],
          }}
          style={{
            position: 'relative',
            zIndex: 2,
            width: 14,
            height: 14,
            borderRadius: '50%',
            background: 'radial-gradient(circle at 40% 35%, rgba(255,223,120,0.9), rgba(212,175,55,0.7))',
            boxShadow: '0 0 8px rgba(212,175,55,0.4), 0 0 16px rgba(212,175,55,0.15)',
          }}
        />
      </div>

      {/* "Swipe" label text */}
      <span style={{
        fontSize: '0.68rem',
        fontWeight: 700,
        color: '#a38860',
        letterSpacing: '0.14em',
        textTransform: 'uppercase',
      }}>
        {label}
      </span>
    </motion.div>
  );
}
