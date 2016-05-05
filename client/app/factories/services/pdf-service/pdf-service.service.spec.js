'use strict';

describe('Service: PdfService', function () {

  // load the service's module
  beforeEach(module('officeManagementApp'));

  // instantiate service
  var PdfService;
  beforeEach(inject(function (_PdfService_) {
    PdfService = _PdfService_;
  }));

  it('should do something', function () {
    expect(!!PdfService).toBe(true);
  });

});
