/*global jQuery, angular */
'use strict';
(function (angular, $) {
	$.ig = $.ig || {};
	$.ig.angular = $.ig.angular || {};

	// igCombo specific code for two way data binding
	$.ig.angular.igCombo = $.ig.angular.igCombo || {};
	$.ig.angular.igCombo.element = $.ig.angular.igCombo.element || "<input></input>";

	// Two way data binding for the combo control
	$.ig.angular.igCombo.bindEvents = $.ig.angular.igCombo.bindEvents || function (scope, element, attrs, model) {
		if (!model) {
			return;
		}
		var controlName = attrs["data-ig-control-name"];
		function setControlValue(value) {
			element.data(controlName).value(value);
			return element.data(controlName).text();
		}
		if (controlName) {
			element.on(controlName.toLowerCase() + "textchanged", function (event, args) {
				scope.$apply(function () {
					model.$setViewValue(args.owner.value());
				});
			});
			model.$formatters.push(setControlValue);
		}
		scope.$watch(attrs.source, function (newValue, oldValue, currentValue) {
			var value = element.data(controlName).value(), newDataSource = [];
			angular.copy(newValue, newDataSource);
			element.data(controlName)._setOption("dataSource", newDataSource);
			element.data(controlName).value(value);
		}, true);
	};

	// igEditor specific code for two way data binding
	$.ig.angular.igEditor = $.ig.angular.igEditor || {};
	$.ig.angular.igEditor.element = $.ig.angular.igEditor.element || "<input></input>";

	// Two way data binding for the editor controls
	$.ig.angular.igEditor.bindEvents = $.ig.angular.igEditor.bindEvents || function (scope, element, attrs, model) {
		if (!model) {
			return;
		}
		var controlName = attrs["data-ig-control-name"];

		function setControlValue(value) {
			element.data(controlName).value(value);
			return element.data(controlName).text();
		}
		if (controlName) {
			element.on(controlName.toLowerCase() + "textchanged", function (event, args) {
				scope.$apply(function () {
					model.$setViewValue(args.owner.value());
				});
			});
			model.$formatters.push(setControlValue);
		}
	};
	$.ig.angular.igCurrencyEditor = angular.extend($.ig.angular.igCurrencyEditor || {}, $.ig.angular.igEditor);
	$.ig.angular.igDateEditor = angular.extend($.ig.angular.igDateEditor || {}, $.ig.angular.igEditor);
	$.ig.angular.igMaskEditor = angular.extend($.ig.angular.igMaskEditor || {}, $.ig.angular.igEditor);
	$.ig.angular.igNumericEditor = angular.extend($.ig.angular.igNumericEditor || {}, $.ig.angular.igEditor);
	$.ig.angular.igTextEditor = angular.extend($.ig.angular.igTextEditor || {}, $.ig.angular.igEditor);
	$.ig.angular.igDatePicker = angular.extend($.ig.angular.igDatePicker || {}, $.ig.angular.igEditor);
	$.ig.angular.igPercentEditor = angular.extend($.ig.angular.igPercentEditor || {}, $.ig.angular.igEditor);

	// igGrid specific code for two way data binding
	$.ig.angular.igGrid = $.ig.angular.igGrid || {};
	$.ig.angular.igGrid.element = $.ig.angular.igGrid.element || "<table></table>";

	// Two way data binding for the grid control
	$.ig.angular.igGrid.bindEvents = $.ig.angular.igGrid.bindEvents || function (scope, element, attrs, model) {
		element.on("iggridupdatingeditcellended iggridupdatingeditrowended iggridupdatingrowdeleted iggridupdatingrowadded", function (event, args) {
			angular.element(element).scope().$apply();
		});
		var diff = [], currentData = $.extend(true, [], scope.$eval(attrs.source)),
		watchFn = function () {
			var equals, newData = scope.$eval(attrs.source);
			equals = equalsDiff(newData, currentData, diff);
			if ((diff.length > 0) || !equals) {
				currentData = $.extend(true, [], newData);
			}
			return currentData;
		};
		// watch for changes from the data source to the view
		scope.$watch(watchFn, function whatchGridDataSource(newValue, oldValue, currentValue) {
			var i, j, pkKey = attrs.primaryKey, existingDomRow, existingRow, grid = element.data("igGrid"), gridUpdating = element.data("igGridUpdating"), column, record, td, colIndex, newFormattedVal, dsRecord, ds = scope.$eval(attrs.source);
			// add/delete new rows
			if (Array.isArray(newValue) && Array.isArray(oldValue)) {
				// adding
				if (newValue.length > oldValue.length) {
					//inserted rows
					if ((oldValue.length > 0) && (oldValue[oldValue.length - 1][pkKey] !== newValue[oldValue.length - 1][pkKey])) {
						// rebind the grid when there is a new inserted row, because igGrid doesn't have an API for inserting rows.
						grid.dataBind();
					}
					for (i = oldValue.length; i < newValue.length; i++) {
						existingDomRow = element.find("tr[data-id='" + newValue[i][pkKey] + "']").length;
						if (existingDomRow === 0) {
							grid.renderNewRow(newValue[i], newValue[i][pkKey]);
						}
						existingRow = grid.dataSource.findRecordByKey(newValue[i][pkKey]);
						if (!existingRow) {
							grid.dataSource.addRow(newValue[i][pkKey], newValue[i], true);
						}
					}
				}

				// deleting a row
				if (newValue.length < oldValue.length) {
					for (i = 0, j = 0; j < oldValue.length; i++, j++) {
						if ((newValue[i] === undefined) || (newValue[i][pkKey] !== oldValue[j][pkKey])) {
							element.find("tr[data-id='" + oldValue[j][pkKey] + "']").remove();
							grid.dataSource.deleteRow(oldValue[j][pkKey], true);
							i--;
						}
					}
				}
			}
			// update a row
			if (Array.isArray(diff)) {
				for (i = 0; i < diff.length; i++) {
					// update cell values
					if (!diff[i].txlog) {
						continue;
					}
					for (j = 0; j < diff[i].txlog.length; j++) {
						// if updating in progress - cancel it
						if (gridUpdating.isEditing()) {
							gridUpdating.endEdit(false);
						}

						// update the DOM of the grid
						column = grid.columnByKey(diff[i].txlog[j].key);
						record = ds[diff[i].index];
						colIndex = grid._getCellIndexByColumnKey(diff[i].txlog[j].key);
						td = element.find("tr[data-id='" + record[pkKey] + "']").children().get(colIndex);
						if (grid.options.rowTemplate && grid.options.rowTemplate.length > 0) {
							newFormattedVal = grid._renderTemplatedCell(diff[i].txlog[j].newVal, column).substring(1);
						} else {
							newFormattedVal = grid._renderCell(diff[i].txlog[j].newVal, column, record);
						}
						// updatecell
						$(td).html(newFormattedVal);
						// update the grid data source
						dsRecord = grid.dataSource.findRecordByKey(record[pkKey]);
						dsRecord[column.key] = diff[i].txlog[j].newVal;
					}
				}
				diff = [];
			}
		}, true);
	};

	// igTree specific code for two way data binding
	$.ig.angular.igTree = $.ig.angular.igTree || {};

	// Two way data binding for the tree control
	$.ig.angular.igTree.bindEvents = $.ig.angular.igTree.bindEvents || function (scope, element, attrs) {
		// rebind data source on changes
		scope.$watch(attrs.source, function (newValue, oldValue, currentValue) {
			$(element).igTree("option", "dataSource", newValue);
		}, true);
	};

    // Utility functions
	function convertToCamelCase(str) {
		//convert hyphen to camelCase
		return str.replace(/-([a-z])/g, function (group) {
			return group[1].toUpperCase();
		});
	}

	function getPropertyType(obj, prop) {
		var i;
		//return the type of prop which is a property of the object
		for (i in obj) {
			if (obj.hasOwnProperty(i)) {
				if (i === prop) {
					return $.type(obj[i]);
				}
				if ($.type(obj[i]) === "object" || $.type(obj[i]) === "array") {
					getPropertyType(obj[i], prop);
				}
			}
		}
		return null;
	}

	function extractOptions(nodeName, context, options, element, scope) {
		//extract all options from the element
		var i, name, value, arrayName, children = context.children,
			attrs = context.attributes, eventName, eventAttrPerfix = "event-";
		for (i = 0; i < attrs.length; i++) {
			name = attrs[i].name;
			value = attrs[i].value;

			if (name.startsWith(eventAttrPerfix)) {
				name = name.substr(eventAttrPerfix.length).replace(/-/g, "").toLowerCase();
				eventName = name.startsWith(nodeName.toLowerCase()) ? name : nodeName.toLowerCase() + name;
				element.on(eventName, scope.$eval(value));
			} else {
				name = convertToCamelCase(name);
				
				/* if somewhere in the controls there is floting point number use this one /^-?\d+\.?\d*$/ */
				if (value === "true" || value === "false" || /^-?\d+\.?\d*$/.test(value) ) {
					value = scope.$eval(value);
				}
				options[name] = value;
			}
		}
		//extract options from the nested element
		for (i = 0; i < children.length; i++) {
			if (!children[i].hasAttributes()) {
				arrayName = children[i].nodeName.toLowerCase();
				arrayName = convertToCamelCase(arrayName);
				if (getPropertyType($.ui[nodeName].prototype.options, arrayName) === "object") {
					options[arrayName] = {};
				} else if (children[i].childElementCount === 0 &&
							children[i].nextSibling.textContent.trim() !== "") {
					options.push(children[i].nextSibling.textContent.trim());
				} else {
					options[arrayName] = [];
				}
				extractOptions(nodeName, children[i], options[arrayName], element, scope);
			} else {
				if (!context.hasAttributes() && $.type(options) === "array") {
					options.push({});
					extractOptions(nodeName, children[i], options[options.length - 1], element, scope);
				} else {
					extractOptions(nodeName, children[i], options, element, scope);
				}
			}
		}
		return options;
	}

	function equalsDiff(o1, o2, diff) {
		if (o1 === o2) return true;
		if (o1 === null || o2 === null) return false;
		if (o1 !== o1 && o2 !== o2) return true; // NaN === NaN
		var t1 = typeof o1, t2 = typeof o2, length, key, keySet, dirty, skipDiff = false, changedVals = [];
		if (t1 == t2) {
			if (t1 == "object") {
				if (isArray(o1)) {
					if (!isArray(o2)) return false;
					if ((length = o1.length) == o2.length) {
						if (!isArray(diff)) {
							skipDiff = true;
						}
						for (key = 0; key < length; key++) {
							// we are comparing objects here
							if (!equalsDiff(o1[key], o2[key], changedVals)) {
								dirty = true;
								if (!skipDiff) {
									diff.push({ index: key, txlog: changedVals });
								}
							}
						}
						if (dirty) {
							return false;
						}
						return true;
					}
				} else if (isDate(o1)) {
					return isDate(o2) && o1.getTime() == o2.getTime();
				} else if (isRegExp(o1) && isRegExp(o2)) {
					return o1.toString() == o2.toString();
				} else {
					if (isScope(o1) || isScope(o2) || isWindow(o1) || isWindow(o2) || isArray(o2)) return false;
					keySet = {};
					if (!isArray(diff)) {
						skipDiff = true;
					}
					for (key in o1) {
						if (key.charAt(0) === "$" || isFunction(o1[key])) continue;
						if (!equalsDiff(o1[key], o2[key])) {
							dirty = true;
							if (!skipDiff) {
								diff.push({ key: key, oldVal: o2[key], newVal: o1[key] });
							}
						}
						keySet[key] = true;
					}
					for (key in o2) {
						if (!keySet.hasOwnProperty(key) &&
							key.charAt(0) !== "$" &&
							o2[key] !== undefined &&
							!isFunction(o2[key])) return false;
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

	function getWidgetName(attrs) {
	    for (var a in attrs) {
	        if (a.substring(0, 2) === "ig") {
	            return a;
	        }
	    }
	    return undefined;
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

	// define modules and directives
	var module = angular.module("igniteui-directives", []);

	// directive constructor for custom tags initialization
	var igniteElementDirectiveConstructor = function () {
		return {
			restrict: "E",
			require: "?ngModel",
			template: function (element, attrs) {
				var nodeName = element.context.nodeName.toLowerCase();
				nodeName = convertToCamelCase(nodeName);
				attrs.$set("data-ig-control-name", nodeName);
				// igDialog is a special case which needs to hold its contents
				if (nodeName === "igDialog") {
					return "<div>" + element.html() + "</div>";
				}
				return $.ig.angular[nodeName] && $.ig.angular[nodeName].element || "<div></div>";
			},
			replace: true,
			link: function (scope, element, attrs, ngModel) {
				var nodeName = attrs["data-ig-control-name"];
				if (nodeName) {
					if (element.context) {
						var res = extractOptions(nodeName, element.context, {}, element, scope);
						if (attrs.source) {
							var ds = scope.$eval(attrs.source);
							res.dataSource = ds;
						}
						// Two way data binding support using events from the controls
						if ($.ig.angular[nodeName] && $.ig.angular[nodeName].bindEvents) {
							$.ig.angular[nodeName].bindEvents(scope, element, attrs, ngModel);
						}
						element[nodeName](res);
					}
				}
			}
		};
	};

	// directive constructor for data-* attribute initialization
	var igniteAttributeDirectiveConstructor = function () {
		return {
			restrict: "A",
			link: function(scope, element, attrs) {
				var widgetName = getWidgetName(attrs);
				if (widgetName) {
					var options = scope[attrs[widgetName]];
					element[widgetName](options || {});
				}
			}
		};
	};

	for (var widget in $.ui) {
		if (widget.substring(0, 2) === "ig") {
			module.directive(widget, igniteElementDirectiveConstructor);
			module.directive(widget, igniteAttributeDirectiveConstructor);
		}
	}
}(angular, jQuery));