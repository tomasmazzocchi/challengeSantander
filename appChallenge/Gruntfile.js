// Generated on 2014-07-31 using generator-angular 0.9.5
'use strict';

// # Globbing
// for performance reasons we're only matching one level down:
// 'test/spec/{,*/}*.js'
// use this if you want to recursively match all subfolders:
// 'test/spec/**/*.js'

module.exports = function (grunt) {

  // Load grunt tasks automatically  
  require('load-grunt-tasks')(grunt);

  // Time how long tasks take. Can help when optimizing build times
  require('time-grunt')(grunt);
  grunt.loadNpmTasks('grunt-ng-constant');
  grunt.loadNpmTasks('grunt-contrib-concat');
  grunt.loadNpmTasks('grunt-injector');  
  grunt.loadNpmTasks('grunt-war');  
  grunt.loadNpmTasks('grunt-contrib-coffee');
  grunt.loadNpmTasks('grunt-contrib-uglify');
  grunt.loadNpmTasks('grunt-filerev');
  grunt.loadNpmTasks('grunt-htmlhint-plus');
  grunt.loadNpmTasks('grunt-template'); 

  // Configurable paths for the application
  var appConfig = {
    app: require('./bower.json').appPath || 'app',
    dist: 'dist'
  };

  // Define the configuration for all the tasks
  grunt.initConfig({    
    // Project settings
    yeoman: appConfig,

    // Watches files for changes and runs tasks based on the changed files
    watch: {
      bower: {
        files: ['bower.json'],
        tasks: ['wiredep']
      },
      js: {
        files: ['<%= yeoman.app %>/scripts/**/{,*/}*.js','<%= yeoman.app %>/modules/*/config/*.js', '<%= yeoman.app %>/modules/*/controllers/*.js', '<%= yeoman.app %>/modules/*/services/*.js', '<%= yeoman.app %>/modules/*/api/*/*.js','<%= yeoman.app %>/modules/*/directives/*.js', '<%= yeoman.app %>/modules/*/filters/*.js','<%= yeoman.app %>/modules/webApi/*/filters/*.js'],
        tasks: ['newer:jshint:all'],
        options: {
          livereload: '<%= connect.options.livereload %>'
        }
      },
      jsTest: {
        files: ['test/spec/{,*/}*.js'],
        tasks: ['newer:jshint:test', 'karma']
      },
      styles: {
        files: ['<%= yeoman.app %>/sass/{,*/}*.scss'],
        tasks: ['sass', 'newer:copy:styles', 'autoprefixer']
      },
      gruntfile: {
        files: ['Gruntfile.js']
      },
      livereload: {
        options: {
          livereload: '<%= connect.options.livereload %>'
        },
        files: [
          '<%= yeoman.app %>/modules/{,*/}*/views/*.html',          
          '.tmp/styles/{,*/}*.css',
          '<%= yeoman.app %>/images/{,*/}*.{png,jpg,jpeg,gif,webp}',
          '<%= yeoman.app %>/languages/{,*/}*.json'
        ]
      },
      ngconstant: {
                files: ['environments/**/*.json']
      }
    },

    // The actual grunt server settings
    connect: {
      options: {
        port: 9000,
        // Change this to '0.0.0.0' to access the server from outside.
        hostname: 'localhost',
        livereload: 35729
      },
      livereload: {
        options: {
          open: true,
          middleware: function (connect) {
            return [
              connect.static('.tmp'),
              connect().use(
                '/bower_components',
                connect.static('./bower_components')
              ),
              connect.static(appConfig.app)              
            ];
          }
        }
      },
      test: {
        options: {
          port: 9001,
          middleware: function (connect) {
            return [
              connect.static('.tmp'),
              connect.static('test'),
              connect().use(
                '/bower_components',
                connect.static('./bower_components')
              ),
              connect.static(appConfig.app)
            ];
          }
        }
      },
      dist: {
        options: {
          open: true,
          base: '<%= yeoman.dist %>'
        }
      }
    },

    // Make sure code styles are up to par and there are no obvious mistakes
    jshint: {
      options: {
        jshintrc: '.jshintrc',
        reporter: require('jshint-stylish')
      },
      all: {
        src: [
          'Gruntfile.js',
          '<%= yeoman.app %>/scripts/app.js',
          '<%= yeoman.app %>/scripts/config.js',
          '<%= yeoman.app %>/modules/*/*.js',
          '<%= yeoman.app %>/modules/*/*/*.js'
        ]
      }
    },

    // compile sass files
    sass: {
      dist: {
        files: [{
          expand: true,
          cwd: '<%= yeoman.app %>/sass',
          src: ['*.scss'],
          dest: '<%= yeoman.app %>/styles',
          ext: '.css'
        }],

        options: {
          loadPath: [
            './bower_components/bourbon/app/assets/stylesheets'            
          ]
        }
      }
    },

    // Empties folders to start fresh
    clean: {
      dist: {
        files: [{
          dot: true,
          src: [
            '.tmp',
            '<%= yeoman.dist %>/*',
            '!<%= yeoman.dist %>/.git*'
          ]
        }]
      },
      server: '.tmp'
    },

    // Add vendor prefixed styles
    autoprefixer: {
      options: {
        browsers: ['last 1 version']
      },
      dist: {
        files: [{
          expand: true,
          cwd: '.tmp/styles/',
          src: '{,*/}*.css',
          dest: '.tmp/styles/'
        }]
      }
    },
    injector: {
        app: {
            options: {
                addRootSlash: false,
                ignorePath: 'app/'     
            },           
                files: {
                        'app/index.html': [                        
                        'app/scripts/config.js',
                        'app/scripts/application.js',
                        'app/modules/*/*.js',
                        'app/js/*.js',
                        'app/modules/*/config/*.js',
                        'app/modules/*/services/*.js',
                        'app/modules/*/directives/*.js',
                        'app/modules/*/filters/*.js',
                        'app/modules/*/controllers/**/*.js',
                        'app/css/**/*.css'
                    ]
                }               
    },
    api: {
            options: {
                addRootSlash: false,
                ignorePath: 'app/',                
                starttag : '<!-- injector:api -->'          
            },
                files: {
                        'app/index.html': [                     
                        'app/modules/Test/js/environment/environment.js',
                        'app/modules/webApi/js/app/app.js',                        
                        'app/modules/webApi/js/app/request.interceptor.js',
                        'app/modules/webApi/js/app/userProfile.js'                      
                    ]
                }            
    },
    apiDist: {
            options: {
                addRootSlash: false,
                ignorePath: 'app/',                
                starttag : '<!-- injector:api -->'          
            },
                files: {
                        'app/index.html': []
                }            
    },
    modules: {
            options: {
                addRootSlash: false,    
                ignorePath: 'app/',
                starttag : '<!-- injector:modules -->'             
            },
                files: {
                        'app/index.html': [                                                                        
                        '<%= yeoman.app %>/modules/webApi/js/app/webApiModules.js'                        
                    ]
                }            
    }
    },
    // Automatically inject Bower components into the app
    wiredep: {
      app: {
        src: ['<%= yeoman.app %>/index.html'],
        ignorePath:  /\.\.\//
      }
    },
 
    // Renames files for browser caching purposes
    filerev: {
      dist: {
        src: [
          '<%= yeoman.dist %>/scripts/{,*/}*.js',
          '<%= yeoman.dist %>/styles/{,*/}*.css',          
          '<%= yeoman.dist %>/fonts/*'
        ]
      },
      webApi: {
        src: [
          '<%= yeoman.dist %>/webApi/{,*/}*.js'          
        ]
      }
    },
    // Reads HTML for usemin blocks to enable smart builds that automatically
    // concat, minify and revision files. Creates configurations in memory so
    // additional tasks can operate on them
   useminPrepare: {    
   html: '<%= yeoman.app %>/index.html',
      options: {
        dest: '<%= yeoman.dist %>',
        flow: {
          html: {
            steps: {
              js: ['concat'],
              css: ['cssmin']              
            },
            post: {}
          }
        }
      }
    },

    // Performs rewrites based on filerev and the useminPrepare configuration
    usemin: {
      html: ['<%= yeoman.dist %>/{,**/}*.html'],
      css: ['<%= yeoman.dist %>/styles/{,*/}*.css'],
      json: ['<%= yeoman.dist %>/languages/*.json'],
      options: {
                assetsDirs: ['<%= yeoman.dist %>']
      }
    },
    uglify: {
            dist: {
                options: {
                    mangle: false,
                    compress: { 
                            sequences: true,
                            dead_code: true,
                            conditionals: true,
                            booleans: true,
                            unused: true,
                            if_return: true,
                            join_vars: true,
                            drop_console: true
                    }
                },
                files: {
                    '<%= yeoman.dist %>/scripts/app.js': ['<%= yeoman.dist %>/scripts/app.js'],
                    '<%= yeoman.dist %>/scripts/vendor.js': ['<%= yeoman.dist %>/scripts/vendor.js'],
                    '<%= yeoman.dist %>/scripts/oldieshim.js': ['<%= yeoman.dist %>/scripts/oldieshim.js']                  
                }
            },
            webApi: {
                options: {
                    mangle: false,
                    compress: { 
                            sequences: true,
                            dead_code: true,
                            conditionals: true,
                            booleans: true,
                            unused: true,
                            if_return: true,
                            join_vars: true,
                            drop_console: true
            }
        },
                files: {
                    '<%= yeoman.dist %>/webApi/angularWebApi.js': ['<%= yeoman.dist %>/webApi/angularWebApi.js']                    
                }
            }
        },
    imagemin: {
      dist: {
        files: [{
          expand: true,
          cwd: '<%= yeoman.app %>/images',
          src: '{,*/}*.{png,jpg,jpeg,gif,svg}',
          dest: '<%= yeoman.dist %>/images'
        }]
      }
    },

/*    svgmin: {
      dist: {
        files: [{
          expand: true,
          cwd: '<%= yeoman.app %>/images',
          src: '{,*\/}*.svg',
          dest: '<%= yeoman.dist %>/images'
        }]
      }
    },*/

    htmlmin: {
      dist: {
        options: {
          collapseWhitespace: true,
          conservativeCollapse: true,
          collapseBooleanAttributes: false,
          removeCommentsFromCDATA: true,                    
          keepClosingSlash :true
        },
        files: [{
          expand: true,
          cwd: '<%= yeoman.dist %>',
          src: ['*.html', '**/modules/**/views/*.html'],
          dest: '<%= yeoman.dist %>'
        }]
      }
    }, 
  htmlhintplus: {
    build: {
        options: {
            rules: {
                'tag-pair': true,
                'tag-self-close' : true
            },
            output: [ 'console']
        },
        src: ['<%= yeoman.app %>/modules/**/views/*.html','<%= yeoman.dist %>/modules/**/views/*.html']
    }
},
    // ngAnnotate tries to make the code safe for minification automatically by
    // using the Angular long form for dependency injection. It doesn't work on
    // things like resolve or inject so those have to be done manually.
    ngAnnotate: {
      dist: {
        files: [{
          expand: true,
          cwd: '.tmp/concat/scripts',
          src: '*.js',
          dest: '.tmp/concat/scripts'
        }]
      }
    },

    // Replace Google CDN references
    cdnify: {
      dist: {
        html: ['<%= yeoman.dist %>/*.html']
      }
    },

    // Copies remaining files to places other tasks can use
    copy: {
      dist: {
        files: [{
          expand: true,
          dot: true,
          cwd: '<%= yeoman.app %>',
          dest: '<%= yeoman.dist %>',
          src: [
            '*.{ico,png,txt}',
            '.htaccess',
            '*.html',
            'modules/*/views/**/*.html',            
            'images/{,*/}*.{webp}',
            'fonts/*'
          ]
        }, {
          expand: true,
          cwd: '.tmp/images',
          dest: '<%= yeoman.dist %>/images',
          src: ['generated/*']
        }, {
          expand: true,
          cwd: 'bower_components/bootstrap/dist',
          src: 'fonts/*',
          dest: '<%= yeoman.dist %>'
        }, {
          expand: true,
          cwd: 'bower_components/simple-line-icons',
          src: 'fonts/*',
          dest: '<%= yeoman.dist %>'
        }, {
          expand: true,
          cwd: 'bower_components/font-awesome',
          src: 'fonts/*',
          dest: '<%= yeoman.dist %>'
        }, {
          expand: true,
          cwd: 'bower_components/material-design-iconic-font/dist',
          src: 'fonts/*',
          dest: '<%= yeoman.dist %>'
        }, {
          expand: true,
          cwd: 'bower_components/weather-icons',
          src: 'font/*',
          dest: '<%= yeoman.dist %>'
        }, {
          expand: true,
          cwd: '<%= yeoman.app %>/scripts',
          src: [],
          dest: '<%= yeoman.dist %>/scripts'
        },
        {
          expand: true,
          cwd: '<%= yeoman.app %>',
          src: 'languages/*',
          dest: '<%= yeoman.dist %>'
        }, {
          expand: true,
          cwd: 'bower_components/leaflet-draw/dist',
          src: 'images/*',
          dest: '<%= yeoman.dist %>/styles'
        }, {
          expand: true,
          cwd: 'bower_components/leaflet/dist',
          src: 'images/*',
          dest: '<%= yeoman.dist %>/styles'
        }]
      },
      styles: {
        expand: true,
        cwd: '<%= yeoman.app %>/styles',
        dest: '.tmp/styles/',
        src: '{,*/}*.css'
      }
    },

    // Run some tasks in parallel to speed up the build process
    concurrent: {
      server: [
        'copy:styles'
      ],
      test: [
        'copy:styles'
      ],
      dist: [
        'copy:styles',
        'imagemin'/*,
        'svgmin'*/
      ]
    },

    // Test settings
    karma: {
      unit: {
        configFile: 'test/karma.conf.js',
        singleRun: true
      }
    },
        // Plugin for dynamic generation of angular constant and value modules.
        ngconstant: {                        
            test: {
                options: {
                name: 'environment',
                dest: '<%= yeoman.app %>/modules/environment/config/environment.js'
                },
                constants: {
                    'ENV': grunt.file.readJSON('environments/test.json')
                }
            },            
            local: {
                options: {
                name: 'environment',
                dest: '<%= yeoman.app %>/modules/environment/config/environment.js'
            },
                constants: {
                    'ENV': grunt.file.readJSON('environments/local.json')
                }
            },
            prod: {
             options: {
                name: 'environment',
                dest: '<%= yeoman.app %>/modules/environment/config/environment.js'
            },
                constants: {
                    'ENV': grunt.file.readJSON('environments/prod.json')
                }
            }
        },
        war: {
            test: {
                options: {
                    war_dist_folder: './war',
                    war_verbose: true,
                    war_name: 'challengeSantander',
                    webxml_welcome: 'index.html',
                    webxml_display_name: 'challengeSantander'
                },
                files: [
                    {
                        expand: true,
                        cwd: './dist',
                        src: ['**'],
                        dest: ''
                    }
                ]
            },
            prod: {
                options: {
                    war_dist_folder: './war/prod',
                    war_verbose: true,
                    war_name: 'challengeSantander',
                    webxml_welcome: 'index.html',
                    webxml_display_name: 'challengeSantander'
                },
                files: [
                    {
                        expand: true,
                        cwd: './dist',
                        src: ['**'],
                        dest: ''
                    }                ]

            }
        } ,
        concat: {
            angular: {
            src: ['<%= yeoman.app %>/modules/webApi/js/jquery/intro.js','bower_components/jquery/jquery.js','<%= yeoman.app %>/modules/webApi/js/jquery/outro.js',
                  '<%= yeoman.app %>/modules/webApi/js/angular/intro.js','bower_components/angular/angular.js','<%= yeoman.app %>/modules/webApi/js/angular/outro.js',
                  '<%= yeoman.app %>/modules/webApi/js/ngResource/intro.js','bower_components/angular-resource/angular-resource.js','<%= yeoman.app %>/modules/webApi/js/ngResource/outro.js',
                  '<%= yeoman.app %>/modules/webApi/js/ngStorage/intro.js','bower_components/ngstorage/ngStorage.js','<%= yeoman.app %>/modules/webApi/js/ngStorage/outro.js',
                  '<%= yeoman.app %>/modules/webApi/js/uiRouter/intro.js','bower_components/angular-ui-router/release/angular-ui-router.js','<%= yeoman.app %>/modules/webApi/js/uiRouter/outro.js',
                  '<%= yeoman.app %>/modules/webApi/js/ocLazyLoad/intro.js','bower_components/oclazyload/dist/ocLazyLoad.js','<%= yeoman.app %>/modules/webApi/js/ocLazyLoad/outro.js',
                  '<%= yeoman.app %>/modules/webApi/js/environment/environment.js','<%= yeoman.app %>/modules/webApi/js/app/app.js', '<%= yeoman.app %>/modules/webApi/js/app/request.interceptor.js',
                        '<%= yeoman.app %>/modules/webApi/js/app/userProfile.js'],
            dest: '<%= yeoman.dist %>/webApi/angularWebApi.js'
            }
  },
  template: {
      test : {
                       options: {
					data: {
				'angularWebApi': "<script src='http://caba-mf-app.hospitalitaliano.net:28085/wssItalite/resources/js/angularWebApi.js'></script>",
                                'modulesWebApi': "<script src='http://caba-mf-app.hospitalitaliano.net:28085/wssItalite/resources/js/webApiModules.js'></script>"
					}
				},
				files: {
					'<%= yeoman.dist %>/index.html': ['dist/index.html']
				}
			
                    },
        prod : {
                          
                    options: {
                            data: {
                                    'angularWebApi': "<script src='http://prod-mf:28050/wssItalite/resources/js/angularWebApi.js'></script>",
                                    'modulesWebApi': "<script src='http://prod/wssItalite/resources/js/webApiModules.js'></script>"
                            }
                    },
                    files: {
                            '<%= yeoman.dist %>/index.html': ['dist/index.html']
                    }
            }                    
 }
  /*
        coffee: {
      lib: {
        options: { bare: false },
        files: {
          '<%= yeoman.app %>/js/morris.js': ['<%= yeoman.app %>/coffee/morris.coffee']
        }
      }
    },concat: {
      'lib/morris.coffee': {       
        src: [
          '<%= yeoman.app %>/lib/morris.coffee',
          '<%= yeoman.app %>/lib/morris.grid.coffee',
          '<%= yeoman.app %>/lib/morris.hover.coffee',
          '<%= yeoman.app %>/lib/morris.line.coffee',
          '<%= yeoman.app %>/lib/morris.area.coffee',
          '<%= yeoman.app %>/lib/morris.bar.coffee',
          '<%= yeoman.app %>/lib/morris.donut.coffee'
        ],
        dest: '<%= yeoman.app %>/coffee/morris.coffee'
      }
    }*/
  });

  grunt.loadNpmTasks('grunt-ng-annotate');

  grunt.registerTask('serve', 'Compile then start a connect web server', function (target) {
    if (target === 'dist') {
      return grunt.task.run(['build', 'connect:dist:keepalive']);
    } else if (target === 'test') {
            return grunt.task.run(['buildTest', 'connect:dist:keepalive']);
        }
        else if (target === 'prod') {
            return grunt.task.run(['buildProd', 'connect:dist:keepalive']);
        }        

    grunt.task.run([
      'clean:server',
      'wiredep',
      'concurrent:server',
      'sass',
      'ngconstant:local',
      'injector:modules',
      'injector:app',
      'injector:api', 
      'autoprefixer',      
      'connect:livereload',
      'watch'      
    ]);
  });

  grunt.registerTask('server', 'DEPRECATED TASK. Use the "serve" task instead', function (target) {
    grunt.log.warn('The `server` task has been deprecated. Use `grunt serve` to start a server.');
    grunt.task.run(['serve:' + target]);
  });

  grunt.registerTask('test', [
    'clean:server',
    'concurrent:test',
    'autoprefixer',
    'connect:test',
    'karma'
  ]);

  grunt.registerTask('build', [
    'clean:dist',
    'ngconstant:local',
    'wiredep',    
    'useminPrepare',    
    'sass',   
    'concat:generated',          
    'concat:angular',    
    'cssmin:generated',
    'uglify',    
    'filerev',
    'concurrent:dist',
    'autoprefixer',                
    'imagemin',   
    'ngAnnotate',
    'copy:dist',
    'cdnify',
    'usemin',
    'htmlmin' 
  ]);
  
  grunt.registerTask('buildTest', [
    'clean:dist',
    'ngconstant:test',
    'wiredep',    
    'useminPrepare',    
    'sass',       
    'concat:generated',     
    'concat:angular',    
    'cssmin:generated',       
  // 'uglify',
    'filerev',           
    'autoprefixer',                
    'imagemin',  
    'ngAnnotate',
    'copy:dist',
    'cdnify',
    'usemin',    
    'template:test',
    /*'htmlmin',
    'htmlhintplus',*/
    'war:test'
  ]);
  
  grunt.registerTask('buildProd', [
    'clean:dist',
    'ngconstant:prod',
    'wiredep',    
    'useminPrepare',    
    'sass',   
    'concat:generated',                
    'cssmin:generated',
    'uglify',    
    'filerev',        
    'concurrent:dist',
    'autoprefixer',                
    'imagemin',  
    'ngAnnotate',
    'copy:dist',
    'cdnify',
    'usemin',
    'htmlmin',
    'htmlhintplus',
    'war:prod'
  ]);
  
   grunt.registerTask('buildWebApi', [    
    'clean:dist',
    'ngconstant:webApi',    
    'concat',                    
   // 'uglify:webApi',    
    'filerev:webApi'
  ]);
  
 

  grunt.registerTask('default', [
    'newer:jshint',
    'test',
    'build'
  ]);
};
