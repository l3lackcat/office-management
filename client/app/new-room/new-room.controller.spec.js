'use strict';

describe('Controller: NewRoomCtrl', function () {

  // load the controller's module
  beforeEach(module('officeManagementApp'));

  var NewRoomCtrl, scope;

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($controller, $rootScope) {
    scope = $rootScope.$new();
    NewRoomCtrl = $controller('NewRoomCtrl', {
      $scope: scope
    });
  }));

  it('should ...', function () {
    expect(1).toEqual(1);
  });
});
