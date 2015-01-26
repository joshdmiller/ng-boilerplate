import 'angular';
import './home/home';
import './about/about';
import 'angular-ui-router';
import AppCtrl from './app.ctrl';

export default angular.module( 'ngBoilerplate', [
  'ngBoilerplate.home',
  'ngBoilerplate.about',
  'ui.router'
])

.config( [ '$stateProvider', '$urlRouterProvider', function myAppConfig ( $stateProvider, $urlRouterProvider ) {
  $urlRouterProvider.otherwise( '/home' );
}])

.run( function run () {
})

.controller( 'AppCtrl', AppCtrl )

;

