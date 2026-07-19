import type { Locale } from '@/lib/types';
import type React from 'react';

export function NavBtn({ onNext, onBack, disabled, locale = 'en' }: {
  onNext: () => void; onBack?: () => void; disabled?: boolean; locale?: Locale;
}) {
  return (
    <div style={{ display: 'flex', gap: 10, marginTop: 8 }}>
      {onBack && (
        <button onClick={onBack} style={{ ...btnStyle, flex: '0 0 auto', width: 48, padding: '14px' }}>
          ←
        </button>
      )}
      <button
        onClick={onNext}
        disabled={disabled}
        style={{
          ...btnStyle,
          flex: 1,
          background: disabled ? 'rgba(201,168,76,0.15)' : 'linear-gradient(135deg, var(--saffron), var(--deep-red))',
          border: 'none',
          color: disabled ? 'rgba(201,168,76,0.5)' : '#FFF8F0',
          cursor: disabled ? 'not-allowed' : 'pointer',
          boxShadow: disabled ? 'none' : '0 6px 24px rgba(232,117,26,0.3)',
        }}
      >
        {locale === 'hi' ? 'अगला →' : 'Next →'}
      </button>
    </div>
  );
}

export function Row({ label, value }: { label: string; value: string }) {
  return (
    <div style={{ display: 'flex', justifyContent: 'space-between', padding: '8px 0',
      borderBottom: '1px solid rgba(201,168,76,0.1)' }}>
      <span style={{ fontFamily: 'var(--font-sans)', fontSize: '0.82rem', color: 'rgba(26,42,74,0.5)' }}>{label}</span>
      <span style={{ fontFamily: 'var(--font-sans)', fontSize: '0.85rem', color: 'var(--night-blue)', fontWeight: 500 }}>{value}</span>
    </div>
  );
}

export const labelStyle: React.CSSProperties = {
  display: 'block',
  fontFamily: 'var(--font-sans)',
  fontSize: '0.78rem',
  letterSpacing: '0.1em',
  textTransform: 'uppercase',
  color: 'rgba(26,42,74,0.5)',
  marginBottom: 8,
};

export const inputStyle: React.CSSProperties = {
  width: '100%',
  background: 'rgba(201,168,76,0.06)',
  border: '1.5px solid rgba(201,168,76,0.25)',
  borderRadius: 12,
  padding: '14px 16px',
  fontFamily: 'var(--font-sans)',
  fontSize: '1rem',
  color: 'var(--night-blue)',
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
