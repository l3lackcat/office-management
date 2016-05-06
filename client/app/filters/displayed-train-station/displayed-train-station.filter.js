'use strict';

angular.module('officeManagementApp')
  .filter('displayedTrainStation', function (_) {
    return function (input) {
        var trainStationNameList = _.map(input, 'name');

        if (trainStationNameList.length > 0) {
            return trainStationNameList.join(', ');
        }

        return '';
    };
  });
