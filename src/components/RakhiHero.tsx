'use client';
import { motion, MotionValue } from 'framer-motion';

interface Props {
  rotateX: MotionValue<number>;
  rotateY: MotionValue<number>;
}

// Gold sparkle positions (relative to center)
const SPARKLES = [
  { id: 1, x: -115, y: -72, size: 5, delay: 1.0 },
  { id: 2, x: 118,  y: -55, size: 4, delay: 1.4 },
  { id: 3, x: -90,  y: 100, size: 6, delay: 1.7 },
  { id: 4, x: 105,  y: 88,  size: 4, delay: 1.2 },
  { id: 5, x: 8,    y: -120, size: 5, delay: 2.0 },
  { id: 6, x: -130, y: 5,   size: 4, delay: 1.6 },
  { id: 7, x: 135,  y: 18,  size: 5, delay: 2.3 },
  { id: 8, x: 45,   y: 118, size: 4, delay: 1.9 },
  { id: 9, x: -55,  y: -100, size: 6, delay: 2.5 },
  { id: 10, x: 70,  y: -95,  size: 3, delay: 1.1 },
];

// 4-point star path
const STAR_PATH = 'M 0,-8 L 2,-2 L 8,0 L 2,2 L 0,8 L -2,2 L -8,0 L -2,-2 Z';

export function RakhiHero({ rotateX, rotateY }: Props) {
  return (
    <div
      style={{
        position: 'relative',
        width: 320,
        height: 300,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
      }}
    >
      {/* ── Ambient warm glow (builds in before rakhi) ── */}
      <motion.div
        initial={{ opacity: 0, scale: 0.4 }}
        animate={{ opacity: [0, 0.55, 0.38], scale: [0.4, 1.15, 1] }}
        transition={{ duration: 1.6, times: [0, 0.5, 1], ease: 'easeOut' }}
        style={{
          position: 'absolute',
          width: 260,
          height: 260,
          borderRadius: '50%',
          background:
            'radial-gradient(circle, rgba(232,117,26,0.45) 0%, rgba(201,168,76,0.22) 45%, transparent 72%)',
          filter: 'blur(38px)',
          pointerEvents: 'none',
          zIndex: 0,
        }}
      />

      {/* ── Sapphire blue gem glow (delayed) ── */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: [0, 0.7, 0.45, 0.7] }}
        transition={{ duration: 2.5, delay: 1.8, repeat: Infinity, times: [0, 0.3, 0.7, 1] }}
        style={{
          position: 'absolute',
          width: 100,
          height: 100,
          borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(66,133,244,0.6) 0%, transparent 70%)',
          filter: 'blur(18px)',
          pointerEvents: 'none',
          zIndex: 0,
        }}
      />

      {/* ── Gold sparkle stars ── */}
      {SPARKLES.map((s) => (
        <motion.svg
          key={s.id}
          viewBox="-10 -10 20 20"
          width={s.size * 3}
          height={s.size * 3}
          initial={{ opacity: 0, scale: 0 }}
          animate={{
            opacity: [0, 1, 1, 0],
            scale: [0, 1, 0.8, 0],
            y: [0, -18, -35],
          }}
          transition={{
            duration: 2.2,
            delay: s.delay,
            repeat: Infinity,
            repeatDelay: 2 + (s.id % 3) * 0.8,
            ease: 'easeOut',
          }}
          style={{
            position: 'absolute',
            left: `calc(50% + ${s.x}px - ${(s.size * 3) / 2}px)`,
            top: `calc(50% + ${s.y}px - ${(s.size * 3) / 2}px)`,
            zIndex: 5,
            pointerEvents: 'none',
            overflow: 'visible',
          }}
        >
          <path d={STAR_PATH} fill="#FFD700" opacity="0.9" />
        </motion.svg>
      ))}

      {/* ── 3D Parallax tilt (NO preserve-3d to avoid compositing white backdrop) ── */}
      <motion.div
        style={{
          rotateX,
          rotateY,
          position: 'relative',
          width: '100%',
          height: '100%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 2,
        }}
        animate={{ y: [0, -12, 0] }}
        transition={{ duration: 5, repeat: Infinity, ease: 'easeInOut' }}
      >
        <div
          style={{
            position: 'relative',
            width: 300,
            height: 300,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            WebkitMaskImage: 'radial-gradient(ellipse 75% 68% at 50% 40%, black 40%, transparent 72%)',
            maskImage: 'radial-gradient(ellipse 75% 68% at 50% 40%, black 40%, transparent 72%)',
          }}
        >
          {/* ── Circular reveal mask for "building" animation ── */}
          <motion.div
            initial={{ clipPath: 'circle(0% at 50% 50%)' }}
            animate={{ clipPath: 'circle(100% at 50% 50%)' }}
            transition={{ duration: 1.6, delay: 0.4, ease: [0.16, 1, 0.3, 1] }}
            style={{ position: 'absolute', width: 280, height: 280 }}
          >
            <motion.img
              src="/modern-rakhi.png"
              alt="Beautiful Indian Rakhi"
              initial={{ scale: 1.35, rotate: 20, opacity: 0.2 }}
              animate={{ scale: 1, rotate: 0, opacity: 1 }}
              transition={{ duration: 1.6, delay: 0.4, ease: [0.16, 1, 0.3, 1] }}
              style={{
                width: 280,
                height: 280,
                objectFit: 'contain',
                pointerEvents: 'none',
                display: 'block',
              }}
            />
          </motion.div>

          {/* ── Pulsing gem overlay (appears after build) ── */}
          <motion.div
            initial={{ scale: 0, opacity: 0 }}
            animate={{
              scale: [0, 1.2, 1, 1.1, 1],
              opacity: 1,
            }}
            transition={{
              duration: 0.6,
              delay: 2.1,
              times: [0, 0.4, 0.6, 0.8, 1],
              ease: 'easeOut',
            }}
            style={{ position: 'absolute', pointerEvents: 'none' }}
          >
            <motion.div
              animate={{
                scale: [1, 1.18, 1],
                boxShadow: [
                  '0 0 14px rgba(26,115,232,0.55)',
                  '0 0 28px rgba(26,115,232,0.9)',
                  '0 0 14px rgba(26,115,232,0.55)',
                ],
              }}
              transition={{
                duration: 2.8,
                repeat: Infinity,
                ease: 'easeInOut',
                delay: 2.4,
              }}
              style={{
                width: 22,
                height: 22,
                borderRadius: '50%',
                background:
                  'radial-gradient(circle, #64b5f6 0%, #1565C0 50%, #0d47a1 100%)',
                boxShadow:
                  '0 0 14px rgba(26,115,232,0.55), inset 0 2px 4px rgba(255,255,255,0.5)',
              }}
            />
          </motion.div>
        </div>
      </motion.div>

      {/* ── Ground shadow (appears after build, syncs with float) ── */}
      <motion.div
        initial={{ scaleX: 0, opacity: 0 }}
        animate={{ scaleX: [0, 1, 0.88, 1], opacity: [0, 0.4, 0.25, 0.4] }}
        transition={{
          duration: 5,
          delay: 2,
          times: [0, 0.2, 0.6, 1],
          repeat: Infinity,
          repeatDelay: 0,
          ease: 'easeInOut',
        }}
        style={{
          position: 'absolute',
          bottom: 8,
          left: '50%',
          transform: 'translateX(-50%)',
          width: 160,
          height: 10,
          borderRadius: '50%',
          background: 'rgba(0,0,0,0.5)',
          filter: 'blur(8px)',
          zIndex: 1,
        }}
      />
    </div>
  );
}
