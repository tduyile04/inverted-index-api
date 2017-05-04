const gulp = require('gulp');
const babel = require('gulp-babel');
const clean = require('gulp-clean');
const jasmine = require('gulp-jasmine');
const istanbulReport = require('gulp-istanbul-report');
const coverageFile = require('./coverage/coverage.json');
// const istanbul = require('gulp-istanbul');

gulp.task('default', ['watch-src-converters', 'watch-test-converters']);

gulp.task('src-converter', () => {
  return gulp.src('./src/**/*.js')
             .pipe(babel())
             .pipe(gulp.dest('./build/src'));
});

gulp.task('test-converter', () => {
  return gulp.src('./tests/inverted-index-test.js')
             .pipe(babel())
             .pipe(gulp.dest('./build/tests'));
});

gulp.task('watch-src-converters', () => {
  gulp.watch('./src/**/*.js', ['clean', 'src-converter']);
});

gulp.task('watch-test-converters', () => {
  gulp.watch('./tests/inverted-index-test.js', ['clean', 'test-converter']);
});

gulp.task('build-fixtures', () => {
  gulp.src('./fixtures/**/*.json')
      .pipe(gulp.dest('./build/fixtures'));
});

gulp.task('clean', () => {
  return gulp.src('./build')
             .pipe(clean());
});

gulp.task('run-tests', () => {
  gulp.src('./build/tests/inverted-index-test.js')
      .pipe(jasmine());
});

// gulp.task('serve-dev', serve({
//   root: ['.'],
//   port: 3000
// }));

gulp.task('coverage', ['run-tests'], () => {
  gulp.src('./build/tests/inverted-index-test.js', { read: false })
    .pipe(jasmine())
    .on('finish', () => {
      gulp.src(coverageFile)
        .pipe(istanbulReport());
    });
});
