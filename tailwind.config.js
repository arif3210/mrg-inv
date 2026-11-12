/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        apple: {
          bg: '#fbfbfd',
          surface: '#ffffff',
          subtle: '#f5f5f7',
          border: 'rgba(0, 0, 0, 0.08)',
          text: '#1d1d1f',
          secondary: '#6e6e73',
          tertiary: '#86868b',
          accent: '#b89562', // Apple luxury champagne bronze
          accentHover: '#9f7d4d',
        }
      },
      fontFamily: {
        luxury: ['"Italiana"', '"Playfair Display"', 'serif'],
        serif: ['"Playfair Display"', 'Georgia', 'serif'],
        cormorant: ['"Cormorant Garamond"', 'Georgia', 'serif'],
        sans: ['"Plus Jakarta Sans"', '-apple-system', 'BlinkMacSystemFont', 'system-ui', 'sans-serif'],
        arabic: ['"Amiri"', 'serif'],
      },
      boxShadow: {
        'apple-card': '0 4px 24px -2px rgba(0, 0, 0, 0.04), 0 2px 6px -1px rgba(0, 0, 0, 0.02)',
        'apple-card-hover': '0 20px 40px -10px rgba(0, 0, 0, 0.08), 0 4px 12px -2px rgba(0, 0, 0, 0.04)',
        'apple-pill': '0 2px 10px rgba(0, 0, 0, 0.06)',
      },
      animation: {
        'fade-in-up': 'fadeInUp 0.8s cubic-bezier(0.16, 1, 0.3, 1) forwards',
      },
      keyframes: {
        fadeInUp: {
          '0%': { opacity: '0', transform: 'translateY(16px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        }
      }
    },
  },
  plugins: [],
}
