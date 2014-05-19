module.exports = function(config){
	config.set({

		basePath : '../',

		files : [
		'http://code.jquery.com/jquery-1.10.2.min.js',
			'http://ajax.googleapis.com/ajax/libs/jqueryui/1.10.4/jquery-ui.min.js',
			'bower_components/angular/angular.js',
			'bower_components/angular-route/angular-route.js',
			'bower_components/angular-mocks/angular-mocks.js',
		'http://cdn-na.infragistics.com/jquery/20132/latest/js/infragistics.core.js',
			'http://cdn-na.infragistics.com/jquery/20132/latest/js/infragistics.dv.js',
			'http://cdn-na.infragistics.com/jquery/20132/latest/js/infragistics.lob.js',
			'src/igniteui-angular.js',
		'test/app/js/my-app.js',
			'test/unit/**/*.js'
		],

		autoWatch : true,

		frameworks: ['jasmine'],

		browsers : ['Chrome'],

		plugins : [
						'karma-chrome-launcher',
						'karma-firefox-launcher',
						'karma-jasmine',
						'karma-junit-reporter'
						],

		junitReporter : {
			outputFile: 'test_out/unit.xml',
			suite: 'unit'
		}

	});
};
