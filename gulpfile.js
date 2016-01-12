var gulp = require('gulp');
var Server = require('karma').Server;
var less = require('gulp-less');
var path = require('path');
var inject = require('gulp-inject');
var del = require('del');
var runSequence = require('run-sequence');
var concat = require('gulp-concat');
var ngHtml2Js = require("gulp-ng-html2js");
var injectString = require('gulp-inject-string');
var versionNumber = 'v1.0';

var profile = 'build';

gulp.task('default', ['test']);

gulp.task('test', function (done) {
    new Server({
        configFile: __dirname + '/test.conf.js',
        singleRun: true
    }, done).start();
});

gulp.task('karma-watch', function (done) {
    new Server({
        configFile: __dirname + '/test.conf.js',
    },  done).start();
});

gulp.task('watch', function() {
    gulp.watch('src/**/*.js', ['karma-watch']);
});

gulp.task('build', function(callback) {
    runSequence('clean', 'copy-files', 'less', 'index',
        callback);
});

gulp.task('clean', function() {
    return del([profile]);
});

gulp.task('less', function () {
    return gulp.src('src/less/main.less')
        .pipe(less({
            paths: [ path.join(__dirname, 'less', 'includes') ]
        }))
        .pipe(gulp.dest(profile+'/assets'));
});

gulp.task('copy-files', ['copy-vendor-files', 'html2js'], function(){

    var filesToCopy = ['src/**/*.js', '!src/**/*.spec.js', 'src/index.html'];

    return gulp.src(filesToCopy)
        .pipe(gulp.dest(profile+'/'));
});

gulp.task('html2js', function(){
    gulp.src("src/app/**/*.tpl.html")
        .pipe(ngHtml2Js({
            moduleName: "templates-app",
            prefix: ""
        }))
        .pipe(concat("templates-app.js"))
        .pipe(gulp.dest("./"+profile));
});

gulp.task('copy-vendor-files', function(){

    var filesToCopy = [
        './vendor/**/angular.js',
        './vendor/**/ui-bootstrap-tpls.min.js',
        './vendor/**/angular-placeholders-0.0.1-SNAPSHOT.min.js',
        './vendor/**/angular-ui-router.js',
        './vendor/**/route.js'
    ];

    return gulp.src(filesToCopy)
        .pipe(gulp.dest(profile+'/vendor'));
});

gulp.task('index', function () {
    var includes = [profile+'/app/**/*.js', './'+profile+'/assets/main.css'];

    var vendorJS = [
        profile+'/vendor/**/angular.js',
        profile+'/vendor/**/ui-bootstrap-tpls.min.js',
        profile+'/vendor/**/angular-placeholders-0.0.1-SNAPSHOT.min.js',
        profile+'/vendor/**/angular-ui-router.js',
        profile+'/vendor/**/route.js'
    ];

    vendorJS = vendorJS.concat(includes);

    var sources = gulp.src(vendorJS, {read: false});

    return gulp.src(profile+'/index.html')
        .pipe(inject(sources, {relative: true}))
        .pipe(injectString.replace('%%VERSION_NUMBER%%', versionNumber))
        .pipe(gulp.dest(profile));
});