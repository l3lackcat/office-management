'use strict';

angular.module('officeManagementApp')
  .filter('displayedRoomStatus', function () {
    return function (input) {
    	if (input === 'Y') { return 'Available'; }
    	if (input === 'N') { return 'Not available'; }

    	return '';
    };
  });
