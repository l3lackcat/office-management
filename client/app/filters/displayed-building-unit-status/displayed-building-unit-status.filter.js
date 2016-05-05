'use strict';

angular.module('officeManagementApp')
  .filter('displayedBuildingUnitStatus', function () {
    return function (input) {
    	if (input === true) { return 'Available'; }
    	if (input === false) { return 'Not available'; }

    	return '';
    };
  });
