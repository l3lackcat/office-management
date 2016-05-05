'use strict';

describe('Controller: BuildingUnitModalCtrl', function () {

  // load the controller's module
  beforeEach(module('officeManagementApp'));

  var BuildingUnitModalCtrl, scope;

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($controller, $rootScope) {
    scope = $rootScope.$new();
    BuildingUnitModalCtrl = $controller('BuildingUnitModalCtrl', {
      $scope: scope
    });
  }));

  it('should ...', function () {
    expect(1).toEqual(1);
  });
});
