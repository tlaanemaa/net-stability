/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      backgroundImage: {
        "gradient-radial": "radial-gradient(var(--tw-gradient-stops))",
        "gradient-conic":
          "conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))",
      },
      colors: {
        "main-color": "#172554", // dark rich blue
        "accent-color": "#FF0000", // bright glowing red
        "faded-accent-color": "#CC0000", // subtly darker red for hover effects
        "grid-color": "#273c75", // a darker blue for a more subtle grid
        "grid-label-color": "#6f7f99", // a slightly lighter blue for more subtle labels
        // Add more colors as per your needs
      },
      // You can also extend other styling options like spacing, border radius, etc.
    },
  },
  plugins: [],
};
