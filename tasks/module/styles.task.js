module.exports = function( grunt, user_config ) {
  console.log("DIR:");
  console.log(__dirname);
  console.log(process.cwd());
  // ------------------------------------------------------------------------ Private Variables

  // ------------------------------------------------------------------------ Init Function
  function init () {
    register_tasks();
    export_config_variables();
  }

  // ------------------------------------------------------------------------ Private Functions
  function export_config_variables () {
    user_config.app_files.temp_less = user_config.utilities.createTempPath( user_config.app_files.less );

    var reduce = user_config.reduce || {};

    reduce.module_less_imports = function ( previousValue, currentValue, index, array ) {
      return  previousValue +
        ( index !== 0 ? '\n' : '' ) +
        '@import \'' +
        currentValue.replace( 'src', '..' ) +
        '\';';
    };

    user_config.reduce = reduce;
  }

  function register_tasks () {
    grunt.registerTask( 'build_styles', ['copy:main_less', 'import:styles', 'recess:build', 'delete:main_less_copy', 'concat:build_css']);
  }

  // ------------------------------------------------------------------------ Helper Functions

  // ------------------------------------------------------------------------ init()
  init();
};
