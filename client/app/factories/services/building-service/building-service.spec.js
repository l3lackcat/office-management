'use strict';

describe('Service: BuildingService', function () {

  // load the service's module
  beforeEach(module('officeManagementApp'));

  // instantiate service
  var BuildingService;
  beforeEach(inject(function (_BuildingService_) {
    BuildingService = _BuildingService_;
  }));

  it('should do something', function () {
    expect(!!BuildingService).toBe(true);
  });

});
