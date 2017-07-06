var gulp = require('gulp');
var open = require('gulp-open');

var livereload = require('gulp-livereload');
var nodemon = require('gulp-nodemon');

var uglify = require('gulp-uglify');
var ngAnnotate = require('gulp-ng-annotate');
var concat = require('gulp-concat');
var sourcemaps = require('gulp-sourcemaps');
var rename = require('gulp-rename');



gulp.task('default',['nodemon','jsminifywatch','watchclient','concat_js','openbrower']);

gulp.task('openbrower',function(){
    var options = {
        url: 'http://localhost:3000',
        app: 'chrome'
    };
    gulp.src('views/index.ejs')
        .pipe(open('', options));
});


gulp.task('nodemon',function(){
    livereload.listen(35729);
    nodemon({ script: 'app.js',
         ignore: ['gulpfile.js','*.ejs' ,'public/**/*']
    })
        .on('restart', function () {
            setTimeout(function(){
                console.log("Reloaded!!");
                gulp.src('views/index.ejs').pipe(livereload());
            },1000);
        })
});

gulp.task('watchclient', function() {
    gulp.watch('public/views/**/*',function(){
        console.log("RELOAD Views");
        gulp.src('views/index.ejs').pipe(livereload());
    });

    gulp.watch('public/dist/alljavascript.min.js',function(){
        console.log("RELOAD JS");
        gulp.src('views/index.ejs').pipe(livereload());
    });

    gulp.watch('public/css/*.css', function(){
        console.log("RELOAD CSS");
        gulp.src('views/index.ejs').pipe(livereload());

    });

    gulp.watch('views/**/*',function(){
        console.log("RELOAD EJS Views");
        gulp.src('views/index.ejs').pipe(livereload());
    });
});

gulp.task('jsminifywatch', function () {
    return gulp.watch('public/js//**/*.js', ['concat_js']);
});

gulp.task('concat_js', function () {
    return gulp.src(['public/js//**/*.js'])
        .pipe(concat('alljavascript.js'))
        .pipe(gulp.dest('public/dist'))
        .on('end', function(){
            gulp.src(['public/dist/alljavascript.js'])
                .pipe(sourcemaps.init())
                // .pipe(ngAnnotate())
                // .pipe(uglify())
                .pipe(sourcemaps.write())
                .pipe(rename({
                    suffix: '.min'
                }))
                .pipe(gulp.dest('public/dist'));
        });
});

//gulp.task('minifyJS',function(){
//    return gulp.src(['public/dist/alljavascript.js'])
//        .pipe(minifyCss({ compatibility: 'ie8' }))
//        .pipe(rename({
//            suffix: '.min'
//        }))
//        .pipe(gulp.dest('public/dist'));
//})