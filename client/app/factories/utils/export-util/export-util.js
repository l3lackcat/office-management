'use strict';

angular.module('officeManagementApp')
  .service('ExportUtil', function ($filter, _, alasql, pdfMake) {
    var ExportUtil = {
        print: function (buildingUnitList) {
            var groupedBuildingUnitList = _.groupBy(buildingUnitList, 'building._id');

            for(var buildingId in groupedBuildingUnitList) {
                pdfMake.createPdf(createDocument(groupedBuildingUnitList[buildingId])).print();
            }
        },

        toExcel: function (buildingUnitList) {
            var data = createExcelDataForExport(buildingUnitList);

            alasql.promise('SELECT INTO XLSX("Buildings.xlsx", ?) FROM ?', data).then(function (data) {
                console.log('Export to excel completed.');
            }).catch(function(err){
                console.log('Export error:', err);
            });
        },

        toJson: function (buildingUnitList) {
            var data = JSON.stringify(createJsonDataForExport(buildingUnitList));

            alasql.promise('SELECT INTO TXT("Buildings.json") FROM ?', [data]).then(function (data) {
                console.log('Export to text completed.');
            }).catch(function(err){
                console.log('Export error:', err);
            });
        },

        toPdf: function (buildingUnitList) {
            var groupedBuildingUnitList = _.groupBy(buildingUnitList, 'building._id');

            for(var buildingId in groupedBuildingUnitList) {
                pdfMake.createPdf(createDocument(groupedBuildingUnitList[buildingId])).open();
            }
        }
    };

    function createDocument (buildingUnitList) {
        return {
            pageSize: 'A4',
            pageOrientation: 'portrait',
            pageMargins: [40, 60, 40, 60],
            content:createContent(buildingUnitList)
        };
    };

    function createContent (buildingUnitList) {
        if (buildingUnitList == null) { return []; }
        if (buildingUnitList.length === 0) { return []; }

        var content = [];
        var buildingObj = buildingUnitList[0].building;
        var columnObj = { alignment: 'justify', columns: [] };
        var columnDetailObj = [];

        columnDetailObj.push(createGroupingTextObject('BUILDING SPECS', [
            createPairTextObject('BUILT: ', ''),
            createPairTextObject('STOREYS: ', ''),
            createPairTextObject('CEILING HEIGHT: ', '')
        ]));

        columnDetailObj.push(createTextObject('\n'));
        columnDetailObj.push(createGroupingTextObject('LIFTS', [
            createPairTextObject('PASSENGER: ', '')
        ]));

        columnDetailObj.push(createTextObject('\n'));
        columnDetailObj.push(createGroupingTextObject('LEASE', [
            createPairTextObject('LEASE TERM: ', ''),
            createPairTextObject('DEPOSIT: ', ''),
            createPairTextObject('ADVANCE RENTAL: ', '')
        ]));

        columnDetailObj.push(createTextObject('\n'));
        columnDetailObj.push(createGroupingTextObject('PARKING', [
            createPairTextObject('TOTAL SPACES: ', ''),
            createPairTextObject('TENANT: ', ''),
            createPairTextObject('ADDITIONAL PARKING: ', ''),
            createPairTextObject('VISITOR PARKING: ', '')
        ]));

        columnDetailObj.push(createTextObject('\n'));
        columnDetailObj.push(createGroupingTextObject('PARKING', [
            createPairTextObject('A/C TYPE: ', ''),
            createPairTextObject('A/C CHARGES: ', ''),
            createPairTextObject('TELEPHONE: ', ''),
            createPairTextObject('ELECTRICITY: ', ''),
            createPairTextObject('WATER CHARGE: ', '')
        ]));

        columnObj.columns.push(columnDetailObj);
        columnObj.columns.push({ width: 200, text: '' });

        content.push(createTextObject(buildingObj.name, 'heading1'));
        content.push(createTextObject(buildingObj.location, 'heading2'));
        content.push(createTextObject('\n'));

        content.push(columnObj);

        content.push(createTextObject('\n'));
        content.push(createBuildingUnitTableObject(buildingUnitList));

        return content;
    };

    function createTextObject (text, textType) {
        var textObj = { text: text };
        var style = {
            heading1: { fontSize: 16, bold: true },
            heading2: { fontSize: 12, bold: true },
            content1: { fontSize: 10, bold: true },
            content2: { fontSize: 10 }
        };

        if (textType != null) {
            textObj.style = style[textType];
        }

        return textObj;
    };

    function createGroupingTextObject (title, children) {
        var textObj = {
            table: {
                headerRows: 1,
                widths: [120, '*'],
                body: [[
                    { text: title, colSpan: 2, style: { fontSize: 12, bold: true, color: '#000' } }
                ]]
            },
            layout: 'headerLineOnly'
        };

        for(var i = 0; i < children.length; i++) {
            var childObj = [];

            childObj.push(children[i][0], children[i][1]);

            textObj.table.body.push(childObj);
        }

        return textObj;
    };

    function createPairTextObject (key, val) {
        var textObj = [];

        textObj.push(createTextObject(key, 'content1'));
        textObj.push(createTextObject(val, 'content2'));

        return textObj;
    };

    function createBuildingUnitTableObject (buildingUnitList) {
        var style = {
            header: { fontSize: 10, bold: true },
            content: { fontSize: 10 }
        };

        var tableObj = {
            style: [0, 5, 0, 15],
            table: {
                widths: [50, 30, '*', '*', '*', 120],
                body: [[
                    { style: style.header, alignment: 'center', text: 'Unit' },
                    { style: style.header, alignment: 'center', text: 'Floor' },
                    { style: style.header, alignment: 'center', text: 'Size (sqm.)' },
                    { style: style.header, alignment: 'center', text: 'Price (p/sqm.)' },
                    { style: style.header, alignment: 'center', text: 'Total Price' },
                    { style: style.header, alignment: 'center', text: 'Note/Comment' }
                ]]
            }
        };

        for(var i = 0; i < buildingUnitList.length; i++) {
            var buildingUnit = buildingUnitList[i];
            var buildingUnitDetail = [];

            buildingUnitDetail.push({ style: style.content, alignment: 'left', text: buildingUnit.name });
            buildingUnitDetail.push({ style: style.content, alignment: 'center', text: buildingUnit.floor });
            buildingUnitDetail.push({ style: style.content, alignment: 'right', text: $filter('number')(buildingUnit.area, 2) });
            buildingUnitDetail.push({ style: style.content, alignment: 'right', text: $filter('number')(buildingUnit.price, 2) });
            buildingUnitDetail.push({ style: style.content, alignment: 'right', text: $filter('number')(buildingUnit.area * buildingUnit.price, 2) });
            buildingUnitDetail.push({ style: style.content, alignment: 'left', text: buildingUnit.remark });

            tableObj.table.body.push(buildingUnitDetail);
        }

        return tableObj;
    };

    function createExcelDataForExport (buildingUnitList) {
        var sheetList = [];
        var dataList = [];
        var groupedBuildingUnitList = _.groupBy(buildingUnitList, 'building._id');

        for(var buildingId in groupedBuildingUnitList) {
            var buildingName = '';
            var newBuildingUnitList = [];
            var oldBuildingUnitList = groupedBuildingUnitList[buildingId];

            for(var i = oldBuildingUnitList.length - 1; i >= 0; i--) {
                var buildingUnit = oldBuildingUnitList[i];

                if (buildingName === '') {
                    buildingName = buildingUnit.building.name;
                }

                newBuildingUnitList.push({
                    'available': (buildingUnit.available === true) ? 'Y' : 'N',
                    'buildingName': buildingName,
                    'unitName': buildingUnit.name,
                    'floor': buildingUnit.floor,
                    'area': $filter('number')(buildingUnit.area, 2),
                    'price': $filter('number')(buildingUnit.price, 2),
                    'type': buildingUnit.type,
                    'location': buildingUnit.building.location,
                    'remarks': buildingUnit.remark,
                    'contact': buildingUnit.contact
                });
            }

            sheetList.push({
                sheetid: buildingName,
                header: true
            });

            dataList.push(newBuildingUnitList);
        }

        return [sheetList, dataList];
    };

    function createJsonDataForExport (buildingUnitList) {
        var data = [];
        var groupedBuildingUnitList = _.groupBy(buildingUnitList, 'building._id');

        for(var buildingId in groupedBuildingUnitList) {
            var buildingObj = null;
            var oldBuildingUnitList = groupedBuildingUnitList[buildingId];

            for(var i = oldBuildingUnitList.length - 1; i >= 0; i--) {
                var buildingUnit = oldBuildingUnitList[i];
                var buildingData = buildingUnit.building;

                if (buildingObj === null) {
                    buildingObj = {
                        name: buildingData.name,
                        location: buildingData.location,
                        trainStation: angular.copy(buildingData.trainStation),
                        specs: angular.copy(buildingData.specs),
                        lifts: angular.copy(buildingData.lifts),
                        lease: angular.copy(buildingData.lease),
                        parking: angular.copy(buildingData.parking),
                        utilities: angular.copy(buildingData.utilities),
                        units: []
                    };
                }

                buildingObj.units.push({
                    'unitName': buildingUnit.name,
                    'floor': buildingUnit.floor,
                    'area': buildingUnit.area,
                    'price': buildingUnit.price,
                    'type': buildingUnit.type,
                    'available': buildingUnit.available,
                    'remarks': buildingUnit.remark,
                    'contact': buildingUnit.contact
                });
            }

            data.push(buildingObj);
        }

        return data;
    };

    return ExportUtil;
  });
