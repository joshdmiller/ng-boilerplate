module.exports = function( grunt, user_config ) {
  // ------------------------------------------------------------------------ Private Variables
  var bower_dep_reg_expr  = /["|']([^("|')]*)["|']\:[\s]*["|']([^("|')]*)["|']/;

  // ------------------------------------------------------------------------ Init Function
  function init () {
    register_tasks();
    export_config_variables();
  }

  // ------------------------------------------------------------------------ Private Functions
  function add_vendor_files_for_module (file_path) {
    var dependencies        = grunt.config.data.vendor_files,
      module_dependencies = require( process.cwd() + '/' + file_path);

    if ( module_dependencies != null && module_dependencies.vendor_files != null ) {
      if ( module_dependencies.vendor_files.js != null ) {
        merge_array( module_dependencies.vendor_files.js, dependencies.js );
      }
      if ( module_dependencies.vendor_files.css != null ) {
        merge_array( module_dependencies.vendor_files.css, dependencies.css );
      }
      if ( module_dependencies.vendor_files.assets != null ) {
        merge_array( module_dependencies.vendor_files.assets, dependencies.assets );
      }
    }
  }

  function export_config_variables () {
    var reduce = user_config.reduce || {};

    reduce.bower_dev_dependencies  = function ( dependencies, file_path, index, array ) {
      var module_dependencies = require( process.cwd() + '/' + file_path );

      if (  module_dependencies != null &&
        module_dependencies.bower != null &&
        module_dependencies.bower.devDependencies != null
        ) {
        merge_bower_dependencies( dependency_hash_to_list(module_dependencies.bower.devDependencies), dependencies );
      }

      return ( index !== array.length - 1 ) ? dependencies : '"devDependencies": {\n    ' + dependencies.join(',\n    ') + '\n  }';
    }

    user_config.reduce = reduce;
  }

  function merge_bower_dependencies ( from, to ) {
    var i;

    for ( i = 0; i < from.length; i+=1 ) {
      dependency = from[i];
      merge_bower_dependency( dependency, to);
    }

    return to;
  }

  function merge_bower_dependency ( dependency, dependencies ) {
    var name    = get_dependency_name( dependency),
      version = get_dependency_version( dependency),
      index   = index_of_dependency(name, dependencies);

    if (index === -1) {
      dependencies.push(dependency);
    } else if ( greater_version( version, get_dependency_version( dependencies[index] ) ) === version ) {
      dependencies[index] = dependency; // prioritize the latest release
    }

    return dependencies;
  }

  function register_tasks () {
    grunt.registerTask( 'process_dependencies', ['import:bower_dev_dependencies', 'update_vendor_files'] );

    grunt.registerTask( 'update_vendor_files', function () {
      grunt.file.expand('src/**/.dependencies.js')
        .forEach( add_vendor_files_for_module );
    });
  }

  function sanatize_version_array (val) {
    if (val.length > 0) {
      val[0] = val[0].replace( /\~/, '' );
    }
    return val;
  }

  // ------------------------------------------------------------------------ Helper Functions
  function dependency_hash_to_list ( hash ) {
    var key,
      list = [];

    for (key in hash) {
      if ( hash.hasOwnProperty( key ) ) {
        list.push('"' + key + '"' + ': ' + '"' + hash[key] + '"');
      }
    }

    return list;
  }

  function get_dependency_name ( dependency ) {
    var match = dependency.match( bower_dep_reg_expr );
    return (match != null && match.length >= 3) ? match[1] : "";
  }

  function get_dependency_version ( dependency ) {
    var match = dependency.match( bower_dep_reg_expr );
    return (match != null && match.length >= 3) ? match[2] : "0.0.0";
  }

  function greater_version ( version_a, version_b ) {
    var i, a, b,
      split_a   = version_a.split('.'),
      split_b   = version_b.split('.'),
      length_a  = split_a.length,
      length_b  = split_b.length;

    sanatize_version_array( split_a );
    sanatize_version_array( split_b );

    for ( i = 0; i < length_a; i += 1 ) {
      a = Number(split_a[i]);
      b = Number(split_b[i]);

      if ( i > length_b - 1 ) {
        return version_a; // greater_version('3.1.1', '3.1') -> '3.1.1'
      } else if ( a > b ) {
        return version_a;
      } else if ( b > a ) {
        return version_b;
      } else if ( i === length_a - 1 && length_b > length_a ) {
        return version_b;  // greater_version('3.1', '3.1.1') -> '3.1.1'
      }
    }

    return version_a; // greater_version('3.1.1', '3.1.1') -> '3.1.1'
  }

  function index_of_dependency ( name, dependencies ) {
    var i;
    for ( i = 0; i < dependencies.length; i++ ) {
      if ( get_dependency_name( dependencies[i] ) === name ) {
        return i;
      }
    }
    return -1;
  }

  function merge_array (from, to) {
    var i;

    if ( from != null && to != null ) {
      for ( i = 0; i < from.length; i += 1 ) {
        if ( to.indexOf( from[i] ) === -1 ) {
          to.push( from[i] );
        }
      }
    }

    return to;
  }

  // ------------------------------------------------------------------------ init()
  init();
};
