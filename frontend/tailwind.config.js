/** @type {import('tailwindcss').Config} */
module.exports = {
    darkMode: 'class',
    content: [
        './index.html',
        './src/**/*.{js,ts,jsx,tsx}',
    ],
    theme: {
        extend: {
            colors: {
                primary: {
                    DEFAULT: 'var(--color-primary)',
                    hover: 'var(--color-primary-hover)',
                },
                background: 'var(--color-bg)',
                surface: 'var(--color-surface)',
                text: {
                    DEFAULT: 'var(--color-text)',
                    muted: 'var(--color-text-muted)',
                },
                border: 'var(--color-border)',
                divider: 'var(--color-divider)',
            },
        },
    },
    plugins: [
        require('tailwind-scrollbar'),
    ],
};