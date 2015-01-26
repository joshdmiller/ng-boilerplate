// Configure module loader
System.config({
  baseURL: './',

  // Set paths for third-party libraries as modules
  paths: {
    'angular': 'vendor/angular/angular.js',
    'angular-ui-router': 'vendor/angular-ui-router/release/angular-ui-router.js',
    'angular-ui-bootstrap': 'vendor/angular-bootstrap/ui-bootstrap-tpls.js',
    'placeholders': 'vendor/placeholders/angular-placeholders-0.0.1-SNAPSHOT.min.js'
  },

  // SystemJS Plugins, referenced with "moduleName!pluginName"
  map: {
    'text': 'vendor/systemjs-plugin-text/text'
  }
});
