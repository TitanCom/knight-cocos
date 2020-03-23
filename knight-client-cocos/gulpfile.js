var gulp = require("gulp");
var fileInline = require("gulp-file-inline");
var htmlmin = require("gulp-htmlmin");
var rev = require("gulp-rev");
var imagemin = require("gulp-imagemin");
var revCollector = require("gulp-rev-collector");
var del = require("del");
var javascriptObfuscator = require("gulp-javascript-obfuscator");

gulp.task("cp-src", function (cb) {
    gulp.src(["./build/web-mobile/src/**"])
        .pipe(gulp.dest("./build/web-mobile/")
            .on("end", cb));
});
gulp.task("imagemin", ["cp-src"], function (cb) {
    gulp.src(["./build/web-mobile/**/*.png"])
        .pipe(imagemin([
            imagemin.gifsicle({interlaced: true}),
            imagemin.jpegtran({progressive: true}),
            imagemin.optipng({optimizationLevel: 5})
        ]))
        .pipe(gulp.dest("./build/web-mobile/"))
        .on("end", cb);
});
gulp.task("htmlmin", ["imagemin"], function (cb) {
    gulp.src("./build/web-mobile/*.html")
        .pipe(fileInline())
        .pipe(htmlmin({
            collapseWhitespace: true,
            removeComments: true,
            minifyCSS: true
        }))
        .pipe(gulp.dest("./build/web-mobile/")
            .on("end", cb));
});
gulp.task("default", ["htmlmin"], function (cb) {
    gulp.src(["./build/web-mobile/project.js"])
        .pipe(javascriptObfuscator({
            compact: true,
            deadCodeInjection: false,
            debugProtection: false,
            debugProtectionInterval: false,
            disableConsoleOutput: false,
            domainLock: [".zz-game.com"],
            mangle: true,
            renameGlobals: false,
            rotateStringArray: true,
            seed: 0,
            selfDefending: false,
            stringArrayEncoding: false,
            stringArray: true,
            target: "browser",
            unicodeEscapeSequence: false
        }))
        .pipe(gulp.dest("./build/web-mobile")
            .on("end", cb));
});