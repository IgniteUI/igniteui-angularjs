module.exports = function (grunt) {

    grunt.initConfig({
        pkg: grunt.file.readJSON('package.json'),
        generator: {
            'default': {
                paths: {
                    source: './src',
                    destination: '../samples',
                    template: './template/template.html'
                }
            }
        },
        watch: {
            scripts: {
                files: ['./src/**','./template/**'],
                tasks: ['generator:default']
            },
        }
    });


    grunt.loadNpmTasks('grunt-contrib-watch');

    require('load-grunt-tasks')(grunt);

    grunt.loadTasks('./grunt/tasks');

    grunt.registerTask('default', ['generator:default']);

};