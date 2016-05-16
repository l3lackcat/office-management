'use strict';

describe('Service: XLSX', function () {

  // load the service's module
  beforeEach(module('officeManagementApp'));

  // instantiate service
  var XLSX;
  beforeEach(inject(function (_XLSX_) {
    XLSX = _XLSX_;
  }));

  it('should do something', function () {
    expect(!!XLSX).toBe(true);
  });

});
