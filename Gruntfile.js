/*global module:false*/
module.exports = function(grunt) {

  // Project configuration.
  grunt.initConfig({
    // Metadata.
    pkg: grunt.file.readJSON('package.json'),
    banner: '/*! <%= pkg.title || pkg.name %> - v<%= pkg.version %> - ' +
      '<%= grunt.template.today("yyyy-mm-dd") %>\n' +
      '<%= pkg.homepage ? "* " + pkg.homepage + "\\n" : "" %>' +
      '* Copyright (c) <%= grunt.template.today("yyyy") %> <%= _.pluck(pkg.authors, "name").join(", ") %>;' +
      ' Licensed <%= _.pluck(pkg.licenses, "type").join(", ") %> */\n',
    // Task configuration.
    concat: {
      options: {
        banner: '<%= banner %>',
        stripBanners: true
      },
      dist: {
        src: ['.tmp/**/*.js'],
        dest: 'dist/<%= pkg.name %>.js'
      }
    },
    clean: {
      dist: '.tmp'
    },
    uglify: {
      options: {
        banner: '<%= banner %>'
      },
      dist: {
        src: '<%= concat.dist.dest %>',
        dest: 'dist/<%= pkg.name %>.min.js'
      }
    },
    ngtemplates: {
      main: {
        options: {
          module: '<%= pkg.name %>',
          prefix: '<%= pkg.name %>/',
          htmlmin: {
            collapseWhitespace: true,
            conservativeCollapse: true,
            collapseBooleanAttributes: true,
            removeCommentsFromCDATA: true,
            removeOptionalTags: true,
          }
        },
        cwd: 'src',
        src: ['**/*.html'],
        dest: '.tmp/templates.js'
      }
    },
    ngAnnotate: {
      dist: {
        files: [{
          expand: true,
          cwd: 'src',
          src: ['**/*.js'],
          dest: '.tmp'
        }]
      }
    },
    jshint: {
      options: {
        curly: true,
        eqeqeq: true,
        immed: true,
        latedef: true,
        newcap: true,
        noarg: true,
        sub: true,
        undef: true,
        unused: true,
        boss: true,
        eqnull: true,
        globals: {
          jQuery: true
        }
      },
      gruntfile: {
        src: 'Gruntfile.js'
      }
    },
      connect: {
          options: {
              port: 9900,
              // Change this to '0.0.0.0' to access the server from outside.
              hostname: 'localhost',
              livereload: 35711
          },
          dev: {
              options: {
                  middleware: function (connect) {
                      return [
                          connect.static('.tmp'),
                          connect().use(
                              '/bower_components',
                              connect.static('./bower_components')
                          ),
                          connect().use(
                              '/dist',
                              connect.static('./dist')
                          ),
                          connect.static('demo')
                      ];
                  }
              }
          }
      },
    watch: {
      dev: {
        files: ['src/**/*.html', 'src/**/*.js'],
        tasks: ['default'],
          options: {
              livereload: '<%= connect.options.livereload %>'
          },
      },
      gruntfile: {
        files: '<%= jshint.gruntfile.src %>',
        tasks: ['jshint:gruntfile']
      }
    }
  });

  // These plugins provide necessary tasks.
    grunt.loadNpmTasks('grunt-contrib-connect');
  grunt.loadNpmTasks('grunt-contrib-concat');
  grunt.loadNpmTasks('grunt-contrib-clean');
  grunt.loadNpmTasks('grunt-contrib-uglify');
  grunt.loadNpmTasks('grunt-contrib-jshint');
  grunt.loadNpmTasks('grunt-contrib-watch');
  grunt.loadNpmTasks('grunt-ng-annotate');
  grunt.loadNpmTasks('grunt-angular-templates');

    grunt.registerTask('serve', ['default', 'connect', 'watch']);

  // Default task.
  grunt.registerTask('default', ['jshint', 'clean', 'ngAnnotate', 'ngtemplates', 'concat', 'uglify']);

};
