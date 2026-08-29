export default {
  darkMode: 'class',
  content: [
  './index.html',
  './src/**/*.{js,ts,jsx,tsx}'
],
  theme: {
    extend: {
      colors: {
        canvas: 'rgb(var(--c-canvas) / <alpha-value>)',
        card: 'rgb(var(--c-card) / <alpha-value>)',
        elevated: 'rgb(var(--c-elevated) / <alpha-value>)',
        line: 'rgb(var(--c-line) / <alpha-value>)',
        ink: 'rgb(var(--c-ink) / <alpha-value>)',
        muted: 'rgb(var(--c-muted) / <alpha-value>)',
        faint: 'rgb(var(--c-faint) / <alpha-value>)',
        accent: 'rgb(var(--c-accent) / <alpha-value>)',
        'accent-ink': 'rgb(var(--c-accent-ink) / <alpha-value>)',
        sidebar: 'rgb(var(--c-sidebar) / <alpha-value>)',
        'sidebar-line': 'rgb(var(--c-sidebar-line) / <alpha-value>)',
        'sidebar-ink': 'rgb(var(--c-sidebar-ink) / <alpha-value>)',
        'sidebar-muted': 'rgb(var(--c-sidebar-muted) / <alpha-value>)',
        positive: 'rgb(var(--c-positive) / <alpha-value>)',
        warning: 'rgb(var(--c-warning) / <alpha-value>)',
        negative: 'rgb(var(--c-negative) / <alpha-value>)',
        info: 'rgb(var(--c-info) / <alpha-value>)'
      },
      fontFamily: {
        sans: ['Inter', 'ui-sans-serif', 'system-ui', 'sans-serif'],
        mono: ['"JetBrains Mono"', 'ui-monospace', 'monospace']
      },
      borderRadius: {
        xl: '0.875rem',
        '2xl': '1.125rem'
      },
      spacing: {
        '4.5': '1.125rem',
        '9.5': '2.375rem'
      },
      boxShadow: {
        card: '0 1px 2px 0 rgb(16 18 20 / 0.04)',
        pop: '0 12px 32px -8px rgb(16 18 20 / 0.18)'
      },
      transitionTimingFunction: {
        smooth: 'cubic-bezier(0.23, 1, 0.32, 1)'
      }
    }
  },
  plugins: []
}
