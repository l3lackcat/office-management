'use strict';

describe('Filter: displayedRoomStatus', function () {

  // load the filter's module
  beforeEach(module('officeManagementApp'));

  // initialize a new instance of the filter before each test
  var displayedRoomStatus;
  beforeEach(inject(function ($filter) {
    displayedRoomStatus = $filter('displayedRoomStatus');
  }));

  it('should return the input prefixed with "displayedRoomStatus filter:"', function () {
    var text = 'angularjs';
    expect(displayedRoomStatus(text)).toBe('displayedRoomStatus filter: ' + text);
  });

});
