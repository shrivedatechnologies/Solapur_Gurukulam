/** @type {import('tailwindcss').Config} */
export default {
    content: [
        "./index.html",
        "./src/**/*.{js,ts,jsx,tsx}",
    ],
    darkMode: 'class',
    theme: {
        extend: {
            colors: {
                primary: {
                    50: '#fef2e8',
                    100: '#fde5d1',
                    200: '#fbcba3',
                    300: '#f9b175',
                    400: '#f79747',
                    500: '#f57d19',
                    600: '#c46414',
                    700: '#934b0f',
                    800: '#62320a',
                    900: '#311905',
                },
                secondary: {
                    50: '#f3e8ff',
                    100: '#e7d1ff',
                    200: '#cfa3ff',
                    300: '#b775ff',
                    400: '#9f47ff',
                    500: '#8719ff',
                    600: '#6c14cc',
                    700: '#510f99',
                    800: '#360a66',
                    900: '#1b0533',
                },
            },
            fontFamily: {
                sans: ['Inter', 'system-ui', 'sans-serif'],
                devanagari: ['Noto Sans Devanagari', 'sans-serif'],
            },
            animation: {
                'fade-in': 'fadeIn 0.5s ease-in-out',
                'slide-up': 'slideUp 0.3s ease-out',
                'slide-down': 'slideDown 0.3s ease-out',
                'pulse-slow': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
            },
            keyframes: {
                fadeIn: {
                    '0%': { opacity: '0' },
                    '100%': { opacity: '1' },
                },
                slideUp: {
                    '0%': { transform: 'translateY(20px)', opacity: '0' },
                    '100%': { transform: 'translateY(0)', opacity: '1' },
                },
                slideDown: {
                    '0%': { transform: 'translateY(-20px)', opacity: '0' },
                    '100%': { transform: 'translateY(0)', opacity: '1' },
                },
            },
        },
    },
    plugins: [
        require('@tailwindcss/forms'),
        require('@tailwindcss/typography'),
    ],
}