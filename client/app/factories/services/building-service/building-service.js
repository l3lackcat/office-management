'use strict';

angular.module('officeManagementApp')
  .service('BuildingService', function ($http) {
    var BuildingService = {
        getBuildingList: function () {
            return $http.get('/api/buildings').success(function (buildingList) {
                return buildingList;
            });
        },

        getBuildingUnitList: function () {
            return $http.get('/api/building-units').success(function (buildingUnitList) {
                return buildingUnitList;
            });
        },

        removeBuildingUnit: function (buildingUnitList) {
            var promise = {};

            for(var i = buildingUnitList.length - 1; i >= 0; i--) {
                var buildingUnitId = buildingUnitList[i]._id;

                promise[buildingUnitId] = $http.delete('/api/building-units/' + buildingUnitId);
            }

            return promise;
        },

        updateBuildingUnit: function (buildingUnitList) {
            var promise = {};

            for(var i = buildingUnitList.length - 1; i >= 0; i--) {
                var buildingUnit = buildingUnitList[i];
                var buildingUnitId = buildingUnit._id;

                promise[buildingUnitId] = $http.put('/api/building-units/' + buildingUnitId, buildingUnit);
            }

            return promise;
        }
    };

    return BuildingService;
  });
