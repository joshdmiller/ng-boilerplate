angular.module( 'ngBoilerplate', [
  'templates-app',
  'templates-common',
  'ngBoilerplate.home',
  'ngBoilerplate.about',
  'ui.state',
  'ui.route'
])

.config( function myAppConfig ( $stateProvider, $urlRouterProvider ) {
  $urlRouterProvider.otherwise( '/home' );
})

.run( function run ( titleService, $rootScope ) {
  titleService.setSuffix( ' | ngBoilerplate' );
  $rootScope.$on('$stateChangeSuccess', function(event, toState, toParams, fromState, fromParams){
    titleService.setTitle( toState.data.pageTitle );
  });
})

.controller( 'AppCtrl', function AppCtrl ( $scope, $location ) {
})

;

