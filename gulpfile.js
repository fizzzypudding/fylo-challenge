const { src, dest, watch, series, parallel, task } = require('gulp');
const pug = require('gulp-pug');
const sass = require('gulp-sass');
const postcss = require('gulp-postcss');
// const autoprefixer = require('autoprefixer');
const cssnano = require('cssnano');
const imagemin = require('gulp-imagemin');
const terser = require('gulp-terser');
const browsersync = require('browser-sync').create();

// HTML Task
function pugTask(){
  return src('app/views/index.pug', { sourcemaps: false })
    .pipe(pug({
      pretty: true,
    }))
    .pipe(dest('.',{ sourcemaps: '.'}));
}

// Sass Task
function sassTask(){
  return src('app/styles/style.sass', { sourcemaps: true })
    .pipe(sass().on('error', sass.logError))
    .pipe(postcss([cssnano()]))
    .pipe(dest('dist',{ sourcemaps: '.'}));
}

// JavaScript Task
function jsTask(){
  return src('app/scripts/scripts.js', { sourcemaps: true })
    .pipe(terser())
    .pipe(dest('dist', { sourcemaps: '.' }));
}

// Imagemin Task
function imageTask(){
  return src('app/images/*')
    .pipe(imagemin())
    .pipe(dest('dist/images'))
}


// Browsersync Task
function browsersyncServe(cb){
  browsersync.init({
    server: {
      baseDir: '.'
    }
  });
  cb();
}

function browsersyncReload(cb){
  browsersync.reload();
  cb();
}

// Watch Task
function watchTask(){
  watch('*.html', browsersyncReload);
  watch(['app/views/**/*.pug', 'app/styles/**/*.sass', 'app/scripts/**/*.js'], series(pugTask, sassTask, jsTask, browsersyncReload));
}

// Default Gulp Task
exports.default = series(
  pugTask,
  sassTask,
  jsTask,
  imageTask,
  browsersyncServe,
  watchTask
);