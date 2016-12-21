'use strict';

var gulp = require('gulp');
var tsc = require('gulp-typescript');
var sourceMaps = require('gulp-sourcemaps');
var typings = require('gulp-typings');
var tslint = require('gulp-tslint');
var jshint = require('gulp-jshint');
var del = require('del');


var allJs = 'src/**/*.js';
var myTs = 'src/**/*.ts';
var allTs = [
    myTs,
    'typings/**/*.d.ts'
];

gulp.task('install-typings', function () {
    var stream = gulp.src('./typings.json')
        .pipe(typings());
    return stream;
});

gulp.task('clean', function (cb) {
    del(allJs, cb);
});

gulp.task('tslint', function () {
    return gulp.src(myTs)
        .pipe(tslint())
        .pipe(tslint.report('verbose'));
});

gulp.task('transpile',  function () {
    var tsResult = gulp.src(allTs, { base: '.' })
    .pipe(sourceMaps.init())
    .pipe(tsc({
        target: 'ES5',
        declarationFiles: false,
        noExternalResolve: true,
        module: 'CommonJS'
    }));
        //.on('error', function () { throw new Error('TypeScript transpilation error.')});
    return tsResult.js
        .pipe(sourceMaps.write(''))
        .pipe(gulp.dest(''));
});