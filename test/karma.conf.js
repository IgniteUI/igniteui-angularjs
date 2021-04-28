module.exports = function (config) {
	config.set({

		basePath: "../",

		files: [
			"http://code.jquery.com/jquery-1.10.2.min.js",
			"http://ajax.googleapis.com/ajax/libs/jqueryui/1.10.4/jquery-ui.min.js",
			"bower_components/angular/angular.js",
			"bower_components/angular-route/angular-route.js",
			"bower_components/angular-mocks/angular-mocks.js",
			"https://cdn-na.infragistics.com/igniteui/latest/js/infragistics.core.js",
			"https://cdn-na.infragistics.com/igniteui/latest/js/infragistics.dv.js",
			"https://cdn-na.infragistics.com/igniteui/latest/js/infragistics.lob.js",
			"src/igniteui-angularjs.js",
			"test/app/js/my-app.js",
			"test/unit/**/*.js"
		],

		crossOriginAttribute: false,

		autoWatch: true,

		frameworks: ["jasmine"],

		plugins: [
			require('karma-jasmine'),
			require('karma-coverage'),
			require('karma-chrome-launcher'),
			require('karma-jasmine-html-reporter'),
			require('karma-junit-reporter')
		],

		reporters: ["junit", "coverage"],

		junitReporter: {
			outputDir: "./test_out",
			outputFile: "unit.xml",
			suite: "unit"
		},

		preprocessors: {
			'src/*.js': ['coverage']
		},

		coverageReporter: {
			reporters: [
				{ type: "lcov", dir: "coverage/karma/" },
				{ type: "json", dir: "coverage/karma/", file: "coverage.json" },
			],
		},

		browsers: ["ChromeHeadless"]
	});
};
