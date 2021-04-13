"use strict";
import path from "path";
import gulp from "gulp";
import browserify from "browserify";
import watchify from "watchify";
import babelify from "babelify";
import source from "vinyl-source-stream";
import buffer from "vinyl-buffer";
import sourcemaps from "gulp-sourcemaps";
import log from "fancy-log"
import through2 from "through2"
// const gutil = require("gulp-util");

// const babelrc = JSON.parse(fs.readFileSync('./babelrc.json'));

const b = browserify({
    entries:"./src/index.js",
    // debug: true
})
    .transform(function (filepath) {
        // 过滤package.json中不需要的字段
        if (filepath === path.join(__dirname, 'package.json')) {
            let bufJson = Buffer.from('')
            return through2((buffer, _, next) => {
                bufJson = Buffer.concat([bufJson, buffer]);
                next(null);
            }, function (flush) {
                const {
                    name,
                    version,
                    nameComponent,
                    isDataPageComponent
                } = JSON.parse(bufJson.toString());

                this.push(Buffer.from(JSON.stringify({
                    name,
                    version,
                    nameComponent,
                    isDataPageComponent
                })));

                flush();
            });
        }
        return through2.obj()
    })
    .transform(babelify)

gulp.task("build", _ => {
    return bundle(b);
});

gulp.task("build-watch", _ => {
    let bw = watchify(b);
    bw.on("update", _=>{
        log("source updated ...")
        bundle(bw)
    });
    bundle(bw);
})

function bundle(b) {
    return b.bundle().on('error', e=>log(e))
        .pipe(source('index.js'))
        .pipe(buffer())
        // .pipe(sourcemaps.init({loadMaps: true}))
        // Add transformation tasks to the pipeline here.
        // .pipe(sourcemaps.write())
        .pipe(gulp.dest('./dist/'));
}
