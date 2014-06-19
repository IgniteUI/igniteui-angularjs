describe('Ignite directives', function() {

	beforeEach(module('igniteui-directives'));

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

	it('should create date picker', inject(function($compile, $rootScope) {
		var datePicker = angular.element('<div><ig-date-picker id="d1"></ig-date-picker></div>');
		var scope = $rootScope.$new();
		$compile(datePicker)(scope);
		scope.$digest();
		var datePickerInput = datePicker.find('#d1');
		expect(datePickerInput.length).toBe(1);
		expect(datePickerInput.data('igDatePicker')).not.toBeUndefined();
	}));

	it('should create grid', inject(function($compile, $rootScope) {
		var scope = $rootScope.$new();
		$compile(grid)(scope);
		scope.$digest();
		var gridTable = grid.find('#grid1');
		expect(gridTable.length).toBe(1);
		expect(gridTable.data('igGrid')).not.toBeUndefined();
		expect(gridTable.data('igGridUpdating')).not.toBeUndefined();
		expect(gridTable.data('igGridFiltering')).not.toBeUndefined();
		expect(gridTable.data('igGridSorting')).not.toBeUndefined();
		expect(gridTable.data('igGrid').options.dataSource).not.toBeUndefined();
		expect(gridTable.data('igGrid').options.dataSource.length).toBe(20);
		expect(Array.isArray(gridTable.data('igGrid').options.columns)).toBe(true);
	}));

	it('should create combo', inject(function($compile, $rootScope) {
		var comboTpl ='<ig-combo id="combo1" data-source="northwind" value-key-type="number" value-key="ProductID" text-key-type="string" text-Key="ProductName" ng-model="combo.value1">' +
		'</ig-combo>';
		var combo = angular.element('<div ng-app="my-app"><div ng-controller="NorthwindCtrl">' + comboTpl  + '</div>');
		var scope = $rootScope.$new();
		$compile(combo)(scope);
		scope.$digest();
		var comboElement = combo.find('#combo1');
		expect(comboElement.length).toBe(1);
		expect(comboElement.data('igCombo')).not.toBeUndefined();
	}));

	it('should create dialog', inject(function($compile, $rootScope) {
		var dialogTpl ='<ig-dialog id="dialog1" header-text="Foo" height="325px"><content>' +
		'<p><img style="width: 220px" src="http://www.igniteui.com/images/samples/dialog-window/content.jpg" /></p><input style="margin: 5px" /></content>' +
		'</ig-dialog>';
		var dialog = angular.element('<div ng-app="my-app"><div ng-controller="NorthwindCtrl">' + dialogTpl + '</div>');
		var scope = $rootScope.$new();
		$compile(dialog)(scope);
		scope.$digest();
		var dialogElement = dialog.find('#dialog1');
		var img = dialog.find('#dialog1 img');
		expect(img.length).toBe(1);
		expect(dialogElement.length).toBe(1);
		expect(dialogElement.data('igDialog')).not.toBeUndefined();
	}));

	it('should create dialog with nested controls', inject(function($compile, $rootScope) {
		var dialogTpl ='<ig-dialog id="dialog1" header-text="Foo" height="325px"><content>' +
		'<p><img style="width: 220px" src="http://www.igniteui.com/images/samples/dialog-window/content.jpg" /></p><input style="margin: 5px" />' +
		'<ig-combo id="combo1" data-source="northwind" value-key-type="number" value-key="ProductID" text-key-type="string" text-key="ProductName" ng-model="combo.value1"></ig-combo></content>' +
		'</ig-dialog>';
		var dialog = angular.element('<div ng-app="my-app"><div ng-controller="NorthwindCtrl">' + dialogTpl + '</div>');
		var scope = $rootScope.$new();
		$compile(dialog)(scope);
		scope.$digest();
		var dialogElement = dialog.find('#dialog1'),
		comboElement = dialog.find("#combo1");
		expect(dialogElement.length).toBe(1);
		expect(dialogElement.data('igDialog')).not.toBeUndefined();
		expect(comboElement.length).toBe(1);
		expect(comboElement.data('igCombo')).not.toBeUndefined();
	}));

	it('should create upload', inject(function($compile, $rootScope) {
		var uploadTpl ='<ig-upload id="upload1" mode="multiple"></ig-upload>';
		var upload = angular.element('<div ng-app="my-app"><div ng-controller="NorthwindCtrl">' + uploadTpl + '</div>');
		var scope = $rootScope.$new();
		$compile(upload)(scope);
		scope.$digest();
		var uploadElement = upload.find('#upload1');
		expect(uploadElement.length).toBe(1);
		expect(uploadElement.data('igUpload')).not.toBeUndefined();
	}));

	it('should create tree', inject(function($compile, $rootScope) {
		var treeTpl ='<ig-tree id="tree1" data-source="ProductCategories">';
		'<bindings><binding child-data-property="ProductSubcategories" text-key="Name" value-key="ProductCategoryID"></binding></bindings>' +
		'</ig-tree>';
		var tree = angular.element('<div ng-app="my-app"><div ng-controller="NorthwindCtrl">' + treeTpl + '</div>');
		var scope = $rootScope.$new();
		$compile(tree)(scope);
		scope.$digest();
		var treeElement = tree.find('#tree1');
		expect(treeElement.length).toBe(1);
		expect(treeElement.data('igTree')).not.toBeUndefined();
		expect(treeElement.data('igTree').options.bindings.constructor).toBe(Object);
	}));
});