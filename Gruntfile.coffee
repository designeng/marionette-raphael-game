module.exports = (grunt) ->

    port = 9001
  
    # Project configuration.
    grunt.initConfig
        watch:
            coffee_app:
                files: ['app/coffee/**/**.coffee', 'app/coffee/**/**/**.coffee', 'app/coffee/**/**/**/**.coffee']
                tasks: ["coffee-compile-app"]
            coffee_tests:
                files: ['tests/coffee/**/**.coffee']
                # tasks: ['coffee-compile', "start-tests"]
                tasks: ["coffee-compile-tests"]
            coffee_mocha_tests:
                files: ['mocha-tests/coffee/**/**.coffee']
                tasks: ["coffee-compile-mocha-tests"]
            # js:
            #     files: ['tests/js/**/**.js', 'mocha-tests/js/**/**.js', 'app/js/**/**.js']
            #     options:
            #         livereload: 9000
            js:
                files: ['app/js/**/**.js', 'mocha-tests/js/**/**.js']
                options:
                    livereload: true

        coffee:
            mocha_tests:
                options: {
                    bare: true
                }
                files: [
                    expand: true,
                    cwd: 'mocha-tests/coffee',
                    src: ['**/*.coffee'],
                    dest: 'mocha-tests/js',
                    ext: '.js'
                ]
            app:
                options: {
                    bare: true
                }
                files: [
                    expand: true,
                    cwd: 'app/coffee',
                    src: ['**/*.coffee'],
                    dest: 'app/js',
                    ext: '.js'
                ]

        insert:
            options: {}
            main:
                src: "app/coffee/requireConfig.coffee",
                dest: "tests/coffee/SpecRunner.coffee",
                match: "# requirejs-config here"

        connect:
            server:
                options:
                    port: port
                    base: '.'
            testUrls:
                options:
                    port: port,
                    base: '.'

        # mocha testUrls
        mocha:
            testUrls:
                options:
                    mocha:
                        ignoreLeaks: false
                        grep: 'food'

                reporter: 'Nyan'

                urls: ['http://localhost:' + port + '/mocha-tests/index.html'],

                run: true

        exec:
            start_tests:
                command: 'npm start'
                stdout: true
                stderr: true

        requirejs:
            compile:
                options:
                    baseUrl: 'app/js'
                    name: 'fixtures/project'
                    out: 'tmp/builded.js'
                    include: ['tableControl']
                    optimize: "none"
                    mainConfigFile: 'app/js/requireConfig.js'
                    findNestedDependencies: true

    grunt.loadNpmTasks "grunt-contrib-watch"
    grunt.loadNpmTasks "grunt-contrib-coffee"
    grunt.loadNpmTasks "grunt-contrib-connect"
    grunt.loadNpmTasks "grunt-newer"
    grunt.loadNpmTasks "grunt-insert"
    grunt.loadNpmTasks "grunt-mocha"
    grunt.loadNpmTasks "grunt-contrib-requirejs"

    grunt.registerTask "default", ["connect:server", "watch"]

    # for all at once compilation
    grunt.registerTask "coffee-compile-tests", ["newer:coffee:tests"]
    grunt.registerTask "coffee-compile-mocha-tests", ["newer:coffee:mocha_tests"]
    grunt.registerTask "coffee-compile-app", ["newer:coffee:app"]
    grunt.registerTask "start-tests", ["exec:start_tests"]
    grunt.registerTask "server", ["connect"]
    grunt.registerTask "compile", ["coffee:app", "default"]
    grunt.registerTask "inc", ["insert", "coffee-compile-tests", "default"]
    
    grunt.registerTask "r", ["requirejs"]