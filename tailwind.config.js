/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      typography: {
        DEFAULT: {
          css: {
            color: "#ECECEC", // Default text color
            h1: {
              fontSize: "2.5rem",
              fontWeight: "bold",
            },
            a: {
              color: "#3b82f6", // Link color
              "&:hover": {
                color: "#2563eb", // Link hover color
              },
            },
          },
        },
        invert: {
          css: {
            color: "#ECECEC", // Inverted text color
          },
        },
      },
    },
  },
  plugins: [require("@tailwindcss/typography")],
};
