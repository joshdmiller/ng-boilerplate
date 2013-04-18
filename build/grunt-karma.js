module.exports = function ( grunt ) {
  var karmaCmd = process.platform === 'win32' ? 'karma.cmd' : 'karma';
  
  // TODO migrate this entirely to Grunt
  function runKarma( testConfigFile, options ) {
    var args = [ 'start', testConfigFile, '--reporters=dots', '--colors' ].concat( options ),
        done = grunt.task.current.async(),
        child = grunt.util.spawn({
          cmd: karmaCmd,
          args: args
        }, function karmaError( err, result, code ) {
          grunt.log.writeln("Running cmd");
          if ( code ) {
            done( false );
          } else {
            done();
          }
        });

    child.stdout.pipe(process.stdout);
    child.stderr.pipe(process.stderr);
  };

  grunt.registerMultiTask( 'test', 'run karma unit tests', function gruntTestTask() {
    var options = [ '--single-run', '--no-auto-watch' ];
    runKarma( this.data.conf, options );
  });
};

