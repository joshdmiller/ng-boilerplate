var gulp = require('gulp');
var Server = require('karma').Server;

gulp.task('default', ['test']);

gulp.task('karma-watch', function (done) {
    new Server({
        configFile: __dirname + '/test.conf.js',
    },  done).start();
});

gulp.task('test', function (done) {
    new Server({
        configFile: __dirname + '/test.conf.js',
        singleRun: true
    }).start();
});

gulp.task('watch', function() {
    gulp.watch('src/**/*.js', ['karma-watch']);
});