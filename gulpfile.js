const gulp = require('gulp');
const sass = require('gulp-sass')(require('sass'));
const autoprefixer = require('gulp-autoprefixer');
const cleanCSS = require('gulp-clean-css');
const rename = require('gulp-rename');
const eslint = require('gulp-eslint');

// SCSS to CSS compilation
function styles() {
    return gulp.src('scss/**/*.scss')
        .pipe(sass().on('error', sass.logError))
        .pipe(autoprefixer())
        .pipe(cleanCSS())
        .pipe(rename({ suffix: '.min' }))
        .pipe(gulp.dest('css'));
}

// JavaScript linting
function lint() {
    return gulp.src('js/**/*.js')
        .pipe(eslint())
        .pipe(eslint.format())
        .pipe(eslint.failAfterError());
}

// Watch files for changes
function watch() {
    gulp.watch('scss/**/*.scss', styles);
    gulp.watch('js/**/*.js', lint);
}

// Export tasks
exports.styles = styles;
exports.lint = lint;
exports.watch = watch;
exports.default = gulp.series(styles, lint);
