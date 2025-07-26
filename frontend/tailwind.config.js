/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      keyframes: {
        'toast-slide-in': {
          '0%': { transform: 'translateX(-100%)', opacity: '0' },
          '100%': { transform: 'translateX(0)', opacity: '1' },
        },
        'toast-slide-out': {
          '0%': { transform: 'translateX(0)', opacity: '1' },
          '100%': { transform: 'translateX(100%)', opacity: '0' },
        },
      },
      animation: {
        'toast-in': 'toast-slide-in 0.5s ease-out forwards',
        'toast-out': 'toast-slide-out 0.5s ease-in forwards',
      },
      fontFamily: {
        sans: ['Poppins', 'sans-serif'],  // override default
        roboto: ['Roboto', 'sans-serif'],
        inter: ['Inter', 'sans-serif'],
        mono: ['Courier New', 'monospace'],
      },
    },
  },
  plugins: [],
};
