'use strict';

describe('Controller: BuildingCtrl', function () {

  // load the controller's module
  beforeEach(module('officeManagementApp'));

  var BuildingCtrl, scope;

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($controller, $rootScope) {
    scope = $rootScope.$new();
    BuildingCtrl = $controller('BuildingCtrl', {
      $scope: scope
    });
  }));

  it('should ...', function () {
    expect(1).toEqual(1);
  });
});
