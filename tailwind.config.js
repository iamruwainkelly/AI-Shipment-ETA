/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{vue,js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        // Primary brand colors
        primary: {
          50: '#eff6ff',
          500: '#3b82f6',
          600: '#2563eb',
          700: '#1d4ed8',
        },
        // Dark theme business colors
        dark: {
          bg: '#0a0a0a',           // Main background
          surface: '#121212',      // Surface/card background
          surface2: '#1a1a1a',     // Secondary surface
          surface3: '#1f1f1f',     // Tertiary surface
          border: '#2a2a2a',       // Borders
          border2: '#333333',      // Secondary borders
          text: '#ffffff',         // Primary text
          text2: '#e5e5e5',        // Secondary text
          text3: '#a3a3a3',        // Tertiary text
          text4: '#737373',        // Quaternary text
        },
        // Status colors for dark theme
        status: {
          success: '#10b981',      // Green
          warning: '#f59e0b',      // Amber
          error: '#ef4444',        // Red
          info: '#3b82f6',         // Blue
          purple: '#8b5cf6',       // Purple accent
        },
        // Gradient colors
        gradient: {
          orange: '#ff6c00',
          purple: '#a678ff',
        }
      },
      backgroundColor: {
        'dark-bg': '#0a0a0a',
        'dark-surface': '#121212',
        'dark-surface-2': '#1a1a1a',
        'dark-surface-3': '#1f1f1f',
      },
      borderColor: {
        'dark-border': '#2a2a2a',
        'dark-border-2': '#333333',
      },
      textColor: {
        'dark-text': '#ffffff',
        'dark-text-2': '#e5e5e5',
        'dark-text-3': '#a3a3a3',
        'dark-text-4': '#737373',
      }
    },
  },
  plugins: [
    require('@tailwindcss/forms'),
  ],
}
