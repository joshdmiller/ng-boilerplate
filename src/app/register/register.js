angular.module( 'ngBoilerplate.register', [
  'ui.router'
])
.config(function config( $stateProvider ) {
  $stateProvider.state( 'register', {
    url: '/register',
    views: {
      "main": {
        controller: 'RegisterCtrl',
        templateUrl: 'register/register.tpl.html'
      }
    },
    data:{ pageTitle: 'Register' }
  });
})
.controller( 'RegisterCtrl', function HomeController( $scope ) {

});