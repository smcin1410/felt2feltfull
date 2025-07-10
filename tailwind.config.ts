const config = {
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
        'vegas': ['Poppins', 'sans-serif'], // Keep for backward compatibility
        'retro': ['Poppins', 'sans-serif'], // Keep for backward compatibility
        sans: ['Roboto', 'sans-serif'],
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
}

export default config