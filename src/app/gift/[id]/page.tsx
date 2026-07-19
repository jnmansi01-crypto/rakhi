'use client';
import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { getExperience } from '@/lib/storage';
import { ExperienceEngine } from '@/components/ExperienceEngine';
import type { RakhiExperience } from '@/lib/types';

export default function GiftPage({ params }: { params: { id: string } }) {
  const [experience, setExperience] = useState<RakhiExperience | null>(null);
  const [loading, setLoading] = useState(true);
  const [missing, setMissing] = useState(false);

  useEffect(() => {
    getExperience(params.id)
      .then(exp => {
        if (!exp) setMissing(true);
        else setExperience(exp);
      })
      .catch(() => setMissing(true))
      .finally(() => setLoading(false));
  }, [params.id]);

  // ── Loading ───────────────────────────────────────────────────
  if (loading) {
    return (
      <div style={{
        position: 'fixed', inset: 0,
        background: 'radial-gradient(ellipse at 50% 60%, #2D1B4E 0%, #1A2A4A 50%, #0D1526 100%)',
        display: 'flex', flexDirection: 'column',
        alignItems: 'center', justifyContent: 'center', gap: 24,
      }}>
        {/* Mandala rings */}
        {[80, 130, 180].map((size, i) => (
          <div key={i} style={{
            position: 'absolute',
            width: size, height: size,
            borderRadius: '50%',
            border: '1px solid rgba(201,168,76,0.2)',
            animation: `mandala-spin ${12 + i * 4}s linear infinite`,
          }}/>
        ))}
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 2, repeat: Infinity, ease: 'linear' }}
          style={{ fontSize: '2.8rem' }}
        >
          🌸
        </motion.div>
        <p style={{
          fontFamily: 'var(--font-serif)', fontStyle: 'italic',
          fontSize: '1rem', color: 'rgba(255,248,240,0.6)',
        }}>
          Opening your gift…
        </p>
      </div>
    );
  }

  // ── Not found ─────────────────────────────────────────────────
  if (missing || !experience) {
    return (
      <div style={{
        position: 'fixed', inset: 0,
        background: 'radial-gradient(ellipse at 50% 60%, #2D1B4E 0%, #1A2A4A 50%, #0D1526 100%)',
        display: 'flex', flexDirection: 'column',
        alignItems: 'center', justifyContent: 'center', gap: 16,
        padding: '40px 32px', textAlign: 'center',
      }}>
        <span style={{ fontSize: '3rem' }}>🎁</span>
        <p style={{
          fontFamily: 'var(--font-serif)', fontSize: '1.3rem',
          color: '#FFF8F0', fontStyle: 'italic',
        }}>
          Gift not found
        </p>
        <p style={{
          fontFamily: 'var(--font-sans)', fontSize: '0.85rem',
          color: 'rgba(255,248,240,0.45)', lineHeight: 1.7,
        }}>
          This gift link may have expired or the link is incorrect.<br/>
          Ask your sibling to resend the link.
        </p>
      </div>
    );
  }

  return <ExperienceEngine experience={experience} />;
}
