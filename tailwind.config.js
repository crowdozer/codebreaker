import animate from "tailwindcss-animate";

/** @type {import('tailwindcss').Config} */
const config = {
    darkMode: ["class"],
    content: [
        "./app/**/*.{ts,tsx}",
    ],
    theme: {
        extend: {},
    },
    plugins: [animate],
};

export default config;
