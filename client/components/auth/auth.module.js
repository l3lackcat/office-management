'use strict';

angular.module('officeManagementApp.auth', [
  'officeManagementApp.constants',
  'officeManagementApp.util',
  'ngCookies',
  'ngRoute'
])
  .config(function($httpProvider) {
    $httpProvider.interceptors.push('authInterceptor');
  });
