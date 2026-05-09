/** @type {import('tailwindcss').Config} */
export default {
  darkMode: 'class',
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
    "./app/**/*.{js,ts,jsx,tsx}",
    "./components/**/*.{js,ts,jsx,tsx}",
    "./lib/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          50: '#FFF0F5', 100: '#FFD6E8', 200: '#FFADD1',
          300: '#FF85BA', 400: '#FF5DA3', 500: '#FF4081',
          600: '#E91E63', 700: '#C2185B', 800: '#AD1457', 900: '#880E4F',
        },
        secondary: {
          50: '#F3E5F5', 100: '#E1BEE7', 500: '#9C27B0',
          600: '#8E24AA', 700: '#7B1FA2',
        },
        success: '#4CAF50',
        warning: '#FF9800',
        error: '#F44336',
        info: '#2196F3',
        love: '#E91E63',
      },
      fontFamily: {
        sans: ['"PingFang SC"', '"Hiragino Sans GB"', '"Microsoft YaHei"', '"Noto Sans SC"', 'sans-serif'],
      },
      borderRadius: {
        'sm': '4px', 'md': '8px', 'lg': '12px',
        'xl': '16px', '2xl': '20px', '3xl': '24px',
      },
      boxShadow: {
        'glow': '0 0 20px rgba(255,64,129,0.3)',
      },
      animation: {
        'pulse-slow': 'pulse 1.5s cubic-bezier(0.4, 0, 0.6, 1) infinite',
      },
    },
  },
  plugins: [],
}
