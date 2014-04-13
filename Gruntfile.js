'use strict';

module.exports = function(grunt) {

  // Project configuration.
  grunt.initConfig({
    

    // Metadata.
    pkg: grunt.file.readJSON('youtube-embedr.json'),
    
    banner: '/*! <%= pkg.title || pkg.name %> - v<%= pkg.version %> - ' +
      '<%= grunt.template.today("yyyy-mm-dd") %>\n',
      //'<%= pkg.homepage ? "* " + pkg.homepage + "\\n" : "" %>' +
      //'* Copyright (c) <%= grunt.template.today("yyyy") %> <%= pkg.author.name %>;' +
      //' Licensed <%= _.pluck(pkg.licenses, "type").join(", ") %> */\n',
    



    // Task configuration.
    clean: {
      files: ['dist']
    },


    // Join the js files
    concat: {
      options: {
        banner: '<%= banner %>',
        stripBanners: true
      },
      dist: {
        src: ['src/<%= pkg.name %>.js'],
        dest: 'dist/<%= pkg.name %>.js'
      }
    },



    // Minify and wrap this sucker
    uglify: {
      options: {
        banner: '<%= banner %>',
        mangle: true,
        wrap: true
      },
      dist: {
        src: '<%= concat.dist.dest %>',
        dest: 'dist/<%= pkg.name %>.min.js'
      }
    },
    



    // Watch
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



    // Connect Server
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
      },
      test: {
        options: {
          port: 8485
        }
      }
    },




    // Less for the CSS
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


    // Validate our JS YO
    jshint: {
      options: {
        jshintrc: '.jshintrc'
      },
      js: {
        src: ['public/js/*.js']
      }
    },




    // Karma unit test
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
    },


    // Mocha for the e2e tests
    mochaTest: {
      test: {
        src: ['test/e2e/**/*.js']
      }
    },

    wait: {
      options: {
        delay: 1000,
        ready: false
      },
      pause: {      
          options: {
              before : function(options) {
                console.log("Waiting for selenium server...")
              },
              after : function(options) {
                var exec = require('child_process').exec,
                curl = exec('curl -v http://127.0.0.1:4444/wd/hub');

                // Post curl, check the status
                curl.on('close', function(code) {
                  options.ready = (code === 0) ? true : false;
                });

                if (!options.ready) {
                  return true;
                }
                console.log('Selenium server is ready');
              }
          }
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
  grunt.loadNpmTasks('grunt-mocha-test');
  grunt.loadNpmTasks('grunt-wait');

  var selenium;
  // Start Selenium
  grunt.registerTask('selenium-start', function() {
    var spawn = require('child_process').spawn;
    selenium = spawn('./node_modules/selenium-standalone/bin/start-selenium');
  })

  // Stop Selenium
  grunt.registerTask('selenium-stop', function() {
    selenium.kill();
  })

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
    'karma:test',
    'connect:test',
    'selenium-start',
    'wait',
    'mochaTest',
    'selenium-stop'
  ]);

  // Build task, builds production ready code
  grunt.registerTask('build', [
    'jshint',
    'karma:build',
    'clean',
    'concat',
    'uglify'
  ]);

};
