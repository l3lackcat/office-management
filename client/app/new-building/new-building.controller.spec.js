'use strict';

describe('Controller: NewBuildingCtrl', function () {

  // load the controller's module
  beforeEach(module('officeManagementApp'));

  var NewBuildingCtrl, scope;

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($controller, $rootScope) {
    scope = $rootScope.$new();
    NewBuildingCtrl = $controller('NewBuildingCtrl', {
      $scope: scope
    });
  }));

  it('should ...', function () {
    expect(1).toEqual(1);
  });
});
