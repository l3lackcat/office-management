'use strict';

angular.module('officeManagementApp')
  .controller('ImportBuildingCtrl', function ($http, $q, $scope, _, FileUploader) {
    var _importedBuildingList = null;

    $scope.uploader = new FileUploader();

    $scope.importedStatus = '';
    $scope.importedProgress = 0;

    $scope.importFile = importFile;
    $scope.removeFile = removeFile;

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
            name: buildingObj.unitName,
            floor: buildingObj.floor,
            space: parseFloat(buildingObj.space),
            price: parseFloat(buildingObj.price),
            type: buildingObj.type,
            available: (buildingObj.available === 'Y') ? true : false,
            remark: buildingObj.remarks,
            contactInfo: buildingObj.contactInfo
        };
    };

    function insertNewBuilding (buildingObj) {
        $http.post('/api/buildings', buildingObj).success(function (newBuilding) {
            console.log('Insert building: ' + newBuilding.name + ' complete.');
        });
    };

    // function insertNewBuildingUnit (buildingUnitObj) {
    //     $http.post('/api/building-units', buildingUnitObj).success(function (newBuilding) {

    //     });
    // };

    function importFile () {
        var groupedBuildingList = [];
        var importedBuildingCount = _importedBuildingList.length;

        $scope.importedStatus = 'Preparing...';
        $scope.importedProgress = 0;

        for(var i = importedBuildingCount - 1; i >= 0; i--) {
            var importedBuilding = _importedBuildingList[i];
            var buildingName = importedBuilding.buildingName || '';

            if (buildingName !== '') {
                var buildingObj = _.find(groupedBuildingList, { name: buildingName });
                var buildingUnitObj = extractBuildingUnit(importedBuilding);

                if (buildingObj == null) {
                    groupedBuildingList.push({
                        name: buildingName,
                        area: importedBuilding.area || '',
                        units: [buildingUnitObj]
                    });
                } else {
                    buildingObj.units.push(buildingUnitObj);
                }
            }

            $scope.importedProgress += ((i / importedBuildingCount) * 10);
        }

        $scope.importedStatus = 'Importing...';
        $scope.importedProgress = 10;

        var groupedBuildingCount = groupedBuildingList.length;
        var findBuildingPromise = {};

        for(var i = groupedBuildingList.length - 1; i >= 0; i--) {
            var buildingName = groupedBuildingList[i].name;

            findBuildingPromise[buildingName] = $http.get('/api/buildings/findByName/' + buildingName);
        }

        $q.all(findBuildingPromise).then(function (results) {
            var insertBuildingPromise = null;

            for(var buildingName in results) {
                var buildingObj = _.find(groupedBuildingList, { name: buildingName });
                var result = results[buildingName];

                if (result.data.length > 0) {
                    var buildingId = result.data[0].id || '';

                    if (buildingId !== '') {
                        for(var i = buildingObj.units.length - 1; i >= 0; i--) {
                            // TODO : Find building unit by name, floor, and buildingId. If not found, insert. Else, ignore.
                        }
                    }
                } else {
                    if (insertBuildingPromise === null) {
                        insertBuildingPromise = {};
                    }

                    insertBuildingPromise[buildingName] = $http.post('/api/buildings', {
                        name: buildingName,
                        area: buildingObj.area
                    });
                }
            }

            if (insertBuildingPromise !== null) {
                $q.all(insertBuildingPromise).then(function (results) {
                    // TODO : Insert building units
                });
            }
        });

        // console.log(newBuildingPromise);

        $scope.importedStatus = 'Import complete!!!';
        // $scope.importedProgress = 100;
    };

    function removeFile () {
        _importedBuildingList = null;

        angular.element('#file').val('');
        $scope.uploader.clearQueue();

        $scope.importedStatus = '';
        $scope.importedProgress = 0;
    };

    angular.element('#file').bind('change', onChangedFile);
  });
