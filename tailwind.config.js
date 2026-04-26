export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: '#1a4731',
          50:  '#f0faf4',
          100: '#dcf2e5',
          200: '#bbe5cd',
          300: '#8ecfad',
          400: '#5ab187',
          500: '#389367',
          600: '#277551',
          700: '#1a4731',
          800: '#163d2b',
          900: '#0f2b1e',
        },
        accent: {
          DEFAULT: '#c9a84c',
          light:   '#e8c97a',
          dark:    '#a07c2e',
        },
        surface: {
          DEFAULT: '#f7f8f5',
          100: '#f7f8f5',
          200: '#eef0eb',
          300: '#e0e3da',
        },
        ink: {
          DEFAULT: '#1c1e1a',
          muted:   '#4a5040',
          faint:   '#8a9285',
        },
      },
      fontFamily: {
        display: ['"DM Serif Display"', 'Georgia', 'serif'],
        sans:    ['"Plus Jakarta Sans"', 'sans-serif'],
        mono:    ['"JetBrains Mono"', 'monospace'],
      },
      boxShadow: {
        card: '0 1px 3px rgba(26,71,49,0.08), 0 4px 16px rgba(26,71,49,0.06)',
        'card-hover': '0 4px 12px rgba(26,71,49,0.12), 0 12px 32px rgba(26,71,49,0.10)',
        modal: '0 8px 32px rgba(26,71,49,0.20)',
      },
    },
  },
  plugins: [require('@tailwindcss/forms')],
};
