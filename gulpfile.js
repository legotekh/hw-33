const gulp = require('gulp');
const sass = require('gulp-sass')(require('sass'));
const postcss = require('gulp-postcss');  // Додано для використання автопрефіксера
const autoprefixer = require('autoprefixer');  // Автопрефіксатор
const cleanCSS = require('gulp-clean-css');
const sourcemaps = require('gulp-sourcemaps');
const rename = require('gulp-rename');
const browserSync = require('browser-sync').create();

const paths = {
  scss: {
    src: 'src/scss/**/*.scss',
    dest: 'dist/css'
  },
  html: {
    src: 'src/*.html',
    dest: 'dist/'
  }
};

function styles() {
  return gulp.src(paths.scss.src)
    .pipe(sourcemaps.init())
    .pipe(sass().on('error', sass.logError))  // Скомпілювати SCSS у CSS
    .pipe(postcss([autoprefixer()]))  // Використовуємо autoprefixer через postcss
    .pipe(gulp.dest(paths.scss.dest))
    .pipe(cleanCSS())  // Мінімізувати CSS
    .pipe(rename({ suffix: '.min' }))  // Додати суфікс .min
    .pipe(sourcemaps.write('.'))
    .pipe(gulp.dest(paths.scss.dest))
    .pipe(browserSync.stream());
}

function html() {
  return gulp.src(paths.html.src)
    .pipe(gulp.dest(paths.html.dest))
    .pipe(browserSync.stream());
}

function serve() {
  browserSync.init({
    server: {
      baseDir: 'dist'
    }
  });

  gulp.watch(paths.scss.src, styles);
  gulp.watch(paths.html.src, html);
}

exports.styles = styles;
exports.html = html;
exports.serve = gulp.series(styles, html, serve);
exports.default = exports.serve;