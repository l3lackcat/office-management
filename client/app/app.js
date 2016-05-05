'use strict';

angular.module('officeManagementApp', [
    'officeManagementApp.auth',
    'officeManagementApp.admin',
    'officeManagementApp.constants',
    'ngCookies',
    'ngResource',
    'ngSanitize',
    'ngRoute',
    'validation.match',
    'angularFileUpload',
    'ui.bootstrap',
    'ui.select'
])
    .config(function($routeProvider, $locationProvider) {
        $routeProvider
            .otherwise({
                redirectTo: '/'
            });

        $locationProvider.html5Mode(true);
    });
