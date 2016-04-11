"use strict";

/*
    The factories are created to provide data and services
    to the controllers and are located under the "data" directory. 
    
    All controllers are included in this single file for simplicity. 
	
	Note: Make sure to include the proper data file when using particular
	controller.
*/

var app = angular.module("igniteui-sample", ["igniteui-directives"]);

// controllers
app.controller("gridController",

            ["$scope", "northwind",
    function ($scope,   northwind) {
        // only needed until https://github.com/angular/angular.js/issues/6683 is resolved
        for (var i = 0; i < northwind.data.length; i++) {
            northwind.data[i].UnitPrice = parseFloat(northwind.data[i].UnitPrice);
        }
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

app.controller("comboController",

            ["$scope", "northwind",
    function ($scope,   northwind) {

        $scope.northwind = northwind.data;

        $scope.combo = {
            value1: 20,
            value2: "Chang"
        };

    }]);

app.controller("dataChartController",

            ["$scope", "populationData",
    function ($scope,   populationData) {

        $scope.dataChart = populationData.data;

    }]);

app.controller("editorsController",

            ["$scope",
    function ($scope) {

        $scope.editors = {
            currency: 12.1,
            date: new Date(),
            editor: "Infragistics",
            mask: "134-134-134",
            numeric: 123,
            percent: 0.12,
            text: "Ignite UI"
        };

    }]);

app.controller("treeController",

            ["$scope", "productCategories",
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
            var selected = $("#tree1").igTree("selectedNode");
            if (selected.path !== null) {
                $("#tree1").igTree("removeAt", selected.path);
            } else {
                alert("Select a node from the tree first");
            }
        };

    }]);

app.controller("hierarchicalGridController",

            ["$scope", "northwindEmployees",
    function ($scope,   northwindEmployees) {

        $scope.northwindEmployees = northwindEmployees.data;

    }]);
	
app.controller("tileManagerController",

            ["$scope", "candidates",
    function ($scope,   candidates) {

        $scope.candidates = candidates.data;

    }]);
app.controller("treeGridController",

            ["$scope", "tasks",
    function ($scope,   tasks) {

        $scope.tasks = tasks.data;

    }]);
app.controller("pivotGridController",

            ["$scope",
    function ($scope) {

        $scope.pivotData = new $.ig.OlapFlatDataSource({
                dataSource:
                [{ "ProductCategory": "Clothing", "UnitPrice": 12.81, "SellerName": "Stanley Brooker", "Country": "Bulgaria", "City": "Plovdiv", "Date": "01/01/2012", "UnitsSold": 282 },
                { "ProductCategory": "Clothing", "UnitPrice": 49.57, "SellerName": "Elisa Longbottom", "Country": "US", "City": "New York", "Date": "01/05/2013", "UnitsSold": 296 },
                { "ProductCategory": "Bikes", "UnitPrice": 3.56, "SellerName": "Lydia Burson", "Country": "Uruguay", "City": "Ciudad de la Costa", "Date": "01/06/2011", "UnitsSold": 68 },
                { "ProductCategory": "Accessories", "UnitPrice": 85.58, "SellerName": "David Haley", "Country": "UK", "City": "London", "Date": "04/07/2012", "UnitsSold": 293 },
                { "ProductCategory": "Components", "UnitPrice": 18.13, "SellerName": "John Smith", "Country": "Japan", "City": "Yokohama", "Date": "12/08/2012", "UnitsSold": 240 },
                { "ProductCategory": "Clothing", "UnitPrice": 68.33, "SellerName": "Larry Lieb", "Country": "Uruguay", "City": "Ciudad de la Costa", "Date": "05/12/2011", "UnitsSold": 456 },
                { "ProductCategory": "Components", "UnitPrice": 16.05, "SellerName": "Walter Pang", "Country": "Bulgaria", "City": "Sofia", "Date": "02/19/2013", "UnitsSold": 492 }],
                metadata: {
                    cube: {
                        name: "Sales",
                        caption: "Sales",
                        measuresDimension: {
                            caption: "Measures",
                            measures: [ //for each measure, name and aggregator are required
                                {
                                    caption: "Units Sold", name: "UnitsSold",
                                    // returns a function that will be used as sum aggregator on the "UnitsSold property" of the data objects
                                    aggregator: $.ig.OlapUtilities.prototype.sumAggregator("UnitsSold")
                                }]
                        },
                        dimensions: [ // for each dimension name and hierarchies are required
                            {
                                caption: "Seller", name: "Seller", hierarchies: [{
                                    caption: "Seller", name: "Seller", levels: [
                                        {
                                            name: "AllSellers", caption: "All Sellers",
                                            memberProvider: function (item) { return "All Sellers"; }
                                        },
                                        {
                                            name: "SellerName", caption: "Seller",
                                            memberProvider: function (item) { return item.SellerName; }
                                        }]
                                }]
                            },
                            {
                                caption: "Date", name: "Date", /*displayFolder: "Folder1\\Folder2",*/ hierarchies: [
                                    $.ig.OlapUtilities.prototype.getDateHierarchy(
                                        "Date", // the source property name
                                        ["year", "quarter", "month", "date"], // the date parts for which levels will be generated (optional)
                                        "Dates", // The name for the hierarchy (optional)
                                        "Date", // The caption for the hierarchy (optional)
                                        ["Year", "Quarter", "Month", "Day"], // the captions for the levels (optional)
                                        "All Periods") // the root level caption (optional)
                                ]
                            }
                        ]
                    }
                },
                // Preload hierarchies for the rows, columns, filters and measures
                rows: "[Date].[Dates]",
                columns: "[Seller].[Seller]",
                measures: "[Measures].[UnitsSold]"
            });
    }]);
app.controller("pivotGridXmlaController",

            ["$scope",
    function ($scope) {
		$scope.xmlaDataSource = new $.ig.OlapXmlaDataSource({
                serverUrl: "http://sampledata.infragistics.com/olap/msmdpump.dll",
                catalog: "Adventure Works DW Standard Edition",
                cube: "Adventure Works",
                rows: "[Ship Date].[Calendar]",
                columns: "[Delivery Date].[Calendar]",
                measures: "[Measures].[Product Gross Profit Margin Status],[Measures].[Product Gross Profit Margin Goal]",
            });
    }]);
app.controller("htmlEditorController",
            ["$scope",
    function ($scope) {
       $scope.data = "<p>Ignite UI controls:</p><p><ul><li>igEditors</li><li>igHtmlEditor</li><li>igGrid</li><li>igDataChart</li><li>etc.</li></ul></p>";
    }]);