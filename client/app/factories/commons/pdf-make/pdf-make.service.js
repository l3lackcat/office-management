'use strict';

angular.module('officeManagementApp')
  .factory('pdfMake', function () {
    // Public API here
    return window.pdfMake;
  });
