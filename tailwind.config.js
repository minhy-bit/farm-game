/** @type {import('tailwindcss').Config} */
export default {
  darkMode: 'class',
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        farm: {
          bg: '#91cbe2',
          surface: '#3f2d24',
          surfaceHover: '#5a3c29',
          card: '#513827',
          border: '#8d6238',
          accent: '#67a947',
          accentLight: '#b9df66',
          primary: '#77ae43',
          soilDry: '#a5653f',
          soilWet: '#70402e',
          sprout: '#b8d957',
          gold: '#e5b94d',
          amber: '#c67b36',
          sky: '#66b9d0'
        },
        mart: {
          bg: '#16222f',
          shelf: '#3b2f2f',
          shelfBorder: '#5a4638',
          counter: '#475569',
          badge: '#0284c7'
        }
      },
      fontFamily: {
        sans: ['Galmuri', 'DungGeunMo', 'Pretendard', 'system-ui', 'sans-serif'],
        mono: ['Galmuri Mono', 'DungGeunMo', 'monospace']
      },
      animation: {
        'bounce-slow': 'bounce 2.5s infinite',
        'pulse-subtle': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'wiggle': 'wiggle 0.3s ease-in-out',
      },
      keyframes: {
        wiggle: {
          '0%, 100%': { transform: 'rotate(-3deg)' },
          '50%': { transform: 'rotate(3deg)' },
        }
      }
    },
  },
  plugins: [],
}
