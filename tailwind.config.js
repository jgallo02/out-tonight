export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        page:    '#0c1538',
        surface: '#16204a',
        soft:    '#1f2a5c',
        ink:     '#efe5d2',
        red:     '#c8243a',
        wine:    '#e8a832',
        gold:    '#e8a832',
        muted:   'rgba(239,229,210,0.62)',
        border:  'rgba(239,229,210,0.14)',
        like:    '#c8243a',
        pass:    '#9c1c2c',
      },
      fontFamily: {
        serif: ['"Playfair Display"', 'Georgia', 'serif'],
        sans:  ['"DM Sans"', 'sans-serif'],
        mono:  ['"DM Mono"', 'monospace'],
      },
    },
  },
  plugins: [],
}
