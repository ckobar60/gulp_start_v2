const {src, dest, series, parallel, watch} = require('gulp');
const sass = require('gulp-sass');
const concat = require('gulp-concat');
const browserSync = require('browser-sync').create();
const uglify = require('gulp-uglify-es').default;
const del = require('del');
const autoprefixer = require('gulp-autoprefixer');
const imagemin = require('gulp-imagemin');

function browsersync() {
    browserSync.init({
        server: {baseDir: './build'},
        notify: false,
        online: true,
    })
}

function styles() {
    return src(['node_modules/normalize.css/normalize.css', './src/sass/**/*.scss'])
    .pipe(sass({outputStyle: 'compressed'}))
    .pipe(concat('style.min.css'))
    .pipe(autoprefixer({ overrideBrowserslist: ['last 5 versions'], grid: true }))
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

function image(){
    return src('./src/images/**/*')
    .pipe(imagemin([
        imagemin.gifsicle({interlaced: true}),
        imagemin.mozjpeg({quality: 75, progressive: true}),
        imagemin.optipng({optimizationLevel: 5}),
        imagemin.svgo({
            plugins: [
                {removeViewBox: true},
                {cleanupIDs: false}
            ]
        })
    ]))
    .pipe(dest('./build/images'))
}

function html(){
    return src('./src/**/*.html')
    .pipe(dest('./build'))
    .pipe(browserSync.stream())
}

function clear() {
    del('./build')
}

function watching() {
    watch(['./src/sass/**/*.scss', '!./src/sass/*.min.scss'], styles)
    watch(['./src/js/**/*.js', '!./src/js/*.min.js'], scripts)
    watch(('./src/**/*.html'), html)
    watch(('./src/images/**/*'), image)
}

exports.browsersync = browsersync;
exports.styles = styles;
exports.html = html;
exports.scripts = scripts;
exports.image = image;
exports.watching = watching;

exports.default = (clear, parallel(html, styles, scripts, image, browsersync, watching));