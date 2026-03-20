import type { Config } from 'tailwindcss';

const config: Config = {
  content: ['./src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        brand: {
          50: '#effbfd',
          100: '#d6f6fb',
          500: '#12bfd1',
          600: '#0e9aab',
          700: '#1176b7'
        }
      },
      boxShadow: {
        soft: '0 10px 40px rgba(15, 23, 42, 0.08)'
      }
    }
  },
  plugins: []
};

export default config;
