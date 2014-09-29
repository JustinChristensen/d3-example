module.exports = function (grunt) {

    grunt.initConfig({
        pkg: grunt.file.readJSON("package.json"),
        connect: {
            server: {
                options: {
                    livereload: true,
                    port: 3000,
                    open: true,
                    hostname: "localhost",
                    keepalive: true,
                    debug: true,
                    base: [".", "bower_components"]
                }
            }
        },
        sass: {
            options: {
                includePaths: ["bower_components/"]
            },
            dev: {
                files: {
                    "css/main.css": "sass/main.scss"
                }
            }
        },
        watch: {
            livereload: {
                files: [
                    "css/**/*.css",
                    "js/**/*.js",
                    "*.html"
                ],
                options: {
                    livereload: true
                }
            },
            sass: {
                files: [
                    "sass/**/*.scss"
                ],
                tasks: ["sass:dev"]
            }
        },
        concurrent: {
            server: {
                tasks: ["connect:server", "watch"],
                options: {
                    logConcurrentOutput: true
                }
            }
        }
    });

    grunt.loadNpmTasks("grunt-sass");
    grunt.loadNpmTasks("grunt-concurrent");
    grunt.loadNpmTasks("grunt-contrib-watch");
    grunt.loadNpmTasks("grunt-contrib-connect");

    grunt.registerTask("server", ["concurrent:server"]);
    grunt.registerTask("default", ["sass:dev"]);

};
