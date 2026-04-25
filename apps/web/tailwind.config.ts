import type { Config } from 'tailwindcss';

const config: Config = {
  darkMode: 'class',
  content: ['./app/**/*.{ts,tsx}', './components/**/*.{ts,tsx}', './lib/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        brand: {
          50:  '#eefcff',
          100: '#d8f6ff',
          200: '#b5eeff',
          300: '#7ee0ff',
          400: '#3dccff',
          500: '#0bb3f2',
          600: '#0090cf',
          700: '#0c72a6',
          800: '#115f89',
          900: '#134f72',
        },
        ink: {
          50:  '#f7f8fa',
          100: '#eef0f4',
          200: '#d8dce5',
          300: '#b4bbcb',
          400: '#848dab',
          500: '#5c6687',
          600: '#434c6a',
          700: '#343b53',
          800: '#262c3f',
          900: '#161b2a',
          950: '#0c0f1a',
        },
      },
      fontFamily: {
        sans: ['ui-sans-serif', 'system-ui', '-apple-system', 'Segoe UI', 'Roboto', 'sans-serif'],
        mono: ['ui-monospace', 'SFMono-Regular', 'Menlo', 'monospace'],
      },
    },
  },
  plugins: [],
};

export default config;
