/** @type {import('tailwindcss').Config} */
module.exports = {
    content: [
        './pages/**/*.{js,ts,jsx,tsx,mdx}',
        './components/**/*.{js,ts,jsx,tsx,mdx}',
        './app/**/*.{js,ts,jsx,tsx,mdx}',
    ],
    theme: {
        extend: {
            colors: {
                'primary-color': 'var(--primary-color)',
                'primary-bg': 'var(--primary-bg)',
                'secondary-bg': 'var(--secondary-bg)',
                'primary-dark': 'var(--primary-dark)',
                'primary-accent': 'var(--primary-accent)',
                'primary-blue': 'var(--primary-blue)',
                'secondary-gray': 'var(--secondary-gray)',
                'light-blue': 'var(--light-blue)',
                'brown': 'var(--brown)',
                'pink': 'var(--pink)',
                'green': 'var(--green)',
            },
            fontFamily: {
                sans: ['Mulish', '-apple-system', 'BlinkMacSystemFont', 'sans-serif'],
            },
        },
    },
    plugins: [],
}; 