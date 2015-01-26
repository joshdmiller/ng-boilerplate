import 'angular';
import 'angular-ui-router';
import 'placeholders';
import 'angular-ui-bootstrap';
import AboutCtrl from './about.ctrl';
import template from './about.tpl.html!text';

export default angular.module( 'ngBoilerplate.about', [
  'ui.router',
  'placeholders',
  'ui.bootstrap'
])

.config([ '$stateProvider', function config( $stateProvider ) {
  $stateProvider.state( 'about', {
    url: '/about',
    views: {
      "main": {
        controller: 'AboutCtrl as aboutCtrl',
        template: template
      }
    },
    data:{ pageTitle: 'What is It?' }
  });
}])

.controller( 'AboutCtrl', AboutCtrl )

;
