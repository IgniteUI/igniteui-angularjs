module.exports = function (grunt) {

	grunt.initConfig({
		pkg: grunt.file.readJSON("package.json"),
		uglify: {
			options: {
				banner: "/*! <%= pkg.name %> <%= grunt.template.today(\"dd-mm-yyyy\") %> */\n",
				report: "min"
			},
			build: {
				src: [ "src/igniteui-angularjs.js" ],
				dest: "dist/<%= pkg.name %>.min.js"
			}
		},

		watch: {
			scripts: {
				files: ["src/igniteui-angularjs.js"],
				tasks: ["jshint"],
				options: {
					spawn: false
				}
			}
		},

		jshint: {
			all: ["Gruntfile.js", "src/igniteui-angularjs.js"],
			options: {
				jshintrc: ".jshintrc",
				reporter: require("jshint-stylish")
			}
		},
		
		exec: {
			update_src_npm: {
				cmd: 'cp src/igniteui-angularjs.js dist/npm/'
			},
			
			update_min_npm: {
				cmd: 'cp dist/igniteui-angularjs.min.js dist/npm/'
			}
		}
	});

	// Event handling
	grunt.event.on("watch", function (action, filepath) {
		grunt.config(["jshint", "all"], filepath);
	});

	grunt.loadNpmTasks("grunt-contrib-uglify");
	grunt.loadNpmTasks("grunt-contrib-jshint");
	grunt.loadNpmTasks("grunt-contrib-watch");
	grunt.loadNpmTasks('grunt-exec');

	grunt.registerTask("build", ["uglify", "exec:update_src_npm", "exec:update_min_npm"]);

	grunt.registerTask("default", ["jshint"]);

};
