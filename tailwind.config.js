/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./app/**/*.{js,ts,jsx,tsx}', './components/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        cream: '#FFF8F0',
        sand: '#F5EBD8',
        coffee: { 100: '#EEDCC5', 400: '#8B6B4A', 700: '#4A3520', 800: '#2D2016' },
        amber: { 50: '#FFF8E7', 100: '#FFEFC2', 300: '#F0C060', 400: '#E5A832', 500: '#D4942A', 600: '#B87D1F' },
        teal: { 50: '#E8FBF7', 100: '#C2F5EA', 400: '#38C9B1', 500: '#2DB89F', 600: '#1FA088' },
        coral: { 50: '#FFF0ED', 400: '#F2826A', 500: '#E8664E' },
        sky: { 300: '#7DD3FC', 400: '#5BC0EB' },
        leaf: { 400: '#66BB6A', 500: '#4CAF50' },
      },
      keyframes: {
        'float': { '0%,100%': { transform: 'translateY(0)' }, '50%': { transform: 'translateY(-6px)' } },
        'fade-up': { '0%': { opacity: '0', transform: 'translateY(16px)' }, '100%': { opacity: '1', transform: 'translateY(0)' } },
        'scale-pop': { '0%': { transform: 'scale(0)' }, '70%': { transform: 'scale(1.15)' }, '100%': { transform: 'scale(1)' } },
        'bounce-in': { '0%': { transform: 'translateY(100px)', opacity: '0' }, '60%': { transform: 'translateY(-10px)', opacity: '1' }, '100%': { transform: 'translateY(0)' } },
        'wiggle': { '0%,100%': { transform: 'rotate(0)' }, '25%': { transform: 'rotate(-5deg)' }, '75%': { transform: 'rotate(5deg)' } },
        'confetti-fall': { '0%': { transform: 'translateY(-10px) rotate(0)', opacity: '1' }, '100%': { transform: 'translateY(100vh) rotate(720deg)', opacity: '0' } },
        'ripple': { '0%': { transform: 'scale(0)', opacity: '0.5' }, '100%': { transform: 'scale(4)', opacity: '0' } },
        'star-earn': { '0%': { transform: 'scale(1)' }, '50%': { transform: 'scale(1.5)' }, '100%': { transform: 'scale(1)' } },
        'drift': { '0%': { transform: 'translate(0,0)' }, '50%': { transform: 'translate(10px,-5px)' }, '100%': { transform: 'translate(0,0)' } },
        'pulse-glow': { '0%,100%': { boxShadow: '0 0 0 0 rgba(212,148,42,0.3)' }, '50%': { boxShadow: '0 0 20px 8px rgba(212,148,42,0.15)' } },
      },
      animation: {
        'float': 'float 3s ease-in-out infinite',
        'fade-up': 'fade-up 0.6s ease forwards',
        'scale-pop': 'scale-pop 0.4s ease forwards',
        'bounce-in': 'bounce-in 0.7s ease forwards',
        'wiggle': 'wiggle 0.5s ease',
        'confetti': 'confetti-fall 2s ease forwards',
        'ripple': 'ripple 0.6s ease forwards',
        'star-earn': 'star-earn 0.4s ease',
        'drift': 'drift 6s ease-in-out infinite',
        'pulse-glow': 'pulse-glow 1.5s ease-in-out infinite',
      },
    },
  },
  plugins: [],
}
