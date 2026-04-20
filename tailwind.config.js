/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ["Inter", "sans-serif"],
      },
      boxShadow: {
        soft: '0 1px 3px 0 rgba(0,0,0,0.05), 0 1px 2px -1px rgba(0,0,0,0.05)',
        medium: '0 4px 6px -1px rgba(0,0,0,0.07), 0 2px 4px -2px rgba(0,0,0,0.05)',
        large: '0 10px 15px -3px rgba(0,0,0,0.08), 0 4px 6px -4px rgba(0,0,0,0.05)',
        card: '0 0 0 1px rgba(0,0,0,0.06), 0 2px 8px rgba(0,0,0,0.08)',
      },
      colors: {
        brand: {
          50: '#f9fafb',
          100: '#f3f4f6',
          200: '#e5e7eb',
          900: '#111827',
        }
      }
    },
  },
  plugins: [],
}
