'use strict';

module.exports = function(grunt) {

  // Project configuration.
  grunt.initConfig({
    // Metadata.
    pkg: grunt.file.readJSON('youtube-embedr.json'),
    
    banner: '/*! <%= pkg.title || pkg.name %> - v<%= pkg.version %> - ' +
      '<%= grunt.template.today("yyyy-mm-dd") %> */\n\n',
    
    clean: {
      files: ['dist']
    },

    uglify: {
      options: {
        banner: '<%= banner %>',
        mangle: true,
        wrap: true
      },
      dist: {
        src: 'public/js/<%= pkg.name %>.js',
        dest: 'dist/<%= pkg.name %>.min.js'
      }
    },
    
    watch: {
      options: {
        livereload: true
      },

      less: {
        files: ['app/less/**/*.less'],
        tasks: 'less'
      },

      html: {
        files: 'public/*.html',
      },

      css: {
        files: 'public/css/**/*.css'
      },

      js: {
        files: 'public/js/**/*.js',
        tasks: ['jshint']
      } 
    },

    connect: {
      options: {
        base: 'public'
      },
      serve: {
        options: {
          hostname: '0.0.0.0',
          port: 8484,
          open: {
            target: 'http://localhost:8484'
          }
        }
      }
    },

    less: {
      compile: {
        options: {
          paths: ['app/less', 'public/css']
        },
        files: {
          'public/css/style.css': 'app/less/style.less',
          'public/css/youtube-embedr.css': 'app/less/youtube-embedr.less'
        }
      }
    },

    jshint: {
      options: {
        jshintrc: '.jshintrc'
      },
      js: {
        src: ['public/js/*.js']
      }
    },

    karma: {
      options: {
        configFile: 'karma.conf.js'
      },
      serve: {
        singleRun: false
      },
      test: {
        singleRun: true
      }
    }
  });

  // These plugins provide necessary tasks.
  grunt.loadNpmTasks('grunt-contrib-clean');
  grunt.loadNpmTasks('grunt-contrib-concat');
  grunt.loadNpmTasks('grunt-contrib-uglify');
  grunt.loadNpmTasks('grunt-contrib-jshint');
  grunt.loadNpmTasks('grunt-contrib-watch');
  grunt.loadNpmTasks('grunt-contrib-connect');
  grunt.loadNpmTasks('grunt-contrib-jade');
  grunt.loadNpmTasks('grunt-contrib-less');
  grunt.loadNpmTasks('grunt-karma');

  // Serve task, for running locally
  grunt.registerTask('serve', [
    'jshint',
    'less',
    'connect:serve',
    'watch'
  ]);

  // Test task, for running the tests
  grunt.registerTask('test', [
    'jshint',
    'karma:test'
  ]);

  // Build task, builds production ready code
  grunt.registerTask('build', [
    'jshint',
    'karma:test',
    'clean',
    'uglify'
  ]);

};
