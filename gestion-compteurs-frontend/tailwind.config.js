/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['"Plus Jakarta Sans"', '-apple-system', 'BlinkMacSystemFont', '"SF Pro Display"', 'Inter', 'system-ui', 'sans-serif'],
        mono: ['"JetBrains Mono"', '"SF Mono"', 'monospace'],
        arabic: ['"Amiri"', '"Noto Sans Arabic"', 'Tahoma', 'sans-serif'],
      },
      colors: {
        srm: {
          // Exact colors derived from the official logo
          crimson: '#9E2422',       // Deep Moroccan Terracotta Crimson
          crimsonHover: '#861D1B',
          crimsonLight: '#FDF2F2',
          crimsonBorder: '#F6CECE',
          
          emerald: '#2D6A4F',       // Traditional Moroccan Zellige Green
          emeraldHover: '#22543D',
          emeraldLight: '#F0F9F5',
          emeraldBorder: '#C6E7D9',
          
          amber: '#B8860B',         // Subtle Moroccan Gold/Amber
          amberLight: '#FEF9EE',
          amberBorder: '#F9E4B7',
          
          slate: '#0F172A',         // Rich Obsidian
          surface: '#FFFFFF',
          card: '#FFFFFF',
          bg: '#F8FAFC',
          border: '#E2E8F0',
        }
      },
      boxShadow: {
        'niche-sm': '0 1px 2px 0 rgba(15, 23, 42, 0.04)',
        'niche-card': '0 4px 20px -2px rgba(15, 23, 42, 0.05), 0 1px 3px 0 rgba(15, 23, 42, 0.03)',
        'niche-card-hover': '0 12px 32px -4px rgba(15, 23, 42, 0.08), 0 2px 6px 0 rgba(15, 23, 42, 0.04)',
        'niche-modal': '0 25px 50px -12px rgba(15, 23, 42, 0.15)',
        'crimson-btn': '0 4px 14px -2px rgba(158, 36, 34, 0.3)',
      }
    },
  },
  plugins: [],
}
