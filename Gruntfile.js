module.exports = function(grunt) {
    "use strict";


      // Time how long tasks take. Can help when optimizing build times
      require('time-grunt')(grunt);

      // Load grunt tasks automatically
      require('load-grunt-tasks')(grunt);



    var ENV = grunt.option('env') || 'development'; // pass --env=production to compile minified css

    // Project configuration.
    grunt.initConfig({
        pkg: grunt.file.readJSON('package.json'),
        config: {
            //target被注释是因为现有项目已只有html-transparent，不需要指定操作的对象。
            //target: grunt.option('target') || 'html-transparent', // pass --target=html-transparent. possible targets: html-transparent, html-white
            srcFolder: 'src',
            distFolder: 'dist'
        },


        // compiles handlebars template to html
        'handlebarslayouts': {
            templates: {
                files: {
                    '<%= config.distFolder %>/*.html': '<%= config.srcFolder %>/*.hbs'
                },
                options: {
                    partials: [
                        '<%= config.srcFolder %>/partials/*.hbs'
                    ],
                    context: {
                        productionEnv: ENV == 'production',
                        title: '<%= pkg.description %>',
                        preHtml: '<!-- <%= pkg.name %> - v<%= pkg.version %> - ' +
                            '<%= grunt.template.today("yyyy-mm-dd") %> -->\n',
                        /**
                         * Returns {clazz} if {val2} is present inside {val1} and if inverse is false or unset
                         * Returns {clazz} if {val2} is NOT present inside {val1} and if inverse is true
                         */
                        conditionClass: function(clazz, val1, val2, inverse){
                            // whether to inverse operation. returns 'class' if there is no val1 inside val2
                            inverse = typeof inverse == "undefined" ? false : inverse;
                            return val2.split(' ').indexOf(val1) == -1 ^ inverse ? '' : clazz;
                        }
                    }
                }
            }
        },

        // compile sass to css
        compass: {
            dist: {
                options: {
                    config: 'config.rb',
                    sassDir: '<%= config.srcFolder %>/sass',
                    cssDir: '<%= config.distFolder %>/css',
                    environment: ENV
                }
            }
        },

        // rename minified scss files
        rename: {
            css: {
                src: '<%= config.distFolder %>/css/application.css',
                dest: '<%= config.distFolder %>/css/application.min.css'
            }
        },

        clean: {
            images: ['<%= config.distFolder %>/img'],
            scripts: ['<%= config.distFolder %>/js'],
            server: ['<%= config.distFolder %>/server'],
            libs: ['<%= config.distFolder %>/lib'],
            all: ['<%= config.distFolder %>']
        },

        // copy images & other static assets
        copy: {
            images: {
                expand: true,
                cwd: '<%= config.srcFolder %>/',
                src: 'img/**',
                dest: '<%= config.distFolder %>/'
            },
            scripts: {
                expand: true,
                cwd: '<%= config.srcFolder %>/',
                src: 'js/**',
                dest: '<%= config.distFolder %>/'
            },
            json: {
                expand: true,
                cwd: '<%= config.srcFolder %>/',
                src: 'js/*.json',
                dest: '<%= config.distFolder %>/'
            },
            server: {
                expand: true,
                cwd: '<%= config.srcFolder %>/',
                src: 'server/**',
                dest: '<%= config.distFolder %>/'
            },
            libs: {
                expand: true,
                cwd: 'bower_components',
                src: ['**/*.js', '**/*.png'],
                dest: '<%= config.distFolder %>/lib/',

                //copy js files from bower_packages only if they are not sources
                filter: function(filepath){
                    return filepath.indexOf('src') == -1;
                }
            },
            fontGoogle: {
                expand: true,
                cwd: '<%= config.srcFolder %>/sass/',
                src: 'fonts/**',
                dest: '<%= config.distFolder %>/css/'
            },
            fontBootstrap: {
                expand: true,
                cwd: 'bower_components/bootstrap-sass-official/assets',
                src: 'fonts/**',
                dest: '<%= config.distFolder %>/css/'
            },
            fontAwesome: {
                expand: true,
                cwd: 'bower_components/font-awesome/fonts',
                src: '**/*.*',
                dest: '<%= config.distFolder %>/css/fonts/font-awesome'
            }
        },

        uglify: {
            options: {
                banner: '/*! <%= pkg.name %> - v<%= pkg.version %> - ' +
                    '<%= grunt.template.today("yyyy-mm-dd") %> */'
            },
            build: {
                files: [{
                    expand: true,
                    cwd: '<%= config.srcFolder %>',
                    src: 'js/**/*.js',
                    dest: '<%= config.distFolder %>/'
                }]
            }
        },

        //监听files里声明的文件，对task里的文件进行相应操作。
        watch: {
            templates: {
                files: ['<%= config.srcFolder %>/*.hbs', '<%= config.srcFolder %>/partials/*.hbs'],
                tasks: ['handlebarslayouts']
            },
            sass: {
                files: ['<%= config.srcFolder %>/sass/**.scss', '<%= config.srcFolder %>/sass/**.sass'],
                tasks: ['dist-compass']
            },
            scripts: {
                files: ['<%= config.srcFolder %>/js/**.js', '<%= config.srcFolder %>/js/**.json'],
                tasks: ['dist-scripts']
            },
            images: {
                files: ['<%= config.srcFolder %>/img/**'],
                tasks: ['clean:images', 'copy:images']
            },
            server: {
                files: ['<%= config.srcFolder %>/server/**'],
                tasks: ['clean:server', 'copy:server']
            },
            libs: {
                files: ['bower_components/**'],
                tasks: ['dist-libs']
            },
            style:{
              files:['less/{,*/}*.less'],
              tasks:['less:style']
            },
            fontAwesome:{
              files:['font-awesome/less/{,*/}*.less'],
              tasks:['less:fontAwesome']
            }

        },

        connect:{
              options:{
                port: 9000,
                open: true,
                livereload: 35729,
                hostname: 'localhost'
              },
              livereload: {
                options: {
                  middleware: function(connect) {
                    return [
                      connect.static('.tmp'),
                      connect().use('/bower_components', connect.static('./bower_components')),
                      connect.static('dist')
                    ];
                  }
                }
              },
              test: {
                options: {
                  open: false,
                  port: 9000,
                  middleware: function(connect) {
                    return [
                      connect.static('.tmp'),
                      connect.static('test'),
                      connect().use('/bower_components', connect.static('./bower_components')),
                      connect.static('html-transparent/dist')
                    ];
                  }
                }
              },
              dist: {
                options: {
                  base: '<%= config.dist %>',
                  livereload: false
                }
              }
            },

        concurrent: {
              server: [
                'compass',
                'copy:server'
              ],
              test: [
                'copy'
              ],
              dist: [
                'compass',
                'copy',
                'imagemin',
                'svgmin'
              ]
            }
    });


    grunt.registerTask('serve', 'start the server and preview your app, --allow-remote for remote access', function (target) {
      if (grunt.option('allow-remote')) {
        grunt.config.set('connect.options.hostname', '0.0.0.0');
      }
      if (target === 'dist') {
        return grunt.task.run(['build', 'connect:dist:keepalive']);
       }

    grunt.task.run([
        'clean:server',
        'concurrent:server',
        'connect:livereload',
        'watch'
      ]);
    });

    
    //有了load-grunt-tasks之后，就不需要一一加载需要的npm包了。
    // grunt.loadNpmTasks('grunt-contrib-compass');
    // grunt.loadNpmTasks('grunt-contrib-clean');
    // grunt.loadNpmTasks('grunt-contrib-copy');
    // grunt.loadNpmTasks('grunt-contrib-rename');
    // grunt.loadNpmTasks('grunt-contrib-watch');
    // grunt.loadNpmTasks('grunt-contrib-uglify');
    // grunt.loadNpmTasks("grunt-handlebars-layouts");

    // minify scripts for production environment or just copy for development
    grunt.registerTask('dist-scripts', ['clean:scripts', 'copy:json', ENV == 'production' ? 'uglify' : 'copy:scripts']);

    var distCompass = ['compass:dist', 'copy:fontAwesome', 'copy:fontGoogle', 'copy:fontBootstrap'];
    if (ENV == 'production') {
        distCompass.push('rename:css');  //rename to application.min if env is production
    }
    grunt.registerTask('dist-compass', distCompass);

    // assemble html files
    grunt.registerTask('dist-templates', ['handlebarslayouts']);

    // copy images & server blocks
    grunt.registerTask('dist-misc', ['clean:images', 'copy:images', 'clean:server', 'copy:server']);

    // copy libs
    grunt.registerTask('dist-libs', ['clean:libs', 'copy:libs']);

    grunt.registerTask('dist-watch', ['watch']);

    // Default task(s)
    grunt.registerTask('default', ['clean:all', 'dist-compass', 'dist-templates', 'dist-scripts', 'dist-libs', 'dist-misc']);

};