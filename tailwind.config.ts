import type { Config } from 'tailwindcss';

const config: Config = {
  content: ['./app/**/*.{ts,tsx}', './components/**/*.{ts,tsx}', './lib/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        bg: '#0c0d0a',
        'bg-2': '#12140f',
        'bg-3': '#191c13',
        ink: '#101208',
        paper: '#f2f3ea',
        'paper-2': '#e9ebdd',
        volt: '#cdfb50',
        'volt-deep': '#a8d92c',
        maroon: '#3d1114',
        'maroon-2': '#4b1518',
        line: 'rgba(255,255,255,0.1)',
        'line-dark': 'rgba(16,18,8,0.12)',
        muted: 'rgba(242,243,234,0.62)',
        'muted-2': 'rgba(242,243,234,0.4)',
        'muted-dark': 'rgba(16,18,8,0.6)',
        danger: '#ff6b5e',
        warn: '#ffc94d',
        ok: '#7ee081',
        info: '#7db8ff',
      },
      fontFamily: {
        display: ['"Space Grotesk"', 'system-ui', 'sans-serif'],
        body: ['Inter', 'system-ui', 'sans-serif'],
      },
      borderRadius: {
        card: '16px',
      },
      transitionTimingFunction: {
        'out-expo': 'cubic-bezier(0.22, 1, 0.36, 1)',
      },
    },
  },
  plugins: [],
};

export default config;
