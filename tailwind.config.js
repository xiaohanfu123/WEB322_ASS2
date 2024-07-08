/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [`./views/**/*.ejs`],
  theme: {
    extend: {},
  },
plugins: [require('@tailwindcss/typography'), require('daisyui')],
daisyui: {
  themes: ["forest","business"],
  themes: true, // false: only light + dark | true: all themes | array: specific themes like this ["light", "dark", "cupcake"]
  darkTheme: "business", // name of one of the included themes for dark mode
},
}

