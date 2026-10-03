/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  darkMode: 'class',
  theme: {
    extend: {
      fontFamily: {
        sans: ['"Inter"', 'system-ui', '-apple-system', 'sans-serif'],
        mono: ['"JetBrains Mono"', 'ui-monospace', 'monospace'],
      },
      colors: {
        felt: {
          50: '#f0f9f6',
          100: '#dbf0e8',
          200: '#b7e0d2',
          300: '#84c9b4',
          400: '#4aab90',
          500: '#2d8e75',
          600: '#1f725c',
          700: '#1a5b4a',
          800: '#18483d',
          900: '#143b33',
          950: '#0a221e',
        },
        accent: {
          50: '#fffbeb',
          100: '#fef3c7',
          200: '#fde68a',
          300: '#fcd34d',
          400: '#fbbf24',
          500: '#f59e0b',
          600: '#d97706',
          700: '#b45309',
          800: '#92400e',
          900: '#78350f',
        },
        ink: {
          50: '#f8fafc',
          100: '#f1f5f9',
          200: '#e2e8f0',
          300: '#cbd5e1',
          400: '#94a3b8',
          500: '#64748b',
          600: '#475569',
          700: '#334155',
          800: '#1e293b',
          900: '#0f172a',
          950: '#080d16',
        },
      },
      boxShadow: {
        'felt': '0 2px 8px rgba(10, 34, 30, 0.12)',
        'felt-lg': '0 8px 30px rgba(10, 34, 30, 0.15)',
      },
    },
  },
  plugins: [],
};
