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
        background: "var(--background)",
        foreground: "var(--foreground)",
        brand: {
          50: '#f0fdfa',
          100: '#ccfbf1',
          200: '#99f6e4',
          300: '#5eead4',
          400: '#2dd4bf',
          500: '#14b8a6',
          600: '#0d9488',
          700: '#0f766e',
          800: '#115e59',
          900: '#134e4a',
          950: '#042f2e',
        },
      },
      backgroundImage: {
        'custom-gradient': `
          radial-gradient(circle at bottom right, rgba(255, 165, 0, 0.15), transparent 30%),
          radial-gradient(circle at top left, rgba(20, 184, 166, 0.15), transparent 40%),
          radial-gradient(circle at bottom left, rgba(128, 0, 128, 0.2), transparent 50%)
        `,
      },
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
        mono: ['JetBrains Mono', 'monospace'],
        poppins: ['Poppins', 'sans-serif'],
      },
    },
  },
  plugins: [],
}
export default config

