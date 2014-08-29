'use strict';

module.exports = function(grunt){
  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),
    // ---------------------------------------------------------------------- //
    watch: {
      code: {
        files: '<%= jshint.all %>',
        tasks: ['jshint:all', 'jscs']
      }
    },
    // ---------------------------------------------------------------------- //
    jshint: {
      options: {jshintrc: '.jshintrc', reporter: require('jshint-stylish')},
      all: ['Gruntfile.js', 'app/**/*.js', 'test/**/*.js', '!app/static/js/vendor/**/*.js', '!app/static/bootstrap/**/*.js']
    },
    // ---------------------------------------------------------------------- //
    jscs: {
      src: '<%= jshint.all %>',
      options: {
        config: '.jscsrc',
        reporter: 'console'
      }
    }
    // ---------------------------------------------------------------------- //
  });

  grunt.loadNpmTasks('grunt-jscs');
  grunt.loadNpmTasks('grunt-contrib-jshint');
  grunt.loadNpmTasks('grunt-contrib-watch');

  grunt.registerTask('build', ['jshint:all', 'jscs']);
  grunt.registerTask('default', ['build', 'watch']);
};

