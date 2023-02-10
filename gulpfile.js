
const gulp = require("gulp");

//SCSS
const sass = require('gulp-sass')(require('sass'));
const plumber = require('gulp-plumber');
//Mejorar CSS
const autoprefixer = require('autoprefixer');
const cssnano = require('cssnano');
const postcss = require('gulp-postcss');
const sourcemap = require('gulp-sourcemaps');

//JS
const terser = require('gulp-terser-js');

//Imagenes
const cache =  require('gulp-cache');
const imagemin = require('gulp-imagemin');
const webp =  require('gulp-webp');
const avif = require('gulp-avif');

//mandamos a llamar un callback para indicar que la funcion termino
function css(done){
    gulp.src('src/scss/**/*.scss')//Identificar el archivo de sass
    .pipe(sourcemap.init())//Nos crea un archivo .map que el navegador lee y nos dice la linea de css en el scss
    .pipe(plumber())// No detendra el workflow al haber un error.
    .pipe(sass())//compilar sass
    .pipe(postcss([autoprefixer(), cssnano()]))
    .pipe(sourcemap.write('.'))
    .pipe(gulp.dest('public/css'));//alamacenar en el disco

    done(); //avisa a gulp cuando termina la ejecucion 
}

//Aligerar imagenes
function images(done){
    options = {
        optimizationLevel: 3
    };

    gulp.src('img/**/*.{png,jpg}')
    .pipe(cache(imagemin(options)))
    .pipe(gulp.dest('public/img'));
    

    done();
}

//Crear imagenes a webp
function getWebp(done){
    const options = {
        quality:50
    };

    gulp.src('img/**/*.{png,jpg}')
    .pipe(webp(options))
    .pipe(gulp.dest('public/img'));

    done();
}
//Crear imagenes a avif
function getAvif(done){
    const options = {
        quality:50
    };

    gulp.src('img/**/*.{png,jpg}')
    .pipe(avif(options))
    .pipe(gulp.dest('public/img'));

    done();
}

function javascript(done){
    gulp.src('src/js/**/*.js')
    .pipe(sourcemap.init())
    .pipe(terser())
    .pipe(sourcemap.write('.'))
    .pipe(gulp.dest('public/js'));

    done();
}

function dev(done){
    gulp.watch('src/scss/**/*.scss', css);
    gulp.watch('src/js/**/*.js', javascript);


    done();
}

exports.css = css;
exports.js = javascript;
exports.getWebp = getWebp;
exports.getAvif = getAvif;
exports.images = images;
exports.dev = gulp.parallel(images, getWebp, getAvif,javascript, dev);