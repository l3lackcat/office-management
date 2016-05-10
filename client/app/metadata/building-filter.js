'use strict';

angular.module('officeManagementApp')
    .run(function (Metadata) {
        Metadata['BUILDING_FILTER'] = {
            name: '',
            location: {
                list: [],
                selected: []
            },
            unit: {
                type: {
                    selected: [],
                    list: [
                        { id: 0, name: 'Office' },
                        { id: 1, name: 'Retail' }
                    ]
                },
                area: {
                    selected: [],
                    list: [
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
                    ]
                },
                price: {
                    selected: [],
                    list: [
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
                    ]
                },
                netPrice: {
                    selected: [],
                    list: [
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
                    ]
                }
            }  
        };
    });
