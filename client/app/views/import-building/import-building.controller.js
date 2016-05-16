'use strict';

angular.module('officeManagementApp')
  .controller('ImportBuildingCtrl', function ($http, $loading, $q, $scope, $uibModal, _, Metadata, FileUploader, XLSX) {
    var _importedBuildingList = null;

    $scope.uploader = new FileUploader();
    $scope.excelSheet = { list: [], selected: null };

    $scope.checkDisabled = checkDisabled;
    $scope.importBuilding = importBuilding;
    $scope.onChangedSelectedSheet = onChangedSelectedSheet;
    $scope.previewBuilding = previewBuilding;
    $scope.reset = reset;

    function extractBuildingUnit (buildingObj) {
        return {
            building: '',
            name: (buildingObj.unitName || '').toString(),
            floor: (buildingObj.floor || '').toString(),
            area: parseFloat(buildingObj.area || 0),
            price: parseFloat(buildingObj.price || 0),
            type: buildingObj.type || 'Office',
            available: (buildingObj.available === 'Y') ? true : false,
            remark: buildingObj.remarks || '',
            contact: buildingObj.contact || ''
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
                        location: importedBuilding.location || '',
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
                location: buildingObj.location
            });
        }

        return $q.all(insertBuildingPromise).then(function (results) {
            return results;
        });
    };

    function updateOldBuildingList (buildingList) {
        if (buildingList.length === 0) { return null; }

        var insertBuildingPromise = {};

        for(var i = buildingList.length - 1; i >= 0; i--) {
            var buildingObj = buildingList[i];
            var buildingName = buildingObj.name;

            insertBuildingPromise[buildingName] = $http.put('/api/buildings/' + buildingObj.id, {
                location: buildingObj.location
            });
        }

        return $q.all(insertBuildingPromise).then(function (results) {
            return results;
        });
    };

    function importBuilding () {
        $loading.start('import-building');

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
                    insertNewBuildingList(newBuildingList),
                    updateOldBuildingList(oldBuildingList)
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
            reset();
        }
    };

    function checkDisabled (name) {
        var isDisabled = true;

        if ((name === 'preview-building') || (name === 'import-building')) {
            if ($scope.uploader.getNotUploadedItems().length > 0) {
                if ($scope.excelSheet.list.length > 0) {
                    if ($scope.excelSheet.selected !== null) {
                        isDisabled = false;
                    }
                } else {
                    isDisabled = false;
                }
            }
        }

        return isDisabled;
    };

    function onChangedSelectedFile (e) {
        var files = e.target.files;

        _importedBuildingList = null;

        $scope.uploader.clearQueue();
        $scope.excelSheet = { list: [], selected: null };

        for(var i = files.length - 1; i >= 0; i--) {
            var file = files[i];
            var fileName = file.name;

            if (fileName.indexOf('.json') > -1) {
                var reader = new FileReader();

                reader.onload = function (theFile) {
                    _importedBuildingList = JSON.parse(theFile.target.result);
                };

                reader.readAsText(file);
            } else if (fileName.indexOf('.xlsx') > -1) {
                var reader = new FileReader();

                reader.onload = function (theFile) {
                    var workbook = XLSX.read(theFile.target.result, { type: 'binary' });

                    $q.all([
                        readExcelSheet(workbook)
                    ]).then(function (results) {
                        // Do Nothing
                    });
                };

                reader.readAsBinaryString(file);
            }
        }
    };

    function onChangedSelectedSheet () {
        var data = $scope.excelSheet.selected.data;

        if (data != null) {
            _importedBuildingList = XLSX.utils.sheet_to_json(data);
        } else {
            _importedBuildingList = null;
        }
    };

    function previewBuilding () {
        var options = _.find(Metadata.MODAL_LIST, { name: 'BuildingViewerModal' });

        if (options != null) {
            options.resolve = {
                buildingList: function () {
                    return generateNewBuildingList();;
                }
            };

            $uibModal.open(options);
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
                        reset();
                    });
                } else {
                    reset();
                }
            });
        } else {
            reset();
        }
    };

    function readExcelSheet (workbook) {
        var sheets = workbook.Sheets || {};

        for(var sheetName in sheets) {
            $scope.excelSheet.list.push({
                name: sheetName,
                data: sheets[sheetName]
            })
        }
    };

    function reset () {
        _importedBuildingList = null;

        angular.element('#file').val('');

        $scope.uploader.clearQueue();
        $scope.excelSheet = { list: [], selected: null };

        $loading.finish('import-building');
    };

    angular.element('#file').bind('change', onChangedSelectedFile);
  });
