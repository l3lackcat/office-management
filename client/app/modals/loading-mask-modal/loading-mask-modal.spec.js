'use strict';

describe('Service: $loadingMask', function () {

    // load the service's module
    beforeEach(module('officeManagementApp'));

    // instantiate service
    var $loadingMask;
    beforeEach(inject(function (_$loadingMask_) {
        $loadingMask = _$loadingMask_;
    }));

    it('should do something', function () {
        expect(!!$loadingMask).toBe(true);
    });

});
