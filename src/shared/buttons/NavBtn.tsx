import type { Locale } from '@/lib/types';
import type React from 'react';
import { btnStyle } from '../inputs/inputs';

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
