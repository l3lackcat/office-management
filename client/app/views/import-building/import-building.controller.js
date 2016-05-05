'use strict';

angular.module('officeManagementApp')
  .controller('ImportBuildingCtrl', function ($http, $q, $scope, _, FileUploader) {
    var _importedBuildingList = null;

    $scope.uploader = new FileUploader();

    $scope.importFile = importFile;
    $scope.reset = reset;

    function onChangedFile (e) {
        var files = e.target.files;

        for(var i = files.length - 1; i >= 0; i--) {
            var file = files[i];

            if (file.name.indexOf('.json') > -1) {
                var reader = new FileReader();

                reader.onload = function (theFile) {
                    _importedBuildingList = JSON.parse(theFile.target.result);
                };

                reader.readAsText(file);
            }
        }
    };

    function extractBuildingUnit (buildingObj) {
        return {
            building: '',
            name: buildingObj.unitName.toString(),
            floor: buildingObj.floor.toString(),
            space: parseFloat(buildingObj.space),
            price: parseFloat(buildingObj.price),
            type: buildingObj.type,
            available: (buildingObj.available === 'Y') ? true : false,
            remark: buildingObj.remarks,
            contactInfo: buildingObj.contactInfo
        };
    };

    function generateNewBuildingList () {
        var newBuildingList = [];
        var importedBuildingCount = _importedBuildingList.length;

        for(var i = importedBuildingCount - 1; i >= 0; i--) {
            var importedBuilding = _importedBuildingList[i];
            var buildingName = importedBuilding.buildingName || '';

            if (buildingName !== '') {
                var buildingObj = _.find(newBuildingList, { name: buildingName });
                var buildingUnitObj = extractBuildingUnit(importedBuilding);

                if (buildingObj == null) {
                    newBuildingList.push({
                        id: '',
                        name: buildingName.toString(),
                        area: importedBuilding.area || '',
                        units: [buildingUnitObj]
                    });
                } else {
                    buildingObj.units.push(buildingUnitObj);
                }
            }
        }

        return newBuildingList;
    };

    function insertNewBuildingList (buildingList) {
        if (buildingList.length === 0) { return null; }

        var insertBuildingPromise = {};

        for(var i = buildingList.length - 1; i >= 0; i--) {
            var buildingObj = buildingList[i];
            var buildingName = buildingObj.name;

            insertBuildingPromise[buildingName] = $http.post('/api/buildings', {
                name: buildingName,
                area: buildingObj.area
            });
        }

        return $q.all(insertBuildingPromise).then(function (results) {
            return results;
        });
    };

    function importFile () {
        // updateStatus(STATUS_IMPORTING);

        var newBuildingList = generateNewBuildingList();

        if (newBuildingList.length > 0) {
            $http.get('/api/buildings').success(function (buildingList) {
                var oldBuildingList = [];

                for(var i = newBuildingList.length - 1; i >= 0; i--) {
                    var newBuildingObj = newBuildingList[i];
                    var oldBuildingObj = _.find(buildingList, { name: newBuildingObj.name.toString() });

                    if (oldBuildingObj != null) {
                        newBuildingObj.id = oldBuildingObj._id;

                        oldBuildingList.push(angular.copy(newBuildingObj));
                        newBuildingList.splice(i, 1);
                    }
                }

                $q.all([
                    insertNewBuildingList(newBuildingList)
                ]).then(function (results) {
                    var insertResult = results[0];

                    for(var i = newBuildingList.length - 1; i >= 0; i--) {
                        var newBuildingObj = newBuildingList[i];
                        var oldBuildingObj = insertResult[newBuildingObj.name].data;

                        newBuildingObj.id = oldBuildingObj._id;
                    }

                    processOldBuildingList(oldBuildingList.concat(newBuildingList));
                });
            });
        } else {
            // updateStatus(STATUS_COMPLETED);
        }
    };

    function processOldBuildingList (buildingList) {
        var searchBuildingUnitPromise = null;

        for(var i = buildingList.length - 1; i >= 0; i--) {
            var buildingObj = buildingList[i];
            var buildingId = buildingObj.id;
            var buildingUnitList = buildingObj.units;

            if (searchBuildingUnitPromise === null) {
                searchBuildingUnitPromise = {};
            }

            searchBuildingUnitPromise[buildingId] = $http.get('/api/building-units/buildingId/' + buildingId);
        }

        if (searchBuildingUnitPromise !== null) {
            $q.all(searchBuildingUnitPromise).then(function (results) {
                var buildingUnitPromise = null;

                for(var buildingId in results) {
                    var buildingObj = _.find(buildingList, { id: buildingId });

                    if (buildingObj != null) {
                        var result = results[buildingId];
                        var oldBuildingUnitList = result.data;
                        var newBuildingUnitList = buildingObj.units;

                        for(var i = newBuildingUnitList.length - 1; i >= 0; i--) {
                            var newBuildingUnitObj = newBuildingUnitList[i];
                            var oldBuildingUnitObj = _.find(oldBuildingUnitList, { name: newBuildingUnitObj.name });

                            newBuildingUnitObj.building = buildingId;

                            if (oldBuildingUnitObj == null) {
                                if (buildingUnitPromise == null) {
                                    buildingUnitPromise = [];
                                }

                                buildingUnitPromise.push($http.post('/api/building-units', newBuildingUnitObj));
                            } else {
                                if (buildingUnitPromise == null) {
                                    buildingUnitPromise = [];
                                }

                                buildingUnitPromise.push($http.put('/api/building-units/' + oldBuildingUnitObj._id, newBuildingUnitObj));
                            }
                        }
                    }
                }

                if (buildingUnitPromise !== null) {
                    $q.all(buildingUnitPromise).then(function (results) {
                        // updateStatus(STATUS_COMPLETED);
                    });
                } else {
                    // updateStatus(STATUS_COMPLETED);
                }
            });
        } else {
            // updateStatus(STATUS_COMPLETED);
        }
    };

    function reset () {
        _importedBuildingList = null;

        angular.element('#file').val('');

        $scope.uploader.clearQueue();
        $scope.importedStatus = '';
    };

    angular.element('#file').bind('change', onChangedFile);
  });
