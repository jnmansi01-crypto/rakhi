import type React from 'react';

export const labelStyle: React.CSSProperties = {
  display: 'block',
  fontFamily: 'var(--font-sans)',
  fontSize: '0.78rem',
  letterSpacing: '0.1em',
  textTransform: 'uppercase',
  color: 'rgba(255,248,240,0.5)',
  marginBottom: 8,
};

export const inputStyle: React.CSSProperties = {
  width: '100%',
  background: 'rgba(255,255,255,0.05)',
  border: '1.5px solid rgba(201,168,76,0.3)',
  borderRadius: 12,
  padding: '14px 16px',
  fontFamily: 'var(--font-sans)',
  fontSize: '1rem',
  color: '#FFF8F0',
  outline: 'none',
  transition: 'border-color 0.2s',
};

export const btnStyle: React.CSSProperties = {
  padding: '14px 24px',
  borderRadius: 100,
  border: '1.5px solid rgba(201,168,76,0.4)',
  background: 'transparent',
  color: 'var(--gold)',
  fontFamily: 'var(--font-sans)',
  fontSize: '0.85rem',
  letterSpacing: '0.08em',
  cursor: 'pointer',
  transition: 'all 0.2s',
  touchAction: 'auto',
};

export function Row({ label, value }: { label: string; value: string }) {
  return (
    <div style={{ display: 'flex', justifyContent: 'space-between', padding: '8px 0',
      borderBottom: '1px solid rgba(255,255,255,0.1)' }}>
      <span style={{ fontFamily: 'var(--font-sans)', fontSize: '0.82rem', color: 'rgba(255,248,240,0.5)' }}>{label}</span>
      <span style={{ fontFamily: 'var(--font-sans)', fontSize: '0.85rem', color: '#FFF8F0', fontWeight: 500 }}>{value}</span>
    </div>
  );
}
