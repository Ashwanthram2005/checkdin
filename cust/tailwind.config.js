export default {content: [
  './index.html',
  './src/**/*.{js,ts,jsx,tsx}'
],
  theme: {
    extend: {
      colors: {
        canvas: '#f6f7f2',
        surface: '#ffffff',
        ink: '#10120e',
        muted: '#6c7166',
        line: '#e5e7dd',
        primary: {
          DEFAULT: '#d9f24b',
          dark: '#c9e832',
          soft: '#f1f8d8',
        },
        night: {
          DEFAULT: '#080a07',
          soft: '#14170f',
          line: '#242819',
          muted: '#9aa18d',
        },
        accent: {
          DEFAULT: '#e2603a',
          soft: '#fdeee8',
        },
        success: {
          DEFAULT: '#1b8a4b',
          soft: '#e8f6ec',
        },
      },
      fontFamily: {
        sans: ['Inter', 'ui-sans-serif', 'system-ui', 'sans-serif'],
        display: ['Inter', 'ui-sans-serif', 'system-ui', 'sans-serif'],
      },
      boxShadow: {
        card: '0 1px 2px rgba(16, 18, 14, 0.04), 0 8px 24px -14px rgba(16, 18, 14, 0.18)',
        lift: '0 2px 4px rgba(16, 18, 14, 0.06), 0 24px 48px -24px rgba(16, 18, 14, 0.28)',
      },
      transitionTimingFunction: {
        smooth: 'cubic-bezier(0.23, 1, 0.32, 1)',
      },
    },
  },
}
