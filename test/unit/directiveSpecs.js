describe("Ignite directives", function() {
	
	beforeEach(module("my-app"));

	//these can go into html files
	var gridTpl = '<ig-grid id="grid1" data-source="northwind" height="400px" primary-key="ProductID" auto-commit="true" width="700px" auto-generate-columns="false">' +
		'<columns>' +
			'<column key="ProductID" header-text="Product ID" width="200px"></column>' +
			'<column key="ProductName" header-text="Name"  width="300px"></column>' +
			'<column key="QuantityPerUnit" header-text="Quantity per unit"  width="200px"></column>' +
		'</columns>' +
		'<features>' +
			'<feature name="Updating">' +
				'<column-settings>' +
					'<column-setting column-key="ProductID" read-only="true"></column-setting>' +
				'</column-settings>' +
			'</feature>' +
			'<feature name="Filtering">' +
			'</feature>' +
			'<feature name="Sorting">' +
			'</feature>' +
		'</features>' +
	'</ig-grid>';
	var grid = angular.element('<div ng-app="my-app"><div ng-controller="NorthwindCtrl">' + gridTpl  + '</div>');

	it("should create date picker", inject(function($compile, $rootScope) {
		var datePicker = angular.element('<div><ig-date-picker id="d1"></ig-date-picker></div>');
		var scope = $rootScope.$new();
		$compile(datePicker)(scope);
		scope.$digest();
		var datePickerInput = datePicker.find("#d1");
		expect(datePickerInput.length).toBe(1);
		expect(datePickerInput.data("igDatePicker")).not.toBeUndefined();
	}));

	it("should create grid", inject(function($compile, $rootScope) {
		var scope = $rootScope.$new();
		$compile(grid)(scope);
		scope.$digest();
		var gridTable = grid.find("#grid1");
		expect(gridTable.length).toBe(1);
		expect(gridTable.data("igGrid")).not.toBeUndefined();
		expect(gridTable.data("igGridUpdating")).not.toBeUndefined();
		expect(gridTable.data("igGridFiltering")).not.toBeUndefined();
		expect(gridTable.data("igGridSorting")).not.toBeUndefined();
		expect(gridTable.data("igGrid").options.dataSource).not.toBeUndefined();
		expect(gridTable.data("igGrid").options.dataSource.length).toBe(20);
		expect(Array.isArray(gridTable.data("igGrid").options.columns)).toBe(true);
	}));

	it("should create combo", inject(function($compile, $rootScope) {
		var comboTpl ='<ig-combo id="combo1" data-source="northwind" value-key-type="number" value-key="ProductID" text-key-type="string" text-Key="ProductName" ng-model="combo.value1">' +
		'</ig-combo>';
		var combo = angular.element('<div ng-app="my-app"><div ng-controller="NorthwindCtrl">' + comboTpl  + '</div>');
		var scope = $rootScope.$new();
		$compile(combo)(scope);
		scope.$digest();
		var comboElement = combo.find("#combo1");
		expect(comboElement.length).toBe(1);
		expect(comboElement.data("igCombo")).not.toBeUndefined();
	}));

	it("should create dialog", inject(function($compile, $rootScope) {
		var dialogTpl ='<ig-dialog id="dialog1" header-text="Foo" height="325px" draggable="true"><content>' +
		'<p><img style="width: 220px" src="http://www.igniteui.com/images/samples/dialog-window/content.jpg" /></p><input style="margin: 5px" /></content>' +
		'</ig-dialog>';
		var dialog = angular.element('<div ng-app="my-app"><div ng-controller="NorthwindCtrl">' + dialogTpl + '</div>');
		var scope = $rootScope.$new();
		$compile(dialog)(scope);
		scope.$digest();
		var dialogElement = dialog.find("#dialog1");
		var img = dialog.find("#dialog1 img");
		expect(img.length).toBe(1);
		expect(dialogElement.length).toBe(1);
		expect(dialogElement.data("igDialog")).not.toBeUndefined();
		expect(dialogElement.attr("draggable")).toBeUndefined();
		expect(dialogElement.attr("height")).toBeUndefined();
	}));

	it("should create dialog with nested controls", inject(function($compile, $rootScope) {
		var dialogTpl ='<ig-dialog id="dialog1" header-text="Foo" height="325px"><content>' +
		'<p><img style="width: 220px" src="http://www.igniteui.com/images/samples/dialog-window/content.jpg" /></p><input style="margin: 5px" />' +
		'<ig-combo id="combo1" data-source="northwind" value-key-type="number" value-key="ProductID" text-key-type="string" text-key="ProductName" ng-model="combo.value1"></ig-combo></content>' +
		'</ig-dialog>';
		var dialog = angular.element('<div ng-app="my-app"><div ng-controller="NorthwindCtrl">' + dialogTpl + '</div>');
		var scope = $rootScope.$new();
		$compile(dialog)(scope);
		scope.$digest();
		var dialogElement = dialog.find("#dialog1"),
		comboElement = dialog.find("#combo1");
		expect(dialogElement.length).toBe(1);
		expect(dialogElement.data("igDialog")).not.toBeUndefined();
		expect(comboElement.length).toBe(1);
		expect(comboElement.data("igCombo")).not.toBeUndefined();
	}));

	it("should create upload", inject(function($compile, $rootScope) {
		var uploadTpl ='<ig-upload id="upload1" mode="multiple"></ig-upload>';
		var upload = angular.element('<div ng-app="my-app"><div ng-controller="NorthwindCtrl">' + uploadTpl + '</div>');
		var scope = $rootScope.$new();
		$compile(upload)(scope);
		scope.$digest();
		var uploadElement = upload.find("#upload1");
		expect(uploadElement.length).toBe(1);
		expect(uploadElement.data("igUpload")).not.toBeUndefined();
	}));

	it("should create tree", inject(function($compile, $rootScope) {
		var treeTpl ='<ig-tree id="tree1" data-source="ProductCategories">' +
		'<bindings child-data-property="ProductSubcategories" text-key="Name" value-key="ProductCategoryID"></bindings>' +
		'</ig-tree>';
		var tree = angular.element('<div ng-app="my-app"><div ng-controller="NorthwindCtrl">' + treeTpl + '</div>');
		var scope = $rootScope.$new();
		$compile(tree)(scope);
		scope.$digest();
		var treeElement = tree.find("#tree1");
		expect(treeElement.length).toBe(1);
		expect(treeElement.data("igTree")).not.toBeUndefined();
		expect(treeElement.data("igTree").options.bindings.constructor).toBe(Object);
	}));
	
	it("should create data chart", inject(function($compile, $rootScope) {
		var dataChartTpl ='<ig-data-chart id="datachart1" data-source="dataChart">' +
            '<axes><axis name="NameAxis" type="categoryX" title="Country" label="CountryName"></axis>' +
            '<axis name="PopulationAxis" type="numericY"  minimumvalue="0" title="Milions of People"></axis></axes>' +
            '<series><series name="2015Population" type="column" is-highlighting-enabled="true" is-transition-in-enabled="true" x-axis="NameAxis" y-axis="PopulationAxis" value-member-path="Pop2015">' +
			'</series></series></ig-data-chart>';
		var dataChart = angular.element('<div ng-app="my-app"><div ng-controller="NorthwindCtrl">' + dataChartTpl + '</div>');
		dataChart.appendTo("body");
		var scope = $rootScope.$new();
		$compile(dataChart)(scope);
		scope.$digest();
		var dataChartElement = dataChart.find("#datachart1");
		expect(dataChartElement.length).toBe(1);
		expect(dataChartElement.data("igDataChart")).not.toBeUndefined();
		dataChart.remove();
	}));

	it("should create hierarchical grid", inject(function($compile, $rootScope, $timeout) {
		jasmine.clock().install();
		var hierarchicalGridTpl =
		'<ig-hierarchical-grid id="hgrid1"  data-source="data" width="100%" height="400px" auto-commit="true" auto-generate-columns="false" auto-generate-layouts="false">' +
			'<columns>' +
				'<column key="FirstName" header-text="First Name" width="25%" data-type="string"></column>' +
				'<column key="LastName" header-text="Last Name"  width="25%"  data-type="string"></column>' +
				'<column key="Title" header-text="Title"  width="25%" data-type="string"></column>' +
				'<column key="BirthDate" header-text="Birth Date"  width="25%" data-type="date"></column>' +
			'</columns>' +
            '<features>' +
                '<feature name="Selection" mode="row"></feature>' +
            '</features>' +
			'<column-layouts>' +
				'<column-layout key="Orders" response-data-key="results" primary-key="OrderID" auto-generate-columns="false" width="100%">' +
					'<columns>' +
						'<column key="OrderID" header-text="OrderID" width="25%" data-type="string"></column>' +
						'<column key="Freight" header-text="Freight"  width="25%"  data-type="string"></column>' +
						'<column key="ShipName" header-text="ShipName"  width="25%" data-type="string"></column>' +
						'<column key="ShipAddress" header-text="ShipAddress"  width="25%" data-type="string"></column>' +
					'</columns>' +
					'<features>' +
						'<feature name="Paging" page-size="10"></feature>' +
					'</features>' +
				'</column-layout>' +
			'</column-layouts>' +
		'</ig-hierarchical-grid>';

		var hierarchicalGrid = angular.element('<div ng-app="my-app"><div ng-controller="NorthwindCtrl">' + hierarchicalGridTpl + '</div>');
		var scope = $rootScope.$new();
		$compile(hierarchicalGrid)(scope);
		scope.$digest();
		jasmine.clock().tick(1); // setTimeout in HGrid scope watch
		var hGridElement = hierarchicalGrid.find("#hgrid1");
		expect(hGridElement.length).toBe(1);
		expect(hGridElement.data("igHierarchicalGrid")).not.toBeUndefined();
		expect(hGridElement.data("igGridSelection")).not.toBeUndefined();
	}));
	
	it("should create text editor", inject(function($compile, $rootScope) {
		var textEditor = angular.element('<div ng-app="my-app"><ig-text-editor id="editor1"></ig-text-editor></div>');
		var scope = $rootScope.$new();
		$compile(textEditor)(scope);
		scope.$digest();
		var textEditorInput = textEditor.find("#editor1");
		expect(textEditorInput.length).toBe(1);
		expect(textEditorInput.data("igTextEditor")).not.toBeUndefined();
		expect(textEditorInput.data("igTextEditor").element[0].nodeName).toBe("INPUT");
	}));
	it("should create multiline text editor", inject(function($compile, $rootScope) {
		var textEditor = angular.element('<div ng-app="my-app"><ig-text-editor id="editor1" text-mode="multiline"></ig-text-editor></div>');
		var scope = $rootScope.$new();
		$compile(textEditor)(scope);
		scope.$digest();
		var textEditorInput = textEditor.find("#editor1");
		expect(textEditorInput.length).toBe(1);
		expect(textEditorInput.data("igTextEditor")).not.toBeUndefined();
		expect(textEditorInput.data("igTextEditor").element[0].nodeName).toBe("TEXTAREA");
	}));
	it("should create text editor on div DOM placeholder", inject(function($compile, $rootScope) {
		var textEditor = angular.element('<div ng-app="my-app"><ig-text-editor id="editor1" element="div"></ig-text-editor></div>');
		var scope = $rootScope.$new();
		$compile(textEditor)(scope);
		scope.$digest();
		var textEditorInput = textEditor.find("#editor1");
		expect(textEditorInput.length).toBe(1);
		expect(textEditorInput.data("igTextEditor")).not.toBeUndefined();
		expect(textEditorInput.data("igTextEditor").element[0].nodeName).toBe("DIV");
	}));
});