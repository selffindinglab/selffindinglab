/** @type {import('tailwindcss').Config} */
module.exports = {
    content: ['./src/**/*.{js,ts,jsx,tsx}'],
    theme: {
        extend: {
            colors: {
                transparent: 'transparent',
                current: 'currentColor',
                crab: '#F26749',
                'sand-dollar': '#FCDED6',
                'vista-blue': '#83A6F2',
                'deep-ocean': '#204ECF',
                butterscotch: '#EA9836',
            },
        },
    },
    plugins: [],
};
