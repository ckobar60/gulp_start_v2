const {src, dest, series, parallel, watch} = require('gulp');
const sass = require('gulp-sass');
const concat = require('gulp-concat');
const browserSync = require('browser-sync').create();
const uglify = require('gulp-uglify-es').default;
const del = require('del');

function browsersync() {
    browserSync.init({
        server: {baseDir: './src',
        notify: false,
        online: true,
        }
    })
}

function styles() {
    return src('./src/sass/**/*.scss')
    .pipe(sass({outputStyle: 'compressed'}))
    .pipe(concat('style.min.css'))
    .pipe(dest('./build/css/'))
    .pipe(browserSync.stream())
}

function scripts() {
    return src('./src/js/**/*.js')
    .pipe(uglify())
    .pipe(concat('app.min.js'))
    .pipe(dest('./build/js/'))
    .pipe(browserSync.stream())
}

function clear() {
    del('./build')
}

function watching() {
    watch(['./src/sass/**/*.scss', '!./src/sass/*.min.scss'], styles)
    watch(['./src/js/**/*.js', '!./src/js/*.min.js'], scripts)
}

exports.browsersync = browsersync;
exports.styles = styles;
exports.scripts = scripts;
exports.watching = watching;

exports.default = parallel(clear, styles, scripts, browsersync, watching)