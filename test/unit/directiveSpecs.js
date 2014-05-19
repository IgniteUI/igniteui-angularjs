describe('Ignite directives', function() {

	beforeEach(module('igniteui-directives'));

	it('should create date picker', inject(function($compile, $rootScope) {
		var datePicker = angular.element('<div><ig-date-picker id="d1"></ig-date-picker></div>');
		scope = $rootScope.$new();
		$compile(datePicker)(scope);
		scope.$digest();
		var datePickerInput = datePicker.find('#d1');
		expect(datePickerInput.length).toBe(1);
		expect(datePickerInput.data('igDatePicker')).not.toBeUndefined();
	}));

	it('should create grid', inject(function($compile, $rootScope) {
		//thise can go into html files
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
		var scope = $rootScope.$new();
		$compile(grid)(scope);
		scope.$digest();
		var gridTable = grid.find('#grid1');
		expect(gridTable.length).toBe(1);
		expect(gridTable.data('igGrid')).not.toBeUndefined();
		expect(gridTable.data('igGrid').options.dataSource).not.toBeUndefined();
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
		expect(comboElement.data('igCombo')).not.toBeUndefined();
	}));
	
});