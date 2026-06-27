/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        dark: {
          950: '#07071a',
          900: '#0a0a1f',
          800: '#0f0f28',
          700: '#141432',
          600: '#1c1c42',
          500: '#252560',
          400: '#3a3a7a',
        },
        primary: {
          DEFAULT: '#6366f1',
          50:  '#eef2ff',
          100: '#e0e7ff',
          200: '#c7d2fe',
          300: '#a5b4fc',
          400: '#818cf8',
          500: '#6366f1',
          600: '#4f46e5',
          700: '#4338ca',
        },
        accent: {
          DEFAULT: '#8b5cf6',
          400: '#a78bfa',
          500: '#8b5cf6',
          600: '#7c3aed',
        },
        success: { DEFAULT: '#10b981', bg: 'rgba(16,185,129,0.12)' },
        warning: { DEFAULT: '#f59e0b', bg: 'rgba(245,158,11,0.12)' },
        danger:  { DEFAULT: '#ef4444', bg: 'rgba(239,68,68,0.12)'  },
        // task status colours
        open:     '#f59e0b',
        progress: '#6366f1',
        done:     '#10b981',
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
      },
      backgroundImage: {
        'page-gradient': 'radial-gradient(ellipse at 20% 50%, rgba(99,102,241,0.08) 0%, transparent 60%), radial-gradient(ellipse at 80% 20%, rgba(139,92,246,0.06) 0%, transparent 50%)',
        'card-gradient': 'linear-gradient(135deg, rgba(255,255,255,0.04) 0%, rgba(255,255,255,0.01) 100%)',
        'sidebar-gradient': 'linear-gradient(180deg, #0d0d25 0%, #0a0a1f 100%)',
        'btn-primary': 'linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)',
        'avatar-gradient': 'linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)',
        'stat-open': 'linear-gradient(135deg, rgba(245,158,11,0.12) 0%, rgba(245,158,11,0.04) 100%)',
        'stat-progress': 'linear-gradient(135deg, rgba(99,102,241,0.12) 0%, rgba(99,102,241,0.04) 100%)',
        'stat-done': 'linear-gradient(135deg, rgba(16,185,129,0.12) 0%, rgba(16,185,129,0.04) 100%)',
        'stat-total': 'linear-gradient(135deg, rgba(139,92,246,0.12) 0%, rgba(139,92,246,0.04) 100%)',
      },
      boxShadow: {
        'card': '0 8px 32px rgba(0,0,0,0.4), inset 0 1px 0 rgba(255,255,255,0.05)',
        'glow': '0 0 30px rgba(99,102,241,0.2)',
        'glow-sm': '0 0 15px rgba(99,102,241,0.15)',
        'sidebar': '4px 0 24px rgba(0,0,0,0.4)',
        'btn': '0 4px 15px rgba(99,102,241,0.35)',
      },
      backdropBlur: {
        'glass': '12px',
      },
      animation: {
        'fade-in': 'fadeIn 0.3s ease-out',
        'slide-up': 'slideUp 0.4s ease-out',
        'spin-slow': 'spin 1.5s linear infinite',
      },
      keyframes: {
        fadeIn: {
          '0%':   { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideUp: {
          '0%':   { opacity: '0', transform: 'translateY(20px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
      },
      borderColor: {
        DEFAULT: 'rgba(255,255,255,0.06)',
      },
    },
  },
  plugins: [],
}
