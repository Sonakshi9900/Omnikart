/** @type {import('tailwindcss').Config} */
export default {
  darkMode: ['class'],
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        background: '#0B1330',      // deep navy, matches cart outline / "Omni" text in logo
        surface: '#101B3D',
        card: '#16214A',
        brand: {
          blue: {
            light: '#2F8CFF',        // top of the "O" wheel gradient in logo
            DEFAULT: '#1D63E0',
            dark: '#0B3FA0',         // bottom of the "O" wheel gradient in logo
          },
          orange: {
            light: '#FFB020',        // top of "Kart" text gradient in logo
            DEFAULT: '#FF8A00',
            dark: '#FF6A00',         // bottom of "Kart" text gradient in logo
          },
        },
        neutral: {
          offwhite: '#F7F8FA',
        },
      },
      fontFamily: {
        sans: ['"Plus Jakarta Sans"', 'sans-serif'],
        heading: ['"Space Grotesk"', 'sans-serif'],
      },
      boxShadow: {
        glow: '0 0 25px -5px rgba(29, 99, 224, 0.35)',
        'glow-amber': '0 0 25px -5px rgba(255, 138, 0, 0.35)',
        'glow-orange': '0 0 25px -5px rgba(255, 138, 0, 0.35)',
      },
    },
  },
  plugins: [],
};
