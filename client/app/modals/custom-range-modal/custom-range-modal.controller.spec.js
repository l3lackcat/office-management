'use strict';

describe('Controller: CustomRangeModalCtrl', function () {

  // load the controller's module
  beforeEach(module('officeManagementApp'));

  var CustomRangeModalCtrl, scope;

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($controller, $rootScope) {
    scope = $rootScope.$new();
    CustomRangeModalCtrl = $controller('CustomRangeModalCtrl', {
      $scope: scope
    });
  }));

  it('should ...', function () {
    expect(1).toEqual(1);
  });
});
