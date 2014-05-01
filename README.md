#Ignite UI directives for AngularJS (Preview) 
Use the directives found in `igniteui-angular.js` to use [Ignite UI](http://igniteui.com) controls in [AngularJS](http://angularjs.com) pages. [Work with the running samples here](http://igniteui.github.io/igniteui-angular).

#Requirements

- [jQuery](http://www.jquery.com) v1.7 and later
- [AngularJS](http://www.angularjs.org) v1.0 and later
- [Ignite UI](http://www.igniteui.com) 13.1 and later

#Building
Build will produce an obfuscated and minified version of the `src/igniteui-angular.js` in the `dist/igniteui-angular.min.js`.  
Build uses [Grunt](http://gruntjs.com/), so you need [Node.js](http://nodejs.org/) installed on your machine.  
To build the project use the following steps:

1. Open a console in the folder where the igniteui-angular project is located
2. Run `npm install`
3. Run `grunt build`

#Getting Started

## Page setup

In the page markup include the Ignite UI AngularJS directives file found in `dist/igniteui-angular.min.js` along with the Ignite UI scripts:

	<script src="jquery.min.js"></script>
	<script src="jquery-ui.min.js"></script>
	<script src="angular.min.js"></script>

	<script src="infragistics.core.js"></script>
	<script src="infragistics.lob.js"></script>

	<script src="igniteui-angular.min.js"></script>
	
Reference the `igniteui-directives` in your AngularJS module:

	var sample_app = angular.module('igniteui-sample-app', ['igniteui-directives']);

## Initializing controls
Controls can be initialized in two ways: 

1. In markup - directly in an html page by using custom tags
2. In controller - a control placehodler is located in an html page, but its initialization options are located in the page controller

## In markup

### Custom tags
Each control implements a custom tag directive where the tag name is formed by splitting each capital letter in the control name with the `-` symbol (This naming convention follows the standard Angular normailzation process).

Examples:

igCombo -> `<ig-combo>`  
igGrid -> `<ig-grid>`  
igDataChart -> `<ig-data-chart>`  
igDialog -> `<ig-dialog>`  
igDateEditor -> `<ig-date-editor>`  
igEditor -> `<ig-editor>`  
igMaskEditor -> `<ig-mask-editor>`  
igNumericEditor -> `<ig-numeric-editor>`  
igPercentEditor -> `<ig-percent-editor>`  
igTextEditor -> `<ig-text-editor>`  
igDatePicker -> `<ig-date-picker>`  
igTree -> `<ig-tree>`  
igMap -> `<ig-map>`  
igUpload -> `<ig-upload>`  
igVideoPlayer -> `<ig-video-player>`


### Configuring control options
Simple type control options (string, number, bool) are configured as an attributes on the control tag. Naming convention follows the same logic as the tag name.

Examples:

igGrid.options.localSchemaTransform -> `<ig-grid local-schema-transform="true">`  
igCombo.options.caseSensitive -> `<ig-combo case-sensitive="true">`  

Complex type control options (arrays, objects) are configured as a child tags of the main control tag.

Example:

	<ig-grid>
		<features>
			<feature name="Filtering">
			</feature>
		</features>
	</ig-grid>

### Handling events
Binding to control events is done again with attributes. Event attribute name is prefixed with "event-" string followed by the event name splitted with `-` symbol. Attribute value corresponds to a function name in the scope.

Examples:

igGrid.events.dataBind -> `<ig-grid event-data-bind="dataBindHandler">`  
igCombo.events.textChanged -> `<ig-combo event-text-changed="textChangedHandler">`  
igDateEditor.events.keypress -> `<ig-date-editor event-keypress="keypressHandler">`  

## In controller
Each control also implements a custom attribute directive where the attribute name is formed by splitting each capital letter in the control name with the `-` symbol (This naming convention follows the standard Angular normailzation process) and the attribute value corresponds to the scope object holding the control options.

Examples:

igCombo -> `<div id="combo" data-ig-combo="combo_options"></div>`  
igGrid -> `<table id="grid" data-ig-grid="grid_options"></table>`  
igDataChart -> `<div id="chart" data-ig-data-chart="data_chart_options"></div>`  
igDialog -> `<div id="dialog" data-ig-dialog="dialog_options"></div>`  
igDateEditor -> `<input id="dialog" data-ig-date-editor="date_editor_options"></input>`  
igEditor -> `<input id="editor" data-ig-editor="editor_options"></input>`  
igMaskEditor -> `<input id="editor" data-ig-mask-editor="mask_editor_options"></input>`  
igNumericEditor -> `<input id="editor" data-ig-numeric-editor="numeric_editor_options"></input>`  
igPercentEditor -> `<input id="editor" data-ig-percent-editor="precent_editor_options"></input>`  
igTextEditor -> `<input id="editor" data-ig-text-editor="text_editor_options"></input>`  
igDatePicker -> `<input id="editor" data-ig-date-picker="date_picker_options"></input>`  
igTree -> `<ul id="tree" data-ig-tree="tree_options"></ul>`  
igMap -> `<div id="map" data-ig-map="map_options"></div>`  
igUpload -> `<div id="upload" data-ig-upload="upload_options"></div>`  
igVideoPlayer -> `<div id="video" data-ig-video-player="video_options"></div>`


## Two-way data binding
The following controls currently support two-way data binding:

1. igGrid
2. igCombo
3. igEditors
4. igTree