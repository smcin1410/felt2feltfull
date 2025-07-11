const config = {
  content: [
    "./src/**/*.{js,ts,jsx,tsx,mdx}",
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        'background': '#121212',
        'text-primary': '#E5E7EB',
        'text-secondary': '#9CA3AF',
        'accent-neon': '#00FFFF',
        'accent-hotpink': '#FF1493',
        'accent-light': '#E5E7EB',
      },
      fontFamily: {
        'poppins': ['Poppins', 'sans-serif'],
        'roboto': ['Roboto', 'sans-serif'],
        'monoton': ['Monoton', 'cursive'],
        'vegas': ['Poppins', 'sans-serif'],
        'retro': ['Poppins', 'sans-serif'],
        sans: ['Poppins', 'Roboto', 'sans-serif'], // Set Poppins as default
      },
      boxShadow: {
        'neon-cyan': '0 0 8px #00FFFF, 0 0 16px #00FFFF33',
        'neon-pink': '0 0 8px #FF1493, 0 0 16px #FF149344',
        'neon-cyan-strong': '0 0 16px #00FFFF, 0 0 32px #00FFFF66',
        'neon-pink-strong': '0 0 16px #FF1493, 0 0 32px #FF149388',
      },
      backgroundImage: {
        'frosted-glass': 'linear-gradient(135deg, rgba(31,41,55,0.7) 0%, rgba(31,41,55,0.9) 100%)',
      },
      animation: {
        'pulse-neon': 'pulse-neon 2s ease-in-out infinite alternate',
        'pulse-neon-pink': 'pulse-neon-pink 2s ease-in-out infinite alternate',
      },
      keyframes: {
        'pulse-neon': {
          '0%': {
            textShadow: '0 0 5px #00FFFF, 0 0 10px #00FFFF, 0 0 15px #00FFFF, 0 0 20px #00FFFF',
          },
          '100%': {
            textShadow: '0 0 10px #00FFFF, 0 0 20px #00FFFF, 0 0 30px #00FFFF, 0 0 40px #00FFFF, 0 0 50px #00FFFF',
          },
        },
        'pulse-neon-pink': {
          '0%': {
            textShadow: '0 0 5px #FF1493, 0 0 10px #FF1493, 0 0 15px #FF1493, 0 0 20px #FF1493',
          },
          '100%': {
            textShadow: '0 0 10px #FF1493, 0 0 20px #FF1493, 0 0 30px #FF1493, 0 0 40px #FF1493, 0 0 50px #FF1493',
          },
        },
      },
    },
  },
  safelist: [
    'neon-glow', 'neon-glow-pink', 'neon-btn', 'neon-btn-pink', 'neon-border', 'neon-border-pink', 'frosted-glass', 'neon-card',
    'shadow-neon-cyan', 'shadow-neon-pink', 'shadow-neon-cyan-strong', 'shadow-neon-pink-strong',
  ],
}

export default config