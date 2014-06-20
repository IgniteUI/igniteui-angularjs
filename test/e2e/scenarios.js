'use strict';

describe('my app', function() {

	browser.get('index.html');

	var util = require('../app/js/util');
	var scopeNorthwind = 'angular.toJson(angular.element("#grid1").scope().northwind)';
	var scopeLength = 'angular.element("#grid1").scope().northwind.length';
	var gridData = 'angular.toJson($("#grid1").igGrid("option", "dataSource"))';

	describe("Grid", function() {

		it("should be initialized", function() {
			util.isInitialized('grid1', 'igGrid');
		});

		it("should support binding through model", function () {
			//set value to the input, which represents the model
			util.executeScript('$("#gridmodel input[ng-model=\'product.ProductName\']:eq(0)").val("test").trigger("input")');
			var cellText = util.getResult('$("#grid1").igGrid("getCellText", 1, "ProductName")');
			expect(cellText).toBe("test");
		});

		it("should support binding through the view from API", function() {
			util.executeScript('$("#grid1").igGridUpdating("setCellValue", 1, "ProductName", "Headlights");');
			//API requires calling $apply to the scope
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

		//test pop, slice, push from scope
		it("should pop from grids data when poping from scope", function() {
			util.executeScript('angular.element("#grid1").scope().northwind.pop()');
			util.executeScript('angular.element("#grid1").scope().$apply()');
			var gridRecordsLength = util.getResult('$("#grid1 tbody tr").length');
			expect(gridRecordsLength).toBe(19);// "pop removed row from the grid"
			expect(util.getResult(scopeNorthwind)).toBe(util.getResult(gridData));
		});

		xit("should add to grids data when pushing to scope", function() {
			var newObject ='{"ProductID": 20, "ProductName": "Jogurt from Grandma", "QuantityPerUnit": "So much"}';
			util.executeScript('angular.element("#grid1").scope().northwind.push(' + newObject + ')');
			util.executeScript('angular.element("#grid1").scope().$apply()');
			var gridRecordsLength = util.getResult('$("#grid1 tbody tr").length');
			expect(gridRecordsLength).toBe(20);
			expect(util.getResult(scopeLength)).toBe(20);
			expect(util.getResult(scopeNorthwind)).toBe(util.getResult(gridData));
		});

		xit("should splice to grids data when splicing scope", function() {
			util.executeScript('angular.element("#grid1").scope().northwind.splice(15, 20)');
			util.executeScript('angular.element("#grid1").scope().$apply()');
			var gridRecordsLength = util.getResult('$("#grid1 tbody tr").length');
			expect(util.getResult(scopeLength)).toBe(20);
			expect(gridRecordsLength).toBe(15);
			expect(util.getResult(scopeNorthwind)).toBe(util.getResult(gridData));
		});

		// addRow, deleteRow, updateRow, setCellValue
		it("should be able to apply the changes from addRow to the scope", function() {
			util.resetNorthwindScope();
			util.executeScript('$("#grid1").igGridUpdating("addRow", { "ProductName": "Meatball", "QuantityPerUnit": "Full plate"})');
			util.executeScript('angular.element("#grid1").scope().$apply()');
			var gridRecordsLength = util.getResult('angular.element("#grid1").scope().northwind.length');
			expect(gridRecordsLength).toBe(21);
			expect(util.getResult(scopeNorthwind)).toBe(util.getResult(gridData));
		});

		it("should be able to apply the changes from deleteRow to the scope", function() {
			util.resetNorthwindScope();
			util.executeScript('$("#grid1").igGridUpdating("deleteRow", 15)');
			util.executeScript('angular.element("#grid1").scope().$apply()');
			var gridRecordsLength = util.getResult('angular.element("#grid1").scope().northwind.length');
			expect(gridRecordsLength).toBe(19);
			expect(util.getResult(scopeNorthwind)).toBe(util.getResult(gridData));
		});

		it("should be able to apply the changes from updateRow to the scope", function() {
			util.resetNorthwindScope();
			util.executeScript('$("#grid1").igGridUpdating("updateRow", 3, { "ProductName": "Tomato salad" })');
			util.executeScript('angular.element("#grid1").scope().$apply()');
			var gridRecordsLength = util.getResult('angular.element("#grid1").scope().northwind.length');
			var newValue = util.getResult('$("#grid1 tbody tr:eq(2) td")[1].innerHTML');
			expect(newValue).toBe("Tomato salad");
			expect(gridRecordsLength).toBe(20);
			expect(util.getResult(scopeNorthwind)).toBe(util.getResult(gridData));
		});

		it("should be able to apply the changes when made from setCellValue", function () {util.executeScript('$("#grid1").igGridUpdating("updateRow", 3, { "ProductName": "Tomato salad" })');
			util.executeScript('$("#grid1").igGridUpdating("setCellValue", 2, "ProductName", "Chicken with rise")');
			util.executeScript('angular.element("#grid1").scope().$apply()');
			var gridRecordsLength = util.getResult('angular.element("#grid1").scope().northwind.length');
			var newValue = util.getResult('$("#grid1 tbody tr:eq(1) td")[1].innerHTML');
			expect(newValue).toBe("Chicken with rise");
			expect(gridRecordsLength).toBe(20);
			expect(util.getResult(scopeNorthwind)).toBe(util.getResult(gridData));
		});

		it("should bind correctly when Filtering is applied", function () {
			util.resetNorthwindScope();
			util.executeScript('$("#grid1").igGridFiltering("filter", [{fieldName:"ProductID", cond:"greaterThan", expr: 5, logic:"AND"}], true, false)');
			util.executeScript('angular.element("#grid1").scope().northwind[6].ProductName = "Milk";');
			util.executeScript('angular.element("#grid1").scope().$apply();');
			expect(util.getResult('$("#grid1 tbody tr:eq(1) td")[1].innerHTML')).toBe("Milk");
			util.executeScript('angular.element("#grid1").scope().northwind[1].ProductName = "Strawberry";');
			util.executeScript('angular.element("#grid1").scope().$apply();');
			util.executeScript('$("#grid1").igGridFiltering("filter", [], true, false);');
			expect(util.getResult('$("#grid1 tbody tr:eq(1) td")[1].innerHTML')).toBe("Strawberry");
			expect(util.getResult(scopeNorthwind)).toBe(util.getResult(gridData));
		});

		it("should work as expected when deleting a row from filtered out records", function () {
			util.resetNorthwindScope();
			util.executeScript('$("#grid1").igGrid("dataBind")');
			util.executeScript('$("#grid1").igGridFiltering("filter", [{fieldName:"ProductID", cond:"greaterThan", expr: 5, logic:"AND"}], true, false)');
			util.executeScript('angular.element("#grid1").scope().northwind.shift();');
			util.executeScript('angular.element("#grid1").scope().$apply();');
			expect(util.getResult('$("#grid1 tbody tr").length')).toBe(15);
			expect(util.getResult('$("#grid1 tbody tr:eq(0) td")[0].innerHTML')).toBe("6");
			util.executeScript('$("#grid1").igGridFiltering("filter", [], true, false);');
			expect(util.getResult('$("#grid1 tbody tr").length')).toBe(19);
			expect(util.getResult('$("#grid1 tbody tr:eq(0) td")[0].innerHTML')).toBe("2");
			expect(util.getResult(scopeNorthwind)).toBe(util.getResult(gridData));
		});

		it("should work as exptected using setCellValue and filtering", function () {
			util.resetNorthwindScope();
			util.executeScript('$("#grid1").igGridFiltering("filter", [{fieldName:"ProductID", cond:"greaterThan", expr: 4, logic:"AND"}], true, false)');
			util.executeScript('$("#grid1").igGridUpdating("setCellValue", 6, "ProductName", "Ice cream");');
			util.executeScript('angular.element("#grid1").scope().$apply();');
			expect(util.getResult('$("#grid1 tbody tr:eq(1) td")[1].innerHTML')).toBe("Ice cream");
			expect(util.getResult(scopeNorthwind)).toBe(util.getResult(gridData));
			util.executeScript('$("#grid1").igGridUpdating("setCellValue", 8, "ProductName", "More Ice cream!");');
			util.executeScript('angular.element("#grid1").scope().$apply();');
			expect(util.getResult('$("#grid1 tbody tr:eq(3) td")[1].innerHTML')).toBe("More Ice cream!");
			expect(util.getResult(scopeNorthwind)).toBe(util.getResult(gridData));
		});

		it("should bind correctly when RowSelectors and Selection are applied", function () {
			util.resetNorthwindScope();
			util.executeScript('$("#grid1").igGrid("destroy");');
			util.executeScript('$("#grid1").remove();');
			util.executeScript('angular.element("body").scope().addGrid(\''
				+ '<ig-grid id="grid1" data-source="northwind" height="400px" primary-key="ProductID" auto-commit="true" width="700px" auto-generate-columns="false">'
					+'<columns>'
						+'<column key="ProductID" header-text="Product ID" width="200px" data-type="number"></column>'
						+'<column key="ProductName" header-text="Name" width="300px" data-type="string"></column>'
						+'<column key="QuantityPerUnit" header-text="Quantity per unit" width="200px" data-type="string"></column>'
					+'</columns>'
					+'<features>'
						+'<feature name="Updating">'
							+'<column-settings>'
								+'<column-setting column-key="ProductID" read-only="true">'
							+'</column-settings>'
							+'</column-settings>'
						+ '</feature>'
						+ '<feature name="Selection">'
						+ '</feature>'
						+ '<feature name="RowSelectors">'
						+ '</feature>'
					+'</features>'
				+'</ig-grid>'
				+ '\');'
				);
			util.executeScript('angular.element("#grid1").scope().northwind[0].ProductName = "Pasta Bolognese";');
			util.executeScript('angular.element("#grid1").scope().northwind[1].QuantityPerUnit = "45 jars";');
			util.executeScript('angular.element("#grid1").scope().$apply();')
			expect(util.getResult('$("#grid1 tbody tr:eq(0) td")[1].innerHTML')).toBe("Pasta Bolognese");
			expect(util.getResult('$("#grid1 tbody tr:eq(1) td")[2].innerHTML')).toBe("45 jars");
			expect(util.getResult(scopeNorthwind)).toBe(util.getResult(gridData));
		});

		it("should support binding when groupby is done", function () {
			//new grid with group by
			util.resetNorthwindScope();
			util.executeScript('$("#grid1").igGrid("destroy");');
			util.executeScript('$("#grid1").remove();');
			util.executeScript('angular.element("body").scope().addGrid(\''
				+ '<ig-grid id="grid1" data-source="northwind" height="400px" primary-key="ProductID" auto-commit="true" width="700px" auto-generate-columns="false">'
					+ '<columns>'
						+ '<column key="ProductID" header-text="Product ID" width="200px" data-type="number"></column>'
						+ '<column key="ProductName" header-text="Name" width="300px" data-type="string"></column>'
						+ '<column key="QuantityPerUnit" header-text="Quantity per unit" width="200px" data-type="string"></column>'
						+ '<column key="UnitsOnOrder" header-text="Units on order" width="200px" data-type="number"></column>'
					+ '</columns>'
					+ '<features>'
						+ '<feature name="Updating">'
							+ '<column-settings>'
								+ '<column-setting column-key="ProductID" read-only="true">'
							+ '</column-settings>'
							+ '</column-settings>'
						+ '</feature>'
						+ '<feature name="GroupBy">'
						+ '</feature>'
					+ '</features>'
				+ '</ig-grid>'
				+ '\');'
				);
			expect(util.getResult('angular.element($("#grid1")).scope().northwind.length')).toBe(20);
			util.executeScript('$("#grid1").igGridGroupBy("groupByColumn", "UnitsOnOrder");');
			util.executeScript('angular.element("#grid1").scope().northwind[10].QuantityPerUnit = "45 jars";');
			util.executeScript('angular.element("#grid1").scope().$apply();');
			expect(util.getResult('$("#grid1 tbody tr:eq(19) td")[3].innerHTML')).toBe("45 jars");
			expect(util.getResult(scopeNorthwind)).toBe(util.getResult(gridData));
			util.executeScript('$("#grid1").igGridGroupBy("ungroupAll");');
			util.executeScript('angular.element("#grid1").scope().northwind[19].QuantityPerUnit = "45 boxes"');
			util.executeScript('angular.element("#grid1").scope().$apply();');
			expect(util.getResult('$("#grid1 tbody tr[data-id=\'20\'] td")[2].innerHTML')).toBe("45 boxes");
			expect(util.getResult(scopeNorthwind)).toBe(util.getResult(gridData));
		});

		it("should delete rows when grouping is applied", function () {
			util.executeScript('$("#grid1").igGridGroupBy("groupByColumn", "UnitsOnOrder");');
			//delete row
			util.executeScript('angular.element("#grid1").scope().northwind.shift();');
			util.executeScript('angular.element("#grid1").scope().$apply();');
			expect(util.getResult('$("#grid1 tbody tr").length')).toBe(23);
			expect(util.getResult('$("#grid1").find("tbody").children("tr").first().hasClass("ui-iggrid-groupedrow")')).toBe(true);
			expect(util.getResult(scopeNorthwind)).toBe(util.getResult(gridData));
			//add row
			var newObject = '{"ProductID": 21, "ProductName": "Jogurt from Grandma", "QuantityPerUnit": "So much", "UnitsOnOrder": 4}';
			util.executeScript('angular.element("#grid1").scope().northwind.push(' + newObject + ')');
			util.executeScript('angular.element("#grid1").scope().$apply();');
			expect(util.getResult('$("#grid1 tbody tr").length')).toBe(24);
			expect(util.getResult(scopeNorthwind)).toBe(util.getResult(gridData));
			//update row
			util.executeScript('angular.element("#grid1").scope().northwind[4].ProductName = "Onion";');
			util.executeScript('angular.element("#grid1").scope().$apply();');
			expect(util.getResult(scopeNorthwind)).toBe(util.getResult(gridData));
		});

		it("should apply changes from scope when columns are moved", function () {
			//new grid with column moving
			util.resetNorthwindScope();
			util.executeScript('$("#grid1").igGrid("destroy");');
			util.executeScript('$("#grid1").remove();');
			util.executeScript('angular.element("body").scope().addGrid(\''
				+ '<ig-grid id="grid1" data-source="northwind" height="400px" primary-key="ProductID" auto-commit="true" width="700px" auto-generate-columns="false">'
					+ '<columns>'
						+ '<column key="ProductID" header-text="Product ID" width="200px" data-type="number"></column>'
						+ '<column key="ProductName" header-text="Name" width="300px" data-type="string"></column>'
						+ '<column key="QuantityPerUnit" header-text="Quantity per unit" width="200px" data-type="string"></column>'
						+ '<column key="UnitsOnOrder" header-text="Units on order" width="200px" data-type="number"></column>'
					+ '</columns>'
					+ '<features>'
						+ '<feature name="Updating">'
							+ '<column-settings>'
								+ '<column-setting column-key="ProductID" read-only="true">'
							+ '</column-settings>'
							+ '</column-settings>'
						+ '</feature>'
						+ '<feature name="ColumnMoving">'
						+ '</feature>'
					+ '</features>'
				+ '</ig-grid>'
				+ '\');'
				);
			//move column and check cell binding
			util.executeScript('$("#grid1").igGridColumnMoving("moveColumn", "ProductName", "ProductID", false, false);');
			util.executeScript('angular.element("#grid1").scope().northwind[4].ProductName = "Pear";');
			util.executeScript('angular.element("#grid1").scope().$apply();');
			expect(util.getResult('$("#grid1 tbody tr:eq(4) td")[0].innerHTML')).toBe("Pear");
			expect(util.getResult(scopeNorthwind)).toBe(util.getResult(gridData));
		});

		it("should bind on already present rows after a column is hidden and then shown", function () {
			//new grid with hiding
			util.resetNorthwindScope();
			util.executeScript('$("#grid1").igGrid("destroy");');
			util.executeScript('$("#grid1").remove();');
			util.executeScript('angular.element("body").scope().addGrid(\''
				+ '<ig-grid id="grid1" data-source="northwind" height="400px" primary-key="ProductID" auto-commit="true" width="700px" auto-generate-columns="false">'
					+ '<columns>'
						+ '<column key="ProductID" header-text="Product ID" width="200px" data-type="number"></column>'
						+ '<column key="ProductName" header-text="Name" width="300px" data-type="string"></column>'
						+ '<column key="QuantityPerUnit" header-text="Quantity per unit" width="200px" data-type="string"></column>'
						+ '<column key="UnitsOnOrder" header-text="Units on order" width="200px" data-type="number"></column>'
					+ '</columns>'
					+ '<features>'
						+ '<feature name="Updating">'
							+ '<column-settings>'
								+ '<column-setting column-key="ProductID" read-only="true">'
							+ '</column-settings>'
							+ '</column-settings>'
						+ '</feature>'
						+ '<feature name="Hiding">'
						+ '</feature>'
					+ '</features>'
				+ '</ig-grid>'
				+ '\');'
				);
			//add event that fires on hiding or showing columns
			util.executeScript('$("#grid1").bind("iggridcolumnscollectionmodified", function() {'
					+ 'angular.element("#grid1").scope().northwind[4].ProductName = "Peach";'
					+ 'angular.element("#grid1").scope().$apply();'
				+ '});');
			util.executeScript('$("#grid1").igGrid("hideColumn", "ProductID")');
			//check event fired and applied the changes
			expect(util.getResult('$("#grid1 tbody tr:eq(4) td")[0].innerHTML')).toBe("Peach");
			expect(util.getResult(scopeNorthwind)).toBe(util.getResult(gridData));
			util.executeScript('$("#grid1").unbind("iggridcolumncolectionmodified")');
			//check changes are persisted when column is shown
			util.executeScript('$("#grid1").igGrid("showColumn", "ProductID")');
			expect(util.getResult('$("#grid1 tbody tr:eq(4) td")[1].innerHTML')).toBe("Peach");
			expect(util.getResult(scopeNorthwind)).toBe(util.getResult(gridData));
		});

		it("should bind new records pushed to the scope after hiding and showing", function () {
			//hide column
			util.resetNorthwindScope();
			util.executeScript('$("#grid1").igGrid("hideColumn", "ProductName")');
			//push new record
			var newObject = '{"ProductID": 21, "ProductName": "Jogurt from Grandma", "QuantityPerUnit": "So much"}';
			util.executeScript('angular.element("#grid1").scope().northwind.push(' + newObject + ')');
			util.executeScript('angular.element("#grid1").scope().$apply()');
			//check new record is correct with hidden and shown column
			expect(util.getResult('$("#grid1 tbody tr:eq(20) td")[1].innerHTML')).toBe("So much");
			expect(util.getResult(scopeNorthwind)).toBe(util.getResult(gridData));
			util.executeScript('$("#grid1").igGrid("showColumn", "ProductName")');
			expect(util.getResult('$("#grid1 tbody tr:eq(20) td")[1].innerHTML')).toBe("Jogurt from Grandma");
			expect(util.getResult(scopeNorthwind)).toBe(util.getResult(gridData));
		});

		it("should bind to cells after paging", function () {
			//new grid with paging
			util.resetNorthwindScope();
			util.executeScript('$("#grid1").igGrid("destroy");');
			util.executeScript('$("#grid1").remove();');
			util.executeScript('angular.element("body").scope().addGrid(\''
				+ '<ig-grid id="grid1" data-source="northwind" height="400px" primary-key="ProductID" auto-commit="true" width="700px" auto-generate-columns="false">'
					+ '<columns>'
						+ '<column key="ProductID" header-text="Product ID" width="200px" data-type="number"></column>'
						+ '<column key="ProductName" header-text="Name" width="300px" data-type="string"></column>'
						+ '<column key="QuantityPerUnit" header-text="Quantity per unit" width="200px" data-type="string"></column>'
						+ '<column key="UnitsOnOrder" header-text="Units on order" width="200px" data-type="number"></column>'
					+ '</columns>'
					+ '<features>'
						+ '<feature name="Updating">'
							+ '<column-settings>'
								+ '<column-setting column-key="ProductID" read-only="true">'
							+ '</column-settings>'
							+ '</column-settings>'
						+ '</feature>'
						+ '<feature name="Paging" page-size="2">'
						+ '</feature>'
					+ '</features>'
				+ '</ig-grid>'
				+ '\');'
				);
			// go to second page
			util.executeScript('$("#grid1").igGridPaging("pageIndex", 1);');
			//check binding
			util.executeScript('angular.element("#grid1").scope().northwind[2].ProductName = "Truffle";');
			util.executeScript('angular.element("#grid1").scope().$apply();');
			expect(util.getResult('$("#grid1 tbody tr:eq(0) td")[1].innerHTML')).toBe("Truffle");
			expect(util.getResult(scopeNorthwind)).toBe(util.getResult(gridData));
			//check binding to record in another page
			util.executeScript('angular.element("#grid1").scope().northwind[0].ProductName = "Bottle of water";');
			util.executeScript('angular.element("#grid1").scope().$apply();');
			util.executeScript('$("#grid1").igGridPaging("pageIndex", 0);');
			expect(util.getResult('$("#grid1 tbody tr:eq(0) td")[1].innerHTML')).toBe("Bottle of water");
			expect(util.getResult(scopeNorthwind)).toBe(util.getResult(gridData));
		});

		xit("should bind to cells when adding rows with paging", function () {
			//add new record
			var newObject = '{"ProductID": 21, "ProductName": "Jogurt from Grandma", "QuantityPerUnit": "So much"}';
			util.executeScript('angular.element("#grid1").scope().northwind.push(' + newObject + ')');
			util.executeScript('angular.element("#grid1").scope().$apply();');
			//check paging goes to the last page and shows the new record
			expect(util.getResult('$("#grid1 tbody tr").length')).toBe(1);
			expect(util.getResult('$("#grid1 tbody tr td")[0].innerHTML')).toBe("21");
			expect(util.getResult(scopeNorthwind)).toBe(util.getResult(gridData));
			//check binding with the new row
			util.executeScript('angular.element("#grid1").scope().northwind[20].ProductName = "Minty candies";');
			util.executeScript('angular.element("#grid1").scope().$apply();');
			expect(util.getResult('$("#grid1 tbody tr td")[1].innerHTML')).toBe("Minty candies");
			//change some other row in another page
			util.executeScript('angular.element("#grid1").scope().northwind[19].ProductName = "Wine";');
			util.executeScript('angular.element("#grid1").scope().$apply();');
			util.executeScript('$("#grid1").igGridPaging("pageIndex", 9);');
			expect(util.getResult('$("#grid1 tbody tr:eq(1) td")[1].innerHTML')).toBe("Wine");
		});

		xit("should bind to cells binding when removing rows and having paging", function () {
			util.resetNorthwindScope();
			//go to second page
			util.executeScript('$("#grid1").igGridPaging("pageIndex", 1)');
			//remove first row of the second page
			util.executeScript('angular.element("#grid1").scope().northwind.splice(2, 1)');
			util.executeScript('angular.element("#grid1").scope().$apply();');
			//the page size should remain 2
			expect(util.getResult('$("#grid1 tbody tr").length')).toBe(2);
			expect(util.getResult(scopeNorthwind)).toBe(util.getResult(gridData));
			//check correct records are shown
			expect(util.getResult('$("#grid1 tbody tr:eq(0) td")[0].innerHTML')).toBe("4");
			expect(util.getResult('$("#grid1 tbody tr:eq(1) td")[0].innerHTML')).toBe("5");
			//check cell binding
			util.executeScript('angular.element("#grid1").scope().northwind[2].ProductName = "Juice";');
			util.executeScript('angular.element("#grid1").scope().$apply();');
			expect(util.getResult('$("#grid1 tbody tr:eq(0) td")[1].innerHTML')).toBe("Juice");
			expect(util.getResult(scopeNorthwind)).toBe(util.getResult(gridData));
			util.executeScript('angular.element("#grid1").scope().northwind[3].ProductName = "Second Juice";');
			util.executeScript('angular.element("#grid1").scope().$apply();');
			expect(util.getResult('$("#grid1 tbody tr:eq(1) td")[1].innerHTML')).toBe("Second Juice");
			expect(util.getResult(scopeNorthwind)).toBe(util.getResult(gridData));
		});

		it("should bind cells with sorting", function () {
			util.resetNorthwindScope();
			util.executeScript('$("#grid1").igGrid("destroy");');
			util.executeScript('$("#grid1").remove();');
			//new grid with sorting
			util.executeScript('angular.element("body").scope().addGrid(\''
				+ '<ig-grid id="grid1" data-source="northwind" height="400px" primary-key="ProductID" auto-commit="true" width="700px" auto-generate-columns="false">'
					+ '<columns>'
						+ '<column key="ProductID" header-text="Product ID" width="200px" data-type="number"></column>'
						+ '<column key="ProductName" header-text="Name" width="300px" data-type="string"></column>'
						+ '<column key="QuantityPerUnit" header-text="Quantity per unit" width="200px" data-type="string"></column>'
						+ '<column key="UnitsOnOrder" header-text="Units on order" width="200px" data-type="number"></column>'
					+ '</columns>'
					+ '<features>'
						+ '<feature name="Updating">'
							+ '<column-settings>'
								+ '<column-setting column-key="ProductID" read-only="true">'
							+ '</column-settings>'
							+ '</column-settings>'
						+ '</feature>'
						+ '<feature name="Sorting" mode="multi" persist="false">'
						+ '</feature>'
					+ '</features>'
				+ '</ig-grid>'
				+ '\');'
				);
			util.executeScript('$("#grid1").igGridSorting("sortColumn", "ProductName", "desc")');
			//change value
			util.executeScript('angular.element("#grid1").scope().northwind[6].ProductName = "Juice";');
			util.executeScript('angular.element("#grid1").scope().$apply();');
			expect(util.getResult('$("#grid1 tbody tr:eq(0) td")[1].innerHTML')).toBe("Juice");
			expect(util.getResult(scopeNorthwind)).toBe(util.getResult(gridData));
			//unsort and check changes are persisted
			util.executeScript('$("#grid1").igGrid("dataBind")');
			expect(util.getResult('$("#grid1 tbody tr:eq(6) td")[1].innerHTML')).toBe("Juice");
			expect(util.getResult(scopeNorthwind)).toBe(util.getResult(gridData));
		});

		it("should bind cells when adding new rows and sorting is applied", function () {
			util.resetNorthwindScope();
			util.executeScript('$("#grid1").igGridSorting("sortColumn", "ProductName", "desc")');
			var newObject = '{"ProductID": 21, "ProductName": "Jogurt from Grandma", "QuantityPerUnit": "So much"}';
			util.executeScript('angular.element("#grid1").scope().northwind.push(' + newObject + ')');
			util.executeScript('angular.element("#grid1").scope().$apply()');
			//didn't break the order
			expect(util.getResult('$("#grid1 tbody tr:eq(0) td")[0].innerHTML')).toBe("7");
			expect(util.getResult('$("#grid1 tbody tr:eq(1) td")[0].innerHTML')).toBe("14");
			expect(util.getResult('$("#grid1 tbody tr:eq(19) td")[0].innerHTML')).toBe("17");
			expect(util.getResult('$("#grid1 tbody tr:eq(20) td")[0].innerHTML')).toBe("21");
			expect(util.getResult(scopeNorthwind)).toBe(util.getResult(gridData));
			// check newly added row's cell binding
			util.executeScript('angular.element("#grid1").scope().northwind[20].ProductName = "Bottle of water"');
			util.executeScript('angular.element("#grid1").scope().$apply()');
			expect(util.getResult('$("#grid1 tbody tr:eq(20) td")[1].innerHTML')).toBe("Bottle of water");
			expect(util.getResult(scopeNorthwind)).toBe(util.getResult(gridData));
		});

		it("should bind cells when removing rows while sorting", function () {
			util.resetNorthwindScope();
			util.executeScript('$("#grid1").igGrid("dataBind")');
			util.executeScript('$("#grid1").igGridSorting("sortColumn", "ProductName")');
			//remove row
			util.executeScript('angular.element("#grid1").scope().northwind.splice(0, 1)');
			util.executeScript('angular.element("#grid1").scope().$apply()');
			expect(util.getResult('$("#grid1 tbody tr").length')).toBe(19);
			expect(util.getResult('$("#grid1 tbody tr:eq(0) td")[0].innerHTML')).toBe("17");
			expect(util.getResult('$("#grid1 tbody tr:eq(18) td")[0].innerHTML')).toBe("7");
			expect(util.getResult(scopeNorthwind)).toBe(util.getResult(gridData));
			//check binding
			util.executeScript('angular.element("#grid1").scope().northwind[0].ProductName = "Oil"');
			util.executeScript('angular.element("#grid1").scope().$apply()');
			expect(util.getResult('$("#grid1 tbody tr:eq(3) td")[1].innerHTML')).toBe("Oil");
			expect(util.getResult(scopeNorthwind)).toBe(util.getResult(gridData));
		});
	});
	
	describe("Tree", function() {
		it("should be initialized", function () {
			util.resetNorthwindScope();
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
		it("should be initialized", function () {
			util.resetNorthwindScope();
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