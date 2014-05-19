'use strict';

describe('my app', function() {

	browser.get('index.html');
	
	var util = require('../app/js/util');
	
	describe("Grid", function() {

		it("should be initialized", function() {
			util.isInitialized('grid1', 'igGrid');
		});

		it("should support binding through model", function() {
			util.executeScript('$("#gridmodel input[ng-model=\'product.ProductName\']:eq(0)").val("test").trigger("input")');
			var cellText = util.getResult('$("#grid1").igGrid("getCellText", 1, "ProductName")');
			expect(cellText).toBe("test");
		});
		it("should support binding through the view from API", function() {
			util.executeScript('$("#grid1").igGridUpdating("setCellValue", 1, "ProductName", "Headlights");');
			util.executeScript('angular.element("#grid1").scope().$apply();');
			expect(util.getResult('$("input[ng-model=\'product.ProductName\']:first").val()')).toBe("Headlights");
		});
		it("should update view when the scope is directly edited", function() {
			util.executeScript('angular.element("#grid1").scope().northwind[1].ProductName = "Writing Pad"');
			util.executeScript('angular.element("#grid1").scope().$apply();')
			var cellText = util.getResult('$("#grid1").igGrid("getCellText", 2, "ProductName");')
			expect(cellText).toBe("Writing Pad");
		});
		it("should initialize Filtering, Updating and Sorting", function() {
			expect(util.getResult('$("#grid1").data("igGridFiltering") != undefined')).toBe(true);
			expect(util.getResult('$("#grid1").data("igGridUpdating") != undefined')).toBe(true);
			expect(util.getResult('$("#grid1").data("igGridSorting") != undefined')).toBe(true);
		});
		it("should retain the values from scope when a column is sorted", function() {
			var inputSelector = '$("#gridmodel input[ng-model=\'product.ProductName\']:eq(2)")';
			util.executeScript(inputSelector + '.val("PEN").trigger("input")');
			util.executeScript('$("#grid1").igGridSorting("sortColumn", "ProductID", "descending");');
			expect(util.getResult('$("#grid1 tbody tr:eq(17) td:eq(1)").html()')).toBe("PEN");
			util.executeScript(inputSelector + '.val("coffee").trigger("input");');
			expect(util.getResult('$("#grid1 tbody tr:eq(17) td:eq(1)").html()')).toBe("coffee");
			util.executeScript('$("#grid1").igGridSorting("sortColumn", "ProductID", "ascending");');
			expect(util.getResult('$("#grid1 tbody tr:eq(2) td:eq(1)").html()')).toBe("coffee");
			util.executeScript('$("#grid1").igGridSorting("unsortColumn", "ProductID");');
		});
		it("should keep its values when filtering is done", function() {
			util.executeScript('$("#grid1").igGridFiltering("filter", [{fieldName: "ProductName", expr: "Chef", cond: "contains"}]);');
			util.executeScript('$(\'input[ng-model="product.ProductName"]\').eq(3).val("Chef Glimbo\'s Cajun Seasoning").trigger("input");');
			expect(util.getResult('$("#grid1 tbody tr:eq(0) td:eq(1)").html()')).toBe("Chef Glimbo's Cajun Seasoning");
			//expect(util.getResult('$("#grid1 tbody tr:eq(0)").height()')).toBeCloseTo(35, 5);
			util.executeScript('$("#grid1").igGridFiltering("filter", [{fieldName: "ProductName", expr: "", cond: "contains"}]);');
		});
		xit("should not duplicate added items in scope", function() {
			util.executeScript('$("input[ng-model=\'newProduct.ProductName\']").val("Small bag").trigger("input");');
			util.executeScript('$("input[ng-model=\'newProduct.QuantityPerUnit\']").val("23").trigger("input");');
			util.executeScript('$("input[ng-model=\'newProduct.UnitPrice\']").val("75.00").trigger("input");');
			util.executeScript('$("input[ng-click=\'add($index)\']").click();');
			var northwindScope = 'angular.element("#grid1").scope().northwind';
			expect(util.getResult(northwindScope + '.length')).toBe(21);
			expect(util.getResult(northwindScope + '[20].ProductName')).toBe("Small bag");
			expect(util.getResult(northwindScope + '[20].QuantityPerUnit')).toBe("23");
			expect(util.getResult(northwindScope + '[20].UnitPrice')).toBe("75.00");	
		});
	});

	describe("Tree", function() {
		it("should be initialized", function() {
			util.isInitialized('tree1', 'igTree');
		});
		it("should set correctly option textKey", function() {
			var textKey = util.getResult('$("#tree1").data("igTree").options.bindings.textKey;');
			expect(textKey).toBe("Name");
		});
		it("should support binding through model", function() {
			var nodeInModel = '$("#treemodel input.ng-valid:eq(1)")';
			expect(util.getResult('$("#tree1 li a:first").text()')).toBe(util.getResult(nodeInModel + '.val()'));
			//set node value through model
			util.executeScript(nodeInModel + '.val("Super Bikes").trigger("input");');
			expect(util.getResult('$("#tree1 li a:first").text()')).toBe("Super Bikes");
		});
		xit("should support binding through view", function() {
			//use API to change tree node
			var element = '$("#tree1").igTree("findNodesByText", "Clothing")[0].element';
			util.executeScript('$("#tree1").data("igTree").applyChangesToNode(' + element + ', {Name: "New Node"});');
			util.executeScript('angular.element("#tree1").scope().$apply();')
			expect(util.getResult('$("input[ng-model=\'do.Name\']")[2].value')).toBe("New Node");
		});
		it("should support binding through the view with delete operations", function() {
			util.executeScript('$("#tree1").igTree("removeAt", "3")');
			expect(util.getResult('angular.element("#tree1").scope().dataObject.length;')).toBe(3);
			expect(util.getResult('angular.element("#tree1").scope().dataObject[2].Name;')).not.toBe("Accessories");
		});
	});

	describe("Combo", function() {
		it("should be initialized", function() {
			util.isInitialized('combo1', 'igCombo');
			util.isInitialized('combo2', 'igCombo');
		});
		
		it("should update its view when model is changed", function() {
			util.executeScript('$("input[ng-model=\'combo.value1\']:eq(0)").val("5").trigger("input");');
			expect(util.getResult('$("#combo1").val()')).toBe("Chef Anton's Gumbo Mix");
		});
	});

	describe("Editor", function() {
		it("should be initialized", function() {
			util.isInitialized("editor1", "igEditor");
		});
		it("Datepicker should be initialized", function() {
			util.isInitialized("datePicker1", "igDatePicker");
		});
		it("Currency should be initialized and should be with a value from the scope", function() {
			util.isInitialized("currency1", "igCurrencyEditor");
			expect(util.getResult('$("#currency1").val()')).toBe("$12.10");
		});
		it("Currency should be changing its view when the model is changed", function() {
			var scope = 'angular.element("#currency1").scope()';
			util.executeScript(scope + '.editors.currency = 123456;');
			util.executeScript(scope + '.$apply();');
			expect(util.getResult('$("#currency1").val()')).toBe("$123,456.00");
		});
		it("Currency should be changing its model when the view is changed", function() {
			util.executeScript('$("#currency1").val("12.1").trigger("input");');
			var currencyInModel = 'angular.element("#currency1").scope().editors.currency;';
			expect(util.getResult(currencyInModel)).toBe("12.1");
		});
		it("Date should be initialized", function() {
			util.isInitialized("date1","igDateEditor");
		});
		it("Mask should be initialized", function() {
			util.isInitialized("mask1", "igMaskEditor");
		});
		it("Numeric should be initialized and should be with a value from the scope", function() {
			util.isInitialized("numeric1", "igNumericEditor");
			expect(util.getResult('$("#numeric1").val()')).toBe("12.1");
		});
		it("Numeric should be changing its view when the model is changed", function() {
			var scope = 'angular.element("#numeric1").scope()';
			util.executeScript(scope + '.editors.currency = 742.4;');
			util.executeScript(scope + '.$apply();');
			expect(util.getResult('$("#numeric1").val()')).toBe("742.4");
		});
		it("Numeric should be changing its model when the view is changed", function() {
			util.executeScript('$("#numeric1").val("123").trigger("input");');
			var currencyInModel = 'angular.element("#numeric1").scope().editors.currency;';
			expect(util.getResult(currencyInModel)).toBe("123");
		});
		it("Percent should be initialized", function() {
			util.isInitialized("percent1", "igPercentEditor");
		});
		it("Text should be initialized", function() {
			util.isInitialized("text1", "igTextEditor");
		});
	});
});