'use strict';

describe('Filter: displayedTrainStation', function () {

  // load the filter's module
  beforeEach(module('officeManagementApp'));

  // initialize a new instance of the filter before each test
  var displayedTrainStation;
  beforeEach(inject(function ($filter) {
    displayedTrainStation = $filter('displayedTrainStation');
  }));

  it('should return the input prefixed with "displayedTrainStation filter:"', function () {
    var text = 'angularjs';
    expect(displayedTrainStation(text)).toBe('displayedTrainStation filter: ' + text);
  });

});
