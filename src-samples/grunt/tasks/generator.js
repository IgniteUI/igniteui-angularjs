module.exports = function (grunt) {

    'use strict';

    grunt.registerMultiTask('generator', 'Generates samples with common layout', function () {
        var done = this.async();
        var generator = require('../lib/generator.js');
        var config = this.data;

        console.log(config.paths.source);

        generator.generate(config, function (stats) {
            grunt.log.write(stats.message.yellow)
            done();
        });
    });
};