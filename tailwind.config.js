/** @type {import('tailwindcss').Config} */
export default {
  content: [
    './index.html',
    './danu.html',
    './src/**/*.{js,css}',
    './resources/views/**/*.blade.php',
  ],
  theme: {
    fontFamily: {
      sans: ['Geist', 'ui-sans-serif', 'system-ui', 'sans-serif'],
      serif: ['Geist', 'ui-serif', 'Georgia', 'serif'],
      mono: ['Geist', 'ui-monospace', 'SFMono-Regular', 'monospace'],
    },
  },
  plugins: [],
}
