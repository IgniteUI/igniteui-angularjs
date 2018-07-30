var cfg = {

	// https://www.protractortest.org/#/server-setup#connecting-directly-to-browser-drivers 
	directConnect: true,

	allScriptsTimeout: 11000,
	
	plugins : [{
		path: "../node_modules/protractor-istanbul-plugin",
		outputPath: "coverage/protractor"
    }],
	
	specs: [
		"e2e/*.js"
	],
	//chromeOnly: true, //https://github.com/angular/protractor/issues/187
	capabilities: { 
		"browserName": "chrome"
	},

	baseUrl: "http://localhost:8000/test/app/",

	framework: "jasmine",

	jasmineNodeOpts: {
		defaultTimeoutInterval: 30000
	}
};

if (process.env.TRAVIS) {
	cfg.capabilities.chromeOptions = {
			"args": ["--no-sandbox"]
		};
}

exports.config = cfg;
