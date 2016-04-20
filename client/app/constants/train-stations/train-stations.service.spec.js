'use strict';

describe('Service: trainStations', function () {

  // load the service's module
  beforeEach(module('officeManagementApp'));

  // instantiate service
  var trainStations;
  beforeEach(inject(function (_trainStations_) {
    trainStations = _trainStations_;
  }));

  it('should do something', function () {
    expect(!!trainStations).toBe(true);
  });

});
