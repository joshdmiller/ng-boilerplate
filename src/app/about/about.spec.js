describe( 'about section', function() {
  beforeEach( module( 'ngBoilerplate.about' ) );

  describe( 'AboutCtrl', function () {

    var AboutCtrl, $scope;

    beforeEach( inject( function( $controller, $rootScope ) {
      $scope = $rootScope.$new();
      AboutCtrl = $controller( 'AboutCtrl', { $scope: $scope });
    }));

    it( 'should setup drop down items', inject( function($controller) {
      expect( $scope.dropdownDemoItems.length ).toBe(3);
      expect( $scope.dropdownDemoItems[0]).toBe("The first choice!");
    }));

  });

});