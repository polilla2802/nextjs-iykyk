/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        formaLight: ['FormaDJRBanner-Light', 'sans-serif'],
        formaRegular: ['FormaDJRBanner-Regular', 'sans-serif'],
        formaMedium: ['FormaDJRBanner-Medium', 'sans-serif'],
        formaBold: ['FormaDJRBanner-Bold', 'sans-serif'],
        formaExtraBold: ['FormaDJRBanner-Extra-Bold', 'sans-serif'],
        formaBlack: ['FormaDJRBanner-Black', 'sans-serif'],
      },
      backgroundImage: {
        "gradient-radial": "radial-gradient(var(--tw-gradient-stops))",
        "gradient-conic":
          "conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))",
      },
    },
  },
  plugins: [],
};
