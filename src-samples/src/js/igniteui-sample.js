'use strict';

/*
    The factories are created to provide data and services
    to the controllers and are located under the "data" directory. 
    
    All controllers are included in this single file for simplicity. 
	
	Note: Make sure to include the proper data file when using particular
	controller.
*/

var app = angular.module('igniteui-sample', ['igniteui-directives']);

// controllers
app.controller('gridController',

            ['$scope', 'northwind',
    function ($scope,   northwind) {
        // only needed until https://github.com/angular/angular.js/issues/6683 is resolved
        for (var i = 0; i < northwind.data.length; i++) {
            northwind.data[i].UnitPrice = parseFloat(northwind.data[i].UnitPrice);
        };
        $scope.northwind = northwind.data;

        var createNewProduct = function () {
            return {
                ProductID: $scope.northwind.length + 1,
                ProductName: null,
                QuantityPerUnit: null,
                UnitPrice: null
            };
        };

        $scope.newProduct = createNewProduct();

        $scope.deleteProduct = function (index) {
            $scope.northwind.splice(index, 1);
        };

        $scope.addProduct = function () {
           
            $scope.northwind.add($scope.newProduct);

            $scope.newProduct = createNewProduct();
        };

        $scope.gridOptions = {
            dataSource: $scope.northwind,
            width: "100%",
            height: "400px",
            primaryKey: "ProductID",
            autoCommit: true,
            autoGenerateColumns: false,
            columns: [
                   { "headerText": "Product ID", "key": "ProductID", "dataType": "number", "width": "50px" },
                   { "headerText": "Name", "key": "ProductName", "dataType": "string", "width": "250px" },
                   { "headerText": "Quantity per unit", "key": "QuantityPerUnit", "dataType": "string", "width": "200px" },
                   { "headerText": "Unit Price", "key": "UnitPrice", "dataType": "string", "width": "100px" }
            ],
            features: [{
                name: "Updating",
                columnSettings: [{
                    columnKey: "ProductID",
                    readOnly: true
                }]
            }, {
                name: "Paging",
                pageSize: 10
            }, {
                name: "Filtering"
            }, {
                name: "Sorting"
            }]

        };

    }]);

app.controller('comboController',

            ['$scope', 'northwind',
    function ($scope,   northwind) {

        $scope.northwind = northwind.data;

        $scope.combo = {
            value1: 20,
            value2: "Chang"
        };

    }]);

app.controller('dataChartController',

            ['$scope', 'populationData',
    function ($scope,   populationData) {

        $scope.dataChart = populationData.data;

    }]);

app.controller('editorsController',

            ['$scope',
    function ($scope) {

        $scope.editors = {
            currency: 12.1,
            date: new Date(),
            editor: 'Infragistics',
            mask: '134-134-134',
            numeric: 123,
            percent: 0.12,
            text: 'Ignite UI'
        };

    }]);

app.controller('treeController',

            ['$scope', 'productCategories',
    function ($scope,   productCategories) {

        $scope.ProductCategories = productCategories.data;

        $scope.deleteProductCategory = function (ix) {
            $scope.ProductCategories.splice(ix, 1);
        };

        $scope.deleteProductSubcategory = function (pix, ix) {
            $scope.ProductCategories[pix].ProductSubcategories.splice(ix, 1);
        };

        $scope.addProductCategory = function () {
            var tmp = angular.copy($scope.newProductCategory);
            $scope.ProductCategories.push(tmp);
        };

        $scope.addProductSubcategory = function (ix) {
            var tmp = angular.copy($scope.newProductSubcategory);
            $scope.ProductCategories[ix].ProductSubcategories.push(tmp);
        };

        $scope.newProductSubcategory = {
            Name: "",
            ProductSubcategoryID: 1,
            Products: []
        };

        $scope.newProductCategory = {
            Name: "",
            ProductCategoryID: 1,
            ProductSubcategories: []
        };

        $scope.addNodeRootLevel = function () {
            $("#tree1").igTree("addNode", { Name: "New Node", ProductCategoryID: $scope.ProductCategories.length + 1 });
        };

        $scope.removeSelectedNode = function () {
            var selected = $('#tree1').igTree('selectedNode');
            if (selected.path !== null) {
                $('#tree1').igTree('removeAt', selected.path);
            } else {
                alert('Select a node from the tree first');
            }
        };

    }]);

app.controller('hierarchicalGridController',

            ['$scope', 'northwindEmployees',
    function ($scope,   northwindEmployees) {

        $scope.northwindEmployees = northwindEmployees.data;

    }]);
	
app.controller('tileManagerController',

            ['$scope', 'candidates',
    function ($scope,   candidates) {

        $scope.candidates = candidates.data;

    }]);
