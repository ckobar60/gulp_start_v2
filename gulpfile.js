const {src, dest, series, parallel, watch} = require('gulp');
const sass = require('gulp-sass');
const concat = require('gulp-concat');
const browserSync = require('browser-sync').create();

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
    .pipe(sass())
    .pipe(concat('style.min.css'))
    .pipe(dest('./build/css/'))
    .pipe(browserSync.stream())
}

function watching() {
    watch(['./src/sass/**/*.scss', '!./src/sass/*.min.scss'], styles)
}

exports.browsersync = browsersync;
exports.styles = styles;
exports.watching = watching;

exports.default = parallel(styles, browsersync, watching)