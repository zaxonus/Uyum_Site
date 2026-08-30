/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{js,jsx,ts,tsx}"],
  safelist: [
    {
      // This is needed for tailwind to process dynamically created colors.
      pattern: /text-([a-z]+)-([0-9]+)/,
    },
  ],
  theme: {
    extend: {},
  },
  plugins: [],
}
