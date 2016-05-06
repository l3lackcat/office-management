'use strict';

describe('Controller: BuildingViewerModalCtrl', function () {

  // load the controller's module
  beforeEach(module('officeManagementApp'));

  var BuildingViewerModalCtrl, scope;

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($controller, $rootScope) {
    scope = $rootScope.$new();
    BuildingViewerModalCtrl = $controller('BuildingViewerModalCtrl', {
      $scope: scope
    });
  }));

  it('should ...', function () {
    expect(1).toEqual(1);
  });
});
