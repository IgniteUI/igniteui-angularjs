module.exports = function(config){
	var cfg = {

		basePath : "../",

		files : [
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

		autoWatch : true,

		frameworks: ["jasmine"],

		plugins : [ "karma-chrome-launcher", "karma-firefox-launcher", "karma-jasmine", "karma-junit-reporter", "karma-coverage" ],
		
		reporters: ["junit", "coverage"],
		
		junitReporter : {
			outputDir: "./test_out",
			outputFile: "unit.xml",
			suite: "unit"
		},
		
		preprocessors: {
		  "src/*.js": ["coverage"]
		},
		
		coverageReporter: {
			reporters:[
				{ type: "lcov", dir:"coverage/karma/" },
				{ type: "json", dir:"coverage/karma/", file: "coverage.json" },
			],
		},
		
		browsers : ["Chrome"],
		
		customLaunchers: {
            Chrome_travis_ci: {
                base: "Chrome",
                flags: ["--no-sandbox"]
            }
        }
	};
	
	if (process.env.TRAVIS) {
		cfg.browsers = ["Chrome_travis_ci"];
    }

    config.set(cfg);
};
