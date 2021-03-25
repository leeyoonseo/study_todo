
const gulp = require('gulp');
const babel = require('gulp-babel');
const sourcemaps = require('gulp-sourcemaps');
const concat = require('gulp-concat');
const uglify = require('gulp-uglify');
const browserSync = require('browser-sync').create();
const sass = require('gulp-sass');
sass.compiler = require('node-sass');

gulp.task('js', function(){
    return gulp.src('src/js/*.js')
        .pipe(sourcemaps.init())
        .pipe(babel({
            presets: ['@babel/preset-env'],
            compact: true,
        }))
        .pipe(concat('bundle.min.js'))
        .pipe(uglify())
        .pipe(sourcemaps.write('.'))
        .pipe(gulp.dest('dist/js'))
        .pipe(browserSync.stream());
});

gulp.task('js-watch', gulp.series('js', function(done){
    browserSync.reload();
    done();
}));

gulp.task('scss', function () {
    return gulp.src('src/scss/*.scss')
        .pipe(sourcemaps.init())
        .pipe(sass.sync({
            outputStyle: 'compressed',
            sourceComments: true,
        }).on('error', sass.logError))
        .pipe(concat('bundle.min.css'))
        .pipe(sourcemaps.write('.'))
        .pipe(gulp.dest('dist/css'))
        .pipe(browserSync.stream());
});

gulp.task('scss-watch', gulp.series('scss', function (done) {
    browserSync.reload();
    done();
}));

gulp.task('default', gulp.series('js', function () {
    // Static server
    browserSync.init({
        server: {
            baseDir: "./"
        }
    });

    gulp.watch("src/js/*.js", gulp.series('js-watch'));
    gulp.watch("src/scss/*.scss", gulp.series('scss-watch'));
}));

gulp.task('default');