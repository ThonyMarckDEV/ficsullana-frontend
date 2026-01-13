/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'fic-red': '#E60000',    // Rojo del logo
        'fic-yellow': '#FFD700', // Amarillo del logo
        'fic-dark': '#1A1A1A',   // Gris muy oscuro para textos
      },
    },
  },
  plugins: [],
}