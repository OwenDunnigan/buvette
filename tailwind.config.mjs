/** @type {import('tailwindcss').Config} */
export default {
	content: ['./src/**/*.{astro,html,js,jsx,md,mdx,svelte,ts,tsx,vue}'],
	theme: {
		extend: {
			screens: {
				'md': '1100px', // Redefines the 'md:' prefix to trigger at 1100px
			},
		},
	},
	plugins: [],
}
