import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        bg: {
          primary: '#0f1115',
          secondary: '#161a20',
          tertiary: '#1d222b',
        },
      },
      fontFamily: {
        sans: ['var(--font-inter)', 'var(--font-noto)', 'sans-serif'],
        mono: ['var(--font-ibm-plex)', 'monospace'],
      },
    },
  },
  plugins: [],
}

export default config
