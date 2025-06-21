/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        // Custom NCX design system colors
        "mint-light": "#F6FFF8",
        "dark-gray": "#252422",
        "accent-red": "#C1121F",
        beige: "#E4CFB2",
        "light-green": "#CCD5AE",
        brown: "#604630",
        "brown-light": "rgba(213, 199, 174, 0.14)",
        "brown-dark": "rgba(74, 80, 67, 0.60)",
      },
      fontFamily: {
        quicksand: ["Quicksand", "sans-serif"],
        ntr: ["NTR", "sans-serif"],
        "reem-kufi": ["Reem Kufi", "sans-serif"],
        playfair: ["Playfair Display", "serif"],
        crimson: ["Crimson Text", "serif"],
        montserrat: ["Montserrat", "sans-serif"],
      },
      borderRadius: {
        lg: "0.5rem",
        md: "0.375rem",
        sm: "0.25rem",
      },
      letterSpacing: {
        brand: "0.84px",
        wide: "0.6px",
        wider: "0.45px",
      },
      boxShadow: {
        soft: "0px 1px 1px 0px rgba(0, 0, 0, 0.25)",
        category: "0px 1px 2px 0px rgba(0, 0, 0, 0.25)",
        nav: "0px 1px 1px 0px rgba(0, 0, 0, 0.25)",
        footer: "0px 1px 1px 0px rgba(0, 0, 0, 0.25) inset",
      },
    },
  },
  plugins: [require("tailwindcss-animate"), require("@tailwindcss/typography")],
};
