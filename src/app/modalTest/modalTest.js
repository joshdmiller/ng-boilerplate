/**
 * Each section of the site has its own module. It probably also has
 * submodules, though this boilerplate is too simple to demonstrate it. Within
 * `src/app/home`, however, could exist several additional folders representing
 * additional modules that would then be listed as dependencies of this one.
 * For example, a `note` section could have the submodules `note.create`,
 * `note.delete`, `note.edit`, etc.
 *
 * Regardless, so long as dependencies are managed correctly, the build process
 * will automatically take take of the rest.
 *
 * The dependencies block here is also where component dependencies should be
 * specified, as shown below.
 */
angular.module('ngBoilerplate.modalTest', [
  'ui.router',
  'ui.bootstrap',
  'ui.bootstrap.modal',
  'angularModalService'
])

/**
 * Each section or module of the site can also have its own routes. AngularJS
 * will handle ensuring they are all available at run-time, but splitting it
 * this way makes each module more "self-contained".
 */
.config(function config($stateProvider) {
    $stateProvider.state('modalTest', {
        url: '/modalTest',
        views: {
            "main": {
                controller: 'modalTestCtrl',
                templateUrl: 'modalTest/modalTest.tpl.html'
            }
        },
        data: {
            pageTitle: 'modalTest'
        }
    });
})
/**
 * And of course we define a controller for our route.
 */
.controller('modalTestCtrl', function HomeController($scope) {

})
    .controller('SampleController', ['$scope', 'ModalService',
        function ($scope, ModalService) {

            $scope.yesNoResult = null;
            $scope.complexResult = null;
            $scope.customResult = null;

            $scope.showYesNo = function () {

                ModalService.showModal({
                    templateUrl: "yesno.html",
                    controller: "YesNoController"
                }).then(function (modal) {
                    modal.element.modal();
                    modal.close.then(function (result) {
                        $scope.yesNoResult = result ? "You said Yes" : "You said No";
                    });
                });

            };

            $scope.showComplex = function () {
                
                //$dialog.dialog({}).open('complex.html');

                ModalService.showModal({
                    templateUrl: "complex.html",
                    controller: "ComplexController",
                    inputs: {
                        title: "A More Complex Example"
                    }
                }).then(function (modal) {
                    //modal.element.modal();
                    modal.element.modal();
                    modal.close.then(function (result) {
                        $scope.complexResult = "Name: " + result.name + ", age: " + result.age;
                    });
                });

            };

            $scope.showCustom = function () {

                ModalService.showModal({
                    templateUrl: "custom.html",
                    controller: "CustomController"
                }).then(function (modal) {
                    modal.close.then(function (result) {
                        $scope.customResult = "All good!";
                    });
                });

            };

}])
    .controller('YesNoController', ['$scope', 'close',
    function ($scope, close) {

            $scope.close = function (result) {
                close(result, 500); // close, but give 500ms for bootstrap to animate
            };
}])
    .controller('ComplexController', ['$scope', 'title', 'close',
        function ($scope, title, close) {

            $scope.name = null;
            $scope.age = null;
            $scope.title = title;

            $scope.close = function () {
                close({
                    name: $scope.name,
                    age: $scope.age
                }, 500); // close, but give 500ms for bootstrap to animate

            };

}])
    .controller('CustomController', ['$scope', 'close',
        function ($scope, close) {

            $scope.display = true;

            $scope.close = function () {
                $scope.display = false;
                close();
            };

}])
;