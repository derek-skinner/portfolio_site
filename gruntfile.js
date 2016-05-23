//Initiate the gruntfile and tell it what folders to watch
module.exports = function (grunt) {

  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),

    watch: {
      content: {
        files: '*.html'
      }, //this live reloads html also

      images: {
        files: ['img/src/*.{png,jpg,gif}'],
        tasks: ['newer:imagemin']
      }, // watch images added to src

      deleting: {
        files: ['img/src/*.{png,jpg,gif}'],
        tasks: ['delete_sync']
      }, // end of delete sync

      scripts: {
        files: ['js/libs/*.js', 'js/custom/*.js'],
        tasks: ['concat', 'uglify'],
        options: {
          spawn: false,
        },
      }, //end of watch scripts

      css: {
        files: ['sass/**/*.scss'],
        tasks: ['sass', 'autoprefixer'],
        options: {
          spawn: false,
        }
      }, //end of sass watch

    }, //end of watch

    /* 
===================================================================

		 Tasks
     
===================================================================
		 */

    delete_sync: {
      dist: {
        cwd: 'img/dist',
        src: ['**'],
        syncWith: 'img/src'
      }
    }, // end of delete sync

    imagemin: {
      dynamic: {
        files: [{
          expand: true, // Enable dynamic expansion
          cwd: 'img/src/', // source images (not compressed)
          src: ['**/*.{png,jpg,gif}'], // Actual patterns to match
          dest: 'img/dist/' // Destination of compressed files
    }]
      }
    }, //end imagemin

    concat: {
      dist: {
        src: ['js/*.js'],
        dest: 'js/build/production.js'
      }
    }, //end concat

    uglify: {
      dist: {
        src: 'js/build/production.js',
        dest: 'js/build/production.min.js'
      }
    }, //end uglify

    sass: {
      dist: {
        options: {
          style: 'compressed', //no need for config.rb
          compass: 'true', //no need to @import compass
          // require : 'sassy-buttons' // plugins if needed!
        },
        files: {
          'css/main.css': 'sass/main.scss'
        }
      }
    }, //end of sass

    autoprefixer: {
      options: {
        browsers: ['> 5%', 'last 2 version', 'ie 8', 'ie 9']
      },

      dist: {
        files: {
          'css/main.css': 'css/main.css'
        }

      }
    }, //end of autoprefixer

    browserSync: {
      dev: {
        bsFiles: {
          src: ['css/*.css', 'img/*.*', 'js/build/production.min.js', '*.html']
        },
        options: {
          server: {
            baseDir: "./"

          },
          watchTask: true // < VERY important
        }
      }
    },

    modernizr: {

      dist: {
        devFile: 'bower_components/modernizr',
        outputFile: 'js/build/custom-modernizr.js',

        // Based on default settings on http://modernizr.com/download/
        "extra": {
          "shiv": true,
          "printshiv": false,
          "load": true,
          "mq": false,
          "cssclasses": true
        },

        // Based on default settings on http://modernizr.com/download/
        "extensibility": {
          "addtest": false,
          "prefixed": false,
          "teststyles": false,
          "testprops": false,
          "testallprops": false,
          "hasevents": false,
          "prefixes": false,
          "domprefixes": false,
          "cssclassprefix": ""
        },

        // By default, source is uglified before saving
        "uglify": true,

        // Define any tests you want to implicitly include.
        "tests": [],

        // By default, this task will crawl your project for references to Modernizr tests.
        // Set to false to disable.
        "parseFiles": true,

        // When parseFiles = true, this task will crawl all *.js, *.css, *.scss and *.sass files,
        // except files that are in node_modules/.
        // You can override this by defining a "files" array below.
        // "files" : {
        // "src": []
        // },

        // This handler will be passed an array of all the test names passed to the Modernizr API, and will run after the API call has returned
        // "handler": function (tests) {},

        // When parseFiles = true, matchCommunityTests = true will attempt to
        // match user-contributed tests.
        "matchCommunityTests": false,

        // Have custom Modernizr tests? Add paths to their location here.
        "customTests": []
      }
    }
  });

  // load npm tasks
  grunt.loadNpmTasks('grunt-contrib-watch'); // Watches files for changes
  grunt.loadNpmTasks('grunt-browser-sync'); // Serves assets to browser & syncs 
  grunt.loadNpmTasks('grunt-contrib-sass'); // Compiles Sass files to css
  grunt.loadNpmTasks('grunt-contrib-concat'); // Combines files
  grunt.loadNpmTasks('grunt-contrib-uglify'); // Minifies files
  grunt.loadNpmTasks('grunt-autoprefixer'); // Adds browser prefixes to css
  grunt.loadNpmTasks('grunt-contrib-imagemin'); // Optimizes images
  grunt.loadNpmTasks('grunt-newer'); // Detects updated files
  grunt.loadNpmTasks('grunt-modernizr'); //removes unused modernizr stuff
  grunt.loadNpmTasks('grunt-delete-sync');

  // define default task
  grunt.registerTask('default', ["browserSync", "watch"]);
  grunt.registerTask('optimize', ["concat:dist", "uglify", "imagemin:dynamic", "modernizr"]);
};