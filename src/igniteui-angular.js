/*!@license
 * Ignite UI directives for AngularJS   1.1.4
 * https://github.com/IgniteUI/igniteui-angular
 *
 * Copyright (c) 2014-2016 Infragistics, Inc.
 * Licensed under the MIT license.
 * https://github.com/IgniteUI/igniteui-angular/blob/master/license.txt
 */

/*global angular*/
(function (angular, $) {
	"use strict";
	$.ig = $.ig || {};
	$.ig.angular = $.ig.angular || {};

	// igCombo specific code for two way data binding
	$.ig.angular.igCombo = $.ig.angular.igCombo || {};
	$.ig.angular.igCombo.element = $.ig.angular.igCombo.element || "<div></div>";
	$.ig.angular.igCombo.events =  [
		"igcombofiltered",
		"igcomboselectionchanged",
		"igcombotextchanged"
	];

	// Mark watchers for discoverability
	function markWatcher(scope, controlName, attrs) {
		// Angular uses unshift(), so the last watcher is at 0:
		scope.$$watchers[ 0 ][ controlName ] = attrs.id || controlName + scope.$$watchers.length;
	}

	// Interrogation functions
	function isDate(value) {
		return Object.prototype.toString.call(value) === "[object Date]";
	}

	function isRegExp(value) {
		return Object.prototype.toString.call(value) === "[object RegExp]";
	}

	function isScope(obj) {
		return obj && obj.$evalAsync && obj.$watch;
	}

	function isWindow(obj) {
		return obj && obj.document && obj.location && obj.alert && obj.setInterval;
	}

	function isFunction(value) { return typeof value === "function"; }

	function isArray(value) {
		return Object.prototype.toString.call(value) === "[object Array]";
	}

	function equalsDiff(o1, o2, diff) {
		if (o1 === o2) { return true; }
		if (o1 === null || o2 === null) { return false; }
		if (o1 !== o1 && o2 !== o2) { return true; }// NaN === NaN
		var t1 = typeof o1, t2 = typeof o2, length, key, keySet,
			dirty, skipDiff = false, changedVals = [];
		if (t1 === t2) {
			if (t1 === "object") {
				if (isArray(o1)) {
					if (!isArray(o2)) { return false; }
					if ((length = o1.length) === o2.length) {
						if (!isArray(diff)) {
							skipDiff = true;
						}
						for (key = 0; key < length; key++) {
							// we are comparing objects here
							if (!equalsDiff(o1[ key ], o2[ key ], changedVals)) {
								dirty = true;
								if (!skipDiff) {
									diff.push({ index: key, txlog: changedVals });
								}
							}
							changedVals = [];
						}
						if (dirty) {
							return false;
						}
						return true;
					}
				} else if (isDate(o1)) {
					return isDate(o2) && o1.getTime() === o2.getTime();
				} else if (isRegExp(o1) && isRegExp(o2)) {
					return o1.toString() === o2.toString();
				} else {
					if (isScope(o1) || isScope(o2) ||
							isWindow(o1) || isWindow(o2) ||
							isArray(o2)) {
						return false;
					}
					keySet = {};
					if (!isArray(diff)) {
						skipDiff = true;
					}
					for (key in o1) {
						if (key.charAt(0) === "$" || isFunction(o1[ key ])) { continue; }
						if (!equalsDiff(o1[ key ], o2[ key ])) {
							dirty = true;
							if (!skipDiff) {
								diff.push({ key: key, oldVal: o2[ key ], newVal: o1[ key ] });
							}
						}
						keySet[ key ] = true;
					}
					for (key in o2) {
						if (!keySet.hasOwnProperty(key) &&
							key.charAt(0) !== "$" &&
							o2[ key ] !== undefined &&
							!isFunction(o2[ key ])) { return false; }
					}
					if (dirty) {
						return false;
					}
					return true;
				}
			}
		}
		return false;
	}
	function _notifyRowAdded(gridElem, row) {
		var rs = gridElem.data("igGridRowSelectors"),
		pa = gridElem.data("igGridPaging"),
		su = gridElem.data("igGridSummaries");
		if (rs && typeof rs._rowAdded === "function") {
			rs._rowAdded(row);
		}
		if (pa && typeof pa._rowAdded === "function") {
			pa._rowAdded(row);
		}
		if (su && typeof su._rowAdded === "function") {
			su._rowAdded(row);
		}
		gridElem.data("igGrid")._fireInternalEvent("_internalRowAdded", { row: row });
	}
	function _notifyRowDeleted(gridElem, rowId, row) {
		var se = gridElem.data("igGridSelection"),
			pa = gridElem.data("igGridPaging"),
			su = gridElem.data("igGridSummaries");
		if (se && typeof se._rowDeleted === "function") {
			se._rowDeleted(rowId, row);
		}
		if (su && typeof su._rowDeleted === "function") {
			su._rowDeleted(rowId, row);
		}
		if (pa && typeof pa._rowDeleted === "function") {
			pa._rowDeleted(rowId, row);
		}
		gridElem.data("igGrid")._fireInternalEvent("_internalRowDeleted", { rowID: rowId, row: row });
	}

	// Two way data binding for the combo control
	$.ig.angular.igCombo.bindEvents = $.ig.angular.igCombo.bindEvents ||
		function (scope, element, attrs, model) {
			if (!model) {
				return;
			}
			var controlName = attrs[ "data-ig-control-name" ], unbinder, comboItems;
			/**
				* Support both versions igCombo value methods before and after 15.1
				*/
			function comboValue(widget, value) {
				if ( widget.values ) {
					return widget.values(value);
				} else {
					// for 15.1 make sure you update to latest SR for value method
					return widget.value(value);
				}
			}
			function setControlValue( value ) {
				comboItems = value;
				if (typeof value === "string") {
					// in case view value is changed from text field (default Array.toString representation is comma separated)
					value = value.split(",");
				}
				comboValue(element.data(controlName), value);
				return element.data(controlName).text();
			}
			function parseValue() {
				//"parse" through the control value, ensure no-flicker with formatted values
				//model controller will attempt to set the edit text (not actual value) to the model. Only allow the actual control value to update.

				// No events fired when custom value is entered, this change won't affect the old combo
				var combo = element.data(controlName);
				if (combo.options.allowCustomValue && combo.refreshValue !== undefined) {
					combo.refreshValue();
				}

				return comboValue(element.data(controlName));
			}
			element.on($.ig.angular.igCombo.events.join(" "), function (event, args) {
				scope.$apply(function () {
					model.$setViewValue(comboValue(args.owner));
				});
			}).on("click", "div.ui-igcombo-clear", function () {
				scope.$apply(function () {
					model.$setViewValue([]);
				});
			}).one("$destroy", function () {
				unbinder();
				var index = $.inArray( setControlValue, model.$formatters );
				if (index >= 0) {
					model.$formatters.splice(index, 1);
				}
			});
			model.$formatters.push(setControlValue);
			model.$parsers.push(parseValue);

			unbinder = scope.$watch(attrs.source, function (newValue) {
				var items = [], newDataSource = [], combo = element.data(controlName);
				items = comboValue(combo);
				angular.copy(newValue, newDataSource);
				combo._setOption("dataSource", newDataSource);
				/* if the items were not in the old data source, use stored values */
				items = items.length !== 0 ? items : comboItems;
				combo.value(items);
			}, true);
			markWatcher(scope, controlName, attrs);
		};

	// igEditor specific code for two way data binding
	$.ig.angular.igEditor = $.ig.angular.igEditor || {};
	$.ig.angular.igEditor.element = $.ig.angular.igEditor.element || "<input></input>";
	$.ig.angular.igEditor.events = [];

	// Two way data binding for the editor controls
	$.ig.angular.igEditor.bindEvents = $.ig.angular.igEditor.bindEvents ||
			function (scope, element, attrs, model) {
				if (!model) {
					return;
				}
				var controlName = attrs[ "data-ig-control-name" ];

				function setControlValue(value) {
					var editor = element.data(controlName),
						displayFunc = editor.displayValue || editor.text || editor.value;

					editor.value(value);
					return displayFunc.call(editor);
				}
				function parseValue() {
					//"parse" through the control value, ensure no-flicker with formatted values
					//model controller will attempt to set the edit text (not actual value) to the model. Only allow the actual control value to update.
					//Can be extended in the future with "immediate" update mode and attempt to provide the to-be value
					return element.data(controlName).value();
				}
				if (controlName) {
					$.ig.angular[ controlName ].events = [ controlName.toLowerCase() + "valuechanged" ];
					element.on($.ig.angular[ controlName ].events.join(" "), function (event, args) {
						scope.$apply(function () {
							// force newer versions of ngModelController(1.3.0+) to update, since we kept the control value while in input was changing
							model.$$lastCommittedViewValue = null;
							model.$setViewValue(args.owner.value());
						});
					}).one("$destroy", function () {
						var index = $.inArray(setControlValue, model.$formatters);
						if (index >= 0) {
							model.$formatters.splice(index, 1);
						}
					});
					model.$formatters.push(setControlValue);
					model.$parsers.push(parseValue);
				}
			};
	$.ig.angular.igCurrencyEditor = angular
		.extend($.ig.angular.igCurrencyEditor || {}, $.ig.angular.igEditor);
	$.ig.angular.igDateEditor = angular
		.extend($.ig.angular.igDateEditor || {}, $.ig.angular.igEditor);
	$.ig.angular.igMaskEditor = angular
		.extend($.ig.angular.igMaskEditor || {}, $.ig.angular.igEditor);
	$.ig.angular.igNumericEditor = angular
		.extend($.ig.angular.igNumericEditor || {}, $.ig.angular.igEditor);
	$.ig.angular.igTextEditor = angular
		.extend($.ig.angular.igTextEditor || {}, $.ig.angular.igEditor);
	$.ig.angular.igDatePicker = angular
		.extend($.ig.angular.igDatePicker || {}, $.ig.angular.igEditor);
	$.ig.angular.igPercentEditor = angular
		.extend($.ig.angular.igPercentEditor || {}, $.ig.angular.igEditor);
	$.ig.angular.igCheckboxEditor = angular
		.extend($.ig.angular.igCheckboxEditor || {}, $.ig.angular.igEditor);

	// igGrid specific code for two way data binding
	$.ig.angular.igGrid = $.ig.angular.igGrid || {};
	$.ig.angular.igGrid.element = $.ig.angular.igGrid.element || "<table></table>";
	$.ig.angular.igGrid.events = [
		"iggridupdatingeditcellended",
		"iggridupdatingeditrowended",
		"iggridupdatingrowdeleted",
		"iggridupdatingrowadded"
	];

	// Two way data binding for the grid control
	$.ig.angular.igGrid.bindEvents = $.ig.angular.igGrid.bindEvents ||
			function (scope, element, attrs) {
				var unbinder,
					collectionWatchMode = attrs && attrs.collectionWatch && attrs.collectionWatch === "true";

				function watchGridDataSource(newValue, oldValue) {
					var i, j, existingDomRow, existingRow,
						grid = element.data("igGrid"), pkKey = grid.options.primaryKey,
						groupByInstance = element.data("igGridGroupBy"),
						gridUpdating = element.data("igGridUpdating"), column,
						record, td, newFormattedVal, dsRecord,
						ds = scope.$eval(attrs.source), diff = [], row, grp, idx,
						autoCommit = grid.options.autoCommit;
					/* check for a change of the data source. In this case rebind the grid */
					if (ds !== grid.options.dataSource) {
						//Setting a timeout 0 pushes the slow databind event to the end of the stack, letting the digest cycle finish, improving the overall responsivness of the page
						setTimeout(function () {
							grid.options.dataSource = ds;
							grid.dataBind();
						}, 0);
						return;
					}
					equalsDiff(newValue, oldValue, diff);
					/* add/delete new rows */
					if (Array.isArray(newValue) && Array.isArray(oldValue)) {
						// adding
						if (newValue.length > oldValue.length) {
							//inserted rows
							if ((oldValue.length > 0) &&
									(oldValue[ oldValue.length - 1 ][ pkKey ] !==
									newValue[ oldValue.length - 1 ][ pkKey ])) {
								// rebind the grid when there is a new inserted row, because igGrid doesn't have an API for inserting rows.
								grid.dataBind();
							}
							grp = groupByInstance && groupByInstance.options.groupedColumns.length > 0;
							for (i = oldValue.length; i < newValue.length; i++) {
								existingDomRow = element.find("tr[data-id='" + newValue[ i ][ pkKey ] + "']").length;
								if (existingDomRow === 0) {
									if (grp) {
										groupByInstance._renderNewRow(newValue[ i ], newValue[ i ][ pkKey ]);
									} else {
										grid.renderNewRow(newValue[ i ], newValue[ i ][ pkKey ]);
									}
								}
								existingRow = grid.dataSource.findRecordByKey(newValue[ i ][ pkKey ]);
								if (!existingRow) {
									// add the row without affecting the original DS (scope source)
									// TODO: trigger rowAdded event?
									grid.dataSource._addRow(newValue[ i ], -1);
								}

								row = grid.rowById(newValue[ i ][ pkKey ]);
								grid.options.autoCommit = true;
								_notifyRowAdded(element, row);
								grid.options.autoCommit = autoCommit;
							}
						}

						// deleting a row
						if (newValue.length < oldValue.length) {
							for (i = 0, j = 0; j < oldValue.length; i++, j++) {
						        if ((newValue[ i ] === undefined) ||
							        (newValue[ i ][ pkKey ] !== oldValue[ j ][ pkKey ])) {
									grid.dataSource.deleteRow(oldValue[ j ][ pkKey ], true);
									i--;
									row = element.find("tr[data-id='" + oldValue[ j ][ pkKey ] + "']");
									idx = row.index();
									row.remove();
									grid._reapplyZebraStyle(idx);
									grid.options.autoCommit = true;
									_notifyRowDeleted(element, oldValue[ j ][ pkKey ], row);
									grid.options.autoCommit = autoCommit;
								}
							}
						}
					}
					/* update a row */
					if (Array.isArray(diff)) {
						for (i = 0; i < diff.length; i++) {
							// update cell values
							if (!diff[ i ].txlog) {
								continue;
							}
							for (j = 0; j < diff[ i ].txlog.length; j++) {
								// if updating in progress - cancel it
								if (gridUpdating && gridUpdating.isEditing()) {
									gridUpdating.endEdit(false);
								}

								// update the DOM of the grid
								column = grid.columnByKey(diff[ i ].txlog[ j ].key);
								record = ds[ diff[ i ].index ];
								row = grid.rowById(record[ pkKey ]);
								td = grid.cellById(record[ pkKey ], diff[ i ].txlog[ j ].key);
								if (column.template || grid.options.rowTemplate) {
									newFormattedVal = grid
										._renderTemplatedCell(diff[ i ].txlog[ j ].newVal, column);
								} else {
									newFormattedVal = grid
										._renderCell(diff[ i ].txlog[ j ].newVal, column, record);
								}
								/* updatecell */
								$(td).html(newFormattedVal);
								grid._fireInternalEvent("_internalCellUpdated", { rowID: record[ pkKey ], cell: td });
								/* update the grid data source */
								dsRecord = grid.dataSource.findRecordByKey(record[ pkKey ]);
								dsRecord[ column.key ] = diff[ i ].txlog[ j ].newVal;
							}
						}
					}
				}

				element.on($.ig.angular.igGrid.events.join(" "), function () {
					unbinder();
					/* When in collection watch mode, a change is detected only when the collection changes - a element is inserted or removed or the whole collection reference changes.
					Changes in a specific element inside collection are not detected. This provides huge performance boost when such change detection is not required */
					unbinder = collectionWatchMode ?
						scope.$watchCollection(attrs.source, watchGridDataSource) :
						scope.$watch(attrs.source, watchGridDataSource, true);
					scope.$apply();
					markWatcher(scope, "igGrid", attrs);
				}).one("$destroy", function () {
					unbinder();
				});

				/* watch for changes from the data source to the view */
				unbinder = collectionWatchMode ?
					scope.$watchCollection(attrs.source, watchGridDataSource) :
					scope.$watch(attrs.source, watchGridDataSource, true);
				markWatcher(scope, "igGrid", attrs);
			};

	// igHierarchicalGrid specific code for one way data binding
	$.ig.angular.igHierarchicalGrid = $.ig.angular.igHierarchicalGrid || {};
	$.ig.angular.igHierarchicalGrid.element = $.ig.angular.igHierarchicalGrid.element ||
		"<table></table>";
	$.ig.angular.igHierarchicalGrid.bindEvents = $.ig.angular.igHierarchicalGrid.bindEvents ||
			function (scope, element, attrs) {
				var unbinder;
			    /* rebind data source on changes */
				unbinder = scope.$watch(attrs.source, function (newValue) {
					var ds = scope.$eval(attrs.source), grid = element.data("igHierarchicalGrid");

					if (ds !== grid.options.dataSource) {
						//Setting a timeout 0 pushes the slow databind event to the end of the stack, letting the digest cycle finish, improving the overall responsivness of the page
						setTimeout(function () {
							$(element).igHierarchicalGrid("option", "dataSource", newValue);
						}, 0);
						return;
					}

				}, true);
				markWatcher(scope, "igHierarchicalGrid", attrs);
				element.one("$destroy", function () {
					unbinder();
				});
			};

	// igTree specific code for two way data binding
	$.ig.angular.igTree = $.ig.angular.igTree || {};

	// Two way data binding for the tree control
	$.ig.angular.igTree.bindEvents = $.ig.angular.igTree.bindEvents ||
			function (scope, element, attrs) {
				var unbinder;
				/* rebind data source on changes */
				unbinder = scope.$watch(attrs.source, function (newValue) {
					$(element).igTree("option", "dataSource", newValue);
				}, true);
				markWatcher(scope, "igTree", attrs);
				element.one("$destroy", function () {
					unbinder();
				});
			};

	// igDataChart specific code for data binding
	$.ig.angular.igDataChart = $.ig.angular.igDataChart || {};

	// Data binding (one-way) for the data chart control
	$.ig.angular.igDataChart.bindEvents = $.ig.angular.igDataChart.bindEvents ||
			function (scope, element, attrs) {
				var diff = [], ds = scope.$eval(attrs.source), unbinder;
				var changeHandler = function (newValue, oldValue) {
					var $chartElem = $(element), chart = $chartElem.data("igDataChart");
					if (newValue && (oldValue === undefined || oldValue === null)) {
						$chartElem.igDataChart("option", "dataSource", newValue);
						return;
					}
					/* check for a change of the data source. In this case rebind */
					if (chart.dataSources[ chart._containerSourceID ] &&
							chart.dataSources[ chart._containerSourceID ].data() !== newValue) {
						$chartElem.igDataChart("option", "dataSource", newValue);
						return;
					}
					if (newValue && oldValue && newValue.length === oldValue.length) {
						//attempt to optimize for value changes
						var equals = equalsDiff(newValue, oldValue, diff);
						if ((diff.length > 0) && !equals) {
							for (var i = 0; i < diff.length; i++) {
								$chartElem.igDataChart("notifySetItem",
									newValue,
									diff[ i ].index,
									newValue[ diff[ i ].index ],
									oldValue[ diff[ i ].index ]);
							}
							return;
						}
					}
					if (newValue) {
						$chartElem.igDataChart("notifyClearItems", newValue);
					}
				};

				//handle push to track added data points, unbind and rebind watcher after.
				ds.push = function () {
					unbinder();
					var res = Array.prototype.push.apply(this, arguments);
					$(element).igDataChart("notifyInsertItem", this, this.length - 1, arguments[ 0 ]);
					unbinder = scope.$watch(attrs.source, changeHandler, true);
					markWatcher(scope, "igDataChart", attrs);
					return res;
				};

				unbinder = scope.$watch(attrs.source, changeHandler, true);
				markWatcher(scope, "igDataChart", attrs);
				element.one("$destroy", function () {
					unbinder();
				});
			};

	// igBaseChart specific code for data binding
	$.ig.angular.igBaseChart = $.ig.angular.igBaseChart || {};
	$.ig.angular.igBaseChart.element = $.ig.angular.igBaseChart.element || "<div></div>";

	// Data binding (one-way) for the igBaseChart-s
	$.ig.angular.igBaseChart.bindEvents = $.ig.angular.igBaseChart.bindEvents ||
			function (scope, element, attrs) {
				var controlName = attrs[ "data-ig-control-name" ], unbinder;
				unbinder = scope.$watch(attrs.source, function (newValue) {
					$(element)[ controlName ]("notifyClearItems", newValue);
				}, true);
				markWatcher(scope, controlName, attrs);
				element.one("$destroy", function () {
					unbinder();
				});
			};
	$.ig.angular.igSparkline = angular.extend($.ig.angular.igSparkline ||
		{}, $.ig.angular.igBaseChart);
	$.ig.angular.igFunnelChart = angular.extend($.ig.angular.igFunnelChart ||
		{}, $.ig.angular.igBaseChart);

	// igHtmlEditor specific code for one way data binding
	$.ig.angular.igHtmlEditor = $.ig.angular.igHtmlEditor || {};
	$.ig.angular.igHtmlEditor.element = $.ig.angular.igHtmlEditor.element || "<div></div>";

	$.ig.angular.igHtmlEditor.bindEvents = $.ig.angular.igHtmlEditor.bindEvents ||
			function (scope, element, attrs) {
				var controlName = attrs[ "data-ig-control-name" ], unbinder;
				unbinder = scope.$watch(attrs.value, function (newValue) {
					$(element)[ controlName ]("setContent", newValue, "html");
				}, true);
				markWatcher(scope, controlName, attrs);
				element.one("$destroy", function () {
					unbinder();
				});
			};

	// igTreeGrid specific code instantiating the element on table
	$.ig.angular.igTreeGrid = $.ig.angular.igTreeGrid || {};
	$.ig.angular.igTreeGrid.element = $.ig.angular.igTreeGrid.element || "<table></table>";

	// igPivotGrid specific code instantiating the element on table
	$.ig.angular.igPivotGrid = $.ig.angular.igPivotGrid || {};
	$.ig.angular.igPivotGrid.element = $.ig.angular.igPivotGrid.element || "<table></table>";

	// Utility functions
	function convertToCamelCase(str) {
		//convert hyphen to camelCase
		return str.replace(/-([a-z])/g, function (group) {
			return group[ 1 ].toUpperCase();
		});
	}

	function getPropertyType(obj, prop) {
		var i;
		/* return the type of prop which is a property of the object */
		for (i in obj) {
			if (obj.hasOwnProperty(i)) {
				if (i === prop) {
					return $.type(obj[ i ]);
				}
				if ($.type(obj[ i ]) === "object" || $.type(obj[ i ]) === "array") {
					getPropertyType(obj[ i ], prop);
				}
			}
		}
		return null;
	}

	function extractOptions(nodeName, context, options, element, scope) {
		//extract all options from the element
		var i, name, value, optionName, children = context.children,
			attrs = context.attributes, eventAttrPrefix = "event-";

		for (i = 0; i < attrs.length; i++) {
			name = attrs[ i ].name;
			value = attrs[ i ].value;

			if (name.startsWith(eventAttrPrefix)) {
				name = name.substr(eventAttrPrefix.length);
				value = scope.$eval(value) || value;
			}
			name = convertToCamelCase(name);

			/* if somewhere in the controls there is floting point number use this one /^-?\d+\.?\d*$/ */
			if (value === "true" || value === "false" || /^-?\d+\.?\d*$/.test(value) || /^{{[^}]+}}$/.test(value)) {
				value = scope.$eval(value.replace(/([{}:])\1/g, ""));
			}
			options[ name ] = value;
		}
		/* extract options from the nested elements */
		for (i = 0; i < children.length; i++) {

			if (!context.optionsPath) {
				context.optionsPath = []; //top level
			}
			optionName = children[ i ].nodeName.toLowerCase();
			if (optionName === "content") {
				continue;
			}
			optionName = convertToCamelCase(optionName);

			var opts = $.ui[ nodeName ].prototype.options;

			if (context.optionsPath[ 0 ] === "features" && options.name) {
				//grid feature, proto options come from feature widget:
				opts = $.ui[ nodeName.replace("Hierarchical", "") + options.name ].prototype.options;
				context.optionsPath = [];
			}

			for (var j = 0; j < context.optionsPath.length; j++) {
				if (opts[ context.optionsPath[ j ] ] && context.optionsPath[ j ] !== "columnLayouts") {
					opts = opts[ context.optionsPath[ j ] ];
				}
			}

			if (children[ i ].childElementCount > 0) {
				var option;
				if (children[ i ].hasAttributes() || getPropertyType(opts, optionName) === "object") {
					// object nodes (can have attributes)
					option = {};
				} else {
					option = [];
				}
				if ($.type(options) === "array") {
					options.push(option);
					children[ i ].optionsPath = context.optionsPath;
					extractOptions(nodeName, children[ i ], options[ options.length - 1 ], element, scope);
				} else {
					options[ optionName ] = option;
					children[ i ].optionsPath = context.optionsPath.concat(optionName);
					extractOptions(nodeName, children[ i ], options[ optionName ], element, scope);
				}
			} else {
				// single options to evaluate against the parent object:
				if (!context.hasAttributes() && $.type(options) === "array") {
					if (children[ i ].nextSibling && children[ i ].nextSibling.textContent.trim() !== "") {
						//child with text content, e.g. video source
						options.push(children[ i ].nextSibling.textContent.trim());
					} else {
						//child with attributes
						options.push({});
						extractOptions(nodeName, children[ i ], options[ options.length - 1 ], element, scope);
					}
				} else {
					if (children[ i ].nextSibling && children[ i ].nextSibling.textContent.trim() !== "") {
						//child with text content
						options[ optionName ] = children[ i ].nextSibling.textContent.trim();
					} else {
						//child with attributes
						options[ optionName ] = {};
						extractOptions(nodeName, children[ i ], options[ optionName ], element, scope);
					}
				}
			}
		}
		return options;
	}

	function getHtml(selector) {
		return $(selector).html();
	}

	// define modules and directives
	var module = angular.module("igniteui-directives", []);

	// directive constructor for custom tags,  data-* attribute and class initialization
	var igniteElementDirectiveConstructor = function () {
		return {
			restrict: "EAC",
			require: "?ngModel",
			template: function (element, attrs) {
				this.origElementCopy = element.clone();
				var content, template, templateParts;
				attrs.$set("data-ig-control-name", this.name);
				content = element.find("content").html();

				// igTextEditor textMode known issue
				if (attrs.textMode && attrs.textMode === "multiline" &&
					attrs[ "data-ig-control-name" ] === "igTextEditor") {
						template = "<textarea></textarea>";
				} else {
					template = (attrs.element && "<_el_></_el_>".replace(/_el_/g, attrs.element)) || ($.ig.angular[ this.name ] && $.ig.angular[ this.name ].element || "<div></div>");
				}
				/* In case there is a content tag in the directive manually construct the template by concatenating start tag + content + end tag */
				if (content) {
					templateParts = template.match("(<[^/][\\w]+>)(</[\\w]+>)");
					if (templateParts.length === 3) {
						template = templateParts[ 1 ] + content + templateParts[ 2 ];
					}
				}
				return template;
			},
			replace: true,
			compile: function (tElement, tAttrs, transclude) {
				var context = this.origElementCopy[ 0 ];
				return function (scope, element, attrs, ngModel) {
					var controlName = attrs[ "data-ig-control-name" ];
					scope.getHtml = scope.getHtml || getHtml;
					if (controlName) {
						if (context) {
							var options = scope.$eval(attrs[ controlName ]) ||
								extractOptions(controlName, context, {}, element, scope);
							/* removing the width and height attributes on the placeholder, because they affect the control dimensions */
							if (element.removeAttr) {
								element.removeAttr("width").removeAttr("height");
							}

							if (attrs.source) {
								options.dataSource = scope.$eval(attrs.source);
							} else {
								attrs.source = attrs[ controlName ] + ".dataSource";
								attrs.primaryKey = options.primaryKey;
							}

							// Two way data binding support using events from the controls
							if ($.ig.angular[ controlName ] && $.ig.angular[ controlName ].bindEvents) {
								$.ig.angular[ controlName ].bindEvents(scope, element, attrs, ngModel);
							}

							// cleanup
							scope.$on("$destroy", function () {
								if (typeof element.data(controlName) === "object") {
									element[ controlName ]("destroy");
								}
								if ($.ig.angular[ controlName ] &&
										$.ig.angular[ controlName ].events &&
										$.ig.angular[ controlName ].events.length) {
									element.off($.ig.angular[ controlName ].events.join(" "));
								}
							});

							element[ controlName ](options);
						}
					}
				};
			}
		};
	};

	for (var control in $.ui) {
		if (control.substring(0, 2) === "ig") {
			module.directive(control, igniteElementDirectiveConstructor);
		}
	}
}(angular, jQuery));
