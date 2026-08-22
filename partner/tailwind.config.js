export default {content: [
  './index.html',
  './src/**/*.{js,ts,jsx,tsx}'
],
  theme: {
    extend: {
      colors: {
        ink: {
          DEFAULT: '#0D0D0D',
          soft: '#1A1A1A',
          muted: '#8A8A8A',
        },
        canvas: '#FAFAF7',
        lime: {
          50: '#F7FBE0',
          100: '#EEF6BE',
          200: '#E2F183',
          300: '#D9FF3F',
          400: '#D4E82A',
          500: '#C2D416',
          600: '#98A70F',
        },
        forest: '#1F6B33',
        moss: '#8FB800',
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
      },
      boxShadow: {
        card: '0 1px 2px rgba(16, 24, 40, 0.04), 0 1px 3px rgba(16, 24, 40, 0.06)',
      },
    },
  },
}
