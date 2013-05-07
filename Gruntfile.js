module.exports = function ( grunt ) {
  
  /** 
   * Load required Grunt tasks. These are installed based on the versions listed
   * in `package.json` when you do `npm install` in this directory.
   */
  grunt.loadNpmTasks('grunt-recess');
  grunt.loadNpmTasks('grunt-contrib-clean');
  grunt.loadNpmTasks('grunt-contrib-copy');
  grunt.loadNpmTasks('grunt-contrib-jshint');
  grunt.loadNpmTasks('grunt-contrib-concat');
  grunt.loadNpmTasks('grunt-contrib-watch');
  grunt.loadNpmTasks('grunt-contrib-uglify');
  grunt.loadNpmTasks('grunt-karma');
  grunt.loadNpmTasks('grunt-ngmin');
  grunt.loadNpmTasks('grunt-html2js');

  /**
   * This is the configuration object Grunt uses to give each plugin its 
   * instructions.
   */
  grunt.initConfig({
    /**
     * TODO fix this comment
     * The directories to which we put compiled files. 
     */
    build_dir: 'dev',
    bin_dir: 'bin',

    /**
     * We read in our `package.json` file so we can access the package name and
     * version. It's already there, so we don't repeat ourselves here.
     */
    pkg: grunt.file.readJSON("package.json"),

    /**
     * The banner is the comment that is placed at the top of our compiled 
     * source files. It is first processed as a Grunt template, where the `<%=`
     * pairs are evaluated based on this very configuration object.
     */
    meta: {
      banner: 
        '/**\n' +
        ' * <%= pkg.name || pkg.name %> - v<%= pkg.version %> - <%= grunt.template.today("yyyy-mm-dd") %>\n' +
        ' * <%= pkg.homepage %>\n' +
        ' *\n' +
        ' * Copyright (c) <%= grunt.template.today("yyyy") %> <%= pkg.author %>\n' +
        ' * Licensed <%= pkg.licenses.type %> <<%= pkg.licenses.url %>>\n' +
        ' */\n'
    },

    /**
     * TODO fix this comment
     * This is a collection of file definitions we use in the configuration of
     * build tasks. `js` is all project javascript, less tests. `atpl` contains
     * our reusable components' template HTML files, while `ctpl` contains the
     * same, but for our app's code. `html` is just our main HTML file and 
     * `less` is our main stylesheet.
     */
    app_files: {
      js: [ 'src/**/*.js', '!src/**/*.spec.js' ], 
      atpl: [ 'src/app/**/*.tpl.html' ],
      ctpl: [ 'src/common/**/*.tpl.html' ],
      index: [ 'src/index.html' ],
      less: 'src/less/main.less',
      unit: [ 'src/**/*.spec.js' ]
    },

    /**
     * TODO fix this comment
     * This is also a collection of file definitions we use in the
     * configuration of build tasks, but it differs from the `src` property in
     * that these values are entirely user-defined. While the `src` property
     * ensures all standardized files are collected for compilation, it is the
     * user's job to ensure non-standardized (i.e. vendor-related) files are
     * handled appropriately.
     *
     * The `vendor.js` property holds files to be automatically concatenated
     * and minified with our project source files.
     */
    vendor_files: {
      js: [
        'components/angular/angular.js',
        'components/angular-bootstrap/ui-bootstrap-tpls.js',
        'components/angular-ui-utils/modules/route/route.js',
        'components/placeholders/angular-placeholders-0.0.1-SNAPSHOT.min.js'
      ],
      css: [
      ]
    },

    /**
     * The directory to delete when `grunt clean` is executed.
     */
    clean: [ '<%= build_dir %>', '<%= bin_dir %>' ],

    /**
     * `grunt copy` just copies files from A to B. We use it here to copy our
     * project assets (images, fonts, etc.) into our distribution directory.
     */
    copy: {
      dev_js: {
        files: [
          {
            //Couldn't use app_files.js here
            src: [ '<%= app_files.js %>' ],
            dest: '<%= build_dir %>/',
            cwd: '.',
            expand: true
          }
        ]
      },
      dev_assets: {
        files: [
          { 
            src: [ '**' ],
            dest: '<%= build_dir %>/assets/',
            cwd: 'src/assets',
            expand: true
          }
        ]   
      },
      dev_components: {
        files: [
          {
            src: ['<%= vendor_files.js %>'],
            dest: '<%= build_dir %>/',
            cwd: '.',
            expand: true
          }
        ]
      },
      //Copy assets from build folder
      compile_assets: {
        files: [
          {
            src: [ '**' ],
            dest: '<%= bin_dir %>/assets/',
            cwd: '<%= build_dir %>/assets',
            expand: true
          }
        ]
      }
    },

    /**
     * `grunt concat` concatenates multiple source files into a single file.
     */
    concat: {
      /**
       * TODO update comments
       * The `dist` target is the concatenation of our application source code
       * into a single file. All files matching what's in the `src.js`
       * configuration property above will be included in the final build.
       *
       * In addition, the source is surrounded in the blocks specified in the
       * `module.prefix` and `module.suffix` files, which are just run blocks
       * to ensure nothing pollutes the global scope.
       *
       * The `options` array allows us to specify some customization for this
       * operation. In this case, we are adding a banner to the top of the file,
       * based on the above definition of `meta.banner`. This is simply a 
       * comment with copyright informaiton.
       */
      compile_js: {
        options: {
          banner: '<%= meta.banner %>'
        },
        src: [
          //TODO it errors if the module suffix and prefix are in for some reason..
          '<%= vendor_files.js %>',
          '<%= html2js.app.dest %>',
          '<%= html2js.common.dest %>',
          //TODO figure out how to use app_files.js glob properly here
          //These files are already ng-min'd
          '<%= build_dir %>/src/**/*.js'
        ],
        dest: '<%= bin_dir %>/<%= pkg.name %>.js'
      }
    },

    /**
     * Use ng-min to annotate the sources before minifying
     * Simply replace the copied js files in dev directory
     */
    ngmin: {
      compile: {
        files: [
          {
            src: ['<%= app_files.js %>'],
            cwd: '<%= build_dir %>',
            dest: '<%= build_dir %>',
            expand: true
          }
        ]
      }
    },

    /**
     * Minify the sources!
     */
    uglify: {
      compile: {
        options: {
          banner: '<%= meta.banner %>'
        },
        files: {
          '<%= concat.compile_js.dest %>': '<%= concat.compile_js.dest %>'
        }
      }
    },

    /**
     * recess handles our LESS compilation and uglification automatically. Only
     * our `main.less` file is included in compilation; all other files must be
     * imported from this file.
     */
    recess: {
      build:  {
        src: [ '<%= app_files.less %>' ],
        dest: '<%= build_dir %>/assets/<%= pkg.name %>.css',
        options: {
          compile: true,
          compress: true,
          noUnderscores: false,
          noIDs: false,
          zeroUnits: false
        }
      }
    },

    /**
     * `jshint` defines the rules of our linter as well as which files we should
     * check. This file, all java script sources, and all our unit tests are
     * linted based on the policies listed in `options`. But we can allow 
     * specify exclusionary patterns for external components by prefixing them
     * with an exclamation point (!).
     */
    jshint: {
      src: [ 
        'Gruntfile.js', 
        '<%= app_files.js %>', 
        '<%= app_files.unit %>'
      ],
      test: [
        '<%= app_files.unit %>'
      ],
      gruntfile: [
        'Gruntfile.js'
      ],
      options: {
        curly: true,
        immed: true,
        newcap: true,
        noarg: true,
        sub: true,
        boss: true,
        eqnull: true
      },
      globals: {}
    },

    /**
     * HTML2JS is a Grunt plugin. It takes all of your template files
     * and places them into JavaScript files as strings that are added to 
     * AngularJS's template cache. This means that the templates too become part
     * of the initial payload as one JavaScript file. Neat!
     */
    html2js: {
      /**
       * These are the templates from `src/app`.
       */
      app: {
        options: {
          module: 'app-templates',
          base: 'src/app'
        },
        src: [ '<%= app_files.atpl %>' ],
        dest: '<%= build_dir %>/app-templates.js'
      },

      /**
       * These are the templates from `src/common`.
       */
      common: {
        options: {
          module: 'common-templates',
          base: 'src/common'
        },
        src: [ '<%= app_files.ctpl %>' ],
        dest: '<%= build_dir %>/common-templates.js'
      }
    },

    index: {
      dev: {
        dir: '<%= build_dir %>',
        //We can only have one files section, so we just stick css and js into
        //one array, and split them up later
        src: [ 
          '<%= vendor_files.js %>',
          '<%= app_files.js %>',
          '<%= html2js.app.dest %>',
          '<%= html2js.common.dest %>',
          '<%= vendor_files.css %>',
          '<%= recess.build.dest %>'
        ]
      },
      bin: {
        dir: '<%= bin_dir %>',
        src: [
          '<%= concat.compile_js.dest %>',
          '<%= vendor_files.css %>',
          '<%= recess.build.dest %>'
        ]
      }
    },

    /**
     * The Karma configurations.
     */
    karma: {
      options: {
        configFile: 'karma/karma-unit.js'
      },
      unit: {
        background: true
      },
      continuous: {
        singleRun: true
      }
    },

    /**
     * And for rapid development, we have a watch set up that checks to see if
     * any of the files listed below change, and then to execute the listed 
     * tasks when they do. This just saves us from having to type "grunt" into
     * the command-line every time we want to see what we're working on; we can
     * instead just leave "grunt watch" running in a background terminal. Set it
     * and forget it, as Ron Popeil used to tell us.
     *
     * But we don't need the same thing to happen for all the files. 
     */
    delta: {
      /**
       * By default, we want the Live Reload to work for all tasks; this is
       * overridden in some tasks (like this file) where browser resources are
       * unaffected. It runs by default on port 35729.
       */
      options: {
        livereload: true
      },

      /**
       * When the Gruntfile changes, we just want to lint it. That said, the
       * watch will have to be restarted if it should take advantage of any of
       * the changes.
       */
      gruntfile: {
        files: 'Gruntfile.js',
        tasks: [ 'jshint:gruntfile' ],
        options: {
          livereload: false
        }
      },

      /**
       * When our source files change, we want to run most of our build tasks
       * (excepting uglification).
       */
      src: {
        files: [ 
          '<%= app_files.js %>'
        ],
        tasks: [ 'jshint:src', 'karma:unit:run', 'copy:dev_js', 'index:dev' ]
      },

      /**
       * When assets are changed, copy them. Note that this will *not* copy new
       * files, so this is probably not very useful.
       */
      assets: {
        files: [ 
          'src/assets/**/*'
        ],
        tasks: [ 'copy:dev_assets' ]
      },

      /**
       * When index.html changes, we need to compile just it.
       */
      html: {
        files: [ '<%= app_files.index %>' ],
        tasks: [ 'index:dev' ]
      },

      /**
       * When our templates change, we only add them to the template cache.
       */
      tpls: {
        files: [ 
          '<%= app_files.atpl %>', 
          '<%= app_files.ctpl %>'
        ],
        tasks: [ 'html2js', 'karma:unit:run' ]
      },

      /**
       * When the CSS files change, we need to compile and minify just them.
       */
      less: {
        files: [ 'src/**/*.less' ],
        tasks: [ 'recess' ]
      },

      /**
       * When a unit test file changes, we only want to linit it and run the
       * unit tests. However, since the `app` module requires the compiled 
       * templates, we must also run the `html2js` task.
       */
      unittest: {
        files: [
          '<%= app_files.unit %>'
        ],
        tasks: [ 'jshint:test', 'karma:unit:run' ],
        options: {
          livereload: false
        }
      }
    }
  });

  /**
   * In order to make it safe to just compile or copy *only* what was changed,
   * we need to ensure we are starting from a clean, fresh build. So we rename
   * the `watch` task to `delta` (that's why the configuration var above is
   * `delta`) and then add a new task called `watch` that does a clean build
   * before watching for changes.
   */
  grunt.renameTask( 'watch', 'delta' );
  grunt.registerTask( 'watch', [ 'before-test', 'after-test', 'karma:unit', 'delta' ] );

  /**
   * The default task is to build.
   */
  grunt.registerTask( 'default', [ 'build' ] );
  grunt.registerTask( 'build', ['before-test', 'karma:continuous', 'after-test' ] );
  grunt.registerTask( 'before-test', [ 'clean', 'html2js', 'jshint' ] );
  grunt.registerTask( 'after-test', [ 'recess', 'copy', 'index:dev' ] );
  
  /*
   * Minify and concat all the files
   */
  grunt.registerTask( 'compile', ['build', 'ngmin', 'concat', 'uglify', 'index:bin'] );

  /** 
   * The index.html template includes the stylesheet and javascript sources
   * based on dynamic names calculated in this Gruntfile. This task compiles it.
   */
  grunt.registerMultiTask( 'index', 'Process index.html template', function () {
    //Split up js and css files by extension
    var jsFiles = this.filesSrc.filter(function(file) {
      return file.match(/\.js$/);
    }).map(function(file) {
      //Some of our paths are bad: they start with `bin/` or `dev/`. This fixes
      //that
      return file.replace(/^(bin|dev)\//, '');
    });
    var cssFiles = this.filesSrc.filter(function(file) {
      return file.match(/\.css$/);
    }).map(function(file) {
      return file.replace(/^(bin|dev)\//, '');
    });

    grunt.file.copy('src/index.html', this.data.dir + '/index.html', {
      process: function (contents, path) {
        return grunt.template.process( contents, {
          data: {
            scripts: jsFiles,
            styles: cssFiles
          }
        });
      }
    });
  });

};
