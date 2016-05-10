'use strict';

describe('Service: ExportUtil', function () {

  // load the service's module
  beforeEach(module('officeManagementApp'));

  // instantiate service
  var ExportUtil;
  beforeEach(inject(function (_ExportUtil_) {
    ExportUtil = _ExportUtil_;
  }));

  it('should do something', function () {
    expect(!!ExportUtil).toBe(true);
  });

});
