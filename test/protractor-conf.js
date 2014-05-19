exports.config = {
	
	allScriptsTimeout: 11000,
	
	specs: [
		'e2e/*.js'
	],

	capabilities: {
		'browserName': 'chrome'
	},

	baseUrl: 'http://localhost:8000/test/app/',

	framework: 'jasmine',

	jasmineNodeOpts: {
		defaultTimeoutInterval: 30000
	}
};
