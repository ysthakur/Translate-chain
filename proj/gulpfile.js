const gulp = require("gulp");
const terser = require("gulp-terser");
var ts = require("gulp-typescript");
var tsProject = ts.createProject("tsconfig.json");
const babel = require('gulp-babel');

gulp.task("default", function () {
  return tsProject
    .src()
    .pipe(tsProject())
    .js
    // .pipe(terser())
    .pipe(
      babel({
        presets: [['@babel/preset-env']]
      })
    ).pipe(gulp.dest("dist"));
});