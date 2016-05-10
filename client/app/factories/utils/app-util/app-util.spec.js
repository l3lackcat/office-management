'use strict';

describe('Service: AppUtil', function () {

  // load the service's module
  beforeEach(module('officeManagementApp'));

  // instantiate service
  var AppUtil;
  beforeEach(inject(function (_AppUtil_) {
    AppUtil = _AppUtil_;
  }));

  it('should do something', function () {
    expect(!!AppUtil).toBe(true);
  });

});
