/*jshint node:true*/
module.exports = function (grunt) {
  'use strict';

  var config = {
    src: 'src/',
    dest: 'dist/',
    test: 'test/',
    site: 'site/',
    lib: 'node_modules/'
  };

  grunt.loadNpmTasks('grunt-contrib-connect');
  grunt.loadNpmTasks('grunt-contrib-jshint');
  grunt.loadNpmTasks('grunt-contrib-uglify');
  grunt.loadNpmTasks('grunt-contrib-watch');
  grunt.loadNpmTasks('grunt-neuter');

  grunt.initConfig({
    jshint: {
      src: {
        options: { jshintrc: true },
        src: [config.src + '**/*.js']
      },
      test: {
        options: { jshintrc: true },
        src: [config.test + '**/*.js', '!' + config.test + 'test-bundle.js']
      }
    },

    neuter: {
      src: {
        options: {
          basePath: config.src,
          template: '{%= src %}'
        },
        src: config.src + 'main.js',
        dest: config.dest + 'particulate.js'
      },
      test: {
        options: {
          basePath: config.test
        },
        src: config.test + 'test.js',
        dest: config.test + 'test-bundle.js'
      },
      site: {
        options: {
          basePath: config.site,
        },
        src: config.site + 'js/main.js',
        dest: config.site + 'main-bundle.js'
      }
    },

    uglify: {
      build: {
        src: config.dest + 'particulate.js',
        dest: config.dest + 'particulate.min.js'
      },
      test: {
        src: config.test + 'test-bundle.js',
        dest: config.test + 'test-bundle.js'
      },
      site: {
        src: config.site + 'main-bundle.js',
        dest: config.site + 'main-bundle.js'
      }
    },

    watch: {
      src: {
        files: [config.src + '**/*'],
        tasks: ['neuter:src']
      },
      test: {
        files: [config.test + '**/*', '!' + config.test + 'test-bundle.js'],
        tasks: ['neuter:test']
      },
      site: {
        files: [config.site + '**/*', '!' + config.site + '**/main-bundle.js'],
        tasks: ['neuter:site']
      }
    },

    connect: {
      server: {
        options: {
          port: 8000,
          hostname: '*',
          base: '',
          open: true
        }
      }
    }
  });

  grunt.registerTask('build', [
    'jshint',
    'neuter',
    'uglify'
  ]);

  grunt.registerTask('develop', function (port) {
    if (port) {
      grunt.config('connect.server.options.port', port);
    }

    grunt.task.run([
      'jshint',
      'neuter',
      'connect',
      'watch'
    ]);
  });

  grunt.registerTask('default', 'develop');
};
