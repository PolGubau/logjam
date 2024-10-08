import { poluiPlugin } from "pol-ui";

/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./app/**/*.{js,ts,jsx,tsx}",
    "node_modules/pol-ui/lib/**/*.js",
  ],
  theme: {
    extend: {},
  },
  plugins: [poluiPlugin(), require("@tailwindcss/container-queries")],
};
