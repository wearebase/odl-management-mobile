(function () {
    'use strict';
    var cordova = require('cordova');

    module.exports = function (grunt) {
        // load all grunt tasks
        require('matchdep').filterDev('grunt-*').forEach(grunt.loadNpmTasks);

        // configurable paths
        var yeomanConfig = {
            app: 'www'
        };

        try {
            yeomanConfig.app = require('./component.json').appPath || yeomanConfig.app;
        } catch (e) {
        }

        var device = {
            platform: grunt.option('platform') || 'all',
            family: grunt.option('family') || 'default',
            target: grunt.option('target') || 'emulator'
        };

        grunt.initConfig({
            yeoman: yeomanConfig,
            jshint: {
                gruntfile: ['Gruntfile.js'],
                files: ['www/js/**/*.js', 'www/spec/tests/**/*.js'],
                options: {
                    // options here to override JSHint defaults
                    globals: {
                        console: true,
                        module: true
                    }
                }
            },
            watchfiles: {
                all: [
                    'www/{,*/}*.html',
                    'www/js/{,*/,*/}*.js',
                    'www/css/{,*/}*.css',
                    'www/img/{,*/}*.{png,jpg,jpeg,gif,webp,svg}'
                ]
            },
            watch: {
                scripts: {
                    files: [
                        'www/js/**/*.js',
                        'www/css/**/*.css'
                    ],
                    tasks: ['jshint']
                },
                liveserve: {
                    options: {
                        livereload: true,
                    },
                    files: ['<%=watchfiles.all %>'],
                    tasks: ['shell:serveend', 'cordova-prepareserve']
                },
                liveemulate: {
                    files: ['<%=watchfiles.all %>'],
                    tasks: ['cordova-emulate-end', 'cordova-buildemulate']
                },
                livedevice: {
                    files: ['<%=watchfiles.all %>'],
                    tasks: ['cordova-buildrun']
                }
            },
            shell: {
                iossimstart: {
                    command: 'ios-sim launch platforms/ios/build/ODL-mobile.app --exit' + (device.family !== 'default' ? ' --family ' + device.family : ''),
                    options: {
                        stdout: true
                    }
                },
                iossimend: {
                    command: 'killall -9 "iPhone Simulator"'
                },
                serveend: {
                    command: 'killall -9 "cordova serve"'
                },
                rippleend: {
                    command: 'killall -9 "cordova ripple"'
                }

            },
            jasmine: {
                istanbul: {
                    src: '<%= jasmine.customTemplate.src %>',
                    options: {
                        vendor: '<%= jasmine.customTemplate.options.vendor %>',
                        specs: '<%= jasmine.customTemplate.options.specs %>',
                        helpers: '<%= jasmine.customTemplate.options.helpers %>',
                        template: require('grunt-template-jasmine-istanbul'),
                        templateOptions: {
                            coverage: 'coverage/json/coverage.json',
                            report: [
                                {type: 'html', options: {dir: 'coverage/html'}},
                                {type: 'text-summary'}
                            ]   
                        }   
                    }   
                },
                customTemplate: {
                    src: 'www/js/**/*.js',
                    options: {
                        vendor: [
                            'www/components/angular/angular.js',
                            'www/components/angular-mocks/angular-mocks.js',
                            'www/components/angular-route/angular-route.js',
                            'www/components/angular-animate/angular-animate.js'
                        ],
                        specs: 'www/spec/tests/**/*.js',
                        helpers: 'www/spec/helpers/**/*.js'
                    }
                }
            }
        });

        // Cordova Tasks
        grunt.registerTask('cordova-prepare', 'Cordova prepare tasks', function () {
            var done = this.async();

            if (device.platform === 'all') {
                // Prepare all platforms
                cordova.prepare(done);
            } else {
                cordova.prepare(device.platform, done);
            }
        });

        grunt.registerTask('cordova-build', 'Cordova building tasks', function () {
            var done = this.async();

            if (device.platform === 'all') {
                // Build all platforms
                cordova.build(done);
            } else {
                cordova.build(device.platform, done);
            }
        });

        grunt.registerTask('cordova-run', 'Cordova running tasks', function () {
            var done = this.async();

            if (device.platform === 'all') {
                // Build all platforms
                cordova.run();
            } else {
                cordova.run(device.platform);
            }

            done();
        });

        grunt.registerTask('cordova-emulate', 'Cordova emulation tasks', function () {
            var done = this.async();

            if (device.platform === 'all') {
                // Emulate all platforms
                cordova.emulate();
            } else {
                if (device.platform === 'ios') {
                    grunt.task.run('shell:iossimstart');
                } else {
                    cordova.emulate(device.platform, function() {
                        grunt.task.run('cordova-emulate-end');
                    });
                }
            }

            done();
        });

        grunt.registerTask('cordova-serve', 'Cordova serve tasks', function () {
            var done = this.async();

            if (device.platform === 'all') {
                // Emulate all platforms
                grunt.fatal("Platform required. Eg. ` --platform=ios`");
            } else {
                cordova.serve(device.platform);
                done();
            }
        });

        grunt.registerTask('cordova-ripple', 'Cordova ripple tasks', function () {
            var done = this.async();

            if (device.platform === 'all') {
                // Emulate all platforms
                grunt.fatal("Platform required. Eg. ` --platform=ios`");
            } else {
                cordova.ripple(device.platform);
                done();
            }
        });

        grunt.registerTask('cordova-emulate-end', 'Cordova emulation tasks', function () {
            if (device.platform === 'all' || device.platform === 'ios') {
                grunt.task.run('shell:iossimend');
            }
        });

        grunt.registerTask('cordova-buildemulate', [
            'cordova-build',
            'cordova-emulate'
        ]);

        grunt.registerTask('cordova-buildrun', [
            'cordova-build',
            'cordova-run'
        ]);

        grunt.registerTask('cordova-prepareserve', [
            'cordova-prepare',
            'cordova-serve'
        ]);

        grunt.registerTask('cordova-platforms', 'Cordova platforms tasks', function () {
            var done = this.async();
            cordova.platform('add', 'android');
            done();
        });

        grunt.registerTask('cordova-plugins', 'Cordova plugins tasks', function () {
            var done = this.async();

            function addPlugins(plugins, done) {
                if (plugins.length) {
                    var plugin = plugins.shift();
                    cordova.plugin('add', plugin, function() {
                        addPlugins(plugins, done);
                    });
                } else {
                    done();
                }
            }

            addPlugins([
                'org.apache.cordova.camera',
                'org.apache.cordova.device',
                'https://github.com/wildabeast/BarcodeScanner.git',
                'org.apache.cordova.network-information',
		'org.apache.cordova.inappbrowser'
            ], done);
        });

        grunt.registerTask('cordova-install', ['cordova-platforms', 'cordova-plugins']);

        grunt.registerTask('serve', ['cordova-prepareserve', 'watch:liveserve']);
        grunt.registerTask('ripple', ['cordova-prepare', 'cordova-ripple', 'watch:liveripple']);

        grunt.registerTask('emulate', ['cordova-buildemulate']);
        grunt.registerTask('live-emulate', ['cordova-buildemulate', 'watch:liveemulate']);

        grunt.registerTask('device', ['cordova-buildrun']);
        grunt.registerTask('live-device', ['cordova-buildrun', 'watch:livedevice']);

        grunt.registerTask('install', ['bower-install-simple', 'cordova-install']);

        grunt.registerTask('test', ['jshint', 'jasmine:istanbul']);

        grunt.registerTask('default', ['test']);
    };
}());
