'use strict';

describe('Filter: displayedBuildingUnitStatus', function () {

  // load the filter's module
  beforeEach(module('officeManagementApp'));

  // initialize a new instance of the filter before each test
  var displayedBuildingUnitStatus;
  beforeEach(inject(function ($filter) {
    displayedBuildingUnitStatus = $filter('displayedBuildingUnitStatus');
  }));

  it('should return the input prefixed with "displayedBuildingUnitStatus filter:"', function () {
    var text = 'angularjs';
    expect(displayedBuildingUnitStatus(text)).toBe('displayedBuildingUnitStatus filter: ' + text);
  });

});
