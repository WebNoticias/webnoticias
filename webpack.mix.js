let mix = require('laravel-mix');

/*
 |--------------------------------------------------------------------------
 | Mix Asset Management
 |--------------------------------------------------------------------------
 |
 | Mix provides a clean, fluent API for defining some Webpack build steps
 | for your Laravel application. By default, we are compiling the Sass
 | file for the application as well as bundling up all the JS files.
 |
 */

  /*
  | Compile javascripts resources
  |
  */
  mix.js('resources/assets/js/app.js', 'public/js');

  /*
  | Compile sass y less resources
  |
  */
  mix.sass('resources/assets/sass/app.scss', 'public/css/app.sass.css');

  /*
  | Bundle the assets css compiled
  |
  */
  mix.styles([
    'public/css/app.sass.css',
    'public/css/custom.css'
  ],'public/css/style.css');

  /*
  | Bundle the assets js compiled
  |
  */
  mix.scripts([
    'public/js/app.js',
    'public/js/scripts.js'
  ],'public/js/scripts.min.js');

  /*
  | Set compiled sourcemap
  |
  */
  mix.sourceMaps();
