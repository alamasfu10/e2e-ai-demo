import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './app/**/*.{ts,tsx}',
    './components/**/*.{ts,tsx}',
  ],
  theme: {
    extend: {
      colors: {
        canvas:  '#F1F1EE',
        ink:     '#0A0A0A',
        void:    '#000000',
        quiet:   '#8A8A86',
        muted:   '#B8B8B3',
        mist:    '#E8E8E5',
        soft:    '#DDDDD9',
        paper:   '#FFFFFF',
        sage:    '#B8D0CA',
        live:    '#22C55E',
      },
      fontFamily: {
        sans:    ['var(--font-inter)', 'system-ui', 'sans-serif'],
        display: ['var(--font-inter)', 'system-ui', 'sans-serif'],
      },
      borderRadius: {
        pill: '999px',
      },
      letterSpacing: {
        tighter2: '-0.04em',
        tighter3: '-0.035em',
        wide2:    '0.06em',
        wide3:    '0.08em',
        wide4:    '0.12em',
      },
    },
  },
  plugins: [],
}

export default config
