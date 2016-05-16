'use strict';

angular.module('officeManagementApp')
  .service('AppUtil', function (_) {
    var AppUtil = {
        createLocationFilterList: function (buildingUnitList) {
            var locationFilterList = [];
            var locationList = AppUtil.getLocationList(buildingUnitList);

            for(var i = locationList.length - 1; i >= 0; i--) {
                locationFilterList.push({
                    id: i,
                    name: locationList[i]
                });
            }

            return locationFilterList;
        },

        getBuildingList: function (buildingUnitList) {
            var buildingList = [];
            var groupedBuildingUnitList = _.groupBy(buildingUnitList, 'building._id');

            for(var buildingId in groupedBuildingUnitList) {
                buildingList.push(groupedBuildingUnitList[buildingId][0].building);
            }

            return buildingList;
        },

        getLocationList: function (buildingUnitList) {
            var buildingList = AppUtil.getBuildingList(buildingUnitList);

            if (buildingList.length === 0) {
                return [];
            } else {
                return _.uniq(_.without(_.map(buildingList, 'location'), null));
            }
        },

        isBetween: function (input, min, max) {
            if ((min !== null) && (max !== null)) {
                if ((input >= min) && (input <= max)) {
                    return true;
                }
            } else if (min !== null) {
                if (input >= min) {
                    return true;
                }
            } else if (min === null) {
                if (input <= max) {
                    return true;
                }
            }

            return false;
        }
    };

    return AppUtil;
  });
