/*
 * Ignite UI directives for AngularJS   1.0.0
 * https://github.com/IgniteUI/igniteui-angular
 *
 * Copyright (c) 2014 Infragistics, Inc.
 * Licensed under the MIT license.
 * https://github.com/IgniteUI/igniteui-angular/blob/master/license.txt
 */

/*global jQuery, angular */
(function (angular, $) {
    "use strict";
    $.ig = $.ig || {};
    $.ig.angular = $.ig.angular || {};

    // igCombo specific code for two way data binding
    $.ig.angular.igCombo = $.ig.angular.igCombo || {};
    $.ig.angular.igCombo.element = $.ig.angular.igCombo.element || "<input></input>";
    $.ig.angular.igCombo.events = ["igcombotextchanged"];

    // Two way data binding for the combo control
    $.ig.angular.igCombo.bindEvents = $.ig.angular.igCombo.bindEvents || function (scope, element, attrs, model) {
        if (!model) {
            return;
        }
        var controlName = attrs["data-ig-control-name"], unbinder;
        function setControlValue(value) {
            element.data(controlName).value(value);
            return element.data(controlName).text();
        }
        element.on($.ig.angular.igCombo.events.join(' '), function (event, args) {
            scope.$apply(function () {
                model.$setViewValue(args.owner.values());
            });
        }).one('$destroy', function() {
        	var index = $.inArray(setControlValue, model.$formatters);
        	unbinder();
        	if (index >=0) {
        		model.$formatters.splice(index, 1);
        	}
        });
        model.$formatters.push(setControlValue);

        unbinder = scope.$watch(attrs.source, function (newValue) {
            var value = element.data(controlName).value(), newDataSource = [];
            angular.copy(newValue, newDataSource);
            element.data(controlName)._setOption("dataSource", newDataSource);
            element.data(controlName).value(value);
        }, true);
		markWatcher(scope, controlName, attrs);
    };

    // igEditor specific code for two way data binding
    $.ig.angular.igEditor = $.ig.angular.igEditor || {};
    $.ig.angular.igEditor.element = $.ig.angular.igEditor.element || "<input></input>";
    $.ig.angular.igEditor.events = [];

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
        	$.ig.angular[controlName].events = [controlName.toLowerCase() + "textchanged"];
            element.on($.ig.angular[controlName].events.join(' '), function (event, args) {
                scope.$apply(function () {
                    model.$setViewValue(args.owner.value());
                });
            }).one('$destroy', function() {
            	var index = $.inArray(setControlValue, model.$formatters);
	        	if (index >=0) {
	        		model.$formatters.splice(index, 1);
	        	}
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
    $.ig.angular.igGrid.events = ["iggridupdatingeditcellended", "iggridupdatingeditrowended", "iggridupdatingrowdeleted", "iggridupdatingrowadded"];

    // Two way data binding for the grid control
    $.ig.angular.igGrid.bindEvents = $.ig.angular.igGrid.bindEvents || function (scope, element, attrs) {
    	var unbinder;
        element.on($.ig.angular.igGrid.events.join(' '), function () {
        	unbinder();
            unbinder = scope.$watch(attrs.source, watchGridDataSource, true);
            scope.$apply();
           	markWatcher(scope, "igGrid", attrs);
        }).one('$destroy', function() {
        	unbinder();
        });

        function watchGridDataSource(newValue, oldValue) {
            var i, j, existingDomRow, existingRow, grid = element.data("igGrid"), pkKey = grid.options.primaryKey,
				gridUpdating = element.data("igGridUpdating"), column, record, td, colIndex, newFormattedVal, dsRecord,
				ds = scope.$eval(attrs.source), diff = [];
            // check for a change of the data source. In this case rebind the grid
            if (ds !== grid.options.dataSource) {
                grid.options.dataSource = ds;
                grid.dataBind();
                return;
            }
            equalsDiff(newValue, oldValue, diff);
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
                            // add the row without affecting the original DS (scope source) 
                            // TODO: trigger rowAdded event?
                            grid.dataSource._addRow(newValue[i], -1);
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
                        if (gridUpdating && gridUpdating.isEditing()) {
                            gridUpdating.endEdit(false);
                        }

                        // update the DOM of the grid
                        column = grid.columnByKey(diff[i].txlog[j].key);
                        record = ds[diff[i].index];
                        colIndex = grid._getCellIndexByColumnKey(diff[i].txlog[j].key);
                        td = element.find("tr[data-id='" + record[pkKey] + "']").children().get(colIndex);
                        if (column.template || grid.options.rowTemplate) {
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
            }
        }
        // watch for changes from the data source to the view
        unbinder = scope.$watch(attrs.source, watchGridDataSource, true);
		markWatcher(scope, "igGrid", attrs);
    };

    // igTree specific code for two way data binding
    $.ig.angular.igTree = $.ig.angular.igTree || {};

    // Two way data binding for the tree control
    $.ig.angular.igTree.bindEvents = $.ig.angular.igTree.bindEvents || function (scope, element, attrs) {
    	var unbinder;
        // rebind data source on changes
        unbinder = scope.$watch(attrs.source, function (newValue) {
            $(element).igTree("option", "dataSource", newValue);
        }, true);
		markWatcher(scope, "igTree", attrs);
        element.one('$destroy', function() {
        	unbinder();
        });
    };

    // igDataChart specific code for data binding
    $.ig.angular.igDataChart = $.ig.angular.igDataChart || {};

    // Data binding (one-way) for the data chart control
    $.ig.angular.igDataChart.bindEvents = $.ig.angular.igDataChart.bindEvents || function (scope, element, attrs) {
        var diff = [], ds = scope.$eval(attrs.source), unbinder;
        var changeHandler = function (newValue, oldValue) {
        	var $chartElem = $(element), chart = $chartElem.data('igDataChart');
 			// check for a change of the data source. In this case rebind
        	if (chart.dataSources[chart._containerSourceID].data() !== newValue) {
                $chartElem.igDataChart("option", "dataSource", newValue);
                return;
            }
            if (newValue.length === oldValue.length) {
                //attempt to optimize for value changes
                var equals = equalsDiff(newValue, oldValue, diff);
                if ((diff.length > 0) && !equals) {
                    for (var i = 0; i < diff.length; i++) {
                        $chartElem.igDataChart("notifySetItem", newValue, diff[i].index, newValue[diff[i].index], oldValue[diff[i].index]);
                    }
                    return;
                }
            }
            $chartElem.igDataChart("notifyClearItems", newValue);
        };

        //handle push to track added data points, unbind and rebind watcher after.
        ds.push = function () {
            unbinder();
            var res = Array.prototype.push.apply(this, arguments);
            $(element).igDataChart("notifyInsertItem", this, this.length - 1, arguments[0]);
            unbinder = scope.$watch(attrs.source, changeHandler, true);
			markWatcher(scope, "igDataChart", attrs);
            return res;
        };

        unbinder = scope.$watch(attrs.source, changeHandler, true);
		markWatcher(scope, "igDataChart", attrs);
        element.one('$destroy', function() {
        	unbinder();
        });
    };

    // igBaseChart specific code for data binding
    $.ig.angular.igBaseChart = $.ig.angular.igBaseChart || {};
    $.ig.angular.igBaseChart.element = $.ig.angular.igBaseChart.element || "<div></div>";

    // Data binding (one-way) for the igBaseChart-s
    $.ig.angular.igBaseChart.bindEvents = $.ig.angular.igBaseChart.bindEvents || function (scope, element, attrs) {
        var controlName = attrs["data-ig-control-name"], unbinder;
        unbinder = scope.$watch(attrs.source, function (newValue) {
            $(element)[controlName]("notifyClearItems", newValue);
        }, true);
		markWatcher(scope, controlName, attrs);
        element.one('$destroy', function() {
        	unbinder();
        });
    };
    $.ig.angular.igSparkline = angular.extend($.ig.angular.igSparkline || {}, $.ig.angular.igBaseChart);
    $.ig.angular.igFunnelChart = angular.extend($.ig.angular.igFunnelChart || {}, $.ig.angular.igBaseChart);

    // igHtmlEditor specific code for one way data binding
    $.ig.angular.igHtmlEditor = $.ig.angular.igHtmlEditor || {};
    $.ig.angular.igHtmlEditor.element = $.ig.angular.igHtmlEditor.element || "<div></div>";

    $.ig.angular.igHtmlEditor.bindEvents = $.ig.angular.igHtmlEditor.bindEvents || function (scope, element, attrs) {
        var controlName = attrs["data-ig-control-name"], unbinder;
        unbinder = scope.$watch(attrs.value, function (newValue) {
            $(element)[controlName]("setContent", newValue, "html");
        }, true);
        markWatcher(scope, controlName, attrs);
        element.one('$destroy', function() {
            unbinder();
        });
    };

    // Mark watchers for discoverability
    function markWatcher (scope, controlName, attrs) {
        // Angular uses unshift(), so the last watcher is at 0:
        scope.$$watchers[0][controlName] = attrs.id || controlName + scope.$$watchers.length; 
    }

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
        var i, name, value, optionName, children = context.children,
			attrs = context.attributes, eventAttrPrefix = "event-";

        for (i = 0; i < attrs.length; i++) {
            name = attrs[i].name;
            value = attrs[i].value;

            if (name.startsWith(eventAttrPrefix)) {
                name = name.substr(eventAttrPrefix.length);
                value = scope.$eval(value) || value;
            }
            name = convertToCamelCase(name);

            /* if somewhere in the controls there is floting point number use this one /^-?\d+\.?\d*$/ */
            if (value === "true" || value === "false" || /^-?\d+\.?\d*$/.test(value) || /^{{[^}]+}}$/.test(value)) {
                value = scope.$eval(value.replace(/([{}:])\1/g, ""));
            }
            options[name] = value;
        }
        //extract options from the nested elements
        for (i = 0; i < children.length; i++) {

            if (!context.optionsPath) {
                context.optionsPath = []; //top level
            }
            optionName = children[i].nodeName.toLowerCase();
            if (optionName === "content") {
                continue;
            }
            optionName = convertToCamelCase(optionName);


            var opts = $.ui[nodeName].prototype.options;

            if (context.optionsPath[0] === "features" && options.name) {
                //grid feature, proto options come from feature widget:
                opts = $.ui[nodeName + options.name].prototype.options;
                context.optionsPath = [];
            }



            for (var j = 0; j < context.optionsPath.length; j++) {
                if (opts[context.optionsPath[j]] && context.optionsPath[j] !== "columnLayouts") {
                    opts = opts[context.optionsPath[j]];
                }
            }

            if (children[i].childElementCount > 0) {
                var option;
                if (children[i].hasAttributes() || getPropertyType(opts, optionName) === "object") {
                    // object nodes (can have attributes) 
                    option = {};
                } else {
                    option = [];
                }
                if ($.type(options) === "array") {
                    options.push(option);
                    children[i].optionsPath = context.optionsPath;
                    extractOptions(nodeName, children[i], options[options.length - 1], element, scope);
                }
                else {
                    options[optionName] = option;
                    children[i].optionsPath = context.optionsPath.concat(optionName);
                    extractOptions(nodeName, children[i], options[optionName], element, scope);
                }
            }
            else {
                // single options to evaluate against the parent object:
                if (!context.hasAttributes() && $.type(options) === "array") {
                    if (children[i].nextSibling && children[i].nextSibling.textContent.trim() !== "") {
                        //child with text content, e.g. video source
                        options.push(children[i].nextSibling.textContent.trim());
                    } else {
                        //child with attributes
                        options.push({});
                        extractOptions(nodeName, children[i], options[options.length - 1], element, scope);
                    }
                } else {
                    if (children[i].nextSibling && children[i].nextSibling.textContent.trim() !== "") {
                        //child with text content
                        options[optionName] = children[i].nextSibling.textContent.trim();
                    } else {
                        //child with attributes
                        options[optionName] = {};
                        extractOptions(nodeName, children[i], options[optionName], element, scope);
                    }
                }
            }
        }
        return options;
    }

    function equalsDiff(o1, o2, diff) {
        if (o1 === o2) { return true; }
        if (o1 === null || o2 === null) { return false; }
        if (o1 !== o1 && o2 !== o2) { return true; }// NaN === NaN
        var t1 = typeof o1, t2 = typeof o2, length, key, keySet, dirty, skipDiff = false, changedVals = [];
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
                    return isDate(o2) && o1.getTime() === o2.getTime();
                } else if (isRegExp(o1) && isRegExp(o2)) {
                    return o1.toString() === o2.toString();
                } else {
                    if (isScope(o1) || isScope(o2) || isWindow(o1) || isWindow(o2) || isArray(o2)) { return false; }
                    keySet = {};
                    if (!isArray(diff)) {
                        skipDiff = true;
                    }
                    for (key in o1) {
                        if (key.charAt(0) === "$" || isFunction(o1[key])) { continue; }
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
							!isFunction(o2[key])) { return false; }
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
                var content, template, templateParts;
                attrs.$set("data-ig-control-name", this.name);
                content = element.find("content").html();
                template = $.ig.angular[this.name] && $.ig.angular[this.name].element || "<div></div>";
                // In case there is a content tag in the directive manually construct the template by concatenating start tag + content + end tag
                if (content) {
                    templateParts = template.match("(<[^/][\\w]+>)(</[\\w]+>)");
                    if (templateParts.length === 3) {
                        template = templateParts[1] + content + templateParts[2];
                    }
                }
                return template;
            },
            replace: true,
            link: function (scope, element, attrs, ngModel) {
                scope.getHtml = scope.getHtml || getHtml;
                var controlName = attrs["data-ig-control-name"];
                if (controlName) {
                    if (element.context) {
                        var options = scope.$eval(attrs[controlName]) || extractOptions(controlName, element.context, {}, element, scope);
                        // removing the width and height attributes on the placeholder, because they affect the control dimensions
                        if (element.removeAttr) {
                            element.removeAttr("width").removeAttr("height");
                        }

                        if (attrs.source) {
                            options.dataSource = scope.$eval(attrs.source);
                        } else {
                            attrs.source = attrs[controlName] + ".dataSource";
                            attrs.primaryKey = options.primaryKey;
                        }

                        // Two way data binding support using events from the controls
                        if ($.ig.angular[controlName] && $.ig.angular[controlName].bindEvents) {
                            $.ig.angular[controlName].bindEvents(scope, element, attrs, ngModel);
                        }
                        
                        // cleanup
                        scope.$on('$destroy', function() {
					        if (element.data(controlName)) {
					        	element[controlName]("destroy");
					        }
					        if($.ig.angular[controlName] && $.ig.angular[controlName].events && $.ig.angular[controlName].events.length) {
                        		element.off($.ig.angular[controlName].events.join(' '));
					        }
						});

                        element[controlName](options);
                    }
                }
            }
        };
    };

    for (var control in $.ui) {
        if (control.substring(0, 2) === "ig") {
            module.directive(control, igniteElementDirectiveConstructor);
        }
    }
}(angular, jQuery));