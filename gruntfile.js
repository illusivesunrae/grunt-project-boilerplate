module.exports = function(grunt) {
  var commonJS = require('rollup-plugin-commonjs');
  var babel = require('rollup-plugin-babel');

  // Project configuration.
  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),
    banner: `/*! 
  * <%= pkg.name %> - @version <%= pkg.version %>

  * Copyright (C) 2018 The Trustees of Indiana University
  * SPDX-License-Identifier: BSD-3-Clause
*/\n`,
    connect: {
      server: {
        options: {
          port: 3000,
          base: 'dist',
          livereload: true,
          keepalive: true
        }
      }
    },
    watch: {
      options: {
        atBegin: true
      },
      files: ['src/**', 'dist/index.html'],
      tasks: [ 'rollup', 'usebanner:dist', 'connect' ]
    },
    rollup: {
      options: {
        plugins: [
          commonJS(),
          babel({
            exclude: './node_modules/**',
            runtimeHelpers: true
          })
        ],
        format: 'iife',
        name: 'Component'
      },
      files: {
        'dest': 'dist/main.js',
        'src': 'src/index.js'
      }
    },
    uglify: {
      options: {
        banner: `<%= banner %>`
      },
      dist: {
        src: 'dist/main.js',
        dest: 'dist/main.min.js'
      }
    },
    usebanner: {
      dist: {
        options: {
          position: 'top',
          banner: `<%= banner %>`,
          linebreak: true
        },
        files: {
          src: [ 'dist/main.js' ]
        }
      }
    }
  });

  // Load the plugins.
  grunt.loadNpmTasks('grunt-contrib-watch');
  grunt.loadNpmTasks('grunt-contrib-connect');
  grunt.loadNpmTasks('grunt-rollup');
  grunt.loadNpmTasks('grunt-contrib-uglify');
  grunt.loadNpmTasks('grunt-banner');

  // Default task(s).
  grunt.registerTask('default', ['watch']);

  grunt.registerTask('build', ['rollup', 'uglify:dist', 'usebanner:dist']);

};