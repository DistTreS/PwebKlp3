/** @type {import('tailwindcss').Config} */

module.exports = {
  content: [
    './views/*.{html,js,ejs}',
    './views/admin/*.{html,js,ejs}',
    'node_modules/preline/dist/*.js',
    './views/mahasiswa/*.{html,js,ejs}',
    './views/dosen/*.{html,js,ejs}',
    './public/**/*.html'
  ],
  theme: {
    extend: {},
  },
  plugins: [
    require('@tailwindcss/forms'),
    require('preline/plugin')
  ]
}

