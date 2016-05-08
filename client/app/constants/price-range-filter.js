'use strict';

angular.module('officeManagementApp')
    .run(function (AppConstant) {
        AppConstant['PRICE_RANGE_LIST'] = [
            {
                id: 0,
                name: 'Less than 300',
                min: null,
                max: 300
            },
            {
                id: 1,
                name: '300 - 500',
                min: 300,
                max: 500
            },
            {
                id: 2,
                name: '500 - 800',
                min: 500,
                max: 800
            },
            {
                id: 3,
                name: 'More than 800',
                min: 800,
                max: null
            }
        ];
    });
