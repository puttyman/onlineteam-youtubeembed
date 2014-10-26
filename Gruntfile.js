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
        src: 'gh-pages/js/<%= pkg.name %>.js',
        dest: 'dist/<%= pkg.name %>.min.js'
      }
    },

    copy: {
      build: {
        files: [
          // includes files within path
          {src: ['<%= uglify.dist.src %>'], dest: 'dist/<%= pkg.name %>.js'},
          {src: ['gh-pages/css/youtube-embedr.css'], dest: 'dist/youtube-embedr.css'},
        ]
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
        files: 'gh-pages/*.html',
      },

      css: {
        files: 'gh-pages/css/**/*.css'
      },

      js: {
        files: 'gh-pages/js/**/*.js',
        tasks: ['jshint']
      } 
    },

    connect: {
      options: {
        base: 'gh-pages'
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
          paths: ['app/less', 'gh-pages/css']
        },
        files: {
          'gh-pages/css/youtube-embedr.css': 'app/less/youtube-embedr.less'
        }
      },

      build: {
        options: {
          paths: ['app/less', 'gh-pages/css'],
          cleancss: true
        },
        files: {
          'dist/youtube-embedr.min.css': 'app/less/youtube-embedr.less'
        }
      }
    },

    jshint: {
      options: {
        jshintrc: '.jshintrc'
      },
      js: {
        src: ['gh-pages/js/*.js']
      }
    },

    karma: {
      options: {
        configFile: 'karma.conf.js'
      },
      test: {
        singleRun: true
      }
    }
  });

  // These plugins provide necessary tasks.
  grunt.loadNpmTasks('grunt-contrib-clean');
  grunt.loadNpmTasks('grunt-contrib-copy');
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
    'less:compile',
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
    'less:build',
    'copy:build',
    'uglify'
  ]);

};
