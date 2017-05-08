const gulp = require('gulp');
const babel = require('gulp-babel');
const clean = require('gulp-clean');
const jasmine = require('gulp-jasmine');
const injectModules = require('gulp-inject-modules');
const istanbulReport = require('gulp-istanbul-report');
const coverageFile = require('./coverage/coverage.json');
const istanbul = require('gulp-istanbul');

gulp.task('default', ['watch-src-converters', 'watch-test-converters']);

gulp.task('src-converter', ['clean-src'], () => {
  return gulp.src('./src/**/*.js')
             .pipe(babel())
             .pipe(gulp.dest('./build/src'));
});

gulp.task('test-converter', ['clean-test'], () => {
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

gulp.task('clean-test', () => {
  return gulp.src('./build/tests')
             .pipe(clean());
});
gulp.task('clean-src', () => {
  return gulp.src('./build/src')
             .pipe(clean());
});

gulp.task('run-tests', () => {
  gulp.src('./tests/inverted-index-test.js')
      .pipe(babel())
      .pipe(injectModules())
      .pipe(jasmine());
});

// gulp.task('serve', () => {
//   gulp.src('./build/src/routes/app.js')
//       .pipe(node);
// });

gulp.task('coverage', (cb) => {
  gulp.src('./build/src/inverted-index.js')
    .pipe(istanbul())
    .pipe(istanbul.hookRequire())
    .on('finish', () => {
      gulp.src('./build/tests/inverted-index-test.js')
      .pipe(babel())
      .pipe(injectModules())
      .pipe(jasmine())
      .pipe(istanbul.writeReports())
      .pipe(istanbul.enforceThresholds({ thresholds: { global: 90 } }))
      .on('end', cb);
    });
});
