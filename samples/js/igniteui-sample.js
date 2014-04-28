'use strict';

/*
    The factories are created to provide data and services
    to the controllers. 
    
    All data and controllers are included in this single file
    to ensure everything is loaded in the proper order. We're
    trying to keep things simple for now by not introducing a 
    script loader - yet ;)
*/

var app = angular.module('igniteui-sample', ['igniteui-directives']);

// controllers
app.controller('gridController',

            ['$scope', 'northwind',
    function ($scope,   northwind) {

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
            debugger;
            $scope.northwind.splice(index, 1);
        };

        $scope.addProduct = function () {
            
            debugger;
            
            $scope.northwind.add($scope.newProduct);

            $scope.newProduct = createNewProduct();
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


// data factories
app.factory('northwind', [function () {

    var svc = {

        add: function (newProduct) {

            var tmp = angular.copy(svc.newProduct);

            tmp.ProductID = newProduct.ProductID;
            tmp.ProductName = newProduct.ProductName;
            tmp.QuantityPerUnit = newProduct.QuantityPerUnit;
            tmp.UnitPrice = newProduct.UnitPrice;

            svc.data.push(tmp);
        },

        newProduct: {
            "ProductID": 1,
            "ProductName": "",
            "SupplierID": 1,
            "CategoryID": 1,
            "QuantityPerUnit": "",
            "UnitPrice": "",
            "UnitsInStock": 0,
            "UnitsOnOrder": 0,
            "ReorderLevel": 0,
            "Discontinued": false,
            "Category": {
                "__deferred": {
                    "uri": "http://services.odata.org/Northwind/Northwind.svc/Products(1)/Category"
                }
            },
            "Order_Details": {
                "__deferred": {
                    "uri": "http://services.odata.org/Northwind/Northwind.svc/Products(1)/Order_Details"
                }
            },
            "Supplier": {
                "__deferred": {
                    "uri": "http://services.odata.org/Northwind/Northwind.svc/Products(1)/Supplier"
                }
            }
        },

        data: [{
            "__metadata": {
                "uri": "http://services.odata.org/Northwind/Northwind.svc/Products(1)",
                "type": "NorthwindModel.Product"
            },
            "ProductID": 1,
            "ProductName": "Chai",
            "SupplierID": 1,
            "CategoryID": 1,
            "QuantityPerUnit": "10 boxes x 20 bags",
            "UnitPrice": "18.0000",
            "UnitsInStock": 39,
            "UnitsOnOrder": 0,
            "ReorderLevel": 10,
            "Discontinued": false,
            "Category": {
                "__deferred": {
                    "uri": "http://services.odata.org/Northwind/Northwind.svc/Products(1)/Category"
                }
            },
            "Order_Details": {
                "__deferred": {
                    "uri": "http://services.odata.org/Northwind/Northwind.svc/Products(1)/Order_Details"
                }
            },
            "Supplier": {
                "__deferred": {
                    "uri": "http://services.odata.org/Northwind/Northwind.svc/Products(1)/Supplier"
                }
            }
        }, {
            "__metadata": {
                "uri": "http://services.odata.org/Northwind/Northwind.svc/Products(2)",
                "type": "NorthwindModel.Product"
            },
            "ProductID": 2,
            "ProductName": "Chang",
            "SupplierID": 1,
            "CategoryID": 1,
            "QuantityPerUnit": "24 - 12 oz bottles",
            "UnitPrice": "19.0000",
            "UnitsInStock": 17,
            "UnitsOnOrder": 40,
            "ReorderLevel": 25,
            "Discontinued": false,
            "Category": {
                "__deferred": {
                    "uri": "http://services.odata.org/Northwind/Northwind.svc/Products(2)/Category"
                }
            },
            "Order_Details": {
                "__deferred": {
                    "uri": "http://services.odata.org/Northwind/Northwind.svc/Products(2)/Order_Details"
                }
            },
            "Supplier": {
                "__deferred": {
                    "uri": "http://services.odata.org/Northwind/Northwind.svc/Products(2)/Supplier"
                }
            }
        }, {
            "__metadata": {
                "uri": "http://services.odata.org/Northwind/Northwind.svc/Products(3)",
                "type": "NorthwindModel.Product"
            },
            "ProductID": 3,
            "ProductName": "Aniseed Syrup",
            "SupplierID": 1,
            "CategoryID": 2,
            "QuantityPerUnit": "12 - 550 ml bottles",
            "UnitPrice": "10.0000",
            "UnitsInStock": 13,
            "UnitsOnOrder": 70,
            "ReorderLevel": 25,
            "Discontinued": false,
            "Category": {
                "__deferred": {
                    "uri": "http://services.odata.org/Northwind/Northwind.svc/Products(3)/Category"
                }
            },
            "Order_Details": {
                "__deferred": {
                    "uri": "http://services.odata.org/Northwind/Northwind.svc/Products(3)/Order_Details"
                }
            },
            "Supplier": {
                "__deferred": {
                    "uri": "http://services.odata.org/Northwind/Northwind.svc/Products(3)/Supplier"
                }
            }
        }, {
            "__metadata": {
                "uri": "http://services.odata.org/Northwind/Northwind.svc/Products(4)",
                "type": "NorthwindModel.Product"
            },
            "ProductID": 4,
            "ProductName": "Chef Anton's Cajun Seasoning",
            "SupplierID": 2,
            "CategoryID": 2,
            "QuantityPerUnit": "48 - 6 oz jars",
            "UnitPrice": "22.0000",
            "UnitsInStock": 53,
            "UnitsOnOrder": 0,
            "ReorderLevel": 0,
            "Discontinued": false,
            "Category": {
                "__deferred": {
                    "uri": "http://services.odata.org/Northwind/Northwind.svc/Products(4)/Category"
                }
            },
            "Order_Details": {
                "__deferred": {
                    "uri": "http://services.odata.org/Northwind/Northwind.svc/Products(4)/Order_Details"
                }
            },
            "Supplier": {
                "__deferred": {
                    "uri": "http://services.odata.org/Northwind/Northwind.svc/Products(4)/Supplier"
                }
            }
        }, {
            "__metadata": {
                "uri": "http://services.odata.org/Northwind/Northwind.svc/Products(5)",
                "type": "NorthwindModel.Product"
            },
            "ProductID": 5,
            "ProductName": "Chef Anton's Gumbo Mix",
            "SupplierID": 2,
            "CategoryID": 2,
            "QuantityPerUnit": "36 boxes",
            "UnitPrice": "21.3500",
            "UnitsInStock": 0,
            "UnitsOnOrder": 0,
            "ReorderLevel": 0,
            "Discontinued": true,
            "Category": {
                "__deferred": {
                    "uri": "http://services.odata.org/Northwind/Northwind.svc/Products(5)/Category"
                }
            },
            "Order_Details": {
                "__deferred": {
                    "uri": "http://services.odata.org/Northwind/Northwind.svc/Products(5)/Order_Details"
                }
            },
            "Supplier": {
                "__deferred": {
                    "uri": "http://services.odata.org/Northwind/Northwind.svc/Products(5)/Supplier"
                }
            }
        }, {
            "__metadata": {
                "uri": "http://services.odata.org/Northwind/Northwind.svc/Products(6)",
                "type": "NorthwindModel.Product"
            },
            "ProductID": 6,
            "ProductName": "Grandma's Boysenberry Spread",
            "SupplierID": 3,
            "CategoryID": 2,
            "QuantityPerUnit": "12 - 8 oz jars",
            "UnitPrice": "25.0000",
            "UnitsInStock": 120,
            "UnitsOnOrder": 0,
            "ReorderLevel": 25,
            "Discontinued": false,
            "Category": {
                "__deferred": {
                    "uri": "http://services.odata.org/Northwind/Northwind.svc/Products(6)/Category"
                }
            },
            "Order_Details": {
                "__deferred": {
                    "uri": "http://services.odata.org/Northwind/Northwind.svc/Products(6)/Order_Details"
                }
            },
            "Supplier": {
                "__deferred": {
                    "uri": "http://services.odata.org/Northwind/Northwind.svc/Products(6)/Supplier"
                }
            }
        }, {
            "__metadata": {
                "uri": "http://services.odata.org/Northwind/Northwind.svc/Products(7)",
                "type": "NorthwindModel.Product"
            },
            "ProductID": 7,
            "ProductName": "Uncle Bob's Organic Dried Pears",
            "SupplierID": 3,
            "CategoryID": 7,
            "QuantityPerUnit": "12 - 1 lb pkgs.",
            "UnitPrice": "30.0000",
            "UnitsInStock": 15,
            "UnitsOnOrder": 0,
            "ReorderLevel": 10,
            "Discontinued": false,
            "Category": {
                "__deferred": {
                    "uri": "http://services.odata.org/Northwind/Northwind.svc/Products(7)/Category"
                }
            },
            "Order_Details": {
                "__deferred": {
                    "uri": "http://services.odata.org/Northwind/Northwind.svc/Products(7)/Order_Details"
                }
            },
            "Supplier": {
                "__deferred": {
                    "uri": "http://services.odata.org/Northwind/Northwind.svc/Products(7)/Supplier"
                }
            }
        }, {
            "__metadata": {
                "uri": "http://services.odata.org/Northwind/Northwind.svc/Products(8)",
                "type": "NorthwindModel.Product"
            },
            "ProductID": 8,
            "ProductName": "Northwoods Cranberry Sauce",
            "SupplierID": 3,
            "CategoryID": 2,
            "QuantityPerUnit": "12 - 12 oz jars",
            "UnitPrice": "40.0000",
            "UnitsInStock": 6,
            "UnitsOnOrder": 0,
            "ReorderLevel": 0,
            "Discontinued": false,
            "Category": {
                "__deferred": {
                    "uri": "http://services.odata.org/Northwind/Northwind.svc/Products(8)/Category"
                }
            },
            "Order_Details": {
                "__deferred": {
                    "uri": "http://services.odata.org/Northwind/Northwind.svc/Products(8)/Order_Details"
                }
            },
            "Supplier": {
                "__deferred": {
                    "uri": "http://services.odata.org/Northwind/Northwind.svc/Products(8)/Supplier"
                }
            }
        }, {
            "__metadata": {
                "uri": "http://services.odata.org/Northwind/Northwind.svc/Products(9)",
                "type": "NorthwindModel.Product"
            },
            "ProductID": 9,
            "ProductName": "Mishi Kobe Niku",
            "SupplierID": 4,
            "CategoryID": 6,
            "QuantityPerUnit": "18 - 500 g pkgs.",
            "UnitPrice": "97.0000",
            "UnitsInStock": 29,
            "UnitsOnOrder": 0,
            "ReorderLevel": 0,
            "Discontinued": true,
            "Category": {
                "__deferred": {
                    "uri": "http://services.odata.org/Northwind/Northwind.svc/Products(9)/Category"
                }
            },
            "Order_Details": {
                "__deferred": {
                    "uri": "http://services.odata.org/Northwind/Northwind.svc/Products(9)/Order_Details"
                }
            },
            "Supplier": {
                "__deferred": {
                    "uri": "http://services.odata.org/Northwind/Northwind.svc/Products(9)/Supplier"
                }
            }
        }, {
            "__metadata": {
                "uri": "http://services.odata.org/Northwind/Northwind.svc/Products(10)",
                "type": "NorthwindModel.Product"
            },
            "ProductID": 10,
            "ProductName": "Ikura",
            "SupplierID": 4,
            "CategoryID": 8,
            "QuantityPerUnit": "12 - 200 ml jars",
            "UnitPrice": "31.0000",
            "UnitsInStock": 31,
            "UnitsOnOrder": 0,
            "ReorderLevel": 0,
            "Discontinued": false,
            "Category": {
                "__deferred": {
                    "uri": "http://services.odata.org/Northwind/Northwind.svc/Products(10)/Category"
                }
            },
            "Order_Details": {
                "__deferred": {
                    "uri": "http://services.odata.org/Northwind/Northwind.svc/Products(10)/Order_Details"
                }
            },
            "Supplier": {
                "__deferred": {
                    "uri": "http://services.odata.org/Northwind/Northwind.svc/Products(10)/Supplier"
                }
            }
        }, {
            "__metadata": {
                "uri": "http://services.odata.org/Northwind/Northwind.svc/Products(11)",
                "type": "NorthwindModel.Product"
            },
            "ProductID": 11,
            "ProductName": "Queso Cabrales",
            "SupplierID": 5,
            "CategoryID": 4,
            "QuantityPerUnit": "1 kg pkg.",
            "UnitPrice": "21.0000",
            "UnitsInStock": 22,
            "UnitsOnOrder": 30,
            "ReorderLevel": 30,
            "Discontinued": false,
            "Category": {
                "__deferred": {
                    "uri": "http://services.odata.org/Northwind/Northwind.svc/Products(11)/Category"
                }
            },
            "Order_Details": {
                "__deferred": {
                    "uri": "http://services.odata.org/Northwind/Northwind.svc/Products(11)/Order_Details"
                }
            },
            "Supplier": {
                "__deferred": {
                    "uri": "http://services.odata.org/Northwind/Northwind.svc/Products(11)/Supplier"
                }
            }
        }, {
            "__metadata": {
                "uri": "http://services.odata.org/Northwind/Northwind.svc/Products(12)",
                "type": "NorthwindModel.Product"
            },
            "ProductID": 12,
            "ProductName": "Queso Manchego La Pastora",
            "SupplierID": 5,
            "CategoryID": 4,
            "QuantityPerUnit": "10 - 500 g pkgs.",
            "UnitPrice": "38.0000",
            "UnitsInStock": 86,
            "UnitsOnOrder": 0,
            "ReorderLevel": 0,
            "Discontinued": false,
            "Category": {
                "__deferred": {
                    "uri": "http://services.odata.org/Northwind/Northwind.svc/Products(12)/Category"
                }
            },
            "Order_Details": {
                "__deferred": {
                    "uri": "http://services.odata.org/Northwind/Northwind.svc/Products(12)/Order_Details"
                }
            },
            "Supplier": {
                "__deferred": {
                    "uri": "http://services.odata.org/Northwind/Northwind.svc/Products(12)/Supplier"
                }
            }
        }, {
            "__metadata": {
                "uri": "http://services.odata.org/Northwind/Northwind.svc/Products(13)",
                "type": "NorthwindModel.Product"
            },
            "ProductID": 13,
            "ProductName": "Konbu",
            "SupplierID": 6,
            "CategoryID": 8,
            "QuantityPerUnit": "2 kg box",
            "UnitPrice": "6.0000",
            "UnitsInStock": 24,
            "UnitsOnOrder": 0,
            "ReorderLevel": 5,
            "Discontinued": false,
            "Category": {
                "__deferred": {
                    "uri": "http://services.odata.org/Northwind/Northwind.svc/Products(13)/Category"
                }
            },
            "Order_Details": {
                "__deferred": {
                    "uri": "http://services.odata.org/Northwind/Northwind.svc/Products(13)/Order_Details"
                }
            },
            "Supplier": {
                "__deferred": {
                    "uri": "http://services.odata.org/Northwind/Northwind.svc/Products(13)/Supplier"
                }
            }
        }, {
            "__metadata": {
                "uri": "http://services.odata.org/Northwind/Northwind.svc/Products(14)",
                "type": "NorthwindModel.Product"
            },
            "ProductID": 14,
            "ProductName": "Tofu",
            "SupplierID": 6,
            "CategoryID": 7,
            "QuantityPerUnit": "40 - 100 g pkgs.",
            "UnitPrice": "23.2500",
            "UnitsInStock": 35,
            "UnitsOnOrder": 0,
            "ReorderLevel": 0,
            "Discontinued": false,
            "Category": {
                "__deferred": {
                    "uri": "http://services.odata.org/Northwind/Northwind.svc/Products(14)/Category"
                }
            },
            "Order_Details": {
                "__deferred": {
                    "uri": "http://services.odata.org/Northwind/Northwind.svc/Products(14)/Order_Details"
                }
            },
            "Supplier": {
                "__deferred": {
                    "uri": "http://services.odata.org/Northwind/Northwind.svc/Products(14)/Supplier"
                }
            }
        }, {
            "__metadata": {
                "uri": "http://services.odata.org/Northwind/Northwind.svc/Products(15)",
                "type": "NorthwindModel.Product"
            },
            "ProductID": 15,
            "ProductName": "Genen Shouyu",
            "SupplierID": 6,
            "CategoryID": 2,
            "QuantityPerUnit": "24 - 250 ml bottles",
            "UnitPrice": "15.5000",
            "UnitsInStock": 39,
            "UnitsOnOrder": 0,
            "ReorderLevel": 5,
            "Discontinued": false,
            "Category": {
                "__deferred": {
                    "uri": "http://services.odata.org/Northwind/Northwind.svc/Products(15)/Category"
                }
            },
            "Order_Details": {
                "__deferred": {
                    "uri": "http://services.odata.org/Northwind/Northwind.svc/Products(15)/Order_Details"
                }
            },
            "Supplier": {
                "__deferred": {
                    "uri": "http://services.odata.org/Northwind/Northwind.svc/Products(15)/Supplier"
                }
            }
        }, {
            "__metadata": {
                "uri": "http://services.odata.org/Northwind/Northwind.svc/Products(16)",
                "type": "NorthwindModel.Product"
            },
            "ProductID": 16,
            "ProductName": "Pavlova",
            "SupplierID": 7,
            "CategoryID": 3,
            "QuantityPerUnit": "32 - 500 g boxes",
            "UnitPrice": "17.4500",
            "UnitsInStock": 29,
            "UnitsOnOrder": 0,
            "ReorderLevel": 10,
            "Discontinued": false,
            "Category": {
                "__deferred": {
                    "uri": "http://services.odata.org/Northwind/Northwind.svc/Products(16)/Category"
                }
            },
            "Order_Details": {
                "__deferred": {
                    "uri": "http://services.odata.org/Northwind/Northwind.svc/Products(16)/Order_Details"
                }
            },
            "Supplier": {
                "__deferred": {
                    "uri": "http://services.odata.org/Northwind/Northwind.svc/Products(16)/Supplier"
                }
            }
        }, {
            "__metadata": {
                "uri": "http://services.odata.org/Northwind/Northwind.svc/Products(17)",
                "type": "NorthwindModel.Product"
            },
            "ProductID": 17,
            "ProductName": "Alice Mutton",
            "SupplierID": 7,
            "CategoryID": 6,
            "QuantityPerUnit": "20 - 1 kg tins",
            "UnitPrice": "39.0000",
            "UnitsInStock": 0,
            "UnitsOnOrder": 0,
            "ReorderLevel": 0,
            "Discontinued": true,
            "Category": {
                "__deferred": {
                    "uri": "http://services.odata.org/Northwind/Northwind.svc/Products(17)/Category"
                }
            },
            "Order_Details": {
                "__deferred": {
                    "uri": "http://services.odata.org/Northwind/Northwind.svc/Products(17)/Order_Details"
                }
            },
            "Supplier": {
                "__deferred": {
                    "uri": "http://services.odata.org/Northwind/Northwind.svc/Products(17)/Supplier"
                }
            }
        }, {
            "__metadata": {
                "uri": "http://services.odata.org/Northwind/Northwind.svc/Products(18)",
                "type": "NorthwindModel.Product"
            },
            "ProductID": 18,
            "ProductName": "Carnarvon Tigers",
            "SupplierID": 7,
            "CategoryID": 8,
            "QuantityPerUnit": "16 kg pkg.",
            "UnitPrice": "62.5000",
            "UnitsInStock": 42,
            "UnitsOnOrder": 0,
            "ReorderLevel": 0,
            "Discontinued": false,
            "Category": {
                "__deferred": {
                    "uri": "http://services.odata.org/Northwind/Northwind.svc/Products(18)/Category"
                }
            },
            "Order_Details": {
                "__deferred": {
                    "uri": "http://services.odata.org/Northwind/Northwind.svc/Products(18)/Order_Details"
                }
            },
            "Supplier": {
                "__deferred": {
                    "uri": "http://services.odata.org/Northwind/Northwind.svc/Products(18)/Supplier"
                }
            }
        }, {
            "__metadata": {
                "uri": "http://services.odata.org/Northwind/Northwind.svc/Products(19)",
                "type": "NorthwindModel.Product"
            },
            "ProductID": 19,
            "ProductName": "Teatime Chocolate Biscuits",
            "SupplierID": 8,
            "CategoryID": 3,
            "QuantityPerUnit": "10 boxes x 12 pieces",
            "UnitPrice": "9.2000",
            "UnitsInStock": 25,
            "UnitsOnOrder": 0,
            "ReorderLevel": 5,
            "Discontinued": false,
            "Category": {
                "__deferred": {
                    "uri": "http://services.odata.org/Northwind/Northwind.svc/Products(19)/Category"
                }
            },
            "Order_Details": {
                "__deferred": {
                    "uri": "http://services.odata.org/Northwind/Northwind.svc/Products(19)/Order_Details"
                }
            },
            "Supplier": {
                "__deferred": {
                    "uri": "http://services.odata.org/Northwind/Northwind.svc/Products(19)/Supplier"
                }
            }
        }, {
            "__metadata": {
                "uri": "http://services.odata.org/Northwind/Northwind.svc/Products(20)",
                "type": "NorthwindModel.Product"
            },
            "ProductID": 20,
            "ProductName": "Sir Rodney's Marmalade",
            "SupplierID": 8,
            "CategoryID": 3,
            "QuantityPerUnit": "30 gift boxes",
            "UnitPrice": "81.0000",
            "UnitsInStock": 40,
            "UnitsOnOrder": 0,
            "ReorderLevel": 0,
            "Discontinued": false,
            "Category": {
                "__deferred": {
                    "uri": "http://services.odata.org/Northwind/Northwind.svc/Products(20)/Category"
                }
            },
            "Order_Details": {
                "__deferred": {
                    "uri": "http://services.odata.org/Northwind/Northwind.svc/Products(20)/Order_Details"
                }
            },
            "Supplier": {
                "__deferred": {
                    "uri": "http://services.odata.org/Northwind/Northwind.svc/Products(20)/Supplier"
                }
            }
        }
        ]
    };

    return svc;

}]);

app.factory('populationData', [function () {

    var svc = {
        data: [
		    { "CountryName": "China", "Pop1995": 1216, "Pop2005": 1297, "Pop2015": 1361, "Pop2025": 1394 },
		    { "CountryName": "India", "Pop1995": 920, "Pop2005": 1090, "Pop2015": 1251, "Pop2025": 1396 },
		    { "CountryName": "United States", "Pop1995": 266, "Pop2005": 295, "Pop2015": 322, "Pop2025": 351 },
		    { "CountryName": "Indonesia", "Pop1995": 197, "Pop2005": 229, "Pop2015": 256, "Pop2025": 277 },
		    { "CountryName": "Brazil", "Pop1995": 161, "Pop2005": 186, "Pop2015": 204, "Pop2025": 218 }
        ]
    };

    return svc;

}]);

app.factory('productCategories', [function () {

    var svc = {
        data: 	[{
            "Name": "Bikes",
            "ProductCategoryID": 1,
            "ProductSubcategories": [{
                "Name": "Mountain Bikes",
                "ProductSubcategoryID": 1,
                "Products": null
            }, {
                "Name": "Road Bikes",
                "ProductSubcategoryID": 2,
                "Products": null
            }, {
                "Name": "Touring Bikes",
                "ProductSubcategoryID": 3,
                "Products": [{
                    "Name": "Touring-2000 Blue, 60",
                    "ProductID": 953,
                    "ProductCostHistories": [{
                        "StandardCost": 755.1508,
                        "ProductID": 953
                    }]
                }, {
                    "Name": "Touring-1000 Yellow, 46",
                    "ProductID": 954,
                    "ProductCostHistories": [{
                        "StandardCost": 1481.9379,
                        "ProductID": 954
                    }]
                }, {
                    "Name": "Touring-1000 Yellow, 50",
                    "ProductID": 955,
                    "ProductCostHistories": [{
                        "StandardCost": 1481.9379,
                        "ProductID": 955
                    }]
                }, {
                    "Name": "Touring-1000 Yellow, 54",
                    "ProductID": 956,
                    "ProductCostHistories": [{
                        "StandardCost": 1481.9379,
                        "ProductID": 956
                    }]
                }, {
                    "Name": "Touring-1000 Yellow, 60",
                    "ProductID": 957,
                    "ProductCostHistories": [{
                        "StandardCost": 1481.9379,
                        "ProductID": 957
                    }]
                }, {
                    "Name": "Touring-3000 Blue, 54",
                    "ProductID": 958,
                    "ProductCostHistories": [{
                        "StandardCost": 461.4448,
                        "ProductID": 958
                    }]
                }, {
                    "Name": "Touring-3000 Blue, 58",
                    "ProductID": 959,
                    "ProductCostHistories": [{
                        "StandardCost": 461.4448,
                        "ProductID": 959
                    }]
                }, {
                    "Name": "Touring-3000 Blue, 62",
                    "ProductID": 960,
                    "ProductCostHistories": [{
                        "StandardCost": 461.4448,
                        "ProductID": 960
                    }]
                }, {
                    "Name": "Touring-3000 Yellow, 44",
                    "ProductID": 961,
                    "ProductCostHistories": [{
                        "StandardCost": 461.4448,
                        "ProductID": 961
                    }]
                }, {
                    "Name": "Touring-3000 Yellow, 50",
                    "ProductID": 962,
                    "ProductCostHistories": [{
                        "StandardCost": 461.4448,
                        "ProductID": 962
                    }]
                }, {
                    "Name": "Touring-3000 Yellow, 54",
                    "ProductID": 963,
                    "ProductCostHistories": [{
                        "StandardCost": 461.4448,
                        "ProductID": 963
                    }]
                }, {
                    "Name": "Touring-3000 Yellow, 58",
                    "ProductID": 964,
                    "ProductCostHistories": [{
                        "StandardCost": 461.4448,
                        "ProductID": 964
                    }]
                }, {
                    "Name": "Touring-3000 Yellow, 62",
                    "ProductID": 965,
                    "ProductCostHistories": [{
                        "StandardCost": 461.4448,
                        "ProductID": 965
                    }]
                }, {
                    "Name": "Touring-1000 Blue, 46",
                    "ProductID": 966,
                    "ProductCostHistories": [{
                        "StandardCost": 1481.9379,
                        "ProductID": 966
                    }]
                }, {
                    "Name": "Touring-1000 Blue, 50",
                    "ProductID": 967,
                    "ProductCostHistories": [{
                        "StandardCost": 1481.9379,
                        "ProductID": 967
                    }]
                }, {
                    "Name": "Touring-1000 Blue, 54",
                    "ProductID": 968,
                    "ProductCostHistories": [{
                        "StandardCost": 1481.9379,
                        "ProductID": 968
                    }]
                }, {
                    "Name": "Touring-1000 Blue, 60",
                    "ProductID": 969,
                    "ProductCostHistories": [{
                        "StandardCost": 1481.9379,
                        "ProductID": 969
                    }]
                }, {
                    "Name": "Touring-2000 Blue, 46",
                    "ProductID": 970,
                    "ProductCostHistories": [{
                        "StandardCost": 755.1508,
                        "ProductID": 970
                    }]
                }, {
                    "Name": "Touring-2000 Blue, 50",
                    "ProductID": 971,
                    "ProductCostHistories": [{
                        "StandardCost": 755.1508,
                        "ProductID": 971
                    }]
                }, {
                    "Name": "Touring-2000 Blue, 54",
                    "ProductID": 972,
                    "ProductCostHistories": [{
                        "StandardCost": 755.1508,
                        "ProductID": 972
                    }]
                }, {
                    "Name": "Touring-3000 Blue, 44",
                    "ProductID": 978,
                    "ProductCostHistories": [{
                        "StandardCost": 461.4448,
                        "ProductID": 978
                    }]
                }, {
                    "Name": "Touring-3000 Blue, 50",
                    "ProductID": 979,
                    "ProductCostHistories": [{
                        "StandardCost": 461.4448,
                        "ProductID": 979
                    }]
                }]
            }]
        }, {
            "Name": "Components",
            "ProductCategoryID": 2,
            "ProductSubcategories": [{
                "Name": "Handlebars",
                "ProductSubcategoryID": 4,
                "Products": [{
                    "Name": "LL Mountain Handlebars",
                    "ProductID": 808,
                    "ProductCostHistories": [{
                        "StandardCost": 17.9780,
                        "ProductID": 808
                    }, {
                        "StandardCost": 19.7758,
                        "ProductID": 808
                    }]
                }, {
                    "Name": "ML Mountain Handlebars",
                    "ProductID": 809,
                    "ProductCostHistories": [{
                        "StandardCost": 24.9932,
                        "ProductID": 809
                    }, {
                        "StandardCost": 27.4925,
                        "ProductID": 809
                    }]
                }, {
                    "Name": "HL Mountain Handlebars",
                    "ProductID": 810,
                    "ProductCostHistories": [{
                        "StandardCost": 48.5453,
                        "ProductID": 810
                    }, {
                        "StandardCost": 53.3999,
                        "ProductID": 810
                    }]
                }, {
                    "Name": "LL Road Handlebars",
                    "ProductID": 811,
                    "ProductCostHistories": [{
                        "StandardCost": 17.9780,
                        "ProductID": 811
                    }, {
                        "StandardCost": 19.7758,
                        "ProductID": 811
                    }]
                }, {
                    "Name": "ML Road Handlebars",
                    "ProductID": 812,
                    "ProductCostHistories": [{
                        "StandardCost": 24.9932,
                        "ProductID": 812
                    }, {
                        "StandardCost": 27.4925,
                        "ProductID": 812
                    }]
                }, {
                    "Name": "HL Road Handlebars",
                    "ProductID": 813,
                    "ProductCostHistories": [{
                        "StandardCost": 48.5453,
                        "ProductID": 813
                    }, {
                        "StandardCost": 53.3999,
                        "ProductID": 813
                    }]
                }, {
                    "Name": "LL Touring Handlebars",
                    "ProductID": 946,
                    "ProductCostHistories": [{
                        "StandardCost": 20.4640,
                        "ProductID": 946
                    }]
                }, {
                    "Name": "HL Touring Handlebars",
                    "ProductID": 947,
                    "ProductCostHistories": [{
                        "StandardCost": 40.6571,
                        "ProductID": 947
                    }]
                }]
            }, {
                "Name": "Bottom Brackets",
                "ProductSubcategoryID": 5,
                "Products": [{
                    "Name": "LL Bottom Bracket",
                    "ProductID": 994,
                    "ProductCostHistories": [{
                        "StandardCost": 23.9716,
                        "ProductID": 994
                    }]
                }, {
                    "Name": "ML Bottom Bracket",
                    "ProductID": 995,
                    "ProductCostHistories": [{
                        "StandardCost": 44.9506,
                        "ProductID": 995
                    }]
                }, {
                    "Name": "HL Bottom Bracket",
                    "ProductID": 996,
                    "ProductCostHistories": [{
                        "StandardCost": 53.9416,
                        "ProductID": 996
                    }]
                }]
            }, {
                "Name": "Brakes",
                "ProductSubcategoryID": 6,
                "Products": [{
                    "Name": "Rear Brakes",
                    "ProductID": 907,
                    "ProductCostHistories": [{
                        "StandardCost": 47.2860,
                        "ProductID": 907
                    }]
                }, {
                    "Name": "Front Brakes",
                    "ProductID": 948,
                    "ProductCostHistories": [{
                        "StandardCost": 47.2860,
                        "ProductID": 948
                    }]
                }]
            }, {
                "Name": "Chains",
                "ProductSubcategoryID": 7,
                "Products": [{
                    "Name": "Chain",
                    "ProductID": 952,
                    "ProductCostHistories": [{
                        "StandardCost": 8.9866,
                        "ProductID": 952
                    }]
                }]
            }, {
                "Name": "Cranksets",
                "ProductSubcategoryID": 8,
                "Products": [{
                    "Name": "LL Crankset",
                    "ProductID": 949,
                    "ProductCostHistories": [{
                        "StandardCost": 77.9176,
                        "ProductID": 949
                    }]
                }, {
                    "Name": "ML Crankset",
                    "ProductID": 950,
                    "ProductCostHistories": [{
                        "StandardCost": 113.8816,
                        "ProductID": 950
                    }]
                }, {
                    "Name": "HL Crankset",
                    "ProductID": 951,
                    "ProductCostHistories": [{
                        "StandardCost": 179.8156,
                        "ProductID": 951
                    }]
                }]
            }, {
                "Name": "Derailleurs",
                "ProductSubcategoryID": 9,
                "Products": [{
                    "Name": "Rear Derailleur",
                    "ProductID": 894,
                    "ProductCostHistories": [{
                        "StandardCost": 53.9282,
                        "ProductID": 894
                    }]
                }, {
                    "Name": "Front Derailleur",
                    "ProductID": 945,
                    "ProductCostHistories": [{
                        "StandardCost": 40.6216,
                        "ProductID": 945
                    }]
                }]
            }, {
                "Name": "Forks",
                "ProductSubcategoryID": 10,
                "Products": [{
                    "Name": "LL Fork",
                    "ProductID": 802,
                    "ProductCostHistories": [{
                        "StandardCost": 65.8097,
                        "ProductID": 802
                    }]
                }, {
                    "Name": "ML Fork",
                    "ProductID": 803,
                    "ProductCostHistories": [{
                        "StandardCost": 77.9176,
                        "ProductID": 803
                    }]
                }, {
                    "Name": "HL Fork",
                    "ProductID": 804,
                    "ProductCostHistories": [{
                        "StandardCost": 101.8936,
                        "ProductID": 804
                    }]
                }]
            }, {
                "Name": "Headsets",
                "ProductSubcategoryID": 11,
                "Products": [{
                    "Name": "LL Headset",
                    "ProductID": 805,
                    "ProductCostHistories": [{
                        "StandardCost": 15.1848,
                        "ProductID": 805
                    }]
                }, {
                    "Name": "ML Headset",
                    "ProductID": 806,
                    "ProductCostHistories": [{
                        "StandardCost": 45.4168,
                        "ProductID": 806
                    }]
                }, {
                    "Name": "HL Headset",
                    "ProductID": 807,
                    "ProductCostHistories": [{
                        "StandardCost": 55.3801,
                        "ProductID": 807
                    }]
                }]
            }, {
                "Name": "Mountain Frames",
                "ProductSubcategoryID": 12,
                "Products": [{
                    "Name": "HL Mountain Frame - Silver, 42",
                    "ProductID": 739,
                    "ProductCostHistories": [{
                        "StandardCost": 623.8403,
                        "ProductID": 739
                    }, {
                        "StandardCost": 660.9142,
                        "ProductID": 739
                    }, {
                        "StandardCost": 747.2002,
                        "ProductID": 739
                    }]
                }, {
                    "Name": "HL Mountain Frame - Silver, 44",
                    "ProductID": 740,
                    "ProductCostHistories": [{
                        "StandardCost": 706.8110,
                        "ProductID": 740
                    }]
                }, {
                    "Name": "HL Mountain Frame - Silver, 48",
                    "ProductID": 741,
                    "ProductCostHistories": [{
                        "StandardCost": 706.8110,
                        "ProductID": 741
                    }]
                }, {
                    "Name": "HL Mountain Frame - Silver, 46",
                    "ProductID": 742,
                    "ProductCostHistories": [{
                        "StandardCost": 623.8403,
                        "ProductID": 742
                    }, {
                        "StandardCost": 660.9142,
                        "ProductID": 742
                    }, {
                        "StandardCost": 747.2002,
                        "ProductID": 742
                    }]
                }, {
                    "Name": "HL Mountain Frame - Black, 42",
                    "ProductID": 743,
                    "ProductCostHistories": [{
                        "StandardCost": 617.0281,
                        "ProductID": 743
                    }, {
                        "StandardCost": 653.6971,
                        "ProductID": 743
                    }, {
                        "StandardCost": 739.0410,
                        "ProductID": 743
                    }]
                }, {
                    "Name": "HL Mountain Frame - Black, 44",
                    "ProductID": 744,
                    "ProductCostHistories": [{
                        "StandardCost": 699.0928,
                        "ProductID": 744
                    }]
                }, {
                    "Name": "HL Mountain Frame - Black, 48",
                    "ProductID": 745,
                    "ProductCostHistories": [{
                        "StandardCost": 699.0928,
                        "ProductID": 745
                    }]
                }, {
                    "Name": "HL Mountain Frame - Black, 46",
                    "ProductID": 746,
                    "ProductCostHistories": [{
                        "StandardCost": 617.0281,
                        "ProductID": 746
                    }, {
                        "StandardCost": 653.6971,
                        "ProductID": 746
                    }, {
                        "StandardCost": 739.0410,
                        "ProductID": 746
                    }]
                }, {
                    "Name": "HL Mountain Frame - Black, 38",
                    "ProductID": 747,
                    "ProductCostHistories": [{
                        "StandardCost": 617.0281,
                        "ProductID": 747
                    }, {
                        "StandardCost": 653.6971,
                        "ProductID": 747
                    }, {
                        "StandardCost": 739.0410,
                        "ProductID": 747
                    }]
                }, {
                    "Name": "HL Mountain Frame - Silver, 38",
                    "ProductID": 748,
                    "ProductCostHistories": [{
                        "StandardCost": 623.8403,
                        "ProductID": 748
                    }, {
                        "StandardCost": 660.9142,
                        "ProductID": 748
                    }, {
                        "StandardCost": 747.2002,
                        "ProductID": 748
                    }]
                }, {
                    "Name": "ML Mountain Frame - Black, 38",
                    "ProductID": 814,
                    "ProductCostHistories": [{
                        "StandardCost": 185.8193,
                        "ProductID": 814
                    }]
                }, {
                    "Name": "ML Mountain Frame - Black, 40",
                    "ProductID": 830,
                    "ProductCostHistories": [{
                        "StandardCost": 185.8193,
                        "ProductID": 830
                    }]
                }, {
                    "Name": "ML Mountain Frame - Black, 44",
                    "ProductID": 831,
                    "ProductCostHistories": [{
                        "StandardCost": 185.8193,
                        "ProductID": 831
                    }]
                }, {
                    "Name": "ML Mountain Frame - Black, 48",
                    "ProductID": 832,
                    "ProductCostHistories": [{
                        "StandardCost": 185.8193,
                        "ProductID": 832
                    }]
                }, {
                    "Name": "ML Mountain Frame-W - Silver, 40",
                    "ProductID": 904,
                    "ProductCostHistories": [{
                        "StandardCost": 199.3757,
                        "ProductID": 904
                    }]
                }, {
                    "Name": "ML Mountain Frame-W - Silver, 42",
                    "ProductID": 905,
                    "ProductCostHistories": [{
                        "StandardCost": 199.3757,
                        "ProductID": 905
                    }]
                }, {
                    "Name": "ML Mountain Frame-W - Silver, 46",
                    "ProductID": 906,
                    "ProductCostHistories": [{
                        "StandardCost": 199.3757,
                        "ProductID": 906
                    }]
                }, {
                    "Name": "LL Mountain Frame - Silver, 42",
                    "ProductID": 917,
                    "ProductCostHistories": [{
                        "StandardCost": 144.5938,
                        "ProductID": 917
                    }]
                }, {
                    "Name": "LL Mountain Frame - Silver, 44",
                    "ProductID": 918,
                    "ProductCostHistories": [{
                        "StandardCost": 144.5938,
                        "ProductID": 918
                    }]
                }, {
                    "Name": "LL Mountain Frame - Silver, 48",
                    "ProductID": 919,
                    "ProductCostHistories": [{
                        "StandardCost": 144.5938,
                        "ProductID": 919
                    }]
                }, {
                    "Name": "LL Mountain Frame - Silver, 52",
                    "ProductID": 920,
                    "ProductCostHistories": [{
                        "StandardCost": 144.5938,
                        "ProductID": 920
                    }]
                }, {
                    "Name": "LL Mountain Frame - Black, 42",
                    "ProductID": 924,
                    "ProductCostHistories": [{
                        "StandardCost": 136.7850,
                        "ProductID": 924
                    }]
                }, {
                    "Name": "LL Mountain Frame - Black, 44",
                    "ProductID": 925,
                    "ProductCostHistories": [{
                        "StandardCost": 136.7850,
                        "ProductID": 925
                    }]
                }, {
                    "Name": "LL Mountain Frame - Black, 48",
                    "ProductID": 926,
                    "ProductCostHistories": [{
                        "StandardCost": 136.7850,
                        "ProductID": 926
                    }]
                }, {
                    "Name": "LL Mountain Frame - Black, 52",
                    "ProductID": 927,
                    "ProductCostHistories": [{
                        "StandardCost": 136.7850,
                        "ProductID": 927
                    }]
                }, {
                    "Name": "ML Mountain Frame-W - Silver, 38",
                    "ProductID": 942,
                    "ProductCostHistories": [{
                        "StandardCost": 199.3757,
                        "ProductID": 942
                    }]
                }, {
                    "Name": "LL Mountain Frame - Black, 40",
                    "ProductID": 943,
                    "ProductCostHistories": [{
                        "StandardCost": 136.7850,
                        "ProductID": 943
                    }]
                }, {
                    "Name": "LL Mountain Frame - Silver, 40",
                    "ProductID": 944,
                    "ProductCostHistories": [{
                        "StandardCost": 144.5938,
                        "ProductID": 944
                    }]
                }]
            }, {
                "Name": "Pedals",
                "ProductSubcategoryID": 13,
                "Products": [{
                    "Name": "LL Mountain Pedal",
                    "ProductID": 935,
                    "ProductCostHistories": [{
                        "StandardCost": 17.9776,
                        "ProductID": 935
                    }]
                }, {
                    "Name": "ML Mountain Pedal",
                    "ProductID": 936,
                    "ProductCostHistories": [{
                        "StandardCost": 27.5680,
                        "ProductID": 936
                    }]
                }, {
                    "Name": "HL Mountain Pedal",
                    "ProductID": 937,
                    "ProductCostHistories": [{
                        "StandardCost": 35.9596,
                        "ProductID": 937
                    }]
                }, {
                    "Name": "LL Road Pedal",
                    "ProductID": 938,
                    "ProductCostHistories": [{
                        "StandardCost": 17.9776,
                        "ProductID": 938
                    }]
                }, {
                    "Name": "ML Road Pedal",
                    "ProductID": 939,
                    "ProductCostHistories": [{
                        "StandardCost": 27.5680,
                        "ProductID": 939
                    }]
                }, {
                    "Name": "HL Road Pedal",
                    "ProductID": 940,
                    "ProductCostHistories": [{
                        "StandardCost": 35.9596,
                        "ProductID": 940
                    }]
                }, {
                    "Name": "Touring Pedal",
                    "ProductID": 941,
                    "ProductCostHistories": [{
                        "StandardCost": 35.9596,
                        "ProductID": 941
                    }]
                }]
            }, {
                "Name": "Road Frames",
                "ProductSubcategoryID": 14,
                "Products": [{
                    "Name": "HL Road Frame - Black, 58",
                    "ProductID": 680,
                    "ProductCostHistories": null
                }, {
                    "Name": "HL Road Frame - Red, 58",
                    "ProductID": 706,
                    "ProductCostHistories": null
                }, {
                    "Name": "HL Road Frame - Red, 62",
                    "ProductID": 717,
                    "ProductCostHistories": [{
                        "StandardCost": 747.9682,
                        "ProductID": 717
                    }, {
                        "StandardCost": 722.2568,
                        "ProductID": 717
                    }, {
                        "StandardCost": 868.6342,
                        "ProductID": 717
                    }]
                }, {
                    "Name": "HL Road Frame - Red, 44",
                    "ProductID": 718,
                    "ProductCostHistories": [{
                        "StandardCost": 747.9682,
                        "ProductID": 718
                    }, {
                        "StandardCost": 722.2568,
                        "ProductID": 718
                    }, {
                        "StandardCost": 868.6342,
                        "ProductID": 718
                    }]
                }, {
                    "Name": "HL Road Frame - Red, 48",
                    "ProductID": 719,
                    "ProductCostHistories": [{
                        "StandardCost": 747.9682,
                        "ProductID": 719
                    }, {
                        "StandardCost": 722.2568,
                        "ProductID": 719
                    }, {
                        "StandardCost": 868.6342,
                        "ProductID": 719
                    }]
                }, {
                    "Name": "HL Road Frame - Red, 52",
                    "ProductID": 720,
                    "ProductCostHistories": [{
                        "StandardCost": 747.9682,
                        "ProductID": 720
                    }, {
                        "StandardCost": 722.2568,
                        "ProductID": 720
                    }, {
                        "StandardCost": 868.6342,
                        "ProductID": 720
                    }]
                }, {
                    "Name": "HL Road Frame - Red, 56",
                    "ProductID": 721,
                    "ProductCostHistories": [{
                        "StandardCost": 747.9682,
                        "ProductID": 721
                    }, {
                        "StandardCost": 722.2568,
                        "ProductID": 721
                    }, {
                        "StandardCost": 868.6342,
                        "ProductID": 721
                    }]
                }, {
                    "Name": "LL Road Frame - Black, 58",
                    "ProductID": 722,
                    "ProductCostHistories": [{
                        "StandardCost": 176.1997,
                        "ProductID": 722
                    }, {
                        "StandardCost": 170.1428,
                        "ProductID": 722
                    }, {
                        "StandardCost": 204.6251,
                        "ProductID": 722
                    }]
                }, {
                    "Name": "LL Road Frame - Black, 60",
                    "ProductID": 723,
                    "ProductCostHistories": [{
                        "StandardCost": 176.1997,
                        "ProductID": 723
                    }, {
                        "StandardCost": 170.1428,
                        "ProductID": 723
                    }, {
                        "StandardCost": 204.6251,
                        "ProductID": 723
                    }]
                }, {
                    "Name": "LL Road Frame - Black, 62",
                    "ProductID": 724,
                    "ProductCostHistories": [{
                        "StandardCost": 176.1997,
                        "ProductID": 724
                    }, {
                        "StandardCost": 170.1428,
                        "ProductID": 724
                    }, {
                        "StandardCost": 204.6251,
                        "ProductID": 724
                    }]
                }, {
                    "Name": "LL Road Frame - Red, 44",
                    "ProductID": 725,
                    "ProductCostHistories": [{
                        "StandardCost": 181.4857,
                        "ProductID": 725
                    }, {
                        "StandardCost": 187.1571,
                        "ProductID": 725
                    }]
                }, {
                    "Name": "LL Road Frame - Red, 48",
                    "ProductID": 726,
                    "ProductCostHistories": [{
                        "StandardCost": 181.4857,
                        "ProductID": 726
                    }, {
                        "StandardCost": 187.1571,
                        "ProductID": 726
                    }]
                }, {
                    "Name": "LL Road Frame - Red, 52",
                    "ProductID": 727,
                    "ProductCostHistories": [{
                        "StandardCost": 181.4857,
                        "ProductID": 727
                    }, {
                        "StandardCost": 187.1571,
                        "ProductID": 727
                    }]
                }, {
                    "Name": "LL Road Frame - Red, 58",
                    "ProductID": 728,
                    "ProductCostHistories": [{
                        "StandardCost": 181.4857,
                        "ProductID": 728
                    }, {
                        "StandardCost": 187.1571,
                        "ProductID": 728
                    }]
                }, {
                    "Name": "LL Road Frame - Red, 60",
                    "ProductID": 729,
                    "ProductCostHistories": [{
                        "StandardCost": 181.4857,
                        "ProductID": 729
                    }, {
                        "StandardCost": 187.1571,
                        "ProductID": 729
                    }]
                }, {
                    "Name": "LL Road Frame - Red, 62",
                    "ProductID": 730,
                    "ProductCostHistories": [{
                        "StandardCost": 181.4857,
                        "ProductID": 730
                    }, {
                        "StandardCost": 187.1571,
                        "ProductID": 730
                    }]
                }, {
                    "Name": "ML Road Frame - Red, 44",
                    "ProductID": 731,
                    "ProductCostHistories": [{
                        "StandardCost": 352.1394,
                        "ProductID": 731
                    }]
                }, {
                    "Name": "ML Road Frame - Red, 48",
                    "ProductID": 732,
                    "ProductCostHistories": [{
                        "StandardCost": 352.1394,
                        "ProductID": 732
                    }]
                }, {
                    "Name": "ML Road Frame - Red, 52",
                    "ProductID": 733,
                    "ProductCostHistories": [{
                        "StandardCost": 352.1394,
                        "ProductID": 733
                    }]
                }, {
                    "Name": "ML Road Frame - Red, 58",
                    "ProductID": 734,
                    "ProductCostHistories": [{
                        "StandardCost": 352.1394,
                        "ProductID": 734
                    }]
                }, {
                    "Name": "ML Road Frame - Red, 60",
                    "ProductID": 735,
                    "ProductCostHistories": [{
                        "StandardCost": 352.1394,
                        "ProductID": 735
                    }]
                }, {
                    "Name": "LL Road Frame - Black, 44",
                    "ProductID": 736,
                    "ProductCostHistories": [{
                        "StandardCost": 176.1997,
                        "ProductID": 736
                    }, {
                        "StandardCost": 170.1428,
                        "ProductID": 736
                    }, {
                        "StandardCost": 204.6251,
                        "ProductID": 736
                    }]
                }, {
                    "Name": "LL Road Frame - Black, 48",
                    "ProductID": 737,
                    "ProductCostHistories": [{
                        "StandardCost": 176.1997,
                        "ProductID": 737
                    }, {
                        "StandardCost": 170.1428,
                        "ProductID": 737
                    }, {
                        "StandardCost": 204.6251,
                        "ProductID": 737
                    }]
                }, {
                    "Name": "LL Road Frame - Black, 52",
                    "ProductID": 738,
                    "ProductCostHistories": [{
                        "StandardCost": 176.1997,
                        "ProductID": 738
                    }, {
                        "StandardCost": 170.1428,
                        "ProductID": 738
                    }, {
                        "StandardCost": 204.6251,
                        "ProductID": 738
                    }]
                }, {
                    "Name": "ML Road Frame-W - Yellow, 38",
                    "ProductID": 822,
                    "ProductCostHistories": [{
                        "StandardCost": 300.1188,
                        "ProductID": 822
                    }, {
                        "StandardCost": 360.9428,
                        "ProductID": 822
                    }]
                }, {
                    "Name": "ML Road Frame-W - Yellow, 40",
                    "ProductID": 833,
                    "ProductCostHistories": [{
                        "StandardCost": 300.1188,
                        "ProductID": 833
                    }, {
                        "StandardCost": 360.9428,
                        "ProductID": 833
                    }]
                }, {
                    "Name": "ML Road Frame-W - Yellow, 42",
                    "ProductID": 834,
                    "ProductCostHistories": [{
                        "StandardCost": 300.1188,
                        "ProductID": 834
                    }, {
                        "StandardCost": 360.9428,
                        "ProductID": 834
                    }]
                }, {
                    "Name": "ML Road Frame-W - Yellow, 44",
                    "ProductID": 835,
                    "ProductCostHistories": [{
                        "StandardCost": 300.1188,
                        "ProductID": 835
                    }, {
                        "StandardCost": 360.9428,
                        "ProductID": 835
                    }]
                }, {
                    "Name": "ML Road Frame-W - Yellow, 48",
                    "ProductID": 836,
                    "ProductCostHistories": [{
                        "StandardCost": 300.1188,
                        "ProductID": 836
                    }, {
                        "StandardCost": 360.9428,
                        "ProductID": 836
                    }]
                }, {
                    "Name": "HL Road Frame - Black, 62",
                    "ProductID": 837,
                    "ProductCostHistories": [{
                        "StandardCost": 722.2568,
                        "ProductID": 837
                    }, {
                        "StandardCost": 868.6342,
                        "ProductID": 837
                    }]
                }, {
                    "Name": "HL Road Frame - Black, 44",
                    "ProductID": 838,
                    "ProductCostHistories": [{
                        "StandardCost": 722.2568,
                        "ProductID": 838
                    }, {
                        "StandardCost": 868.6342,
                        "ProductID": 838
                    }]
                }, {
                    "Name": "HL Road Frame - Black, 48",
                    "ProductID": 839,
                    "ProductCostHistories": [{
                        "StandardCost": 722.2568,
                        "ProductID": 839
                    }, {
                        "StandardCost": 868.6342,
                        "ProductID": 839
                    }]
                }, {
                    "Name": "HL Road Frame - Black, 52",
                    "ProductID": 840,
                    "ProductCostHistories": [{
                        "StandardCost": 722.2568,
                        "ProductID": 840
                    }, {
                        "StandardCost": 868.6342,
                        "ProductID": 840
                    }]
                }]
            }, {
                "Name": "Saddles",
                "ProductSubcategoryID": 15,
                "Products": [{
                    "Name": "LL Mountain Seat/Saddle",
                    "ProductID": 908,
                    "ProductCostHistories": [{
                        "StandardCost": 12.0413,
                        "ProductID": 908
                    }]
                }, {
                    "Name": "ML Mountain Seat/Saddle",
                    "ProductID": 909,
                    "ProductCostHistories": [{
                        "StandardCost": 17.3782,
                        "ProductID": 909
                    }]
                }, {
                    "Name": "HL Mountain Seat/Saddle",
                    "ProductID": 910,
                    "ProductCostHistories": [{
                        "StandardCost": 23.3722,
                        "ProductID": 910
                    }]
                }, {
                    "Name": "LL Road Seat/Saddle",
                    "ProductID": 911,
                    "ProductCostHistories": [{
                        "StandardCost": 12.0413,
                        "ProductID": 911
                    }]
                }, {
                    "Name": "ML Road Seat/Saddle",
                    "ProductID": 912,
                    "ProductCostHistories": [{
                        "StandardCost": 17.3782,
                        "ProductID": 912
                    }]
                }, {
                    "Name": "HL Road Seat/Saddle",
                    "ProductID": 913,
                    "ProductCostHistories": [{
                        "StandardCost": 23.3722,
                        "ProductID": 913
                    }]
                }, {
                    "Name": "LL Touring Seat/Saddle",
                    "ProductID": 914,
                    "ProductCostHistories": [{
                        "StandardCost": 12.0413,
                        "ProductID": 914
                    }]
                }, {
                    "Name": "ML Touring Seat/Saddle",
                    "ProductID": 915,
                    "ProductCostHistories": [{
                        "StandardCost": 17.3782,
                        "ProductID": 915
                    }]
                }, {
                    "Name": "HL Touring Seat/Saddle",
                    "ProductID": 916,
                    "ProductCostHistories": [{
                        "StandardCost": 23.3722,
                        "ProductID": 916
                    }]
                }]
            }, {
                "Name": "Touring Frames",
                "ProductSubcategoryID": 16,
                "Products": [{
                    "Name": "HL Touring Frame - Yellow, 60",
                    "ProductID": 885,
                    "ProductCostHistories": [{
                        "StandardCost": 601.7437,
                        "ProductID": 885
                    }]
                }, {
                    "Name": "LL Touring Frame - Yellow, 62",
                    "ProductID": 886,
                    "ProductCostHistories": [{
                        "StandardCost": 199.8519,
                        "ProductID": 886
                    }]
                }, {
                    "Name": "HL Touring Frame - Yellow, 46",
                    "ProductID": 887,
                    "ProductCostHistories": [{
                        "StandardCost": 601.7437,
                        "ProductID": 887
                    }]
                }, {
                    "Name": "HL Touring Frame - Yellow, 50",
                    "ProductID": 888,
                    "ProductCostHistories": [{
                        "StandardCost": 601.7437,
                        "ProductID": 888
                    }]
                }, {
                    "Name": "HL Touring Frame - Yellow, 54",
                    "ProductID": 889,
                    "ProductCostHistories": [{
                        "StandardCost": 601.7437,
                        "ProductID": 889
                    }]
                }, {
                    "Name": "HL Touring Frame - Blue, 46",
                    "ProductID": 890,
                    "ProductCostHistories": [{
                        "StandardCost": 601.7437,
                        "ProductID": 890
                    }]
                }, {
                    "Name": "HL Touring Frame - Blue, 50",
                    "ProductID": 891,
                    "ProductCostHistories": [{
                        "StandardCost": 601.7437,
                        "ProductID": 891
                    }]
                }, {
                    "Name": "HL Touring Frame - Blue, 54",
                    "ProductID": 892,
                    "ProductCostHistories": [{
                        "StandardCost": 601.7437,
                        "ProductID": 892
                    }]
                }, {
                    "Name": "HL Touring Frame - Blue, 60",
                    "ProductID": 893,
                    "ProductCostHistories": [{
                        "StandardCost": 601.7437,
                        "ProductID": 893
                    }]
                }, {
                    "Name": "LL Touring Frame - Blue, 50",
                    "ProductID": 895,
                    "ProductCostHistories": [{
                        "StandardCost": 199.8519,
                        "ProductID": 895
                    }]
                }, {
                    "Name": "LL Touring Frame - Blue, 54",
                    "ProductID": 896,
                    "ProductCostHistories": [{
                        "StandardCost": 199.8519,
                        "ProductID": 896
                    }]
                }, {
                    "Name": "LL Touring Frame - Blue, 58",
                    "ProductID": 897,
                    "ProductCostHistories": [{
                        "StandardCost": 199.8519,
                        "ProductID": 897
                    }]
                }, {
                    "Name": "LL Touring Frame - Blue, 62",
                    "ProductID": 898,
                    "ProductCostHistories": [{
                        "StandardCost": 199.8519,
                        "ProductID": 898
                    }]
                }, {
                    "Name": "LL Touring Frame - Yellow, 44",
                    "ProductID": 899,
                    "ProductCostHistories": [{
                        "StandardCost": 199.8519,
                        "ProductID": 899
                    }]
                }, {
                    "Name": "LL Touring Frame - Yellow, 50",
                    "ProductID": 900,
                    "ProductCostHistories": [{
                        "StandardCost": 199.8519,
                        "ProductID": 900
                    }]
                }, {
                    "Name": "LL Touring Frame - Yellow, 54",
                    "ProductID": 901,
                    "ProductCostHistories": [{
                        "StandardCost": 199.8519,
                        "ProductID": 901
                    }]
                }, {
                    "Name": "LL Touring Frame - Yellow, 58",
                    "ProductID": 902,
                    "ProductCostHistories": [{
                        "StandardCost": 199.8519,
                        "ProductID": 902
                    }]
                }, {
                    "Name": "LL Touring Frame - Blue, 44",
                    "ProductID": 903,
                    "ProductCostHistories": [{
                        "StandardCost": 199.8519,
                        "ProductID": 903
                    }]
                }]
            }, {
                "Name": "Wheels",
                "ProductSubcategoryID": 17,
                "Products": [{
                    "Name": "LL Mountain Fron1t Wheel",
                    "ProductID": 815,
                    "ProductCostHistories": [{
                        "StandardCost": 0.0000,
                        "ProductID": 815
                    }]
                }, {
                    "Name": "ML Mountain Front Wheel",
                    "ProductID": 816,
                    "ProductCostHistories": [{
                        "StandardCost": 92.8071,
                        "ProductID": 816
                    }]
                }, {
                    "Name": "HL Mountain Front Wheel",
                    "ProductID": 817,
                    "ProductCostHistories": [{
                        "StandardCost": 133.2955,
                        "ProductID": 817
                    }]
                }, {
                    "Name": "LL Road Front Wheel",
                    "ProductID": 818,
                    "ProductCostHistories": [{
                        "StandardCost": 37.9909,
                        "ProductID": 818
                    }]
                }, {
                    "Name": "ML Road Front Wheel",
                    "ProductID": 819,
                    "ProductCostHistories": [{
                        "StandardCost": 110.2829,
                        "ProductID": 819
                    }]
                }, {
                    "Name": "HL Road Front Wheel",
                    "ProductID": 820,
                    "ProductCostHistories": [{
                        "StandardCost": 146.5466,
                        "ProductID": 820
                    }]
                }, {
                    "Name": "Touring Front Wheel",
                    "ProductID": 821,
                    "ProductCostHistories": [{
                        "StandardCost": 96.7964,
                        "ProductID": 821
                    }]
                }, {
                    "Name": "LL Mountain Rear Wheel",
                    "ProductID": 823,
                    "ProductCostHistories": [{
                        "StandardCost": 38.9588,
                        "ProductID": 823
                    }]
                }, {
                    "Name": "ML Mountain Rear Wheel",
                    "ProductID": 824,
                    "ProductCostHistories": [{
                        "StandardCost": 104.7951,
                        "ProductID": 824
                    }]
                }, {
                    "Name": "HL Mountain Rear Wheel",
                    "ProductID": 825,
                    "ProductCostHistories": [{
                        "StandardCost": 145.2835,
                        "ProductID": 825
                    }]
                }, {
                    "Name": "LL Road Rear Wheel",
                    "ProductID": 826,
                    "ProductCostHistories": [{
                        "StandardCost": 49.9789,
                        "ProductID": 826
                    }]
                }, {
                    "Name": "ML Road Rear Wheel",
                    "ProductID": 827,
                    "ProductCostHistories": [{
                        "StandardCost": 122.2709,
                        "ProductID": 827
                    }]
                }, {
                    "Name": "HL Road Rear Wheel",
                    "ProductID": 828,
                    "ProductCostHistories": [{
                        "StandardCost": 158.5346,
                        "ProductID": 828
                    }]
                }, {
                    "Name": "Touring Rear Wheel",
                    "ProductID": 829,
                    "ProductCostHistories": [{
                        "StandardCost": 108.7844,
                        "ProductID": 829
                    }]
                }]
            }]
        }, {
            "Name": "Clothing",
            "ProductCategoryID": 3,
            "ProductSubcategories": [{
                "Name": "Bib-Shorts",
                "ProductSubcategoryID": 18,
                "Products": [{
                    "Name": "Men\u0027s Bib-Shorts, S",
                    "ProductID": 855,
                    "ProductCostHistories": [{
                        "StandardCost": 37.1209,
                        "ProductID": 855
                    }]
                }, {
                    "Name": "Men\u0027s Bib-Shorts, M",
                    "ProductID": 856,
                    "ProductCostHistories": [{
                        "StandardCost": 37.1209,
                        "ProductID": 856
                    }]
                }, {
                    "Name": "Men\u0027s Bib-Shorts, L",
                    "ProductID": 857,
                    "ProductCostHistories": [{
                        "StandardCost": 37.1209,
                        "ProductID": 857
                    }]
                }]
            }, {
                "Name": "Caps",
                "ProductSubcategoryID": 19,
                "Products": [{
                    "Name": "AWC Logo Cap",
                    "ProductID": 712,
                    "ProductCostHistories": [{
                        "StandardCost": 5.7052,
                        "ProductID": 712
                    }, {
                        "StandardCost": 5.2297,
                        "ProductID": 712
                    }, {
                        "StandardCost": 6.9223,
                        "ProductID": 712
                    }]
                }]
            }, {
                "Name": "Gloves",
                "ProductSubcategoryID": 20,
                "Products": [{
                    "Name": "Half-Finger Gloves, S",
                    "ProductID": 858,
                    "ProductCostHistories": [{
                        "StandardCost": 9.7136,
                        "ProductID": 858
                    }, {
                        "StandardCost": 9.1593,
                        "ProductID": 858
                    }]
                }, {
                    "Name": "Half-Finger Gloves, M",
                    "ProductID": 859,
                    "ProductCostHistories": [{
                        "StandardCost": 9.7136,
                        "ProductID": 859
                    }, {
                        "StandardCost": 9.1593,
                        "ProductID": 859
                    }]
                }, {
                    "Name": "Half-Finger Gloves, L",
                    "ProductID": 860,
                    "ProductCostHistories": [{
                        "StandardCost": 9.7136,
                        "ProductID": 860
                    }, {
                        "StandardCost": 9.1593,
                        "ProductID": 860
                    }]
                }, {
                    "Name": "Full-Finger Gloves, S",
                    "ProductID": 861,
                    "ProductCostHistories": [{
                        "StandardCost": 15.6709,
                        "ProductID": 861
                    }]
                }, {
                    "Name": "Full-Finger Gloves, M",
                    "ProductID": 862,
                    "ProductCostHistories": [{
                        "StandardCost": 15.6709,
                        "ProductID": 862
                    }]
                }, {
                    "Name": "Full-Finger Gloves, L",
                    "ProductID": 863,
                    "ProductCostHistories": [{
                        "StandardCost": 15.6709,
                        "ProductID": 863
                    }]
                }]
            }, {
                "Name": "Jerseys",
                "ProductSubcategoryID": 21,
                "Products": [{
                    "Name": "Long-Sleeve Logo Jersey, S",
                    "ProductID": 713,
                    "ProductCostHistories": [{
                        "StandardCost": 31.7244,
                        "ProductID": 713
                    }, {
                        "StandardCost": 29.0807,
                        "ProductID": 713
                    }, {
                        "StandardCost": 38.4923,
                        "ProductID": 713
                    }]
                }, {
                    "Name": "Long-Sleeve Logo Jersey, M",
                    "ProductID": 714,
                    "ProductCostHistories": [{
                        "StandardCost": 31.7244,
                        "ProductID": 714
                    }, {
                        "StandardCost": 29.0807,
                        "ProductID": 714
                    }, {
                        "StandardCost": 38.4923,
                        "ProductID": 714
                    }]
                }, {
                    "Name": "Long-Sleeve Logo Jersey, L",
                    "ProductID": 715,
                    "ProductCostHistories": [{
                        "StandardCost": 31.7244,
                        "ProductID": 715
                    }, {
                        "StandardCost": 29.0807,
                        "ProductID": 715
                    }, {
                        "StandardCost": 38.4923,
                        "ProductID": 715
                    }]
                }, {
                    "Name": "Long-Sleeve Logo Jersey, XL",
                    "ProductID": 716,
                    "ProductCostHistories": [{
                        "StandardCost": 31.7244,
                        "ProductID": 716
                    }, {
                        "StandardCost": 29.0807,
                        "ProductID": 716
                    }, {
                        "StandardCost": 38.4923,
                        "ProductID": 716
                    }]
                }, {
                    "Name": "Short-Sleeve Classic Jersey, S",
                    "ProductID": 881,
                    "ProductCostHistories": [{
                        "StandardCost": 41.5723,
                        "ProductID": 881
                    }]
                }, {
                    "Name": "Short-Sleeve Classic Jersey, M",
                    "ProductID": 882,
                    "ProductCostHistories": [{
                        "StandardCost": 41.5723,
                        "ProductID": 882
                    }]
                }, {
                    "Name": "Short-Sleeve Classic Jersey, L",
                    "ProductID": 883,
                    "ProductCostHistories": [{
                        "StandardCost": 41.5723,
                        "ProductID": 883
                    }]
                }, {
                    "Name": "Short-Sleeve Classic Jersey, XL",
                    "ProductID": 884,
                    "ProductCostHistories": [{
                        "StandardCost": 41.5723,
                        "ProductID": 884
                    }]
                }]
            }, {
                "Name": "Shorts",
                "ProductSubcategoryID": 22,
                "Products": [{
                    "Name": "Men\u0027s Sports Shorts, S",
                    "ProductID": 841,
                    "ProductCostHistories": [{
                        "StandardCost": 24.7459,
                        "ProductID": 841
                    }]
                }, {
                    "Name": "Men\u0027s Sports Shorts, M",
                    "ProductID": 849,
                    "ProductCostHistories": [{
                        "StandardCost": 24.7459,
                        "ProductID": 849
                    }]
                }, {
                    "Name": "Men\u0027s Sports Shorts, L",
                    "ProductID": 850,
                    "ProductCostHistories": [{
                        "StandardCost": 24.7459,
                        "ProductID": 850
                    }]
                }, {
                    "Name": "Men\u0027s Sports Shorts, XL",
                    "ProductID": 851,
                    "ProductCostHistories": [{
                        "StandardCost": 24.7459,
                        "ProductID": 851
                    }]
                }, {
                    "Name": "Women\u0027s Mountain Shorts, S",
                    "ProductID": 867,
                    "ProductCostHistories": [{
                        "StandardCost": 26.1763,
                        "ProductID": 867
                    }]
                }, {
                    "Name": "Women\u0027s Mountain Shorts, M",
                    "ProductID": 868,
                    "ProductCostHistories": [{
                        "StandardCost": 26.1763,
                        "ProductID": 868
                    }]
                }, {
                    "Name": "Women\u0027s Mountain Shorts, L",
                    "ProductID": 869,
                    "ProductCostHistories": [{
                        "StandardCost": 26.1763,
                        "ProductID": 869
                    }]
                }]
            }, {
                "Name": "Socks",
                "ProductSubcategoryID": 23,
                "Products": [{
                    "Name": "Mountain Bike Socks, M",
                    "ProductID": 709,
                    "ProductCostHistories": [{
                        "StandardCost": 3.3963,
                        "ProductID": 709
                    }]
                }, {
                    "Name": "Mountain Bike Socks, L",
                    "ProductID": 710,
                    "ProductCostHistories": [{
                        "StandardCost": 3.3963,
                        "ProductID": 710
                    }]
                }, {
                    "Name": "Racing Socks, M",
                    "ProductID": 874,
                    "ProductCostHistories": [{
                        "StandardCost": 3.3623,
                        "ProductID": 874
                    }]
                }, {
                    "Name": "Racing Socks, L",
                    "ProductID": 875,
                    "ProductCostHistories": [{
                        "StandardCost": 3.3623,
                        "ProductID": 875
                    }]
                }]
            }, {
                "Name": "Tights",
                "ProductSubcategoryID": 24,
                "Products": [{
                    "Name": "Women\u0027s Tights, S",
                    "ProductID": 852,
                    "ProductCostHistories": [{
                        "StandardCost": 30.9334,
                        "ProductID": 852
                    }]
                }, {
                    "Name": "Women\u0027s Tights, M",
                    "ProductID": 853,
                    "ProductCostHistories": [{
                        "StandardCost": 30.9334,
                        "ProductID": 853
                    }]
                }, {
                    "Name": "Women\u0027s Tights, L",
                    "ProductID": 854,
                    "ProductCostHistories": [{
                        "StandardCost": 30.9334,
                        "ProductID": 854
                    }]
                }]
            }, {
                "Name": "Vests",
                "ProductSubcategoryID": 25,
                "Products": [{
                    "Name": "Classic Vest, S",
                    "ProductID": 864,
                    "ProductCostHistories": [{
                        "StandardCost": 11.0000,
                        "ProductID": 864
                    }]
                }, {
                    "Name": "Classic Vest, M",
                    "ProductID": 865,
                    "ProductCostHistories": [{
                        "StandardCost": 23.7490,
                        "ProductID": 865
                    }]
                }, {
                    "Name": "Classic Vest, L",
                    "ProductID": 866,
                    "ProductCostHistories": [{
                        "StandardCost": 0.0000,
                        "ProductID": 866
                    }]
                }]
            }]
        }, {
            "Name": "Accessories",
            "ProductCategoryID": 4,
            "ProductSubcategories": [{
                "Name": "Bike Racks",
                "ProductSubcategoryID": 26,
                "Products": [{
                    "Name": "Hitch Rack - 4-Bike",
                    "ProductID": 876,
                    "ProductCostHistories": [{
                        "StandardCost": 44.8800,
                        "ProductID": 876
                    }]
                }]
            }, {
                "Name": "Bike Stands",
                "ProductSubcategoryID": 27,
                "Products": [{
                    "Name": "All-Purpose Bike Stand",
                    "ProductID": 879,
                    "ProductCostHistories": [{
                        "StandardCost": 59.4660,
                        "ProductID": 879
                    }]
                }]
            }, {
                "Name": "Bottles and Cages",
                "ProductSubcategoryID": 28,
                "Products": [{
                    "Name": "Water Bottle - 30 oz.",
                    "ProductID": 870,
                    "ProductCostHistories": [{
                        "StandardCost": 1.8663,
                        "ProductID": 870
                    }]
                }, {
                    "Name": "Mountain Bottle Cage",
                    "ProductID": 871,
                    "ProductCostHistories": [{
                        "StandardCost": 3.7363,
                        "ProductID": 871
                    }]
                }, {
                    "Name": "Road Bottle Cage",
                    "ProductID": 872,
                    "ProductCostHistories": [{
                        "StandardCost": 3.3623,
                        "ProductID": 872
                    }]
                }]
            }, {
                "Name": "Cleaners",
                "ProductSubcategoryID": 29,
                "Products": [{
                    "Name": "Bike Wash - Dissolver",
                    "ProductID": 877,
                    "ProductCostHistories": [{
                        "StandardCost": 2.9733,
                        "ProductID": 877
                    }]
                }]
            }, {
                "Name": "Fenders",
                "ProductSubcategoryID": 30,
                "Products": [{
                    "Name": "Fender Set - Mountain",
                    "ProductID": 878,
                    "ProductCostHistories": [{
                        "StandardCost": 8.2205,
                        "ProductID": 878
                    }]
                }]
            }, {
                "Name": "Helmets",
                "ProductSubcategoryID": 31,
                "Products": [{
                    "Name": "Sport-100 Helmet, Red",
                    "ProductID": 707,
                    "ProductCostHistories": [{
                        "StandardCost": 12.0278,
                        "ProductID": 707
                    }, {
                        "StandardCost": 13.8782,
                        "ProductID": 707
                    }, {
                        "StandardCost": 13.0863,
                        "ProductID": 707
                    }]
                }, {
                    "Name": "Sport-100 Helmet, Black",
                    "ProductID": 708,
                    "ProductCostHistories": [{
                        "StandardCost": 12.0278,
                        "ProductID": 708
                    }, {
                        "StandardCost": 13.8782,
                        "ProductID": 708
                    }, {
                        "StandardCost": 13.0863,
                        "ProductID": 708
                    }]
                }, {
                    "Name": "Sport-100 Helmet, Blue",
                    "ProductID": 711,
                    "ProductCostHistories": [{
                        "StandardCost": 12.0278,
                        "ProductID": 711
                    }, {
                        "StandardCost": 13.8782,
                        "ProductID": 711
                    }, {
                        "StandardCost": 13.0863,
                        "ProductID": 711
                    }]
                }]
            }, {
                "Name": "Hydration Packs",
                "ProductSubcategoryID": 32,
                "Products": [{
                    "Name": "Hydration Pack - 70 oz.",
                    "ProductID": 880,
                    "ProductCostHistories": [{
                        "StandardCost": 20.5663,
                        "ProductID": 880
                    }]
                }]
            }, {
                "Name": "Lights",
                "ProductSubcategoryID": 33,
                "Products": [{
                    "Name": "Taillights - Battery-Powered",
                    "ProductID": 846,
                    "ProductCostHistories": [{
                        "StandardCost": 5.7709,
                        "ProductID": 846
                    }]
                }, {
                    "Name": "Headlights - Dual-Beam",
                    "ProductID": 847,
                    "ProductCostHistories": [{
                        "StandardCost": 14.4334,
                        "ProductID": 847
                    }]
                }, {
                    "Name": "Headlights - Weatherproof",
                    "ProductID": 848,
                    "ProductCostHistories": [{
                        "StandardCost": 18.5584,
                        "ProductID": 848
                    }]
                }]
            }, {
                "Name": "Locks",
                "ProductSubcategoryID": 34,
                "Products": [{
                    "Name": "Cable Lock",
                    "ProductID": 843,
                    "ProductCostHistories": [{
                        "StandardCost": 10.3125,
                        "ProductID": 843
                    }]
                }]
            }, {
                "Name": "Panniers",
                "ProductSubcategoryID": 35,
                "Products": [{
                    "Name": "Touring-Panniers, Large",
                    "ProductID": 842,
                    "ProductCostHistories": [{
                        "StandardCost": 51.5625,
                        "ProductID": 842
                    }]
                }]
            }, {
                "Name": "Pumps",
                "ProductSubcategoryID": 36,
                "Products": [{
                    "Name": "Minipump",
                    "ProductID": 844,
                    "ProductCostHistories": [{
                        "StandardCost": 8.2459,
                        "ProductID": 844
                    }]
                }, {
                    "Name": "Mountain Pump",
                    "ProductID": 845,
                    "ProductCostHistories": [{
                        "StandardCost": 10.3084,
                        "ProductID": 845
                    }]
                }]
            }, {
                "Name": "Tires and Tubes",
                "ProductSubcategoryID": 37,
                "Products": [{
                    "Name": "Patch Kit/8 Patches",
                    "ProductID": 873,
                    "ProductCostHistories": [{
                        "StandardCost": 0.8565,
                        "ProductID": 873
                    }]
                }, {
                    "Name": "Mountain Tire Tube",
                    "ProductID": 921,
                    "ProductCostHistories": [{
                        "StandardCost": 1.8663,
                        "ProductID": 921
                    }]
                }, {
                    "Name": "Road Tire Tube",
                    "ProductID": 922,
                    "ProductCostHistories": [{
                        "StandardCost": 1.4923,
                        "ProductID": 922
                    }]
                }, {
                    "Name": "Touring Tire Tube",
                    "ProductID": 923,
                    "ProductCostHistories": [{
                        "StandardCost": 1.8663,
                        "ProductID": 923
                    }]
                }, {
                    "Name": "LL Mountain Tire",
                    "ProductID": 928,
                    "ProductCostHistories": [{
                        "StandardCost": 9.3463,
                        "ProductID": 928
                    }]
                }, {
                    "Name": "ML Mountain Tire",
                    "ProductID": 929,
                    "ProductCostHistories": [{
                        "StandardCost": 11.2163,
                        "ProductID": 929
                    }]
                }, {
                    "Name": "HL Mountain Tire",
                    "ProductID": 930,
                    "ProductCostHistories": [{
                        "StandardCost": 13.0900,
                        "ProductID": 930
                    }]
                }, {
                    "Name": "LL Road Tire",
                    "ProductID": 931,
                    "ProductCostHistories": [{
                        "StandardCost": 8.0373,
                        "ProductID": 931
                    }]
                }, {
                    "Name": "ML Road Tire",
                    "ProductID": 932,
                    "ProductCostHistories": [{
                        "StandardCost": 9.3463,
                        "ProductID": 932
                    }]
                }, {
                    "Name": "HL Road Tire",
                    "ProductID": 933,
                    "ProductCostHistories": [{
                        "StandardCost": 12.1924,
                        "ProductID": 933
                    }]
                }, {
                    "Name": "Touring Tire",
                    "ProductID": 934,
                    "ProductCostHistories": [{
                        "StandardCost": 10.8423,
                        "ProductID": 934
                    }]
                }]
            }]
        }]
    };

    return svc;

}]);