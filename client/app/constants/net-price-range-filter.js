'use strict';

angular.module('officeManagementApp')
    .run(function (AppConstant) {
        AppConstant['NET_PRICE_RANGE_LIST'] = [
            {
                id: 0,
                name: 'Less than 20,000',
                min: null,
                max: 20000
            },
            {
                id: 1,
                name: '20,000 - 40,000',
                min: 20000,
                max: 40000
            },
            {
                id: 2,
                name: '40,000 - 60,000',
                min: 40000,
                max: 60000
            },
            {
                id: 3,
                name: '60,000 - 80,000',
                min: 60000,
                max: 80000
            },
            {
                id: 4,
                name: 'More than 80,000',
                min: 80000,
                max: null
            }
        ];
    });
