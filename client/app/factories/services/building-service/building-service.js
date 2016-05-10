'use strict';

angular.module('officeManagementApp')
  .service('BuildingService', function ($http) {
    var BuildingService = {
        getBuilding: function (buildingId) {
            return $http.get('/api/buildings/' + buildingId).success(function (building) {
                return building;
            });
        },

        getBuildingList: function () {
            return $http.get('/api/buildings').success(function (buildingList) {
                return buildingList;
            });
        },

        getBuildingUnitList: function (buildingId) {
            if (buildingId == null) {
                return $http.get('/api/building-units').success(function (buildingUnitList) {
                    return buildingUnitList;
                });
            } else {
                return $http.get('/api/building-units/buildingId/' + buildingId).success(function (buildingUnitList) {
                    return buildingUnitList;
                });
            }
        },

        insertBuildingUnit: function (buildingUnit) {
            return $http.post('/api/building-units', buildingUnit).success(function (insertedBuildingUnit) {
                return insertedBuildingUnit;
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

        updateBuilding: function (building) {
            return $http.put('/api/buildings/' + building._id, building).success(function (updatedBuilding) {
                return updatedBuilding;
            });
        },

        updateBuildingList: function (buildingList) {
            var promise = {};

            for(var i = buildingList.length - 1; i >= 0; i--) {
                var building = buildingList[i];
                var buildingId = building._id;

                promise[buildingUnitId] = $http.put('/api/buildings/' + buildingId, building);
            }

            return promise;
        },

        updateBuildingUnit: function (buildingUnit) {
            return $http.put('/api/building-units/' + buildingUnit._id, buildingUnit).success(function (updatedBuildingUnit) {
                return updatedBuildingUnit;
            });
        },

        updateBuildingUnitList: function (buildingUnitList) {
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
