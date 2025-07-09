const config = {
  theme: {
    extend: {
      colors: {
        'background': '#0D0D0D',
        'text-primary': '#E5E7EB',
        'text-secondary': '#9CA3AF',
        'accent-neon': '#22D3EE',
        'accent-hotpink': '#EC4899',
        'accent-light': '#E5E7EB',
      },
      fontFamily: {
        'orbitron': ['Orbitron', 'sans-serif'],
        sans: ['Inter', 'sans-serif'],
      },
      animation: {
        'pulse-neon': 'pulse-neon 2s ease-in-out infinite alternate',
      },
      keyframes: {
        'pulse-neon': {
          '0%': {
            textShadow: '0 0 5px #22D3EE, 0 0 10px #22D3EE, 0 0 15px #22D3EE, 0 0 20px #22D3EE',
          },
          '100%': {
            textShadow: '0 0 10px #22D3EE, 0 0 20px #22D3EE, 0 0 30px #22D3EE, 0 0 40px #22D3EE, 0 0 50px #22D3EE',
          },
        },
      },
    },
  },
}

export default config