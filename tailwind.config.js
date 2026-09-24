/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,css}'],
  theme: {
    fontFamily: {
      sans: ['Geist', 'ui-sans-serif', 'system-ui', 'sans-serif'],
      serif: ['Geist', 'ui-serif', 'Georgia', 'serif'],
      mono: ['Geist', 'ui-monospace', 'SFMono-Regular', 'monospace'],
    },
  },
  plugins: [],
}
