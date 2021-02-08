var gulp = require("gulp");
var browserify = require("browserify");
var source = require("vinyl-source-stream");
var tsify = require("tsify");
// var uglify = require("gulp-uglify");
var terser = require("gulp-terser");
var sourcemaps = require("gulp-sourcemaps");
var buffer = require("vinyl-buffer");
var paths = {
  pages: ["src/*.html"],
};
var ts = require("gulp-typescript");
var tsProject = ts.createProject("tsconfig.json");
const babel = require('gulp-babel');

gulp.task("default", function () {
  return tsProject
    .src()
    .pipe(tsProject())
    .js
    .pipe(
      babel({
        presets: [['@babel/preset-env']]
      })
    ).pipe(gulp.dest("dist"));
});

gulp.task("copy-html", () => gulp.src(paths.pages).pipe(gulp.dest("dist")));

// gulp.task(
//   "default",
//   gulp.series(gulp.parallel("copy-html"), function () {
//     return browserify({
//       basedir: ".",
//       debug: true,
//       entries: ["src/main.ts"],
//       cache: {},
//       packageCache: {},
//     })
//       .plugin(tsify)
//       .bundle()
//       .pipe(source("bundle.js"))
//       .pipe(buffer())
//       .pipe(sourcemaps.init({ loadMaps: true }))
//       // .pipe(terser())
//       .pipe(sourcemaps.write("./"))
//       .pipe(gulp.dest("dist"));
//   })
// );