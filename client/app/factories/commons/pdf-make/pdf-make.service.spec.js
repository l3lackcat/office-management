'use strict';

describe('Service: pdfMake', function () {

  // load the service's module
  beforeEach(module('officeManagementApp'));

  // instantiate service
  var pdfMake;
  beforeEach(inject(function (_pdfMake_) {
    pdfMake = _pdfMake_;
  }));

  it('should do something', function () {
    expect(!!pdfMake).toBe(true);
  });

});
