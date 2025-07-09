import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        'background': '#0D0D0D',
        'text-primary': '#E5E7EB',
        'text-secondary': '#9CA3AF',
        'accent-neon': '#22D3EE',
        'accent-hotpink': '#EC4899',
      },
      fontFamily: {
        sans: ['Orbitron', 'sans-serif'],
      },
    },
  },
  plugins: [],
}
export default config