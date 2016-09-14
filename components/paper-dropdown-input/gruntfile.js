module.exports = function(grunt) {

  grunt.initConfig({
    /*
     * Execute any @import directives in source files
     * and copy to _build
     */
    import: {
      options: {
        indent: true
      },
      sass: {
        files: [{
          expand: true,
          src: "src/sass/*.scss",
          rename: function(dest, src) {
            return src.replace('src/sass', '_build/sass');
          }
        }]
      },
      css: {
        files: [{
          expand: true,
          src: "src/css/*.css",
          rename: function(dest, src) {
            return src.replace('src/css', '_build/css');
          }
        }]
      },
      babel: {
        files: [{
          expand: true,
          src: "src/babel/*.js",
          rename: function(dest, src) {
            return src.replace('src/babel', '_build/babel');
          }
        }]
      },
      javascript: {
        files: [{
          expand: true,
          src: "src/javascript/*.js",
          rename: function(dest, src) {
            return src.replace('src/javascript', '_build/javascript');
          }
        }]
      },
      html: {
        files: [{
          expand: true,
          src: "src/html/*.html",
          rename: function(dest, src) {
            return src.replace('src/html', '_build/html');
          }
        }]
      },
    },

    /*
     * Compile SASS code to CSS
     */
    sass: {
      element: {
        options: {
          sourcemap: 'none',
          outputStyle: 'expanded',
          noCache: true
        },
        files: [{
          expand: true,
          cwd: '',
          src: "_build/sass/*.scss",
          dest: '',
          rename: function(dest, src) {
            return src.replace('_build/sass', '_build/css');
          },
          ext: ".css"
        }]
      }
    },
    /*
     * Add css prefixes for compatibility with
     * - last 2 versions of any browser
     * - latest firefox ESR release
     * - whatever browser has >1% market share
     */
    postcss: {
      options: {
        map: false,
        processors: [
          require('autoprefixer')({
            browsers: ['last 2 versions', 'Firefox ESR', '> 1%']
          })
        ]
      },
      elements: {
        src: "_build/css/*.css"
      }
    },
    /*
     * Transform ES6 to ES5 with Babel
     */
    babel: {
      options: {
        sourceMap: false,
        // custom profile to keep babel compatibile with Polymer behaviors
        // presets: ['es2015']
        plugins: [
          require("babel-plugin-transform-es2015-template-literals"),
          require("babel-plugin-transform-es2015-literals"),
          // require("babel-plugin-transform-es2015-function-name"),
          require("babel-plugin-transform-es2015-arrow-functions"),
          require("babel-plugin-transform-es2015-block-scoped-functions"),
          require("babel-plugin-transform-es2015-classes"),
          require("babel-plugin-transform-es2015-object-super"),
          require("babel-plugin-transform-es2015-shorthand-properties"),
          require("babel-plugin-transform-es2015-duplicate-keys"),
          require("babel-plugin-transform-es2015-computed-properties"),
          require("babel-plugin-transform-es2015-for-of"),
          require("babel-plugin-transform-es2015-sticky-regex"),
          require("babel-plugin-transform-es2015-unicode-regex"),
          require("babel-plugin-check-es2015-constants"),
          require("babel-plugin-transform-es2015-spread"),
          require("babel-plugin-transform-es2015-parameters"),
          require("babel-plugin-transform-es2015-destructuring"),
          require("babel-plugin-transform-es2015-block-scoping"),
          require("babel-plugin-transform-es2015-typeof-symbol"),
          require("babel-plugin-transform-es2015-modules-commonjs"), [require("babel-plugin-transform-regenerator"), {
            async: false,
            asyncGenerators: false
          }],
        ]
      },
      elements: {
        files: [{
          expand: true,
          src: "_build/babel/*.js",
          rename: function(dest, src) {
            return src.replace('_build/babel', '_build/javascript');
          },
        }]
      }
    },

    /*
     * Process JavaScript (code optimizations)
     */
    uglify: {
      options: {
        preserveComments: 'some',
        srewIE8: true,
        mangleProperties: false,
        mangle: false,
        sourceMap: false,
        // compress: false,
        beautify: {
          indent_start: 0,
          indent_level: 2,
          quote_keys: false,
          space_colon: true,
          ascii_only: false,
          unescape_regexps: false,
          inline_script: true,
          width: 80,
          max_line_len: 32000,
          beautify: true,
          source_map: null,
          bracketize: false,
          semicolons: true,
          comments: false,
          shebang: true,
          preserve_line: false,
          screw_ie8: false,
          preamble: null,
          quote_style: 0
        }
      },
      element: {
        files: [{
          expand: true,
          src: "_build/javascript/*.js"
        }]
      }
    },

    /*
     * inline CSS and JavaScript into the HTML, final output
     */
    inline: {
      html: {
        files: [{
          expand: true,
          src: "_build/html/*.html",
          rename: function(dest, src) {
            return src.replace('_build/html', '.');
          }
        }]
      }
    },

    clean: {
      elements: {
        options: {
          'no-write': false
        },
        src: "_build"
      }
    },

    'wct-test': {
      local: {
        options: {
          remote: false,
          suites: "test/index.html"
        }
      }
    }
  });

  require("load-grunt-tasks")(grunt);
  grunt.loadNpmTasks('grunt-contrib-uglify');
  grunt.loadNpmTasks('grunt-postcss');
  grunt.loadNpmTasks('grunt-contrib-clean');
  grunt.loadNpmTasks('grunt-sass');
  grunt.loadNpmTasks('grunt-inline');
  grunt.loadNpmTasks('web-component-tester');

  grunt.registerTask('default', ['dev', 'clean']);
  grunt.registerTask('dev', ['import', 'sass', 'postcss', 'babel', 'uglify', 'inline']);
  grunt.registerTask('test', ['dev', 'wct-test']);
};
