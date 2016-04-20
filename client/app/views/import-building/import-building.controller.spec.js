'use strict';

describe('Controller: ImportBuildingCtrl', function () {

  // load the controller's module
  beforeEach(module('officeManagementApp'));

  var ImportBuildingCtrl, scope;

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($controller, $rootScope) {
    scope = $rootScope.$new();
    ImportBuildingCtrl = $controller('ImportBuildingCtrl', {
      $scope: scope
    });
  }));

  it('should ...', function () {
    expect(1).toEqual(1);
  });
});
