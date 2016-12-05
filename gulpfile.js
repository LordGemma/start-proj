var path = require('path');
const gulp = require('gulp');
const plugins = require('gulp-load-plugins');
const del = require('del');
const browserSync = require('browser-sync').create();

var pkg = require('./package.json');
var dirs = pkg['configs'].directories;

var $ = plugins();

gulp.task('sass', function() {
   return gulp.src(['src/css/sass/*.scss', 'src/css/sass/*.sass'])
       .pipe($.sourcemaps.init())
       .pipe($.sass({
           outputStyle: 'compressed'
       }).on('error', $.sass.logError))
       .pipe($.autoprefixer())
       .pipe($.sourcemaps.write(dirs.src + '/css'))
       .pipe(gulp.dest(dirs.src + '/css'));
});

gulp.task('index.html', function () {
    return gulp.src(dirs.dist + '/index.html')
        .pipe($.replace(/{{JQUERY_VERSION}}/g, pkg.devDependencies.jquery))
        .pipe(gulp.dest(dirs.dist));
});

gulp.task('jquery', function () {
    return gulp.src(['node_modules/jquery/dist/jquery.min.js'])
        .pipe($.rename('jquery-' + pkg.devDependencies.jquery + '.min.js'))
        .pipe(gulp.dest(dirs.src + '/js'));
});

gulp.task('bootstrap.scss', function () {
    return gulp.src(['node_modules/bootstrap-sass/assets/stylesheets/_bootstrap.scss'])
        .pipe($.rename('bootstrap.scss'))
        .pipe($.sass({
            outputStyle: 'compressed'
        }).on('error', $.sass.logError))
        .pipe(gulp.dest(dirs.src + '/css'));
});

gulp.task('bootstrap.js', function () {
    return gulp.src(['node_modules/bootstrap-sass/assets/javascripts/bootstrap.min.js'])
        .pipe(gulp.dest(dirs.src + '/js'));
});

gulp.task('font-awesome', function () {
    return gulp.src(['node_modules/font-awesome/scss/font-awesome.scss'])
        .pipe($.sass({
            outputStyle: 'compressed'
        }).on('error', $.sass.logError))
        .pipe(gulp.dest(dirs.src + '/css'));
});


gulp.task('copy',
    gulp.series(gulp.parallel('index.html', 'jquery', 'bootstrap.scss', 'bootstrap.js', 'font-awesome'))
);

gulp.task('source', function() {
    return gulp.src(['src/**/*.*', '!src/js/ts/**', '!src/css/sass/**'], {since: gulp.lastRun('source')})
        .pipe(gulp.dest(dirs.dist));
});

gulp.task('watch', function() {

    gulp.watch('src/css/sass/*.scss', gulp.series('sass'));
    // gulp.watch('src/js/*.js', gulp.series('js'));
    gulp.watch('src/**/*.*', gulp.series('source'));
});

gulp.task('serve', function() {
    browserSync.init({
        server: 'dist'
    });

    browserSync.watch('dist/**/*.*').on('change', browserSync.reload);
});

gulp.task('default',
    gulp.series('source', 'copy', gulp.parallel('watch', 'serve'))
);

