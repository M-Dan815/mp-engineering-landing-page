/** @type {import('tailwindcss').Config} */
module.exports = {
	content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
	theme: {
		extend: {
			colors: {
				brand: {
					orange: "#f97316",
					dark: "#050505",
					card: "#0a0a0a",
					surface: "#141414",
				},
			},
		},
	},
	plugins: [],
};
