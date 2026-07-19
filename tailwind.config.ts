/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./src/**/*.{js,ts,jsx,tsx,mdx}'],
  theme: {
    extend: {
      colors: {
        gold:      '#C9A84C',
        'gold-light': '#E5C97A',
        saffron:   '#E8751A',
        'deep-red':'#C0392B',
        'night-blue': '#1A2A4A',
        cream:     '#FFF8F0',
        'warm-white': '#FFFDF8',
        'deep-rose': '#8B2252',
      },
      fontFamily: {
        serif:  ['var(--font-serif)', 'Georgia', 'serif'],
        sans:   ['var(--font-sans)', 'system-ui', 'sans-serif'],
      },
      boxShadow: {
        'object': '0 20px 60px rgba(26,42,74,0.20), 0 4px 16px rgba(26,42,74,0.10)',
        'lift':   '0 40px 100px rgba(26,42,74,0.35), 0 10px 30px rgba(26,42,74,0.15)',
        'glow':   '0 0 30px rgba(201,168,76,0.50), 0 0 60px rgba(201,168,76,0.20)',
        'inner-glow': 'inset 0 0 40px rgba(201,168,76,0.12)',
      },
      keyframes: {
        'float': {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%':      { transform: 'translateY(-10px)' },
        },
        'shimmer': {
          '0%':   { backgroundPosition: '-200% 0' },
          '100%': { backgroundPosition: '200% 0' },
        },
        'petal-fall': {
          '0%':   { transform: 'translateY(-20px) rotate(0deg)', opacity: '0' },
          '10%':  { opacity: '1' },
          '100%': { transform: 'translateY(100vh) rotate(720deg)', opacity: '0' },
        },
        'mandala-spin': {
          '0%':   { transform: 'rotate(0deg)' },
          '100%': { transform: 'rotate(360deg)' },
        },
        'heartbeat': {
          '0%, 100%': { transform: 'scale(1)' },
          '50%':      { transform: 'scale(1.08)' },
        },
      },
      animation: {
        'float':        'float 4s ease-in-out infinite',
        'shimmer':      'shimmer 3s linear infinite',
        'petal-fall':   'petal-fall 4s ease-in-out forwards',
        'mandala-spin': 'mandala-spin 20s linear infinite',
        'heartbeat':    'heartbeat 2s ease-in-out infinite',
      },
    },
  },
  plugins: [],
};
