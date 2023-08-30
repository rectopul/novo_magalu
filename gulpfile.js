var { watch, src, dest, series, parallel } = require('gulp'),
    stylus = require('gulp-stylus'),
    autoprefixer = require('gulp-autoprefixer'),
    concat = require('gulp-concat'),
    sourcemaps = require("gulp-sourcemaps"),
    notify = require("gulp-notify");

const uglify = require('gulp-uglify');
const rename = require('gulp-rename');


function executeTask(done) {
    execTask(
        'node_modules/@nestjs/cli/bin/nest.js',
        [ 'start', '--watch' ]
    )
    done()
}


const browserSync = require("browser-sync");
const server = browserSync.create();

function reloadTask(done) {
    server.reload();
    done();
}


function browser(done) {
    server.init({
      baseDir: './',
    });
    done();
}


function watchSrc() {
    watch('./src/assets/css/**/*.styl', css)
    watch(['./src/assets/js/**/*.js'], js)
}

const css = () => {
    return src('./src/assets/css/**/*.styl')
        .pipe(sourcemaps.init())
        .pipe(
            stylus({
                'include css': true,
                compress: true,
                linenos: false,
                import: __dirname + '/src/assets/css/settings.styl',
            })
        )
        .pipe(rename('app.css'))
        .pipe(autoprefixer())
        .pipe(concat('app.css'))
        .pipe(sourcemaps.write())
        .pipe(dest('./public/css'))
        .pipe(server.stream())
        .on(`error`, (err) => notify(err))
        //.pipe(notify("Hello Gulp!"))
}

const js = () => {
    return src(['./src/assets/js/settings.js', './src/assets/js/**/*.js', '!./src/assets/js/adm/*.js'], {
        sourcemaps: false,
    })
        .pipe(uglify())
        .pipe(concat('scripts.js'))
        .pipe(dest('./public/js'), { sourcemaps: false })
        .pipe(rename({ extname: '.min.js' }))
        .pipe(dest('./public/js'))
}

exports.js = js
exports.css = css
exports.executeTask = executeTask

exports.init = series(css, js)

exports.default = parallel(series(browser, watchSrc))
