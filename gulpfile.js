var gulp = require('gulp'),
    Server = require('karma').Server,
    less = require('gulp-less'),
    path = require('path'),
    inject = require('gulp-inject'),
    injectString = require('gulp-inject-string'),
    del = require('del'),
    runSequence = require('run-sequence'),
    concat = require('gulp-concat'),
    html2js = require("gulp-ng-html2js");

var versionNumber = 'v1.0',
    profile = 'build';

gulp.task('default', ['watch']);

gulp.task('build', function(callback) {
    runSequence('clean', 'copy-files', 'less', 'index','test', callback);
});

gulp.task('clean', function() {
    return del([profile]);
});

/*--- js ----*/

gulp.task('test', function (done) {
    new Server({
        configFile: __dirname + '/karma.conf.js',
        singleRun: true
    }, done).start();
});

gulp.task('watch', ['build'], function(callback) {
    gulp.watch('src/**/*.js', function(){
        runSequence('copy-js-files', 'test');
    });
    gulp.watch('src/**/*.less', ['less']);
    gulp.watch('src/index.html', function(){
        runSequence('copy-index', 'index');
    });
    gulp.watch('src/**/*.tpl.html', ['html2js']);
});

gulp.task('copy-js-files', function(){
    return gulp.src(['src/**/*.js', '!src/**/*.spec.js']).pipe(gulp.dest(profile+'/'));
});

/*-- html --*/

gulp.task('less', function () {
    return gulp.src('src/less/main.less')
        .pipe(less({
            paths: [ path.join(__dirname, 'less', 'includes') ]
        }))
        .pipe(gulp.dest(profile+'/assets'));
});

gulp.task('copy-files', ['copy-index', 'copy-js-files', 'copy-vendor-files', 'html2js']);

gulp.task('copy-index', function(){
    return gulp.src(['src/index.html']).pipe(gulp.dest(profile+'/'));
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

gulp.task('html2js', function(){
    gulp.src("src/app/**/*.tpl.html")
        .pipe(html2js({
            moduleName: "templates-app",
            prefix: ""
        }))
        .pipe(concat("templates-app.js"))
        .pipe(gulp.dest("./"+profile));
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