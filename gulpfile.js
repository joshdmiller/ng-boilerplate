var gulp = require('gulp');
var Server = require('karma').Server;
var less = require('gulp-less');
var path = require('path');
var inject = require('gulp-inject');

var vendorJS = [
    'vendor/angular/angular.js',
    'vendor/angular-bootstrap/ui-bootstrap-tpls.min.js',
    'vendor/placeholders/angular-placeholders-0.0.1-SNAPSHOT.min.js',
    'vendor/angular-ui-router/release/angular-ui-router.js',
    'vendor/angular-ui-utils/modules/route/route.js'
];

var profile = 'build';

gulp.task('default', ['test']);

gulp.task('test', function (done) {
    new Server({
        configFile: __dirname + '/test.conf.js',
        singleRun: true
    }).start();
});

gulp.task('karma-watch', function (done) {
    new Server({
        configFile: __dirname + '/test.conf.js',
    },  done).start();
});

gulp.task('watch', function() {
    gulp.watch('src/**/*.js', ['karma-watch']);
});

gulp.task('build', ['less', 'index', 'copy-files']);

gulp.task('less', function () {
    return gulp.src('src/less/main.less')
        .pipe(less({
            paths: [ path.join(__dirname, 'less', 'includes') ]
        }))
        .pipe(gulp.dest(profile+'/assets'));
});

gulp.task('copy-files', ['copy-vendor-files'], function(){

    var filesToCopy = ['src/**/*.js', '!src/**/*.spec.js', 'src/**/*.html'];

    return gulp.src(filesToCopy)
        .pipe(gulp.dest(profile+'/'));
});

gulp.task('copy-vendor-files', function(){

    var filesToCopy = vendorJS;

    return gulp.src(filesToCopy)
        .pipe(gulp.dest(profile+'/vendor/'));
});

gulp.task('index', function () {
    var includes = ['./src/**/*.js', '!./src/**/*.spec.js', './'+profile+'/assets/main.css'];
    includes = includes.concat(vendorJS);

    var sources = gulp.src(includes, {read: false});

    return gulp.src('./src/index.html')
        .pipe(inject(sources, {relative: true}))
        .pipe(gulp.dest('./src'));
});