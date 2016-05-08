'use strict';

angular.module('officeManagementApp')
    .run(function (AppConstant) {
        AppConstant['AREA_RANGE_LIST'] = [
            {
                id: 0,
                name: 'Less than 100',
                min: null,
                max: 100
            },
            {
                id: 1,
                name: '100 - 200',
                min: 100,
                max: 200
            },
            {
                id: 2,
                name: '200 - 300',
                min: 200,
                max: 300
            },
            {
                id: 3,
                name: '300 - 400',
                min: 300,
                max: 400
            },
            {
                id: 4,
                name: '400 - 500',
                min: 400,
                max: 500
            },
            {
                id: 5,
                name: 'More than 500',
                min: 500,
                max: null
            },
            {
                id: 6,
                name: 'More than 1,000',
                min: 1000,
                max: null
            }
        ];
    });
