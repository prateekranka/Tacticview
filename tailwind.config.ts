import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './app/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        'tv-bg': '#0a0a0a',
        'tv-surface': '#171717',
        'tv-surface-hover': '#262626',
        'tv-border': '#333333',
        'tv-text': '#f5f5f5',
        'tv-text-muted': '#a3a3a3',
        'tv-accent': '#22c55e',
        'tv-accent-blue': '#3b82f6',
        'tv-live': '#ef4444',
        'tv-goal': '#eab308',
        'tv-pitch': '#1a6b1a',
      },
    },
  },
  plugins: [],
}

export default config
