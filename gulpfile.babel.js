
const gulp = require('gulp');
const babel = require('gulp-babel');
const sourcemaps = require('gulp-sourcemaps');
const concat = require('gulp-concat');
const uglify = require('gulp-uglify');
const browserSync = require('browser-sync').create();
const htmlmin = require('gulp-htmlmin');
const image = require('gulp-image');
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

gulp.task('htmlmin', () => {
    return gulp.src('src/index.html')
    .pipe(htmlmin({ collapseWhitespace: true }))
    .pipe(gulp.dest('dist'));
});

gulp.task('htmlmin-watch', gulp.series('htmlmin', function(done){
    browserSync.reload();
    done();
}));

gulp.task('image', function () {
    return gulp.src('src/img/*')
    .pipe(image())
    .pipe(gulp.dest('dist/img'));
});

gulp.task('image-watch', gulp.series('image', function(done){
    browserSync.reload();
    done();
}));

gulp.task('default', gulp.series('js', 'scss', 'htmlmin', 'image', function () {
    // Static server
    browserSync.init({
        server: {
            baseDir: './dist'
        }
    });

    gulp.watch('src/js/*.js', gulp.series('js-watch'));
    gulp.watch('src/scss/*.scss', gulp.series('scss-watch'));
    gulp.watch('src/index.html', gulp.series('htmlmin-watch'));
    gulp.watch('src/img/*', gulp.series('image-watch'));
}));

gulp.task('default');