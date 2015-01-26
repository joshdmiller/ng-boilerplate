class AppCtrl {
  constructor($scope) {
    $scope.$on('$stateChangeSuccess', (event, toState) => {
      if (angular.isDefined(toState.data.pageTitle)) {
        $scope.pageTitle = toState.data.pageTitle + ' | ngBoilerplate';
      }
    });
  }
}
AppCtrl.$inject = ['$scope'];
export default AppCtrl;