'use strict';

describe('Service: alasql', function () {

  // load the service's module
  beforeEach(module('officeManagementApp'));

  // instantiate service
  var alasql;
  beforeEach(inject(function (_alasql_) {
    alasql = _alasql_;
  }));

  it('should do something', function () {
    expect(!!alasql).toBe(true);
  });

});
