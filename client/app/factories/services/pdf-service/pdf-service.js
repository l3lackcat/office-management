'use strict';

angular.module('officeManagementApp')
  .service('PdfService', function ($filter, _, pdfMake) {
    var PdfService = {
        createBuildingDetailReport: function (buildingUnitList, action) {
            var docDefinition = {
                pageSize: 'A4',
                pageOrientation: 'portrait',
                pageMargins: [40, 60, 40, 60],
                content:[]
            };

            if (buildingUnitList.length > 0) {
                var buildingObj = buildingUnitList[0].building;
                var columnObj = { alignment: 'justify', columns: [] };
                var columnDetailObj = [];

                console.log(buildingObj);

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

                docDefinition.content.push(createTextObject(buildingObj.name, 'heading1'));
                docDefinition.content.push(createTextObject(buildingObj.location, 'heading2'));
                docDefinition.content.push(createTextObject('\n'));

                docDefinition.content.push(columnObj);

                docDefinition.content.push(createTextObject('\n'));
                docDefinition.content.push(createBuildingUnitTableObject(buildingUnitList));
                // docDefinition.content.push({ text: '', pageOrientation: 'portrait', pageBreak: 'after' });
            }

            if (action === 'print') {
                pdfMake.createPdf(docDefinition).print();
            } else {
                pdfMake.createPdf(docDefinition).open();
            }
        }
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

    return PdfService;
  });